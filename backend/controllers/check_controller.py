import asyncio
from datetime import datetime
from bson import ObjectId
from config.database import get_db
from lib.gemini import analyze_shoe
from lib.prompt_builder import build_prompt
from lib.reference_fetcher import fetch_reference_images


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

        # Fetch reference images (cache-first, gracefully returns [] if all sources fail)
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
        )

        result = await analyze_shoe(
            brand=check["brand"],
            model=check["model"],
            colorway=check.get("colorway", ""),
            photos=photos,
            reference_photos=reference_photos,
            prompt=prompt,
        )

        # Normalize results
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

        await db.auth_checks.update_one(
            {"_id": ObjectId(check_id)},
            {"$set": {
                "results": normalized,
                "overall_verdict": result.get("overallVerdict", "inconclusive"),
                "verdict_confidence": int(result.get("verdictConfidence", 0)),
                "verdict_summary": verdict_summary,
                "reasoning_summary": reasoning,
                "risk_score": result.get("riskScore", 0),
                "consistency_score": result.get("consistencyScore", 0),
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
