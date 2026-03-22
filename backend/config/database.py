from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    MONGODB_URI: str = "mongodb://localhost:27017"
    JWT_SECRET: str = "shoe-auth-jwt-secret-change-this"
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    FRONTEND_URL: str = "http://localhost:3000"
    GMAIL_USER: str = ""
    GMAIL_APP_PASSWORD: str = ""
    SNEAKERS_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    GOOGLE_SEARCH_ENGINE_ID: str = ""
    SERPER_API_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client["shoe-auth"]
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.auth_checks.create_index([("user_id", 1), ("created_at", -1)])
    await db.auth_checks.create_index("processing_status")
    # Reference image cache — TTL 30 days
    await db.reference_images.create_index("cache_key", unique=True)
    await db.reference_images.create_index("created_at", expireAfterSeconds=2592000)
    print("✅ Connected to MongoDB: shoe-auth")


async def close_db():
    global client
    if client:
        client.close()


def get_db():
    return db
