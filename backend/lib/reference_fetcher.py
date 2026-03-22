"""
Reference image fetcher for sneaker authentication.
Priority: Static map → Google CSE → SneakersAPI → SneakerDatabase
Caches results in MongoDB (30-day TTL). Empty results NOT cached.
"""
import re
import httpx
from datetime import datetime
from config.database import get_db, settings

# Static reference images for top authenticated models
# Using official brand CDN + stockx stable URLs
STATIC_REFS: dict[str, list[str]] = {
    # Nike Air Force 1
    "nike_air-force-1-low": [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/3cc96f56-b298-4cfd-b6ce-4570e658ec76/air-force-1-07-shoes-WrLlWX.png",
    ],
    "nike_air-force-1-high": [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/00375837-849f-4f17-b7f8-62b72dfde4e2/air-force-1-high-07-shoes-2pMqWz.png",
    ],
    # Nike Dunk
    "nike_dunk-low": [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b0f3cc8-dc25-4e65-8f3d-c8ba1f15b2ba/dunk-low-retro-shoes-GGmM6z.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c5adc7bc-8bd9-4cf2-accc-81d63b0d73ea/dunk-low-retro-shoes-GGmM6z.png",
    ],
    "nike_dunk-high": [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/2a9d8d90-dc37-4b2b-a67c-63b5ba8f7568/dunk-high-retro-shoes-QJRbfl.png",
    ],
    # Nike Air Max
    "nike_air-max-90": [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-665455a5-45de-40fb-945f-c1852b82400d/air-max-90-shoes-kRsBnD.png",
    ],
    "nike_air-max-95": [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/ivjpyzlbczbgfkgdmbm8/air-max-95-essential-shoes-NLv59d.png",
    ],
    "nike_air-max-97": [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqgec3mwpzubzbxm/air-max-97-shoes-P2VmXZ.png",
    ],
    # Jordan
    "jordan_air-jordan-1-retro-high-og": [
        "https://images.unsplash.com/photo-1607522370275-f6fd0dd05e8b?w=600&q=90",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=90",
    ],
    "jordan_air-jordan-1-low": [
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=90",
    ],
    "jordan_air-jordan-1-mid": [
        "https://images.unsplash.com/photo-1605408499391-6368c628ef42?w=600&q=90",
    ],
    "jordan_air-jordan-3-retro": [
        "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=90",
    ],
    "jordan_air-jordan-4-retro": [
        "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=90",
    ],
    "jordan_air-jordan-11-retro": [
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=90",
    ],
    # Adidas
    "adidas_stan-smith": [
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/68ae7ea7849b43eca70aac1e00f5146d_9366/Stan_Smith_Shoes_White_FX5502_01_standard.jpg",
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/68ae7ea7849b43eca70aac1e00f5146d_9366/Stan_Smith_Shoes_White_FX5502_02_standard_hover.jpg",
    ],
    "adidas_superstar": [
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/f36578b4facd4896a3e4ac7800abcec2_9366/Superstar_Shoes_White_EG4958_01_standard.jpg",
    ],
    "adidas_samba-og": [
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2938800fb7264dd99e86adf200d4ccbf_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg",
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2938800fb7264dd99e86adf200d4ccbf_9366/Samba_OG_Shoes_Black_B75807_02_standard_hover.jpg",
    ],
    "adidas_ultra-boost-1-0": [
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/7ed0f8d0a59e4bec9847af7800abcc1d_9366/Ultraboost_1.0_Shoes_Black_HQ4202_01_standard.jpg",
    ],
    "adidas_campus-00s": [
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a57bfc04eed14fcb9098aed4013b9be8_9366/Campus_00s_Shoes_White_HQ8708_01_standard.jpg",
    ],
    "adidas_gazelle": [
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/5c7e7aa2929a4cde95daae1700abc87e_9366/Gazelle_Shoes_Blue_BB5478_01_standard.jpg",
    ],
    # New Balance
    "new_balance_550": [
        "https://nb.scene7.com/is/image/NB/bb550wt1_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=880&hei=880",
        "https://nb.scene7.com/is/image/NB/bb550wt1_nb_03_i?$pdpflexf2$&qlt=80&fmt=webp&wid=880&hei=880",
    ],
    "new_balance_990v6": [
        "https://nb.scene7.com/is/image/NB/m990gl6_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=880&hei=880",
    ],
    "new_balance_2002r": [
        "https://nb.scene7.com/is/image/NB/mr2002ra_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=880&hei=880",
    ],
    "new_balance_574": [
        "https://nb.scene7.com/is/image/NB/ml574evg_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=880&hei=880",
    ],
    "new_balance_9060": [
        "https://nb.scene7.com/is/image/NB/u9060aaa_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=880&hei=880",
    ],
}


def _slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def _make_cache_key(brand: str, model: str, colorway: str) -> str:
    parts = [_slugify(brand), _slugify(model)]
    if colorway:
        parts.append(_slugify(colorway))
    return "_".join(parts)


def _static_lookup(brand: str, model: str) -> list[str]:
    """Check static map using brand_model key (colorway-agnostic)."""
    key = f"{_slugify(brand)}_{_slugify(model)}"
    urls = STATIC_REFS.get(key, [])
    if urls:
        print(f"[ref] Static hit for {key} → {len(urls)} urls")
    return urls


async def _fetch_serper(brand: str, model: str, colorway: str) -> list[str]:
    api_key = getattr(settings, "SERPER_API_KEY", "")
    if not api_key:
        print("[ref] Serper skipped — missing SERPER_API_KEY")
        return []
    query = f"{brand} {model} {colorway} authentic sneaker".strip()
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(
                "https://google.serper.dev/images",
                headers={"X-API-KEY": api_key, "Content-Type": "application/json"},
                json={"q": query, "num": 6},
            )
            print(f"[ref] Serper status={resp.status_code} body={resp.text[:300]}")
            resp.raise_for_status()
            data = resp.json()
            urls = [
                item["imageUrl"] for item in data.get("images", [])
                if item.get("imageUrl") and item["imageUrl"].startswith("http")
            ][:4]
            print(f"[ref] Serper found {len(urls)} urls: {urls}")
            return urls
    except Exception as e:
        print(f"[ref] Serper error: {e}")
        return []


async def _fetch_sneakersapi(brand: str, model: str, colorway: str) -> list[str]:
    query = f"{brand} {model} {colorway}".strip()
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://api.sneakersapi.dev/api/v3/products",
                params={"q": query, "limit": 5},
            )
            print(f"[ref] SneakersAPI status={resp.status_code}")
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
            print(f"[ref] SneakerDB status={resp.status_code}")
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

    # 1. Static map (instant, no API)
    urls = _static_lookup(brand, model)

    # 2. Serper (Google Images, 2500 free/month)
    if not urls:
        urls = await _fetch_serper(brand, model, colorway)

    # 3. SneakersAPI
    if not urls:
        urls = await _fetch_sneakersapi(brand, model, colorway)

    # 4. The Sneaker Database
    if not urls:
        urls = await _fetch_sneakerdatabase(brand, model)

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
