from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from config.database import get_db
from middleware.auth_middleware import get_optional_user, get_current_user
from models.auth_check import CreateCheckRequest
from controllers.check_controller import run_analysis

router = APIRouter(prefix="/checks", tags=["checks"])


def serialize_check(check: dict) -> dict:
    check["id"] = str(check.pop("_id"))
    return check


@router.post("")
async def create_check(
    body: CreateCheckRequest,
    request: Request,
    background_tasks: BackgroundTasks,
):
    user = await get_optional_user(request.cookies.get("access_token"))

    if len(body.photos) < 5:
        raise HTTPException(400, "At least 5 photos required (side-lateral, side-medial, top-down, heel, sole)")

    db = get_db()

    # Anonymous rate limiting: allow max 3 checks from same IP per day if no user
    if not user:
        today = datetime.utcnow().date().isoformat()
        ip = request.client.host
        anon_count = await db.auth_checks.count_documents({
            "user_id": None,
            "anon_ip": ip,
        })
        if anon_count >= 3:
            raise HTTPException(403, "Free limit reached. Please sign in to continue.")

    check_doc = {
        "user_id": str(user["_id"]) if user else None,
        "anon_ip": request.client.host if not user else None,
        "brand": body.brand,
        "model": body.model,
        "colorway": body.colorway,
        "photos": [p.model_dump() for p in body.photos],
        "results": [],
        "overall_verdict": "pending",
        "verdict_confidence": 0,
        "verdict_summary": "",
        "processing_status": "pending",
        "processing_error": None,
        "tier": "free",
        "created_at": datetime.utcnow(),
    }

    result = await db.auth_checks.insert_one(check_doc)
    check_id = str(result.inserted_id)

    # Trigger AI analysis as background task
    background_tasks.add_task(run_analysis, check_id)

    return {"checkId": check_id}


@router.get("/{check_id}")
async def get_check(check_id: str, request: Request):
    db = get_db()
    try:
        check = await db.auth_checks.find_one({"_id": ObjectId(check_id)})
    except Exception:
        raise HTTPException(400, "Invalid check ID")

    if not check:
        raise HTTPException(404, "Check not found")

    # Allow access: owner or anonymous (check has no user_id)
    user = await get_optional_user(request.cookies.get("access_token"))
    if check.get("user_id"):
        if not user or str(user["_id"]) != check["user_id"]:
            raise HTTPException(403, "Access denied")

    return serialize_check(check)


@router.get("")
async def get_check_history(request: Request):
    user = await get_current_user(request.cookies.get("access_token"))
    db = get_db()

    cursor = db.auth_checks.find(
        {"user_id": str(user["_id"])},
        sort=[("created_at", -1)],
        limit=50,
    )
    checks = []
    async for check in cursor:
        checks.append(serialize_check(check))

    return {"checks": checks}
