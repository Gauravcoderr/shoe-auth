import io
from typing import Optional


def check_exif(image_bytes: bytes) -> dict:
    """
    Analyse EXIF metadata of an image to detect whether it was taken by a real
    camera (supporting authenticity) or is a screenshot / stock image (no EXIF).

    Returns a dict:
      {
        "has_camera_exif": bool,     # True = real camera data found
        "camera_make": str | None,   # e.g. "Apple", "Samsung"
        "camera_model": str | None,  # e.g. "iPhone 15 Pro"
        "focal_length": str | None,
        "software_only": bool,       # True = only software tags (Photoshop, etc.)
        "summary": str               # human-readable one-liner for the AI prompt
      }
    """
    try:
        import exifread  # pip install ExifRead
        tags = exifread.process_file(io.BytesIO(image_bytes), details=False)
    except ImportError:
        return _no_exif_result("exifread not installed — skipping EXIF check")
    except Exception:
        return _no_exif_result("Could not read EXIF data")

    if not tags:
        return _no_exif_result("No EXIF data found — likely a screenshot or stock image")

    camera_make: Optional[str] = _tag(tags, "Image Make")
    camera_model: Optional[str] = _tag(tags, "Image Model")
    focal_length: Optional[str] = _tag(tags, "EXIF FocalLength")
    software: Optional[str] = _tag(tags, "Image Software")

    # Detect software-only tags (editing tools, not cameras)
    software_keywords = ("photoshop", "lightroom", "gimp", "snapseed",
                         "screenshot", "capture one", "affinity", "preview")
    software_only = (
        software is not None
        and camera_make is None
        and any(kw in software.lower() for kw in software_keywords)
    )

    has_camera_exif = camera_make is not None or camera_model is not None

    if has_camera_exif:
        summary = f"Real camera EXIF detected: {camera_make or ''} {camera_model or ''}".strip()
    elif software_only:
        summary = f"Software-only EXIF ({software}) — image may be edited or a stock photo"
    else:
        summary = "Partial EXIF present but no camera make/model — treat as uncertain"

    return {
        "has_camera_exif": has_camera_exif,
        "camera_make": camera_make,
        "camera_model": camera_model,
        "focal_length": focal_length,
        "software_only": software_only,
        "summary": summary,
    }


def _tag(tags: dict, key: str) -> Optional[str]:
    val = tags.get(key)
    return str(val).strip() if val else None


def _no_exif_result(summary: str) -> dict:
    return {
        "has_camera_exif": False,
        "camera_make": None,
        "camera_model": None,
        "focal_length": None,
        "software_only": False,
        "summary": summary,
    }
