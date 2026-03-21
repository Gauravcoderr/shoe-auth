from fastapi import APIRouter, HTTPException
from data.brands import get_all_brands, get_brand

router = APIRouter(prefix="/brands", tags=["brands"])


@router.get("")
async def list_brands():
    return {"brands": get_all_brands()}


@router.get("/{slug}")
async def get_brand_detail(slug: str):
    brand = get_brand(slug)
    if not brand:
        raise HTTPException(404, "Brand not found")
    return brand
