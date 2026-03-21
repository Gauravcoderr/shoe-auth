import asyncio
from datetime import datetime
from bson import ObjectId
from config.database import get_db
from lib.gemini import analyze_shoe
from lib.prompt_builder import build_prompt


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
        photo_angles = [p["angle"] for p in photos]
        prompt = build_prompt(
            brand_slug=check["brand"].lower().replace(" ", "_"),
            model=check["model"],
            colorway=check.get("colorway", ""),
            photo_angles=photo_angles,
        )

        result = await analyze_shoe(
            brand=check["brand"],
            model=check["model"],
            colorway=check.get("colorway", ""),
            photos=photos,
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
                "notes": c.get("notes", ""),
                "photo_angle": c.get("photoAngle", ""),
            })

        await db.auth_checks.update_one(
            {"_id": ObjectId(check_id)},
            {"$set": {
                "results": normalized,
                "overall_verdict": result.get("overallVerdict", "inconclusive"),
                "verdict_confidence": int(result.get("verdictConfidence", 0)),
                "verdict_summary": result.get("verdictSummary", ""),
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
