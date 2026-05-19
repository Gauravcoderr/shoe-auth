import asyncio
import httpx
from datetime import datetime
from bson import ObjectId
from config.database import get_db
from lib.gemini import analyze_shoe
from lib.prompt_builder import build_prompt
from lib.reference_fetcher import fetch_reference_images
from lib.exif_checker import check_exif
from lib.barcode_decoder import decode_barcode


async def _fetch_image_bytes(url: str) -> bytes:
    """Download image bytes from a Cloudinary URL."""
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        return resp.content


async def run_analysis(check_id: str):
    """Background task: analyze photos with Gemini and save results"""
    db = get_db()
    check = await db.auth_checks.find_one({"_id": ObjectId(check_id)})
    if not check:
        return

    await db.auth_checks.update_one(
        {"_id": ObjectId(check_id)},
        {"$set": {"processing_status": "processing"}}
    )

    try:
        photos = check.get("photos", [])

        # ── Pre-analysis: EXIF check on each photo ────────────────────────────
        exif_summaries = []
        exif_results_map = {}
        box_label_bytes = None

        for photo in photos:
            try:
                img_bytes = await _fetch_image_bytes(photo["url"])
                exif_data = check_exif(img_bytes)
                exif_results_map[photo["angle"]] = exif_data
                exif_summaries.append(f"{photo['angle']}: {exif_data['summary']}")
                if photo["angle"] == "box-label":
                    box_label_bytes = img_bytes
            except Exception:
                exif_summaries.append(f"{photo['angle']}: Could not fetch image for EXIF check")

        # ── Pre-analysis: Barcode decode on box-label photo ───────────────────
        decoded_barcode = None
        if box_label_bytes:
            decoded_barcode = decode_barcode(box_label_bytes)

        # ── Fetch reference images ────────────────────────────────────────────
        reference_photos = await fetch_reference_images(
            brand=check["brand"],
            model=check["model"],
            colorway=check.get("colorway", ""),
        )

        prompt = build_prompt(
            brand_slug=check["brand"].lower().replace(" ", "_"),
            model=check["model"],
            colorway=check.get("colorway", ""),
            has_reference_images=len(reference_photos) > 0,
            exif_summaries=exif_summaries if exif_summaries else None,
            decoded_barcode=decoded_barcode,
        )

        result = await analyze_shoe(
            brand=check["brand"],
            model=check["model"],
            colorway=check.get("colorway", ""),
            photos=photos,
            reference_photos=reference_photos,
            prompt=prompt,
        )

        # ── Normalize results ─────────────────────────────────────────────────
        checks = result.get("checks", [])
        normalized = []
        for c in checks:
            normalized.append({
                "check_id": c.get("checkId", ""),
                "category": c.get("category", ""),
                "label": c.get("label", ""),
                "result": c.get("result", "skipped"),
                "confidence": int(c.get("confidence", 0)),
                "weight": c.get("weight", 1),
                "critical": c.get("critical", False),
                "notes": c.get("notes", ""),
                "photo_angle": c.get("photoAngle", ""),
            })

        reasoning = result.get("reasoningSummary", [])
        verdict_summary = " ".join(reasoning) if isinstance(reasoning, list) else reasoning

        # ── Apply img_real_shoe override ──────────────────────────────────────
        overall_verdict = result.get("overallVerdict", "inconclusive")
        img_real_shoe = next(
            (c for c in normalized if c["check_id"] == "img_real_shoe"), None
        )
        if img_real_shoe and img_real_shoe["result"] == "fail":
            overall_verdict = "inconclusive"
            warning_note = "Photos do not appear to show a real physical shoe — verdict unreliable."
            verdict_summary = warning_note + (" " + verdict_summary if verdict_summary else "")

        # ── Extract condition from cond_overall check ─────────────────────────
        condition = None
        cond_overall = next(
            (c for c in normalized if c["check_id"] == "cond_overall"), None
        )
        if cond_overall:
            condition = cond_overall.get("notes", "").strip() or None

        # ── Compute image_authenticity_score from Image Authenticity checks ───
        img_auth_checks = [c for c in normalized if c["category"] == "Image Authenticity"]
        if img_auth_checks:
            pass_count = sum(1 for c in img_auth_checks if c["result"] == "pass")
            image_authenticity_score = int((pass_count / len(img_auth_checks)) * 100)
        else:
            image_authenticity_score = None

        await db.auth_checks.update_one(
            {"_id": ObjectId(check_id)},
            {"$set": {
                "results": normalized,
                "overall_verdict": overall_verdict,
                "verdict_confidence": int(result.get("verdictConfidence", 0)),
                "verdict_summary": verdict_summary,
                "reasoning_summary": reasoning,
                "risk_score": result.get("riskScore", 0),
                "consistency_score": result.get("consistencyScore", 0),
                "condition": condition,
                "image_authenticity_score": image_authenticity_score,
                "exif_results": exif_results_map,
                "barcode_decoded": decoded_barcode,
                "processing_status": "complete",
            }}
        )

    except Exception as e:
        await db.auth_checks.update_one(
            {"_id": ObjectId(check_id)},
            {"$set": {
                "processing_status": "failed",
                "processing_error": str(e)[:500],
            }}
        )
