"""Runtime configuration loaded from environment (with .env file support)."""
from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Core
    app_name: str = "FitAI API"
    env: str = "dev"
    debug: bool = True

    # Database
    database_url: str = "postgresql+asyncpg://fit:fit@localhost:5432/fit"
    database_url_sync: str = "postgresql+psycopg2://fit:fit@localhost:5432/fit"

    # Auth
    jwt_secret: str = "dev-secret-change-in-prod-please"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 days

    # External data sources
    usda_api_key: str | None = None  # Optional — USDA provides a DEMO_KEY but rate-limited
    openfoodfacts_user_agent: str = "FitAI/0.1 (family-use)"

    # CORS (dev)
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
