import asyncio
import base64
import httpx
import json
import re
import google.generativeai as genai
from groq import AsyncGroq
from config.database import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)

GEMINI_MODEL = "gemini-1.5-flash"
GROQ_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"


def _parse_json(raw: str) -> dict:
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?\n?", "", raw)
    raw = re.sub(r"\n?```$", "", raw)
    return json.loads(raw)


async def fetch_image_as_base64(url: str) -> tuple[str, str]:
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        mime = resp.headers.get("content-type", "image/jpeg").split(";")[0]
        return base64.b64encode(resp.content).decode(), mime


async def _analyze_with_gemini(photos: list[dict], prompt: str) -> dict:
    images = await asyncio.gather(*[fetch_image_as_base64(p["url"]) for p in photos])

    parts = []
    for i, (b64, mime) in enumerate(images):
        parts.append({"inline_data": {"mime_type": mime, "data": b64}})
        parts.append({"text": f"[Photo {i+1} — angle: {photos[i]['angle']}]"})
    parts.append({"text": prompt})

    model_client = genai.GenerativeModel(
        model_name=GEMINI_MODEL,
        generation_config={
            "response_mime_type": "application/json",
            "temperature": 0.1,
            "max_output_tokens": 8192,
        },
    )

    for attempt in range(3):
        try:
            response = model_client.generate_content(
                contents=[{"role": "user", "parts": parts}]
            )
            return _parse_json(response.text)
        except Exception as e:
            if "429" in str(e) and attempt < 2:
                await asyncio.sleep(2 ** (attempt + 1))
                continue
            raise


async def _analyze_with_groq(photos: list[dict], prompt: str) -> dict:
    content = []
    for i, p in enumerate(photos):
        content.append({"type": "text", "text": f"[Photo {i+1} — angle: {p['angle']}]"})
        content.append({"type": "image_url", "image_url": {"url": p["url"]}})
    content.append({"type": "text", "text": prompt})

    for attempt in range(3):
        try:
            response = await groq_client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[{"role": "user", "content": content}],
                temperature=0.1,
                max_tokens=8192,
            )
            return _parse_json(response.choices[0].message.content)
        except Exception as e:
            if "429" in str(e) and attempt < 2:
                await asyncio.sleep(2 ** (attempt + 1))
                continue
            raise


async def analyze_shoe(
    brand: str,
    model: str,
    colorway: str,
    photos: list[dict],
    prompt: str,
) -> dict:
    try:
        return await _analyze_with_gemini(photos, prompt)
    except Exception:
        return await _analyze_with_groq(photos, prompt)
