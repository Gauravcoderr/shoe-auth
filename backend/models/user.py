from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserDB(BaseModel):
    """MongoDB document schema for users"""
    email: str
    name: str = ""
    phone: str = ""
    tier: str = "free"  # "free" | "premium"
    checks_today: int = 0
    last_check_date: Optional[datetime] = None
    subscription_expiry: Optional[datetime] = None
    otp: Optional[str] = None          # SHA256 hashed
    otp_expiry: Optional[datetime] = None
    otp_attempts: int = 0
    last_otp_sent: Optional[datetime] = None
    refresh_token: Optional[str] = None  # SHA256 hashed
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserPublic(BaseModel):
    """Safe user object returned to frontend"""
    id: str
    email: str
    name: str
    phone: str
    tier: str
    checks_today: int
