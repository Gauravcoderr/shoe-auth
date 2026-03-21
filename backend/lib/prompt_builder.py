import json
from data.brands import get_brand
from data.check_categories import CHECK_CATEGORIES


def build_prompt(brand_slug: str, model: str, colorway: str, photo_angles: list[str]) -> str:
    brand = get_brand(brand_slug)
    brand_name = brand["name"] if brand else brand_slug.title()
    serial_format = brand.get("serial_format", "Check inner tongue label for style code.") if brand else ""
    fake_indicators = brand.get("fake_indicators", []) if brand else []

    # Build flat check list for the prompt
    checks_list = []
    for cat in CHECK_CATEGORIES:
        for check in cat["checks"]:
            # Only include checks whose required photo is available (or is optional)
            checks_list.append({
                "checkId": check["id"],
                "category": cat["category"],
                "label": check["label"],
                "requiredPhoto": check["photo"],
                "description": check["description"],
            })

    checks_json = json.dumps(checks_list, indent=2)
    indicators_text = "\n".join(f"- {ind}" for ind in fake_indicators)
    photos_text = ", ".join(photo_angles)

    return f"""You are an expert sneaker authentication specialist with 10+ years of experience authenticating {brand_name} footwear. You have examined thousands of authentic pairs and high-quality counterfeits including 7A grade replicas.

SHOE BEING ANALYZED:
- Brand: {brand_name}
- Model: {model}
- Colorway: {colorway or "Unknown"}

SERIAL NUMBER FORMAT FOR THIS BRAND:
{serial_format}

KNOWN FAKE INDICATORS FOR THIS MODEL:
{indicators_text}

PHOTOS PROVIDED ({len(photo_angles)} photos from these angles: {photos_text}):
Each photo is labeled with its angle in the conversation above.

YOUR TASK:
Analyze these photos and perform each authentication check listed below. For each check:
- Examine the relevant photo angle
- Give a result: "pass" (looks authentic), "fail" (clear fake indicator), "warning" (borderline/uncertain), or "skipped" (photo not available or too blurry)
- Provide a confidence score 0-100 (how clearly the photo evidence supports your result)
- Write a specific note describing exactly what you see (max 150 characters)

RETURN ONLY valid JSON — no markdown, no explanation outside the JSON:

{{
  "overallVerdict": "authentic" | "fake" | "inconclusive",
  "verdictConfidence": <0-100>,
  "verdictSummary": "<2-3 sentence plain English summary of your findings>",
  "checks": [
    {{
      "checkId": "<checkId from list>",
      "category": "<category>",
      "label": "<label>",
      "result": "pass" | "fail" | "warning" | "skipped",
      "confidence": <0-100>,
      "notes": "<specific observation, max 150 chars>",
      "photoAngle": "<which angle photo you used>"
    }}
  ]
}}

IMPORTANT RULES:
- "skipped" ONLY if the required photo was not provided or is too blurry/dark to analyze
- "warning" means you can see something but are uncertain — borderline quality or ambiguous
- "fail" means you see a clear red flag that indicates a fake
- Overall verdict logic: if 3+ "fail" results OR any critical category fails → "fake". If everything passes → "authentic". Otherwise → "inconclusive"
- verdictConfidence reflects certainty of your overall verdict (not per-check)
- For serial number checks: if box-label photo not provided, mark as "skipped"
- Be specific in notes — "Font appears thinner than authentic spec" not "font looks wrong"
- 7A grade replicas are very close to authentic — look carefully at micro-details

CHECKS TO PERFORM:
{checks_json}"""
