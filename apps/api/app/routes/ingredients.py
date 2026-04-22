"""Ingredient Composer route — compute combined nutrition from ingredients."""
from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models.food import Food, FoodNutrient, Unit
from app.services.compose import ComposerIngredientIn, UnitContext, compose

router = APIRouter()


class ComposerIngredient(BaseModel):
    food_id: int
    quantity: float = Field(gt=0)
    unit: Unit
    cooking: str | None = Field(default=None, description="raw | boiled | fried | baked | grilled")
    added_oil_ml: float | None = Field(default=None, ge=0, le=100)


class ComposerRequest(BaseModel):
    ingredients: list[ComposerIngredient]


class ComposedTotalsOut(BaseModel):
    total_grams: float
    kcal: float
    protein_g: float
    carbs_g: float
    fat_g: float
    micronutrients: dict[str, float] = {}


@router.post("/compose", response_model=ComposedTotalsOut)
async def compose_meal(
    body: ComposerRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ComposedTotalsOut:
    """Sum nutrients across user-entered ingredients.

    Resolves each `food_id` to its nutrient profile from the DB, then applies
    the shared `compose()` logic (see `services/compose.py`).
    """
    if not body.ingredients:
        raise HTTPException(400, "At least one ingredient required")

    food_ids = [i.food_id for i in body.ingredients]

    # Load foods in one query
    foods = (await db.execute(select(Food).where(Food.id.in_(food_ids)))).scalars().all()
    foods_by_id = {f.id: f for f in foods}

    # Load all nutrients for these foods in one query
    nutrients = (await db.execute(
        select(FoodNutrient).where(FoodNutrient.food_id.in_(food_ids))
    )).scalars().all()
    nutrients_by_food: dict[int, dict[str, float]] = {}
    for n in nutrients:
        nutrients_by_food.setdefault(n.food_id, {})[n.nutrient] = n.per_100g

    # Build service-layer inputs
    inputs: list[ComposerIngredientIn] = []
    for item in body.ingredients:
        food = foods_by_id.get(item.food_id)
        if food is None:
            raise HTTPException(404, f"Food {item.food_id} not found")
        ctx = UnitContext(
            grams_per_piece=food.grams_per_unit if food.default_unit == Unit.piece else None,
            grams_per_serving=food.grams_per_unit if food.default_unit == Unit.serving else None,
            density_g_per_ml=1.0,  # TODO: add density column for oil/milk
        )
        inputs.append(ComposerIngredientIn(
            food_id=item.food_id,
            quantity=item.quantity,
            unit=item.unit,
            per_100g=nutrients_by_food.get(item.food_id, {}),
            ctx=ctx,
            cooking=item.cooking,  # type: ignore[arg-type]
            added_oil_ml=item.added_oil_ml,
        ))

    totals = compose(inputs)
    return ComposedTotalsOut(
        total_grams=totals.total_grams,
        kcal=totals.kcal,
        protein_g=totals.protein,
        carbs_g=totals.carbs,
        fat_g=totals.fat,
        micronutrients=totals.micronutrients,
    )
