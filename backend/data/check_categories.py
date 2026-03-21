from typing import List, Dict

CHECK_CATEGORIES: List[Dict] = [
    {
        "category": "Shape & Silhouette",
        "checks": [
            {"id": "side_profile_shape", "label": "Side Profile Shape", "photo": "side-lateral", "description": "Overall silhouette matches authentic reference shape"},
            {"id": "toe_box_shape", "label": "Toe Box Shape", "photo": "toe-front", "description": "Toe box proportions and roundness match authentic"},
            {"id": "heel_curve", "label": "Heel Curve", "photo": "side-lateral", "description": "Heel counter curve and height match authentic"},
            {"id": "midsole_height", "label": "Midsole Height", "photo": "side-lateral", "description": "Midsole thickness consistent with authentic specs"},
        ],
    },
    {
        "category": "Color & Finish",
        "checks": [
            {"id": "main_colorway", "label": "Main Colorway Match", "photo": "side-lateral", "description": "Primary colors match official colorway exactly"},
            {"id": "midsole_color", "label": "Midsole Color", "photo": "side-lateral", "description": "Midsole color shade is correct (e.g. off-white vs pure white)"},
            {"id": "sole_color", "label": "Outsole Color", "photo": "sole", "description": "Outsole color matches authentic (translucency, tone)"},
            {"id": "accent_colors", "label": "Accent Colors", "photo": "side-lateral", "description": "Secondary and accent color shades are accurate"},
        ],
    },
    {
        "category": "Logo & Badge",
        "checks": [
            {"id": "logo_placement", "label": "Logo Placement", "photo": "side-lateral", "description": "Logo is correctly positioned on the upper"},
            {"id": "logo_size", "label": "Logo Size & Proportions", "photo": "side-medial", "description": "Logo dimensions match authentic spec exactly"},
            {"id": "logo_font", "label": "Logo Font & Weight", "photo": "side-lateral", "description": "Font type, weight and spacing are accurate"},
            {"id": "logo_stitching", "label": "Logo Stitching", "photo": "side-lateral", "description": "Stitching around logo is even, tight, and correct color"},
        ],
    },
    {
        "category": "Stitching Quality",
        "checks": [
            {"id": "stitch_density", "label": "Stitch Density", "photo": "side-lateral", "description": "Stitches per inch consistent with authentic (approx 10-12/inch for Nike)"},
            {"id": "stitch_alignment", "label": "Stitch Alignment", "photo": "side-lateral", "description": "Stitching lines are straight with no drift or wobble"},
            {"id": "thread_color", "label": "Thread Color Match", "photo": "side-lateral", "description": "Thread color matches the adjacent material correctly"},
            {"id": "loose_threads", "label": "No Loose Threads", "photo": "side-lateral", "description": "No hanging, loose, or unraveled threads visible"},
            {"id": "toe_stitching", "label": "Toe Cap Stitching", "photo": "toe-front", "description": "Toe cap stitching pattern matches authentic spec (e.g. Jordan 1 perforations)"},
        ],
    },
    {
        "category": "Sole & Tread",
        "checks": [
            {"id": "tread_pattern", "label": "Tread Pattern", "photo": "sole", "description": "Sole tread pattern matches authentic design exactly"},
            {"id": "outsole_branding", "label": "Outsole Branding", "photo": "sole", "description": "Brand text/logo on outsole is correct font and placement"},
            {"id": "sole_material", "label": "Sole Material", "photo": "sole", "description": "Rubber color, texture and sheen match authentic"},
            {"id": "sole_curvature", "label": "Sole Curvature", "photo": "side-lateral", "description": "Side profile of sole curves naturally and correctly"},
        ],
    },
    {
        "category": "Tongue Label",
        "checks": [
            {"id": "tongue_font", "label": "Tongue Label Font", "photo": "tongue", "description": "Font type and weight on tongue tag are correct"},
            {"id": "tongue_text", "label": "Tongue Label Text", "photo": "tongue", "description": "All text content, spelling, and formatting is correct"},
            {"id": "tongue_country", "label": "Country of Origin", "photo": "tongue", "description": "Country of manufacture text is present and correctly formatted"},
            {"id": "tongue_size", "label": "Size Markings", "photo": "tongue", "description": "Size numbers and format (US/UK/EU) match authentic label"},
            {"id": "tongue_stitching", "label": "Tongue Label Attachment", "photo": "tongue", "description": "Label is sewn straight and flush — not glued or crooked"},
        ],
    },
    {
        "category": "Heel Tab",
        "checks": [
            {"id": "heel_logo", "label": "Heel Tab Logo", "photo": "heel", "description": "Logo on heel tab is correct size, placement and color"},
            {"id": "heel_tab_shape", "label": "Heel Tab Shape", "photo": "heel", "description": "Pull tab shape and height matches authentic spec"},
            {"id": "heel_stitching", "label": "Heel Stitching", "photo": "heel", "description": "Stitching at heel counter is tight and consistent"},
        ],
    },
    {
        "category": "Insole",
        "checks": [
            {"id": "insole_text", "label": "Insole Branding Text", "photo": "tongue", "description": "Brand text on insole is correct font and embossed/printed correctly"},
            {"id": "insole_size", "label": "Insole Size Marking", "photo": "tongue", "description": "Size printed on insole matches box and tongue label"},
            {"id": "insole_cushion", "label": "Cushioning Logo", "photo": "side-lateral", "description": "Cushioning technology logo (Air, Boost, GEL etc.) is correct"},
        ],
    },
    {
        "category": "Box & Packaging",
        "checks": [
            {"id": "box_label_font", "label": "Box Label Font", "photo": "box-label", "description": "Font on box label is correct weight and spacing"},
            {"id": "box_barcode", "label": "Barcode Format", "photo": "box-label", "description": "Barcode format matches brand standard (UPC-A)"},
            {"id": "box_colorway_spelling", "label": "Colorway Name Spelling", "photo": "box-label", "description": "Colorway name is spelled correctly on box label"},
            {"id": "box_style_code", "label": "Style Code Format", "photo": "box-label", "description": "Style code format matches brand's known format"},
        ],
    },
    {
        "category": "Material & Texture",
        "checks": [
            {"id": "upper_material", "label": "Upper Material Quality", "photo": "side-lateral", "description": "Leather/suede/mesh texture and finish looks authentic"},
            {"id": "material_transitions", "label": "Material Transition Points", "photo": "side-lateral", "description": "Seams where materials meet are clean with no bunching or gaps"},
            {"id": "knit_pattern", "label": "Knit/Mesh Pattern", "photo": "side-lateral", "description": "Knit weave pattern (Primeknit, Flyknit) is correctly structured"},
        ],
    },
    {
        "category": "Hardware",
        "checks": [
            {"id": "eyelets", "label": "Eyelet Quality", "photo": "top-down", "description": "Lace eyelets are clean metal rings with no rough edges"},
            {"id": "lace_pattern", "label": "Lace Pattern", "photo": "top-down", "description": "Lace weaving pattern matches authentic (over/under pattern)"},
            {"id": "aglet_tips", "label": "Aglet Tips", "photo": "top-down", "description": "Lace tip aglets are clean metal or molded, not frayed"},
        ],
    },
    {
        "category": "Serial Number",
        "checks": [
            {"id": "serial_format", "label": "Serial Number Format", "photo": "box-label", "description": "Serial/style code matches expected format for this brand"},
            {"id": "serial_consistency", "label": "Serial Consistency", "photo": "box-label", "description": "Style code on box matches tongue label matches insole"},
        ],
    },
]


def get_all_checks() -> list:
    all_checks = []
    for cat in CHECK_CATEGORIES:
        for check in cat["checks"]:
            all_checks.append({**check, "category": cat["category"]})
    return all_checks
