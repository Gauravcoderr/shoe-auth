import asyncio
import base64
import httpx
import json
import re
from typing import Optional
import google.generativeai as genai
from config.database import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

MODEL = "gemini-1.5-flash"


async def fetch_image_as_base64(url: str) -> tuple[str, str]:
    """Download image URL and return (base64_data, mime_type)"""
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        mime = resp.headers.get("content-type", "image/jpeg").split(";")[0]
        return base64.b64encode(resp.content).decode(), mime


async def analyze_shoe(
    brand: str,
    model: str,
    colorway: str,
    photos: list[dict],  # [{ "angle": str, "url": str }]
    prompt: str,
) -> dict:
    """
    Send photos + prompt to Gemini Vision and return structured JSON results.
    Returns dict with overallVerdict, verdictConfidence, verdictSummary, checks[]
    """
    # Fetch all images concurrently
    image_tasks = [fetch_image_as_base64(p["url"]) for p in photos]
    images = await asyncio.gather(*image_tasks)

    # Build multimodal parts: images first, then prompt
    parts = []
    for i, (b64, mime) in enumerate(images):
        angle = photos[i]["angle"]
        parts.append({
            "inline_data": {
                "mime_type": mime,
                "data": b64,
            }
        })
        # Label each image
        parts.append({"text": f"[Photo {i+1} — angle: {angle}]"})

    parts.append({"text": prompt})

    model_client = genai.GenerativeModel(
        model_name=MODEL,
        generation_config={
            "response_mime_type": "application/json",
            "temperature": 0.1,
            "max_output_tokens": 8192,
        },
    )

    # Retry with exponential backoff on rate limit
    for attempt in range(3):
        try:
            response = model_client.generate_content(
                contents=[{"role": "user", "parts": parts}]
            )
            raw = response.text.strip()
            # Strip markdown fences if present
            raw = re.sub(r"^```(?:json)?\n?", "", raw)
            raw = re.sub(r"\n?```$", "", raw)
            return json.loads(raw)
        except Exception as e:
            err_str = str(e)
            if "429" in err_str and attempt < 2:
                wait = 2 ** (attempt + 1)
                await asyncio.sleep(wait)
                continue
            raise
