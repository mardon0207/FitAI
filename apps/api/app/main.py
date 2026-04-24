"""FastAPI entry point — run via `uvicorn app.main:app --reload`."""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routes import auth, diary, foods, ingredients, users

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="FitAI — oilaviy kaloriya va ovqatlanish tracker",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=settings.cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok", "env": settings.env}


app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(foods.router, prefix="/api/foods", tags=["foods"])
app.include_router(ingredients.router, prefix="/api/ingredients", tags=["ingredients"])
app.include_router(diary.router, prefix="/api/diary", tags=["diary"])
