"""Runtime configuration loaded from environment (with .env file support)."""
from __future__ import annotations

import json
from functools import lru_cache
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def _rewrite_sqlalchemy_url(url: str, driver: str) -> str:
    """Adapt plain Postgres URLs from cloud providers to SQLAlchemy driver URLs."""
    if url.startswith(f"postgresql+{driver}://"):
        return url
    if "://" not in url:
        return url

    scheme, rest = url.split("://", 1)
    if scheme in {"postgres", "postgresql"}:
        return f"postgresql+{driver}://{rest}"
    if scheme.startswith("postgresql+"):
        return f"postgresql+{driver}://{rest}"
    return url


def _sanitize_asyncpg_url(url: str) -> str:
    """Remove libpq-only params that break SQLAlchemy's asyncpg adapter.

    Inference from official docs:
    - SQLAlchemy documents `sslmode` for psycopg-style URLs.
    - asyncpg documents SSL under the `ssl` connect parameter / DSN handling.
    """
    parts = urlsplit(url)
    query_items = []
    ssl_value: str | None = None
    for key, value in parse_qsl(parts.query, keep_blank_values=True):
        if key == "channel_binding":
            continue
        if key == "sslmode":
            ssl_value = value
            continue
        query_items.append((key, value))
    if ssl_value and not any(key == "ssl" for key, _ in query_items):
        query_items.append(("ssl", ssl_value))
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query_items), parts.fragment))


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Core
    app_name: str = "FitAI API"
    env: str = "dev"
    debug: bool = True

    # Database
    database_url: str | None = None
    database_url_sync: str | None = None
    database_url_unpooled: str | None = None
    postgres_url: str | None = None
    postgres_url_non_pooling: str | None = None

    # Auth
    jwt_secret: str = "dev-secret-change-in-prod-please"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 days

    # External data sources
    usda_api_key: str | None = None
    openfoodfacts_user_agent: str = "FitAI/0.1 (family-use)"

    # CORS
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://ecofit-cph1.vercel.app",
    ]
    cors_origin_regex: str | None = r"^https://([a-z0-9-]+\.)?vercel\.app$"

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> object:
        if isinstance(value, str):
            stripped = value.strip()
            if not stripped:
                return []
            if stripped.startswith("["):
                return json.loads(stripped)
            return [item.strip() for item in stripped.split(",") if item.strip()]
        return value

    @model_validator(mode="after")
    def finalize_database_urls(self) -> "Settings":
        fallback_async = self.postgres_url or "postgresql://fit:fit@localhost:5432/fit"
        fallback_sync = (
            self.database_url_unpooled
            or self.postgres_url_non_pooling
            or self.postgres_url
            or "postgresql://fit:fit@localhost:5432/fit"
        )

        self.database_url = _sanitize_asyncpg_url(
            _rewrite_sqlalchemy_url(self.database_url or fallback_async, "asyncpg")
        )
        self.database_url_sync = _rewrite_sqlalchemy_url(
            self.database_url_sync or fallback_sync,
            "psycopg2",
        )
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
