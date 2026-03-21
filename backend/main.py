from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config.database import connect_db, close_db, settings
from routes.auth import router as auth_router
from routes.checks import router as checks_router
from routes.brands import router as brands_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="SneakerAuth API",
    description="AI-powered shoe authentication",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "https://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(checks_router, prefix="/api/v1")
app.include_router(brands_router, prefix="/api/v1")


@app.get("/")
async def health():
    return {"status": "ok", "service": "SneakerAuth API"}
