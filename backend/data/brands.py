from typing import Dict, List

BRANDS: Dict[str, dict] = {
    "nike": {
        "name": "Nike",
        "slug": "nike",
        "models": [
            "Air Force 1 Low", "Air Force 1 High", "Air Max 90", "Air Max 95",
            "Air Max 97", "Air Max 270", "Air Max 1", "Dunk Low", "Dunk High",
            "Blazer Mid", "Cortez", "React Element 55", "Free Run",
            "Air Presto", "Air Huarache",
        ],
        "serial_format": "Style code format: XXXXXX-XXX (6 digits, dash, 3 digits). Example: CU8591-001",
        "fake_indicators": [
            "Fakes often have longer stitch lengths on the swoosh to save thread — authentic Nike is 10-12 stitches/inch",
            "The Nike Air bubble on fakes is usually smaller, opaque, or painted rubber — no actual air depth visible",
            "Authentic Air Force 1 soles have a distinct creamy off-white matte finish; fakes use pure white or glossy lacquer",
            "Font on the tongue tag should be clean Helvetica Neue with no bleeding ink — fakes blur or wrong-weight the font",
            "The pivot circle on the sole of Air Force 1 must be a perfect geometric circle — fakes are slightly oval",
            "Heel counter on fakes is often softer and collapses visibly inward at the ankle opening",
            # Lace indicators
            "AF1 laces are flat woven cotton approximately 14-15mm wide — fakes use narrower 10-12mm nylon laces that look thin in the lace bed",
            "AF1 lace color is warm off-white/cream, NOT optical bright white — bright white laces = replacement or fake laces",
            "Authentic AF1 aglets are a slightly elongated silver metal crimp — fakes use rotating plastic aglets or frayed non-crimped tips",
            "AF1 factory lacing pattern is crisscross from bottom eyelet — straight bar lacing on AF1 suggests re-lacing",
            # Box indicators
            "Nike box is Pantone 1655C orange — not red-orange, not burnt orange; fake boxes frequently use the wrong orange shade",
            "Nike box label font: the digit '1' has a small flag serif at the top — fakes use a plain sans-serif '1' without the serif",
            "Nike box label text is industrial printed at 600+ DPI — pixelated or blurry text = home-printed fake label",
            "Nike box side sticker (style code label) should be white label on orange box — fakes sometimes invert or omit this secondary sticker",
        ],
    },
    "jordan": {
        "name": "Air Jordan",
        "slug": "jordan",
        "models": [
            "Air Jordan 1 Retro High OG", "Air Jordan 1 Low", "Air Jordan 1 Mid",
            "Air Jordan 3 Retro", "Air Jordan 4 Retro", "Air Jordan 5 Retro",
            "Air Jordan 6 Retro", "Air Jordan 11 Retro", "Air Jordan 12 Retro",
            "Air Jordan 13 Retro", "Air Jordan 6 Rings",
        ],
        "serial_format": "Style code format: XXXXXX-XXX. Example: 555088-134 (Chicago). Check inner tongue label.",
        "fake_indicators": [
            "Jordan 1 toe cap: exactly 3 rows of 12 perforations (36 total), each hole 2.5mm, evenly spaced — fakes have wrong counts or irregular spacing",
            "The Jumpman logo on fakes is often slightly misaligned or has different leg/arm proportions — legs should be at 45° spread",
            "Authentic Jordan 1 wings logo stitching has consistent thread density 10-12 stitches/inch; fakes are uneven",
            "The heel swoosh on Jordan 4 should be perfectly straight — fakes often curve slightly at the tip",
            "NIKE AIR text on insole must be crisp bold block font, centered — fakes use thinner font or off-center placement",
            "Jordan 11 patent leather should have deep glossy finish with visible depth; fakes use thin plastic-like material",
            # Lace indicators
            "Jordan 1 laces are flat cotton 14-15mm wide — the most common fake replacement uses glossy satin laces which look visibly wrong",
            "Jordan 1 is factory straight-bar laced from the factory — crisscross lacing suggests the shoe was re-laced (investigate why)",
            "Jordan 1 aglets: color should match the lace color (red aglets for red laces, white aglets for white laces) — fakes use silver aglets regardless",
            "Jordan 1 'Chicago': lower laces red, upper laces white with red tips — many fakes use all-white or wrong-length laces",
            # Box indicators
            "Jordan box label: the 'Air Jordan' wordmark should be in the correct italic condensed font — fakes use an upright (non-italic) version",
            "Jordan box size field lists US / UK / FR / CM — if the 'FR' field reads a non-standard number (e.g. 45 instead of 44.5 for US 10), it is a fake label",
            "Authentic Jordan box has a subtle texture to the orange cardboard surface — fake boxes use smooth matte cardboard without the texture",
            "Jumpman logo on Jordan box end-label should be crisply embossed into the cardboard — fakes use a flat printed Jumpman with no emboss depth",
        ],
    },
    "adidas": {
        "name": "Adidas",
        "slug": "adidas",
        "models": [
            "Ultra Boost 1.0", "Ultra Boost 2.0", "Stan Smith", "Superstar",
            "NMD R1", "NMD XR1", "Forum Low", "Forum High", "Gazelle",
            "Samba OG", "Campus 00s", "Response CL", "Handball Spezial",
        ],
        "serial_format": "Style code is 6 characters: letters + numbers. Example: GX3607. Found on box and inner tongue label.",
        "fake_indicators": [
            "The 3 stripes on fakes are often too thick, too thin, or unevenly spaced — compare stripe width to gap width, should be equal",
            "Adidas Trefoil logo must be perfectly symmetrical with 3 equal-size lobes — fakes are asymmetric or have wrong proportions",
            "Ultra Boost Primeknit weave on fakes is noticeably looser and less defined — individual knit loops should be tight and regular",
            "Continental sole pattern on Stan Smith must be very precise with sharp edges — fakes have blurry or simplified pattern",
            "Samba gum sole must be translucent warm amber — not opaque yellow, not clear plastic; compare against reference sole image",
            # Lace indicators
            "Adidas laces (Stan Smith, Superstar): flat cotton with a specific tight herringbone weave — fakes use a looser open weave that appears less structured",
            "Stan Smith lace color is pure bright white (unlike Nike which uses off-white) — cream or yellow-tinted laces on Stan Smith = wrong",
            "Ultra Boost uses round tubular laces, not flat — any flat laces on Ultra Boost = incorrect replacement laces",
            "Adidas aglets are white molded plastic with a squared-off rectangular shape — fakes use a generic silver metal crimp",
            # Box indicators
            "Adidas white box has a specific matte finish — fakes use a semi-gloss or shiny white box surface",
            "Adidas style code is exactly 6 characters (e.g. GX3607) — any 7-character or 5-character code = wrong format, fake label",
            "Adidas box has both a barcode AND a QR code on the label — QR must scan to a valid Adidas product page; fakes use a non-functional QR",
            "Adidas 3-stripe logo on box end should match the stripe thickness of the stripes on the shoe itself — fakes rescale the box logo independently",
        ],
    },
    "new_balance": {
        "name": "New Balance",
        "slug": "new-balance",
        "models": [
            "550", "990v6", "990v5", "990v4", "2002R", "574", "327",
            "1906R", "9060", "530", "M1300", "Made in USA 998",
        ],
        "serial_format": "Model number + colorway code. Example: BB550WT1. On box side panel.",
        "fake_indicators": [
            "The 'N' logo on fakes is often slightly different proportions, wrong font weight, or misaligned — compare proportions against reference",
            "NB 550 sole curvature: authentic has a specific arch profile and toe spring — fakes flatten both, making the shoe look lower profile",
            "990 series ENCAP midsole has a distinct visible white polyurethane ring from the side — fakes blur or omit this ring",
            "Made in USA New Balance models have specific interior construction details — fakes claim 'Made in USA' but show Chinese manufacturing tells",
            "Suede quality on NB 550 should be fine, even nap — fakes use rougher, unevenly-napped suede",
            # Lace indicators
            "NB 550 laces are flat woven, slightly wider than average (~16mm) with a specific texture — fakes use standard-width generic laces",
            "NB 990 series uses round tubular laces, not flat — flat laces on 990 = incorrect replacement laces",
            "New Balance aglets are white molded plastic tube in a clean rectangular shape — fakes use a generic silver metal crimp",
            # Box indicators
            "New Balance box is plain brown kraft cardboard with no color printing on exterior except the label — any colored or branded exterior box = suspicious",
            "NB box label style code includes both letters and numbers in model-specific order (e.g. BB550WT1) — transposed letters or wrong character count = fake",
            "NB box label includes a size conversion chart — if any size conversion is mathematically incorrect, the label is fake",
        ],
    },
}


def get_brand(slug: str) -> dict | None:
    return BRANDS.get(slug)


def get_all_brands() -> List[dict]:
    return [{"slug": k, "name": v["name"], "models": v["models"]} for k, v in BRANDS.items()]
