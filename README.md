# 👟 SneakerAuth — AI Shoe Authentication

> Upload photos of your sneakers. Our AI checks 50+ points in seconds and tells you if they're real or fake.

## What It Does

- **Upload 5–8 photos** from guided angles (side, sole, tongue, heel, etc.)
- **Gemini AI analyzes** color, stitching, sole pattern, logo, badge, materials, serial number — 50+ checks
- **Get a verdict:** AUTHENTIC / FAKE / INCONCLUSIVE with per-check breakdown and confidence scores
- **3 free checks** without creating an account — then login required
- Supports: Nike, Jordan, Adidas, Yeezy, New Balance, Puma, Reebok, Asics

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, TanStack Query |
| Backend | Python 3.11, FastAPI, Uvicorn |
| Database | MongoDB Atlas (free tier) |
| AI | Google Gemini 2.5 Flash (`gemini-2.5-flash-preview-03-25`) |
| Auth | JWT + Email OTP (no passwords) |
| Images | Cloudinary (upload) |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
shoe-auth/
├── frontend/          # Next.js 14 app
│   ├── app/
│   │   ├── page.tsx               # Landing page
│   │   ├── check/page.tsx         # Step 1: Brand + Model
│   │   ├── check/[id]/upload/     # Step 2: Photo upload
│   │   ├── check/[id]/results/    # Step 3: Results
│   │   ├── account/               # Check history
│   │   └── guides/[brand]/        # Fake detection guides (SEO)
│   ├── components/
│   │   ├── check/                 # BrandSelector, PhotoUploadGrid, ResultsCard...
│   │   ├── home/                  # HeroSection, HowItWorks, BrandGrid...
│   │   └── layout/               # Navbar, Footer
│   └── lib/
│       ├── freeCheckTracker.ts    # localStorage counter (3 free → login gate)
│       ├── uploadImage.ts         # Cloudinary upload
│       └── api.ts                 # Typed fetch wrappers
│
└── backend/           # Python FastAPI app
    ├── main.py                    # FastAPI app entry
    ├── config/
    │   └── database.py            # MongoDB async connection (Motor)
    ├── models/
    │   ├── user.py                # User schema (tier, checksToday)
    │   └── auth_check.py          # AuthCheck schema (photos, results, verdict)
    ├── routes/
    │   ├── auth.py                # OTP send/verify, JWT, refresh, logout
    │   └── checks.py              # POST /checks, GET /checks/:id, GET /checks
    ├── controllers/
    │   └── check_controller.py    # Create check, trigger AI, poll status
    ├── middleware/
    │   └── auth_middleware.py     # JWT verification dependency
    ├── lib/
    │   ├── gemini.py              # Gemini Vision analysis engine
    │   ├── prompt_builder.py      # Brand-specific prompt construction
    │   └── mailer.py              # OTP email sender
    └── data/
        ├── brands.py              # 8 brands + models + fake indicators
        └── check_categories.py    # ~50 checks across 12 categories
```

---

## Authentication Flow (Email OTP, no passwords)

```
POST /api/v1/auth/send-otp   { email }
POST /api/v1/auth/verify-otp { email, otp }  → JWT access + refresh cookies
POST /api/v1/auth/refresh                    → rotate refresh token
POST /api/v1/auth/logout                     → revoke token
GET  /api/v1/auth/me                         → profile (requires JWT)
```

---

## Check API

```
POST /api/v1/checks         { brand, model, colorway, photos[] }  → { checkId }
GET  /api/v1/checks/:id     → { status, verdict, results[] }
GET  /api/v1/checks         → user check history (requires JWT)
```

---

## Free Check Flow

```
User visits → localStorage count checked
  count 0–2 → full check, no login needed
  count 3+  → FreeGate overlay: "Login to continue"

Anonymous checks stored with userId: null in MongoDB
After login, checks stay accessible via account page
```

---

## 8 Photo Angles

| # | Angle | Covers |
|---|-------|--------|
| 1 | Lateral (outer side) | Silhouette, heel tab, sole shape |
| 2 | Medial (inner side) | Medial logo, arch stitching |
| 3 | Top-down | Toe box, lace holes, symmetry |
| 4 | Heel / back | Heel counter, pull tab |
| 5 | Sole (bottom) | Tread pattern, outsole branding |
| 6 | Tongue label | Tag text, font, country of origin |
| 7 | Toe box (front) | Front logo, material texture |
| 8 | Box label (optional) | Barcode format, font, colorway spelling |

Minimum 5 required. SVG ghost overlays guide exact framing.

---

## 12 Authentication Check Categories (~50 total)

1. Shape & Silhouette
2. Color & Finish
3. Logo & Badge
4. Stitching Quality
5. Sole & Tread
6. Tongue Label
7. Heel Tab
8. Insole
9. Box & Packaging
10. Material & Texture
11. Hardware (eyelets, aglets)
12. Serial Number Format

---

## Free Services Used

| Service | Free Limit |
|---------|-----------|
| Gemini API | 1,500 req/day |
| MongoDB Atlas | 512 MB storage |
| Vercel | 100 GB bandwidth/month |
| Render | 750 hrs/month |
| Cloudinary | 25 GB storage |

---

## Setup

### Backend (Python)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in values
uvicorn main:app --reload --port 8000
```

### Frontend (Next.js)
```bash
cd frontend
npm install
cp .env.local.example .env.local   # fill in values
npm run dev
```

---

## Environment Variables

### Backend `.env`
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-key
FRONTEND_URL=http://localhost:3000
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=shoe-auth
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

---

## Roadmap

- [x] MVP: AI photo analysis, free + login gate, 8 brands
- [ ] Premium tier + Razorpay payments
- [ ] PDF authentication certificate download
- [ ] Brand-specific guides (SEO content)
- [ ] Mobile app (React Native)
- [ ] Physical authentication service option
