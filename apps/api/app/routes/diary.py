"""Diary log routes — today summary, meal entries, water/weight/steps logs."""
from __future__ import annotations

from datetime import date, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models.food import Food, FoodNutrient, Unit
from app.models.log import DiaryEntry, MealType, StepLog, WaterLog, WeightLog
from app.models.user import User
from app.services.compose import UnitContext, scale_nutrient, to_grams
from app.services.security import current_user
from app.services.tdee import steps_to_kcal

router = APIRouter()


class DiaryEntryOut(BaseModel):
    id: int
    food_id: int | None
    meal_type: MealType
    logged_at: datetime
    log_date: date
    quantity: float
    unit: Unit
    grams: float
    kcal: float
    protein_g: float
    carbs_g: float
    fat_g: float
    note: str | None

    model_config = {"from_attributes": True}


class TodaySummary(BaseModel):
    log_date: date
    consumed_kcal: float
    consumed_protein_g: float
    consumed_carbs_g: float
    consumed_fat_g: float
    target_kcal: float | None
    target_protein_g: float | None
    target_carbs_g: float | None
    target_fat_g: float | None
    steps: int
    kcal_burned: float
    water_ml: float
    weight_kg: float | None
    meals: dict[MealType, list[DiaryEntryOut]]


class AddEntryBody(BaseModel):
    food_id: int
    meal_type: MealType
    quantity: float = Field(gt=0)
    unit: Unit
    note: str | None = Field(default=None, max_length=500)
    log_date: date | None = None  # defaults to today


class WaterBody(BaseModel):
    ml: float = Field(gt=0, le=5000)
    log_date: date | None = None


class WeightBody(BaseModel):
    weight_kg: float = Field(gt=20, le=400)
    note: str | None = Field(default=None, max_length=255)
    log_date: date | None = None


class StepsBody(BaseModel):
    steps: int = Field(ge=0, le=100_000)
    log_date: date | None = None
    source: str = "manual"


@router.get("/today", response_model=TodaySummary)
async def get_today(
    target_date: Annotated[date | None, Query(alias="date")] = None,
    user: Annotated[User, Depends(current_user)] = ...,  # type: ignore[assignment]
    db: Annotated[AsyncSession, Depends(get_db)] = ...,  # type: ignore[assignment]
) -> TodaySummary:
    log_date = target_date or date.today()

    entries = (await db.execute(
        select(DiaryEntry)
        .where(and_(DiaryEntry.user_id == user.id, DiaryEntry.log_date == log_date))
        .order_by(DiaryEntry.logged_at)
    )).scalars().all()

    meals: dict[MealType, list[DiaryEntryOut]] = {m: [] for m in MealType}
    for e in entries:
        meals[e.meal_type].append(DiaryEntryOut.model_validate(e))

    consumed_kcal = sum(e.kcal for e in entries)
    consumed_p = sum(e.protein_g for e in entries)
    consumed_c = sum(e.carbs_g for e in entries)
    consumed_f = sum(e.fat_g for e in entries)

    steps_total = await db.scalar(
        select(func.coalesce(func.sum(StepLog.steps), 0))
        .where(and_(StepLog.user_id == user.id, StepLog.log_date == log_date))
    ) or 0
    kcal_burned_total = await db.scalar(
        select(func.coalesce(func.sum(StepLog.kcal_burned), 0.0))
        .where(and_(StepLog.user_id == user.id, StepLog.log_date == log_date))
    ) or 0.0

    water_total = await db.scalar(
        select(func.coalesce(func.sum(WaterLog.ml), 0.0))
        .where(and_(WaterLog.user_id == user.id, WaterLog.log_date == log_date))
    ) or 0.0

    latest_weight = (await db.execute(
        select(WeightLog.weight_kg)
        .where(WeightLog.user_id == user.id)
        .order_by(WeightLog.logged_at.desc())
        .limit(1)
    )).scalar_one_or_none()

    return TodaySummary(
        log_date=log_date,
        consumed_kcal=consumed_kcal,
        consumed_protein_g=consumed_p,
        consumed_carbs_g=consumed_c,
        consumed_fat_g=consumed_f,
        target_kcal=user.target_kcal,
        target_protein_g=user.target_protein_g,
        target_carbs_g=user.target_carbs_g,
        target_fat_g=user.target_fat_g,
        steps=int(steps_total),
        kcal_burned=float(kcal_burned_total),
        water_ml=float(water_total),
        weight_kg=latest_weight,
        meals=meals,
    )


@router.post("/entry", response_model=DiaryEntryOut, status_code=201)
async def add_entry(
    body: AddEntryBody,
    user: Annotated[User, Depends(current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> DiaryEntry:
    """Log a food item. Denormalizes nutrient snapshot to preserve history."""
    food = (await db.execute(select(Food).where(Food.id == body.food_id))).scalar_one_or_none()
    if food is None:
        raise HTTPException(404, "Food not found")

    ctx = UnitContext(
        grams_per_piece=food.grams_per_unit if food.default_unit == Unit.piece else None,
        grams_per_serving=food.grams_per_unit if food.default_unit == Unit.serving else None,
    )
    grams = to_grams(body.quantity, body.unit, ctx)

    nutrients = (await db.execute(
        select(FoodNutrient).where(FoodNutrient.food_id == body.food_id)
    )).scalars().all()
    n_map = {n.nutrient: n.per_100g for n in nutrients}

    entry = DiaryEntry(
        user_id=user.id,
        food_id=body.food_id,
        meal_type=body.meal_type,
        log_date=body.log_date or date.today(),
        quantity=body.quantity,
        unit=body.unit,
        grams=grams,
        kcal=scale_nutrient(n_map.get("kcal", 0), grams),
        protein_g=scale_nutrient(n_map.get("protein", 0), grams),
        carbs_g=scale_nutrient(n_map.get("carbs", 0), grams),
        fat_g=scale_nutrient(n_map.get("fat", 0), grams),
        note=body.note,
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/entry/{entry_id}", status_code=204)
async def delete_entry(
    entry_id: int,
    user: Annotated[User, Depends(current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    entry = (await db.execute(
        select(DiaryEntry).where(and_(DiaryEntry.id == entry_id, DiaryEntry.user_id == user.id))
    )).scalar_one_or_none()
    if entry is None:
        raise HTTPException(404, "Entry not found")
    await db.delete(entry)
    await db.commit()


@router.post("/water", status_code=201)
async def add_water(
    body: WaterBody,
    user: Annotated[User, Depends(current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    log = WaterLog(user_id=user.id, log_date=body.log_date or date.today(), ml=body.ml)
    db.add(log)
    await db.commit()
    return {"id": log.id, "ml": log.ml}


@router.post("/weight", status_code=201)
async def add_weight(
    body: WeightBody,
    user: Annotated[User, Depends(current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    log = WeightLog(
        user_id=user.id,
        log_date=body.log_date or date.today(),
        weight_kg=body.weight_kg,
        note=body.note,
    )
    db.add(log)
    # Also update the profile's current weight so TDEE recalc sees it next patch.
    user.weight_kg = body.weight_kg
    await db.commit()
    return {"id": log.id, "weight_kg": log.weight_kg}


@router.post("/steps", status_code=201)
async def add_steps(
    body: StepsBody,
    user: Annotated[User, Depends(current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    kcal = steps_to_kcal(body.steps, user.weight_kg or 70.0)
    log = StepLog(
        user_id=user.id,
        log_date=body.log_date or date.today(),
        steps=body.steps,
        kcal_burned=kcal,
        source=body.source,
    )
    db.add(log)
    await db.commit()
    return {"id": log.id, "steps": log.steps, "kcal_burned": log.kcal_burned}
