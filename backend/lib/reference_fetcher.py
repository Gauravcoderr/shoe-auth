"""
Reference image fetcher for sneaker authentication.
Tries multiple free sources with fallbacks. Caches results in MongoDB (30-day TTL).
Empty results are NOT cached so failed lookups retry on next request.
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
# Source 1: KicksDB (kicks.dev) — KICKS- prefix key
# ─────────────────────────────────────────────
async def _fetch_kicksdb(brand: str, model: str, colorway: str) -> list[str]:
    key = getattr(settings, "SNEAKERS_API_KEY", "")
    query = f"{brand} {model} {colorway}".strip()
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            # Try v2 endpoint with Bearer auth
            resp = await client.get(
                "https://kicks.dev/api/v2/products",
                params={"q": query, "limit": 5},
                headers={"Authorization": f"Bearer {key}"} if key else {},
            )
            if not resp.is_success:
                # Fallback: v1 with api_key param
                resp = await client.get(
                    "https://kicks.dev/api/products",
                    params={"query": query, "limit": 5, "api_key": key},
                )
            resp.raise_for_status()
            data = resp.json()
            urls = []
            items = data if isinstance(data, list) else data.get("products", data.get("data", data.get("results", [])))
            for product in items:
                for field in ("imageUrl", "image", "thumbnail", "picture", "img"):
                    url = product.get(field) or product.get("media", {}).get(field)
                    if url and isinstance(url, str) and url.startswith("http") and url not in urls:
                        urls.append(url)
            return urls[:4]
    except Exception:
        return []


# ─────────────────────────────────────────────
# Source 2: SneakersAPI.dev
# ─────────────────────────────────────────────
async def _fetch_sneakersapi(brand: str, model: str, colorway: str) -> list[str]:
    query = f"{brand} {model} {colorway}".strip()
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://api.sneakersapi.dev/api/v3/products",
                params={"q": query, "limit": 5},
            )
            resp.raise_for_status()
            data = resp.json()
            urls = []
            for product in data.get("data", []):
                for field in ("imageUrl", "thumbnail", "image"):
                    url = product.get("media", {}).get(field) or product.get(field)
                    if url and isinstance(url, str) and url.startswith("http") and url not in urls:
                        urls.append(url)
            return urls[:4]
    except Exception:
        return []


# ─────────────────────────────────────────────
# Source 3: The Sneaker Database
# ─────────────────────────────────────────────
async def _fetch_sneakerdatabase(brand: str, model: str) -> list[str]:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://api.thesneakerdatabase.com/v1/sneakers",
                params={"limit": 5, "name": model, "brand": brand},
            )
            resp.raise_for_status()
            data = resp.json()
            urls = []
            for product in data.get("results", []):
                media = product.get("media", {})
                for field in ("imageUrl", "smallImageUrl", "thumbUrl"):
                    url = media.get(field)
                    if url and isinstance(url, str) and url.startswith("http") and url not in urls:
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
    # Simple query without site: restriction — works better with image search
    query = f"{brand} {model} {colorway} authentic sneaker".strip()
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                "https://www.googleapis.com/customsearch/v1",
                params={
                    "key": api_key,
                    "cx": cx,
                    "q": query,
                    "searchType": "image",
                    "num": 6,
                    "imgType": "photo",
                    "imgSize": "medium",
                    "safe": "active",
                },
            )
            resp.raise_for_status()
            data = resp.json()
            return [
                item["link"] for item in data.get("items", [])
                if item.get("link") and item["link"].startswith("http")
            ][:4]
    except Exception:
        return []


# ─────────────────────────────────────────────
# Main entry point
# ─────────────────────────────────────────────
async def fetch_reference_images(brand: str, model: str, colorway: str) -> list[dict]:
    """
    Returns list of {"url": str, "angle": "reference"} dicts.
    Tries: MongoDB cache → KicksDB → SneakersAPI → SneakerDatabase → Google.
    Empty results are NOT cached so they retry on next request.
    """
    db = get_db()
    cache_key = _make_cache_key(brand, model, colorway)

    # 1. Check cache (only stored when results were found)
    cached = await db.reference_images.find_one({"cache_key": cache_key})
    if cached:
        return cached.get("images", [])

    # 2-5. Try each source
    urls: list[str] = []
    for fetcher, args in [
        (_fetch_kicksdb, (brand, model, colorway)),
        (_fetch_sneakersapi, (brand, model, colorway)),
        (_fetch_sneakerdatabase, (brand, model)),
        (_fetch_google, (brand, model, colorway)),
    ]:
        urls = await fetcher(*args)
        if urls:
            break

    if not urls:
        return []  # Don't cache empty — retry next time

    images = [{"url": u, "angle": "reference"} for u in urls]

    # Cache only successful results (30-day TTL via MongoDB index)
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
        pass

    return images
