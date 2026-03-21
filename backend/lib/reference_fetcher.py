"""
Reference image fetcher for sneaker authentication.
Tries multiple free sources with fallbacks. Caches results in MongoDB (30-day TTL).
All API keys are optional — system works without any of them.
"""
import re
import httpx
from datetime import datetime
from config.database import get_db, settings


def _slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def _make_cache_key(brand: str, model: str, colorway: str) -> str:
    parts = [_slugify(brand), _slugify(model)]
    if colorway:
        parts.append(_slugify(colorway))
    return "_".join(parts)


# ─────────────────────────────────────────────
# Source 1: SneakersAPI.dev
# ─────────────────────────────────────────────
async def _fetch_sneakersapi(brand: str, model: str, colorway: str) -> list[str]:
    key = getattr(settings, "SNEAKERS_API_KEY", "")
    query = f"{brand} {model} {colorway}".strip()
    headers = {"x-api-key": key} if key else {}
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://api.sneakersapi.dev/api/v3/products",
                params={"q": query, "limit": 5},
                headers=headers,
            )
            resp.raise_for_status()
            data = resp.json()
            urls = []
            for product in data.get("data", []):
                for field in ("imageUrl", "thumbnail", "image"):
                    url = product.get("media", {}).get(field) or product.get(field)
                    if url and url not in urls:
                        urls.append(url)
            return urls[:4]
    except Exception:
        return []


# ─────────────────────────────────────────────
# Source 2: KicksDB (kicks.dev)
# ─────────────────────────────────────────────
async def _fetch_kicksdb(brand: str, model: str) -> list[str]:
    query = f"{brand} {model}"
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://kicks.dev/api/products",
                params={"query": query, "limit": 5},
            )
            resp.raise_for_status()
            data = resp.json()
            urls = []
            for product in data.get("products", data if isinstance(data, list) else []):
                for field in ("imageUrl", "image", "thumbnail", "picture"):
                    url = product.get(field)
                    if url and url not in urls:
                        urls.append(url)
            return urls[:4]
    except Exception:
        return []


# ─────────────────────────────────────────────
# Source 3: The Sneaker Database
# ─────────────────────────────────────────────
async def _fetch_sneakerdatabase(model: str) -> list[str]:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://api.thesneakerdatabase.com/v1/sneakers",
                params={"limit": 5, "name": model},
            )
            resp.raise_for_status()
            data = resp.json()
            urls = []
            for product in data.get("results", []):
                media = product.get("media", {})
                for field in ("imageUrl", "smallImageUrl", "thumbUrl"):
                    url = media.get(field)
                    if url and url not in urls:
                        urls.append(url)
            return urls[:4]
    except Exception:
        return []


# ─────────────────────────────────────────────
# Source 4: Google Custom Search Images
# ─────────────────────────────────────────────
async def _fetch_google(brand: str, model: str, colorway: str) -> list[str]:
    api_key = getattr(settings, "GOOGLE_API_KEY", "")
    cx = getattr(settings, "GOOGLE_SEARCH_ENGINE_ID", "")
    if not api_key or not cx:
        return []
    query = f"{brand} {model} {colorway} official authentic site:stockx.com OR site:{brand.lower()}.com".strip()
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://www.googleapis.com/customsearch/v1",
                params={
                    "key": api_key,
                    "cx": cx,
                    "q": query,
                    "searchType": "image",
                    "num": 4,
                    "imgType": "photo",
                    "safe": "active",
                },
            )
            resp.raise_for_status()
            data = resp.json()
            return [item["link"] for item in data.get("items", []) if item.get("link")][:4]
    except Exception:
        return []


# ─────────────────────────────────────────────
# Main entry point
# ─────────────────────────────────────────────
async def fetch_reference_images(brand: str, model: str, colorway: str) -> list[dict]:
    """
    Returns list of {"url": str, "angle": "reference"} dicts.
    Tries MongoDB cache → SneakersAPI → KicksDB → SneakerDatabase → Google.
    Returns [] if nothing found — auth continues gracefully without references.
    """
    db = get_db()
    cache_key = _make_cache_key(brand, model, colorway)

    # 1. Check cache
    cached = await db.reference_images.find_one({"cache_key": cache_key})
    if cached:
        return cached.get("images", [])

    # 2-5. Try each source
    urls: list[str] = []
    for fetcher, args in [
        (_fetch_sneakersapi, (brand, model, colorway)),
        (_fetch_kicksdb, (brand, model)),
        (_fetch_sneakerdatabase, (model,)),
        (_fetch_google, (brand, model, colorway)),
    ]:
        urls = await fetcher(*args)
        if urls:
            break

    images = [{"url": u, "angle": "reference"} for u in urls]

    # Save to cache even if empty (avoids hammering APIs on every miss)
    try:
        await db.reference_images.update_one(
            {"cache_key": cache_key},
            {"$set": {
                "cache_key": cache_key,
                "brand": brand,
                "model": model,
                "colorway": colorway,
                "images": images,
                "created_at": datetime.utcnow(),
            }},
            upsert=True,
        )
    except Exception:
        pass  # Cache write failure is non-fatal

    return images
