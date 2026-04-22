"""Daily log models — diary entries, steps, water, weight."""
from __future__ import annotations

from datetime import date, datetime
from enum import Enum

from sqlalchemy import Date, DateTime, Enum as SAEnum, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base
from app.models.food import Unit


class MealType(str, Enum):
    breakfast = "breakfast"
    lunch = "lunch"
    dinner = "dinner"
    snack = "snack"


class DiaryEntry(Base):
    """A single food (or composed-meal) logged by a user at a specific time."""
    __tablename__ = "diary_entries"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    food_id: Mapped[int | None] = mapped_column(ForeignKey("foods.id"))
    # If this was a one-off ingredient composition (not saved as a recipe),
    # we stash the composed ingredients as JSON in notes + link each to own DiaryEntry.
    # For MVP keep it simple: one row per food.

    meal_type: Mapped[MealType] = mapped_column(SAEnum(MealType, name="meal_type"))
    logged_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    log_date: Mapped[date] = mapped_column(Date, index=True)

    # Portion as logged
    quantity: Mapped[float] = mapped_column(Float)
    unit: Mapped[Unit] = mapped_column(SAEnum(Unit, name="unit"))
    grams: Mapped[float] = mapped_column(Float)  # resolved grams for nutrient calc

    # Denormalized nutrient snapshot (so a food-DB change doesn't alter history)
    kcal: Mapped[float] = mapped_column(Float)
    protein_g: Mapped[float] = mapped_column(Float)
    carbs_g: Mapped[float] = mapped_column(Float)
    fat_g: Mapped[float] = mapped_column(Float)

    note: Mapped[str | None] = mapped_column(String(500))


class StepLog(Base):
    __tablename__ = "step_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    log_date: Mapped[date] = mapped_column(Date, index=True)
    steps: Mapped[int] = mapped_column(Integer)
    kcal_burned: Mapped[float] = mapped_column(Float)
    source: Mapped[str] = mapped_column(String(32), default="manual")  # manual | healthkit | health_connect


class WaterLog(Base):
    __tablename__ = "water_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    logged_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    log_date: Mapped[date] = mapped_column(Date, index=True)
    ml: Mapped[float] = mapped_column(Float)


class WeightLog(Base):
    __tablename__ = "weight_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    logged_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    log_date: Mapped[date] = mapped_column(Date, index=True)
    weight_kg: Mapped[float] = mapped_column(Float)
    note: Mapped[str | None] = mapped_column(String(255))
