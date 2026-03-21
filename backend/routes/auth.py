from fastapi import APIRouter, HTTPException, Response, Cookie, Request
from pydantic import BaseModel, EmailStr
from typing import Optional
import hashlib
import secrets
import random
from datetime import datetime, timedelta
from jose import jwt
from config.database import settings, get_db
from lib.mailer import send_otp_email

router = APIRouter(prefix="/auth", tags=["auth"])

ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 30
OTP_EXPIRE_MINUTES = 5
OTP_COOLDOWN_SECONDS = 60
MAX_OTP_ATTEMPTS = 5


def hash_value(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def create_access_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": user_id, "exp": expire}, settings.JWT_SECRET, algorithm="HS256")


def create_refresh_token() -> str:
    return secrets.token_urlsafe(64)


def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    is_prod = settings.FRONTEND_URL.startswith("https")
    response.set_cookie(
        "access_token", access_token,
        httponly=True, secure=is_prod, samesite="none" if is_prod else "lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    response.set_cookie(
        "refresh_token", refresh_token,
        httponly=True, secure=is_prod, samesite="none" if is_prod else "lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 86400,
    )


class SendOtpRequest(BaseModel):
    email: EmailStr


class VerifyOtpRequest(BaseModel):
    email: EmailStr
    otp: str
    name: Optional[str] = None
    phone: Optional[str] = None


@router.post("/send-otp")
async def send_otp(body: SendOtpRequest):
    db = get_db()
    email = body.email.lower()
    user = await db.users.find_one({"email": email})

    # Cooldown check
    if user and user.get("last_otp_sent"):
        diff = (datetime.utcnow() - user["last_otp_sent"]).total_seconds()
        if diff < OTP_COOLDOWN_SECONDS:
            raise HTTPException(429, f"Please wait {int(OTP_COOLDOWN_SECONDS - diff)}s before requesting another OTP")

    otp = str(random.randint(100000, 999999))
    otp_expiry = datetime.utcnow() + timedelta(minutes=OTP_EXPIRE_MINUTES)

    await db.users.update_one(
        {"email": email},
        {"$set": {
            "email": email,
            "otp": hash_value(otp),
            "otp_expiry": otp_expiry,
            "otp_attempts": 0,
            "last_otp_sent": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }, "$setOnInsert": {
            "name": "", "phone": "", "tier": "free",
            "checks_today": 0, "last_check_date": None,
            "refresh_token": None, "created_at": datetime.utcnow(),
        }},
        upsert=True,
    )

    await send_otp_email(email, otp)
    return {"message": "OTP sent"}


@router.post("/verify-otp")
async def verify_otp(body: VerifyOtpRequest, response: Response):
    db = get_db()
    email = body.email.lower()
    user = await db.users.find_one({"email": email})

    if not user:
        raise HTTPException(400, "No OTP found for this email")
    if user.get("otp_attempts", 0) >= MAX_OTP_ATTEMPTS:
        raise HTTPException(429, "Too many attempts. Request a new OTP.")
    if not user.get("otp_expiry") or datetime.utcnow() > user["otp_expiry"]:
        raise HTTPException(400, "OTP has expired")
    if user.get("otp") != hash_value(body.otp):
        await db.users.update_one({"email": email}, {"$inc": {"otp_attempts": 1}})
        raise HTTPException(400, "Invalid OTP")

    refresh_token = create_refresh_token()
    update_data = {
        "otp": None, "otp_expiry": None, "otp_attempts": 0,
        "refresh_token": hash_value(refresh_token),
        "updated_at": datetime.utcnow(),
    }
    if body.name:
        update_data["name"] = body.name
    if body.phone:
        update_data["phone"] = body.phone

    await db.users.update_one({"email": email}, {"$set": update_data})
    user = await db.users.find_one({"email": email})

    access_token = create_access_token(str(user["_id"]))
    set_auth_cookies(response, access_token, refresh_token)

    return {
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user.get("name", ""),
            "phone": user.get("phone", ""),
            "tier": user.get("tier", "free"),
            "checks_today": user.get("checks_today", 0),
        }
    }


@router.post("/refresh")
async def refresh_token(response: Response, refresh_token: Optional[str] = Cookie(default=None)):
    if not refresh_token:
        raise HTTPException(401, "No refresh token")
    db = get_db()
    user = await db.users.find_one({"refresh_token": hash_value(refresh_token)})
    if not user:
        raise HTTPException(401, "Invalid refresh token")

    new_refresh = create_refresh_token()
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"refresh_token": hash_value(new_refresh), "updated_at": datetime.utcnow()}}
    )

    access_token = create_access_token(str(user["_id"]))
    set_auth_cookies(response, access_token, new_refresh)
    return {"message": "Token refreshed"}


@router.post("/logout")
async def logout(response: Response, refresh_token: Optional[str] = Cookie(default=None)):
    if refresh_token:
        db = get_db()
        await db.users.update_one(
            {"refresh_token": hash_value(refresh_token)},
            {"$set": {"refresh_token": None}}
        )
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out"}


@router.get("/me")
async def get_me(request: Request):
    from middleware.auth_middleware import get_current_user
    user = await get_current_user(request.cookies.get("access_token"))
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name", ""),
        "phone": user.get("phone", ""),
        "tier": user.get("tier", "free"),
        "checks_today": user.get("checks_today", 0),
    }
