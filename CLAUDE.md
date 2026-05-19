# CLAUDE.md — shoe-auth

## Project Overview

AI-powered sneaker authentication app. Users upload photos of a shoe from multiple angles; a Gemini vision AI analyses them against 100+ checks and returns a verdict (AUTHENTIC / FAKE / INCONCLUSIVE) with confidence score, risk score, consistency score, condition assessment, and per-check notes.

---

## Monorepo Layout

```
shoe-auth/
├── backend/          FastAPI + Motor (async MongoDB)
│   ├── config/       database.py — Motor client + indexes
│   ├── controllers/  check_controller.py — background analysis task
│   ├── data/         brands.py, check_categories.py — static data
│   ├── lib/          gemini.py, prompt_builder.py, reference_fetcher.py,
│   │                 exif_checker.py, barcode_decoder.py
│   ├── middleware/   auth_middleware.py — JWT cookie verification
│   ├── models/       auth_check.py, user.py — Pydantic schemas
│   ├── routes/       auth.py, checks.py, brands.py
│   └── main.py       FastAPI app entry point
└── frontend/         Next.js 14 (App Router) + Tailwind CSS
    ├── app/          page routes
    │   └── check/[checkId]/results/   results polling page
    ├── components/check/              ResultsCard, VerdictBadge,
    │                                  CheckItemRow, ConditionBadge,
    │                                  AuthCertificate, AnalysisLoader
    ├── lib/api.ts    typed API client
    └── types/index.ts  shared TypeScript interfaces
```

---

## Running Locally

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# pyzbar also needs the system zbar library:
#   macOS: brew install zbar
#   Ubuntu: sudo apt-get install libzbar0
cp .env.example .env   # fill in MONGO_URI, GEMINI_API_KEY, GROQ_API_KEY, etc.
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev
```

---

## Key Design Decisions

### Dual-model AI fallback
`backend/lib/gemini.py` tries **Gemini 1.5 Flash** first. On rate-limit/error it falls back to **Groq Llama 4 Scout**. This gives ~99.9% uptime without a paid tier dependency.

### Weighted risk scoring
`backend/lib/prompt_builder.py` (Stage decision engine):
- Critical FAIL → +40 pts, Regular FAIL → +10 pts, WARNING → +5 pts
- Risk ≥ 60 → fake, 30–59 → inconclusive, < 30 + consistency > 80 → authentic
- Hard overrides: 2+ critical fails or style-code mismatch → fake
- `img_real_shoe` fail → forced inconclusive (can't authenticate a stock photo)

### 8-stage prompt
The prompt in `prompt_builder.py` runs sequentially:
0. Physical reality / image authenticity + condition assessment (NEW)
1. Input validation (angle, subject, quality)
2. Reference image matching
3. Micro-detail analysis (stitching, logos, typography, materials, adhesive, heat-stamp)
4. Label / serial validation
5. Cross-consistency engine (box ↔ tongue ↔ insole)
6. Anomaly detection (brand-specific fake indicators)
7. Interior inspection
8. Brand-specific spot checks

### Reference image caching
`lib/reference_fetcher.py` tries: static map → Serper Google Images → SneakersAPI → TSNKR DB. Results cached in MongoDB `reference_images` collection with 30-day TTL.

### Pre-analysis tools (free, no API cost)
- **ExifRead** (`lib/exif_checker.py`): detects real camera EXIF vs screenshot/stock images. Run on every photo before AI call.
- **pyzbar** (`lib/barcode_decoder.py`): decodes barcode from box-label photo. Decoded value passed to AI for validation.

---

## Adding New Checks

1. **Add the check definition** to `backend/data/check_categories.py`:
   ```python
   {
       "id": "my_check_id",
       "label": "Human-readable Label",
       "photo": "side-lateral",   # angle the photo must be
       "description": "What the AI should look for...",
       "weight": 1,               # 1–3; 3 = heavy fake signal
       "critical": False,         # True = +40 risk pts on fail
   }
   ```

2. **Add instructions** to `backend/lib/prompt_builder.py` in the relevant stage (Stage 3 for visual details, Stage 4 for serial/label, etc.).

3. New **Condition Assessment** checks (informational) always return `result="pass"` and never contribute to `risk_score`.

4. New **Image Authenticity** checks with `critical=True` can trigger the inconclusive override if `img_real_shoe` fails.

---

## New Dependencies (install in backend venv)

```
ExifRead==3.0.0     # EXIF metadata extraction
pyzbar==0.1.9       # barcode / QR decoding (requires libzbar system lib)
Pillow==11.1.0      # image decoding for pyzbar
```

System dependency for pyzbar:
- macOS: `brew install zbar`
- Ubuntu/Debian: `sudo apt-get install libzbar0`

---

## API Routes

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/v1/checks` | optional | Create check, trigger analysis |
| GET | `/api/v1/checks/{id}` | optional | Poll / fetch results |
| GET | `/api/v1/checks` | required | User check history |
| POST | `/api/v1/auth/send-otp` | — | Send OTP to email |
| POST | `/api/v1/auth/verify-otp` | — | Verify OTP, get JWT |
| GET | `/api/v1/brands` | — | List supported brands |

Auth tokens are stored as httponly cookies (access: 15 min, refresh: 30 days).

---

## Deployment

Backend is configured for **Render** (`backend/render.yaml`). Frontend deploys to Vercel or any Next.js host. Set `NEXT_PUBLIC_API_URL` to the backend URL.
