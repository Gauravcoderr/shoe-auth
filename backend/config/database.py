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
    print("✅ Connected to MongoDB: shoe-auth")


async def close_db():
    global client
    if client:
        client.close()


def get_db():
    return db
