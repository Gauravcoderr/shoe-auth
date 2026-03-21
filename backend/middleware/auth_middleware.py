from fastapi import Depends, HTTPException, Cookie, status
from typing import Optional
from jose import JWTError, jwt
from config.database import settings, get_db


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


async def get_current_user(access_token: Optional[str] = Cookie(default=None)):
    """Required auth — raises 401 if not logged in"""
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_token(access_token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    db = get_db()
    from bson import ObjectId
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def get_optional_user(access_token: Optional[str] = Cookie(default=None)):
    """Optional auth — returns user or None (for anonymous checks)"""
    if not access_token:
        return None
    try:
        payload = decode_token(access_token)
        user_id = payload.get("sub")
        if not user_id:
            return None
        db = get_db()
        from bson import ObjectId
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        return user
    except Exception:
        return None
