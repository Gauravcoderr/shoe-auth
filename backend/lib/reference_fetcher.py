"""
Reference image fetcher for sneaker authentication.
Tries multiple free sources with fallbacks. Caches results in MongoDB (30-day TTL).
Empty results are NOT cached so failed lookups retry on next request.
Priority: Google CSE → SneakersAPI → SneakerDatabase → KicksDB
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


async def _fetch_google(brand: str, model: str, colorway: str) -> list[str]:
    api_key = getattr(settings, "GOOGLE_API_KEY", "")
    cx = getattr(settings, "GOOGLE_SEARCH_ENGINE_ID", "")
    if not api_key or not cx:
        print("[ref] Google skipped — missing GOOGLE_API_KEY or GOOGLE_SEARCH_ENGINE_ID")
        return []
    query = f"{brand} {model} {colorway} sneaker official".strip()
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
                    "safe": "active",
                },
            )
            print(f"[ref] Google status={resp.status_code} body={resp.text[:500]}")
            resp.raise_for_status()
            data = resp.json()
            urls = [
                item["link"] for item in data.get("items", [])
                if item.get("link") and item["link"].startswith("http")
            ][:4]
            print(f"[ref] Google found {len(urls)} urls: {urls}")
            return urls
    except Exception as e:
        print(f"[ref] Google error: {e}")
        return []


async def _fetch_sneakersapi(brand: str, model: str, colorway: str) -> list[str]:
    query = f"{brand} {model} {colorway}".strip()
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://api.sneakersapi.dev/api/v3/products",
                params={"q": query, "limit": 5},
            )
            print(f"[ref] SneakersAPI status={resp.status_code} body={resp.text[:300]}")
            resp.raise_for_status()
            data = resp.json()
            urls = []
            for product in data.get("data", []):
                for field in ("imageUrl", "thumbnail", "image"):
                    url = product.get("media", {}).get(field) or product.get(field)
                    if url and isinstance(url, str) and url.startswith("http") and url not in urls:
                        urls.append(url)
            print(f"[ref] SneakersAPI found {len(urls)} urls")
            return urls[:4]
    except Exception as e:
        print(f"[ref] SneakersAPI error: {e}")
        return []


async def _fetch_sneakerdatabase(brand: str, model: str) -> list[str]:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://api.thesneakerdatabase.com/v1/sneakers",
                params={"limit": 5, "name": model, "brand": brand},
            )
            print(f"[ref] SneakerDB status={resp.status_code} body={resp.text[:300]}")
            resp.raise_for_status()
            data = resp.json()
            urls = []
            for product in data.get("results", []):
                media = product.get("media", {})
                for field in ("imageUrl", "smallImageUrl", "thumbUrl"):
                    url = media.get(field)
                    if url and isinstance(url, str) and url.startswith("http") and url not in urls:
                        urls.append(url)
            print(f"[ref] SneakerDB found {len(urls)} urls")
            return urls[:4]
    except Exception as e:
        print(f"[ref] SneakerDB error: {e}")
        return []



async def fetch_reference_images(brand: str, model: str, colorway: str) -> list[dict]:
    db = get_db()
    cache_key = _make_cache_key(brand, model, colorway)

    cached = await db.reference_images.find_one({"cache_key": cache_key})
    if cached:
        print(f"[ref] Cache hit for {cache_key}")
        return cached.get("images", [])

    print(f"[ref] Fetching references for: {brand} / {model} / {colorway}")

    urls: list[str] = []
    for fetcher, args in [
        (_fetch_google, (brand, model, colorway)),
        (_fetch_sneakersapi, (brand, model, colorway)),
        (_fetch_sneakerdatabase, (brand, model)),
    ]:
        urls = await fetcher(*args)
        if urls:
            break

    if not urls:
        print(f"[ref] All sources failed for {cache_key}")
        return []

    images = [{"url": u, "angle": "reference"} for u in urls]

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
    except Exception as e:
        print(f"[ref] Cache write failed: {e}")

    return images
