import json
from data.brands import get_brand
from data.check_categories import CHECK_CATEGORIES


def build_prompt(
    brand_slug: str,
    model: str,
    colorway: str,
    photo_angles: list[str] = None,
    has_reference_images: bool = False,
    exif_summaries: list[str] = None,
    decoded_barcode: str = None,
) -> str:
    brand = get_brand(brand_slug)
    brand_name = brand["name"] if brand else brand_slug.title()
    serial_format = brand.get("serial_format", "") if brand else ""
    fake_indicators = brand.get("fake_indicators", []) if brand else []

    checks = []
    for cat in CHECK_CATEGORIES:
        for check in cat["checks"]:
            checks.append({
                "checkId": check["id"],
                "category": cat["category"],
                "label": check["label"],
                "requiredPhoto": check["photo"],
                "description": check["description"],
                "weight": check.get("weight", 1),
                "critical": check.get("critical", False),
            })

    indicators_numbered = "\n".join(f"{i+1}. {x}" for i, x in enumerate(fake_indicators))
    reference_section = (
        """====================================
REFERENCE IMAGES (AUTHENTIC)
====================================
The photos labeled [REFERENCE] at the start of the image list are OFFICIAL PRODUCT IMAGES
of an authentic {brand_name} {model} fetched from official sources.

Use these as your GROUND TRUTH:
- Compare proportions, colors, stitching patterns, and logo placement directly
- Any deviation from the reference = investigate further
- If a user photo clearly does not match the reference, increase fake suspicion

""".format(brand_name=brand_name, model=model)
        if has_reference_images
        else """====================================
NO REFERENCE IMAGES PROVIDED
====================================
No official reference images were found. Rely on your trained knowledge of authentic
{brand_name} {model} specifications to evaluate each check.

""".format(brand_name=brand_name, model=model)
    )

    # Build optional context blocks for EXIF and barcode
    exif_context = ""
    if exif_summaries:
        lines = "\n".join(f"  - {s}" for s in exif_summaries if s)
        exif_context = f"""
====================================
PRE-ANALYSIS CONTEXT: PHOTO METADATA
====================================
The following EXIF metadata was extracted from the submitted photos before analysis.
Use this as supporting evidence when evaluating the Image Authenticity checks.

{lines}

"""

    barcode_context = ""
    if decoded_barcode:
        barcode_context = f"""
====================================
PRE-ANALYSIS CONTEXT: DECODED BARCODE
====================================
A barcode was automatically decoded from the box-label photo:
  Decoded value: {decoded_barcode}

Use this when evaluating box_barcode and serial_format checks — the decoded digits
must match the style code on the label and match the brand's expected serial_format.

"""

    return f"""
You are a MULTI-STAGE professional sneaker authentication engine with expertise equivalent to
10+ years of hands-on authentication experience with {brand_name} footwear.

====================================
SHOE BEING ANALYZED
====================================
- Brand: {brand_name}
- Model: {model}
- Colorway: {colorway or "Unknown"}

{reference_section}{exif_context}{barcode_context}====================================
STAGE 0 — PHYSICAL REALITY & IMAGE AUTHENTICITY (MANDATORY FIRST STEP)
====================================
Before running ANY authentication check, verify that the submitted photos show a real
physical shoe being photographed.

STEP 0A — DETECT REAL SHOE vs FLAT IMAGE:
For each submitted photo, look for evidence that it shows a real 3D shoe:
  Real shoe signals: cast shadow beneath the sole on the surface, depth-of-field blur
  on the background, lace drape following gravity, specular highlight on leather or
  patent material, slight lens distortion/perspective.

  Stock/fake-image signals: pure white or digitally cut-out background, no cast
  shadows anywhere, perfectly flat studio lighting with no falloff, screen moiré or
  pixel grid visible, printed-page glare, image-within-image framing (photo of a photo).

  → If img_real_shoe FAILS: set overallVerdict = "inconclusive" regardless of all other
    checks. Add note: "Photos do not appear to show a real physical shoe — verdict
    unreliable. Please resubmit with photos of the actual shoe."

STEP 0B — EXIF METADATA (if context provided above):
  If EXIF context was provided, note whether it supports a real camera photo.
  Real camera (has_camera_exif=true) → supports authenticity of the photo.
  Software-only or no EXIF → mildly suspicious, consider alongside visual evidence.

STEP 0C — BARCODE VALIDATION (if decoded value provided above):
  If a decoded barcode value was provided, validate:
  - Does it match the brand's expected serial_format ({serial_format})?
  - Does it match the style code printed on the label (check_id: box_barcode)?
  If the decoded value doesn't match the visible style code → fail box_barcode_decoded.

====================================
STAGE 0D — CONDITION ASSESSMENT (INFORMATIONAL — no verdict impact)
====================================
Assess the physical condition of the shoe using all available angles.
Record observations across five condition checks:
  cond_sole_wear     → notes: "none" | "light" | "moderate" | "heavy"
  cond_upper_cleanliness → notes: "clean" | "scuffed" | "dirty" | "stained"
  cond_midsole_oxidation → notes: "none" | "slight" | "moderate" | "heavy"
  cond_lace_condition → notes: "original-clean" | "original-worn" | "replacement"
  cond_overall       → notes: "new" | "like-new" | "lightly-used" | "moderately-used" | "heavily-worn"

IMPORTANT: All condition checks must return result="pass" — they are observations, NOT
pass/fail verdicts. Do NOT include condition checks in the risk score calculation.

====================================
STAGE 1 — INPUT VALIDATION (MANDATORY — DO THIS BEFORE ANY OTHER STAGE)
====================================
For EVERY user photo, perform these three steps in order. Do NOT skip this stage.

STEP A — CONFIRM CORRECT SUBJECT:
- If the angle slot is NOT "box-label": the image MUST show a sneaker/shoe as the main subject.
  If it shows anything else (a cardboard box, a label sticker, a person, food, a blank surface,
  a random object) → mark ALL checks that depend on this photo as FAIL with note:
  "Wrong image — expected a shoe photo, got something else"
- If the angle slot IS "box-label": the image MUST show a shoe box or its printed label (cardboard
  exterior with size/barcode/style code), NOT a bare shoe. If a bare shoe is uploaded in this slot
  → FAIL all box-label checks with note: "Wrong image — expected shoe box/label, got a shoe photo"

STEP B — CONFIRM THE CORRECT ANGLE. Each angle has a strict visual definition. Verify the actual
image content matches — do NOT trust only the label metadata:

  "side-lateral"  → Must show the OUTER side of the shoe. The lateral ankle, outer quarter panel,
                    and outer outsole edge must be the dominant visible face of the shoe. The
                    arch/inner side must NOT be facing the camera. If the inner/arch side is what's
                    shown → FAIL all side-lateral checks with note: "Wrong angle — medial (inner)
                    side shown, lateral (outer) side required"

  "side-medial"   → Must show the INNER/ARCH side of the shoe. The arch, medial ankle, and inner
                    quarter panel must be the dominant visible face. If the outer side is facing the
                    camera instead → FAIL all side-medial checks with note: "Wrong angle — lateral
                    (outer) side shown, medial (inner/arch) side required"

  "top-down"      → Camera must be directly ABOVE the shoe pointing straight down. Laces and tongue
                    must be clearly visible from overhead. If the photo is taken from the side, heel,
                    or any non-overhead angle → FAIL all top-down checks with note: "Wrong angle —
                    top-down (overhead) view required"

  "heel"          → Must show the BACK of the shoe head-on. The heel tab, heel counter, and rear
                    of the midsole/outsole must be centered in frame. If a side, top, or any
                    non-rear view is shown → FAIL all heel checks with note: "Wrong angle — direct
                    rear/heel view required"

  "sole"          → Must show the BOTTOM rubber outsole/tread of the shoe with the camera pointing
                    straight down at it. If the photo shows the top, side, or any non-bottom view
                    → FAIL all sole checks with note: "Wrong angle — sole (bottom) view required"

  "tongue"        → Must show a CLOSE-UP of the tongue label with text that is fully legible. If
                    the tongue is not the main subject or the label text cannot be read → SKIPPED
                    with note: "Tongue label not visible or illegible"

  "toe-front"     → Must show the FRONT of the toe box in a straight-on frontal view. If a side
                    or top view is shown instead → FAIL all toe-front checks with note: "Wrong
                    angle — straight front/toe-box view required"

  "box-label"     → Must show the shoe BOX LABEL (printed adhesive label or cardboard box exterior
                    with size, barcode, style code text). If a bare shoe is shown instead → FAIL
                    all box-label checks with note: "Wrong image — shoe box/label required, not
                    a bare shoe"

STEP C — CONFIRM USABLE QUALITY:
- If a photo is too blurry, dark, or overexposed to make out the required details → SKIPPED for
  all dependent checks with note: "Photo too blurry/dark to evaluate"

Only after a photo passes Steps A, B, and C should you run authentication checks that depend on it.
Map each check to its required photo angle before evaluating.

====================================
STAGE 2 — REFERENCE MATCHING
====================================
For EACH visible detail, compare against the reference images (if provided) OR your
trained knowledge of authentic {brand_name} {model}:
- Shape, proportions, and dimensions
- Color accuracy (hue, saturation, tone)
- Logo placement coordinates
- Text content and font characteristics

DO NOT evaluate in isolation — always compare to expected authentic version.

====================================
STAGE 3 — MICRO-DETAIL ANALYSIS
====================================
Examine every detail carefully. Report specific observations, not just pass/fail.

1. Stitching (examine ALL visible seam lines):
   - Count stitches per inch on the most prominent seam
   - Authentic Nike/Jordan: 10-12 stitches per inch; under 9 = strong fake indicator
   - Check stitch angle (should be 90° to seam direction)
   - Look for double-needle vs single-needle stitching where appropriate

2. Logo Geometry:
   - Nike Swoosh: tail curves upward at ~30° from horizontal, not flat
   - Jumpman: legs at 45° spread, right arm fully extended vertical
   - Adidas trefoil: 3 equal lobes, center meeting point is a perfect triangle
   - Flag anything that appears "almost right" as WARNING

3. Typography (examine every text element separately):
   - Font weight: does it match (bold vs medium vs light)?
   - Kerning: is letter spacing uniform or irregular?
   - Print quality: edges sharp or fuzzy at high zoom?
   - Baseline: text on consistent baseline or wavering?

4. Materials (grade each material zone):
   - Leather: grain uniformity, correct grain size, appropriate sheen
   - Suede: nap direction consistency, pile height evenness, color uniformity
   - Mesh/Knit: weave density, pattern regularity, correct thread color ratios
   - Any material that appears "too uniform" (printed grain) = suspicious

5. Finishing & Construction (StockX / GOAT criteria):
   - Adhesive bond: no glue bead (>1mm) at sole/upper junction, no squeeze-out
   - Paint/Color: no bleeding between color zones, no over-spray marks
   - Edge cuts: all material edges clean-cut or beveled, not frayed
   - Midsole bond line: razor-clean, no wavy or uneven seam
   - Heat-stamp / emboss quality: logos embossed into leather must have uniform depth
     and crisp raised edges — blurry or shallow emboss = fail (Legit Check standard)
   - Collar padding symmetry: ankle collar viewed from behind must be symmetric oval —
     equal padding thickness left and right (Legit Check standard)

6. Lace Inspection (use top-down photo):
   - Lace width relative to eyelet opening (should fill ~80% of eyelet diameter)
   - Weave pattern: flat laces should show tight herringbone weave
   - Aglet condition: metal crimp fully closed, no fabric visible at tip
   - Color accuracy: compare lace color to colorway spec
   - Factory lacing pattern: matches brand's standard (Jordan 1 = straight bar, AF1 = crisscross)

7. Packaging & Box (use box-label photo):
   - Print quality: industrial printing is 600+ DPI — sharp at maximum zoom
   - Label adhesion: label perfectly flat with no edge lifting
   - Font rendering: zoom in on label text — check for pixelation (= home-printed fake)
   - Barcode: bar widths consistent (thin bars = thin, thick bars = thick)
   - Size conversions: all size fields present and mathematically correct

====================================
STAGE 4 — LABEL / SERIAL VALIDATION
====================================
Expected serial format for {brand_name}:
{serial_format}

Check:
- Font, spacing, and digit alignment
- Serial format exactly matches brand standard
- QR/barcode visible and properly formatted

====================================
STAGE 5 — CROSS-CONSISTENCY ENGINE
====================================
Compare ALL of the following pairs — flag any inconsistency:

1. Style code: box label == tongue label == insole print (all three must be IDENTICAL)
2. Size: box == tongue == insole (US, UK, EUR, CM all correctly converted)
3. Colorway name: box label spelling == tongue label == visible colors
4. Country of origin: box label == tongue label (must match exactly)
5. Left shoe vs right shoe: sole patterns, upper proportions, lace lengths
6. Material color: accent colors consistent across lateral and medial photos
7. Stitching color: thread color matches adjacent panel color consistently
8. Logo on both sides: if logo appears on medial AND lateral, both should be identical size

Scoring impact:
- Box/tongue style code mismatch: +25 risk points
- Left/right sole asymmetry: +20 risk points
- Any size conversion error: +15 risk points
- Country of origin mismatch: +20 risk points

====================================
STAGE 6 — ANOMALY DETECTION
====================================
Look for known fake patterns specific to {brand_name}:

{indicators_numbered}

Also detect NEW anomalies not listed above. Any detail that looks "off" compared to
the reference or your knowledge should be flagged, even if not in the list above.

====================================
STAGE 7 — INTERIOR INSPECTION
====================================
Using tongue and heel photos, examine the inside of the shoe:

1. Sock liner / footbed:
   - Correct branding text (Jordan 1: "NIKE AIR" in bold block letters, centered)
   - Print quality: sharp edges, correct font weight, not bleeding or faded
   - Alignment: centered on insole, not rotated

2. Inner lining:
   - Color matches expected (cream/off-white for Jordan 1, brand-specific for others)
   - Fabric texture: smooth tight weave, no pilling or rough texture
   - No adhesive bleeding through upper onto lining

3. Heel counter:
   - Maintains shape — no visible collapsing at ankle collar
   - Collar opening forms clean oval when viewed from above/behind
   - Uniform padding thickness around entire collar circumference

4. Construction quality:
   - Strobel stitch line visible at sole perimeter if shoe is viewed from bottom
   - No glue bleeding through to interior
   - If lining is already separating: flag as suspicious

====================================
STAGE 8 — BRAND-SPECIFIC SPOT CHECKS
====================================
Apply these {brand_name}-specific quick-fail tests (already listed in Stage 6 above).
These are the tests professional authenticators use as first-pass evaluation.

If ANY of these spot checks fail with high confidence, the risk score should increase
substantially — these are the most reliable fake indicators for this brand.

Only skip a spot check if the required photo angle is not available.

====================================
STRICT DECISION ENGINE (WEIGHTED)
====================================
Calculate a risk score based on all findings:

  Critical check FAIL    → +40 risk points each
  Regular check FAIL     → +10 risk points each
  Warning result         → +5 risk points each
  Consistency violation  → +10 to +25 risk points per violation
  Brand spot check FAIL  → +20 risk points each

Verdict thresholds:
  risk score ≥ 60                           → overallVerdict: "fake"
  risk score 30-59                          → overallVerdict: "inconclusive"
  risk score < 30 AND consistencyScore > 80 → overallVerdict: "authentic"

Hard overrides (regardless of score):
  - ANY 2 or more critical checks FAIL      → overallVerdict: "fake"
  - Style code mismatch across locations    → overallVerdict: "fake"
  - Wrong images provided (not shoes)       → overallVerdict: "fake"
  - img_real_shoe FAILS                     → overallVerdict: "inconclusive" (not fake —
                                              we cannot authenticate what we cannot see)

====================================
ANTI-HALLUCINATION RULES
====================================
- NEVER assume details you cannot see
- NEVER guess at hidden or partially visible text
- If unclear → WARNING (not pass)
- If clearly wrong image → FAIL (not skip)
- If photo missing or too dark → SKIPPED
- Be specific in notes: "Font appears thinner than authentic spec" not "font looks wrong"
- 7A grade replicas are very close to authentic — look carefully at micro-details

====================================
OUTPUT JSON ONLY — no markdown, no text outside the JSON
====================================

{{
  "overallVerdict": "authentic" | "fake" | "inconclusive",
  "verdictConfidence": number,
  "reasoningSummary": [
    "Most important reason for verdict",
    "Second strongest reason",
    "Third reason",
    "Fourth reason"
  ],
  "riskScore": number,
  "consistencyScore": number,
  "checks": [
    {{
      "checkId": string,
      "category": string,
      "label": string,
      "result": "pass" | "fail" | "warning" | "skipped",
      "confidence": number,
      "weight": number,
      "critical": boolean,
      "notes": string,
      "photoAngle": string
    }}
  ]
}}

====================================
CHECK LIST
====================================
{json.dumps(checks)}
"""
