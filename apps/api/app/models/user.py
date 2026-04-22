"""User + profile ORM models."""
from __future__ import annotations

from datetime import date, datetime
from enum import Enum

from sqlalchemy import Date, DateTime, Enum as SAEnum, Float, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class Gender(str, Enum):
    male = "male"
    female = "female"


class Goal(str, Enum):
    lose = "lose"
    maintain = "maintain"
    gain = "gain"


class Activity(str, Enum):
    sedentary = "sedentary"
    light = "light"
    moderate = "moderate"
    active = "active"
    very_active = "very_active"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str | None] = mapped_column(String(255))

    # Profile (set via quiz after signup)
    height_cm: Mapped[float | None] = mapped_column(Float)
    weight_kg: Mapped[float | None] = mapped_column(Float)
    birth_date: Mapped[date | None] = mapped_column(Date)
    gender: Mapped[Gender | None] = mapped_column(SAEnum(Gender, name="gender"))
    goal: Mapped[Goal | None] = mapped_column(SAEnum(Goal, name="goal"))
    activity: Mapped[Activity | None] = mapped_column(SAEnum(Activity, name="activity"))

    # Daily targets (computed from profile at signup; user can override)
    target_kcal: Mapped[float | None] = mapped_column(Float)
    target_protein_g: Mapped[float | None] = mapped_column(Float)
    target_carbs_g: Mapped[float | None] = mapped_column(Float)
    target_fat_g: Mapped[float | None] = mapped_column(Float)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
