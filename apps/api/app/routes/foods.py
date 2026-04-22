"""Food search + detail routes."""
from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models.food import Food, FoodAlias, FoodNutrient, FoodSource, Unit

router = APIRouter()


class FoodSummary(BaseModel):
    id: int
    name: str
    brand: str | None = None
    category: str | None = None
    emoji: str | None = None
    source: FoodSource
    default_unit: Unit
    default_qty: float
    grams_per_unit: float | None = None
    is_recipe: bool = False
    kcal_per_100g: float | None = None
    protein_g: float | None = None
    carbs_g: float | None = None
    fat_g: float | None = None

    model_config = {"from_attributes": True}


class FoodDetail(FoodSummary):
    nutrients: dict[str, float]


# Keys we expose in the search preview row
PREVIEW_KEYS = ("kcal", "protein", "carbs", "fat")


@router.get("/search", response_model=list[FoodSummary])
async def search_foods(
    q: str = Query("", max_length=100),
    lang: str = "uz",
    category: str | None = None,
    source: FoodSource | None = None,
    limit: int = Query(30, ge=1, le=100),
    db: Annotated[AsyncSession, Depends(get_db)] = ...,  # type: ignore[assignment]
) -> list[FoodSummary]:
    """Fuzzy search using pg_trgm similarity on aliases + canonical names.

    The `pg_trgm` extension must be enabled — see alembic/versions/*_enable_pg_trgm.py.
    """
    query = q.strip()

    # Build an aliased query: join aliases in the user's language, fall back to canonical name.
    alias_match = select(FoodAlias.food_id).where(
        and_(
            FoodAlias.lang == lang,
            FoodAlias.alias.ilike(f"%{query}%") if query else FoodAlias.alias.isnot(None),
        )
    )

    stmt = select(Food)
    if query:
        stmt = stmt.where(or_(Food.name.ilike(f"%{query}%"), Food.id.in_(alias_match)))
        # Prefer pg_trgm similarity when available.
        try:
            stmt = stmt.order_by(func.similarity(Food.name, query).desc())
        except Exception:  # noqa: BLE001 — sqlite fallback for unit tests
            stmt = stmt.order_by(Food.name)
    if category:
        stmt = stmt.where(Food.category == category)
    if source:
        stmt = stmt.where(Food.source == source)

    stmt = stmt.limit(limit)
    rows = (await db.execute(stmt)).scalars().all()
    if not rows:
        return []

    # Fetch preview nutrients in one go
    food_ids = [r.id for r in rows]
    nutrient_rows = (await db.execute(
        select(FoodNutrient).where(
            and_(FoodNutrient.food_id.in_(food_ids), FoodNutrient.nutrient.in_(PREVIEW_KEYS))
        )
    )).scalars().all()
    by_food: dict[int, dict[str, float]] = {}
    for n in nutrient_rows:
        by_food.setdefault(n.food_id, {})[n.nutrient] = n.per_100g

    result: list[FoodSummary] = []
    for r in rows:
        preview = by_food.get(r.id, {})
        result.append(FoodSummary(
            id=r.id, name=r.name, brand=r.brand, category=r.category, emoji=r.emoji,
            source=r.source, default_unit=r.default_unit, default_qty=r.default_qty,
            grams_per_unit=r.grams_per_unit, is_recipe=r.is_recipe,
            kcal_per_100g=preview.get("kcal"),
            protein_g=preview.get("protein"),
            carbs_g=preview.get("carbs"),
            fat_g=preview.get("fat"),
        ))
    return result


@router.get("/{food_id}", response_model=FoodDetail)
async def get_food(
    food_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> FoodDetail:
    food = (await db.execute(select(Food).where(Food.id == food_id))).scalar_one_or_none()
    if food is None:
        raise HTTPException(404, "Food not found")

    nutrients = (await db.execute(
        select(FoodNutrient).where(FoodNutrient.food_id == food_id)
    )).scalars().all()
    nutrient_map = {n.nutrient: n.per_100g for n in nutrients}

    return FoodDetail(
        id=food.id, name=food.name, brand=food.brand, category=food.category, emoji=food.emoji,
        source=food.source, default_unit=food.default_unit, default_qty=food.default_qty,
        grams_per_unit=food.grams_per_unit, is_recipe=food.is_recipe,
        kcal_per_100g=nutrient_map.get("kcal"),
        protein_g=nutrient_map.get("protein"),
        carbs_g=nutrient_map.get("carbs"),
        fat_g=nutrient_map.get("fat"),
        nutrients=nutrient_map,
    )
