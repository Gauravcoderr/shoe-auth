from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class CheckPhoto(BaseModel):
    angle: str   # "side-lateral", "sole", "tongue", etc.
    url: str     # Cloudinary URL


class CheckResult(BaseModel):
    check_id: str
    category: str
    label: str
    result: str  # "pass" | "fail" | "warning" | "skipped"
    confidence: int  # 0-100
    notes: str
    photo_angle: str


class AuthCheckDB(BaseModel):
    """MongoDB document schema for authentication checks"""
    user_id: Optional[str] = None   # None = anonymous check
    brand: str
    model: str
    colorway: str = ""
    photos: List[CheckPhoto] = []
    results: List[CheckResult] = []
    overall_verdict: str = "pending"  # "authentic" | "fake" | "inconclusive" | "pending"
    verdict_confidence: int = 0
    verdict_summary: str = ""
    processing_status: str = "pending"  # "pending" | "processing" | "complete" | "failed"
    processing_error: Optional[str] = None
    tier: str = "free"
    # Condition & image authenticity (populated during analysis)
    condition: Optional[str] = None              # "new" | "like-new" | "lightly-used" | "moderately-used" | "heavily-worn"
    image_authenticity_score: Optional[int] = None  # 0-100 derived from Image Authenticity checks
    exif_results: Optional[dict] = None          # raw EXIF summary per photo
    barcode_decoded: Optional[str] = None        # decoded barcode from box-label photo
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AuthCheckPublic(BaseModel):
    """Public-facing check response"""
    id: str
    brand: str
    model: str
    colorway: str
    photos: List[CheckPhoto]
    results: List[CheckResult]
    overall_verdict: str
    verdict_confidence: int
    verdict_summary: str
    processing_status: str
    condition: Optional[str] = None
    image_authenticity_score: Optional[int] = None
    risk_score: Optional[int] = None
    consistency_score: Optional[int] = None
    created_at: datetime


class CreateCheckRequest(BaseModel):
    brand: str
    model: str
    colorway: str = ""
    photos: List[CheckPhoto]
