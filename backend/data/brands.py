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
            "Fakes often have longer stitch lengths on the swoosh to save thread",
            "The Nike Air bubble on fakes is usually smaller or misaligned",
            "Authentic Air Force 1 soles have a distinct creamy off-white; fakes use pure white",
            "Font on the tongue tag should be clean with no bleeding ink",
            "The pivot circle on the sole of Air Force 1 should be perfectly round",
            "Heel counter on fakes is often softer and collapses more easily",
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
            "Jordan 1 toe cap should have exactly 3 rows of 12 perforations — fakes often have irregular spacing",
            "The Jumpman logo on fakes is often slightly misaligned or has different proportions",
            "Authentic Jordan 1 wings logo stitching has consistent thread density; fakes are uneven",
            "The heel swoosh on Jordan 4 should be perfectly straight — fakes often curve slightly",
            "Lace holes on Jordan 1: authentic has clean metal eyelets; fakes often have raw edges",
            "NIKE AIR text on insole should be crisp bold font — fakes use thinner font",
            "Jordan 11 patent leather should have a deep glossy finish; fakes use a thinner plastic-like material",
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
            "The 3 stripes on fakes are often too thick or unevenly spaced",
            "Adidas Trefoil logo should be perfectly symmetrical — fakes are often asymmetric",
            "Ultra Boost Primeknit weave on fakes is noticeably looser and less defined",
            "The Continental sole pattern on authentic Stan Smith is very precise — fakes have blurry pattern",
            "Samba gum sole should be translucent with a warm amber tone; fakes use opaque yellow rubber",
        ],
    },
    "yeezy": {
        "name": "Yeezy",
        "slug": "yeezy",
        "models": [
            "Yeezy Boost 350 V2", "Yeezy Boost 700", "Yeezy Boost 700 V2",
            "Yeezy Boost 380", "Yeezy Foam Runner", "Yeezy Slide",
            "Yeezy 500", "Yeezy 450", "Yeezy NSLTD BT",
        ],
        "serial_format": "Style code format: XXXXXX. Example: FW5317. On box and inner tag.",
        "fake_indicators": [
            "Yeezy 350 V2 Primeknit pattern is one of the hardest to fake — look for misaligned diagonal lines",
            "The BOOST midsole on fakes uses cheaper foam that looks less 'bumpy' and uniform",
            "Inner label stitching on Yeezys: authentic uses tight lockstitch, fakes use chain stitch that unravels",
            "Yeezy 350 V2 heel tab should sit flush — fakes often have a tab that sticks out",
            "The monofilament layer (translucent stripe on 350 V2) should be perfectly straight",
            "ADIDAS YEEZY text on insole: authentic has embossed text, fakes usually print it on",
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
            "The 'N' logo on fakes is often slightly different proportions or wrong font weight",
            "New Balance 550 sole curvature: authentic has a specific arch profile fakes often flatten",
            "990 series ENCAP midsole has a distinct white ring visible from the side — fakes blur this",
            "Made in USA models have a specific stitch pattern inside; fakes made in China lack this detail",
            "The suede quality on NB 550 should be fine and even — fakes use rougher, cheaper suede",
        ],
    },
    "puma": {
        "name": "Puma",
        "slug": "puma",
        "models": [
            "Suede Classic", "RS-X", "Clyde", "Rider FV", "Basket Classic",
            "Future Rider", "Mayze", "Cali", "Alteration Kurve",
        ],
        "serial_format": "6-digit article number. Example: 374915-01. On box and inner label.",
        "fake_indicators": [
            "Puma formstrip (side stripe) on fakes is often too wide or wrong angle",
            "The Puma cat logo proportions are frequently wrong on fakes",
            "Suede texture on Suede Classic should be fine-grain — fakes use coarser suede",
            "Authentic Puma Suede soles are slightly flexible rubber — fakes use harder plastic-like sole",
        ],
    },
    "reebok": {
        "name": "Reebok",
        "slug": "reebok",
        "models": [
            "Classic Leather", "Club C 85", "Freestyle Hi", "Question Mid",
            "Answer IV", "Instapump Fury", "Nano X3", "BB4500",
        ],
        "serial_format": "Style code varies. Example: DV3811. On box and tongue label.",
        "fake_indicators": [
            "Reebok vector logo (the double union jack) is a common fake tell — lines should be perfectly parallel",
            "Classic Leather tongue label font should be clean and consistent",
            "The hexalite cushioning on fakes looks different in shape and distribution",
            "DMX foam on fakes doesn't have the same visible air channel pattern",
        ],
    },
    "asics": {
        "name": "Asics",
        "slug": "asics",
        "models": [
            "Gel-Kayano 14", "Gel-Nimbus 9", "Gel-Lyte III", "Gel-1090",
            "Gel-NYC", "GT-2160", "Gel-Cumulus", "Novablast 3",
        ],
        "serial_format": "Style code: 4 letters + 4 digits. Example: 1201A019. On box and inner label.",
        "fake_indicators": [
            "ASICS stripes (onitsuka tiger stripes) on fakes are often wrong width or angle",
            "GEL cushioning unit on fakes is usually a solid rubber blob, not the actual silicone gel",
            "The reflective panels on Gel-Lyte fakes lack the fine honeycomb texture of authentics",
            "Tongue gusset (the fabric connecting tongue to upper) on fakes is often missing or poorly attached",
        ],
    },
}


def get_brand(slug: str) -> dict | None:
    return BRANDS.get(slug)


def get_all_brands() -> List[dict]:
    return [{"slug": k, "name": v["name"], "models": v["models"]} for k, v in BRANDS.items()]
