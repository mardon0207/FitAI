"""Ingredient Composer math — Python port of packages/nutrition-core/src/compose.ts.

Keep behavior identical between the TS and Python implementations so the live
frontend preview matches the backend-authoritative total.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

from app.models.food import Unit

Cooking = Literal["raw", "boiled", "fried", "baked", "grilled"]

# Volume → ml approximations when only a volume unit is known.
VOLUME_TO_ML: dict[Unit, float] = {
    Unit.cup: 200.0,  # piyola
    Unit.tbsp: 15.0,  # osh qoshiq
    Unit.tsp: 5.0,  # chay qoshiq
}

# Nutrient profile for sunflower oil (per 100g).
OIL_PER_100G: dict[str, float] = {"kcal": 884.0, "fat": 100.0, "vit_e": 41.08}
OIL_DENSITY = 0.92  # g/ml


@dataclass(frozen=True)
class UnitContext:
    grams_per_piece: float | None = None
    grams_per_serving: float | None = None
    density_g_per_ml: float = 1.0


@dataclass(frozen=True)
class ComposerIngredientIn:
    food_id: int
    quantity: float
    unit: Unit
    per_100g: dict[str, float]  # fetched from DB
    ctx: UnitContext = field(default_factory=UnitContext)
    cooking: Cooking | None = None
    added_oil_ml: float | None = None


@dataclass
class ComposedTotals:
    total_grams: float = 0.0
    kcal: float = 0.0
    protein: float = 0.0
    carbs: float = 0.0
    fat: float = 0.0
    micronutrients: dict[str, float] = field(default_factory=dict)


def to_grams(qty: float, unit: Unit, ctx: UnitContext) -> float:
    """Convert any Unit + quantity to grams for nutrient scaling."""
    density = ctx.density_g_per_ml
    if unit == Unit.g:
        return qty
    if unit == Unit.ml:
        return qty * density
    if unit == Unit.piece:
        return qty * (ctx.grams_per_piece or 100.0)
    if unit == Unit.serving:
        return qty * (ctx.grams_per_serving or 100.0)
    if unit in VOLUME_TO_ML:
        return qty * VOLUME_TO_ML[unit] * density
    raise ValueError(f"Unknown unit: {unit}")


def scale_nutrient(per_100g: float, grams: float) -> float:
    return (per_100g * grams) / 100.0


def compose(ingredients: list[ComposerIngredientIn]) -> ComposedTotals:
    totals = ComposedTotals()

    for ing in ingredients:
        grams = to_grams(ing.quantity, ing.unit, ing.ctx)
        totals.total_grams += grams
        for key, per100 in ing.per_100g.items():
            _add(totals, key, scale_nutrient(per100, grams))

        # Fried → add oil by volume
        if ing.cooking == "fried" and ing.added_oil_ml:
            oil_g = ing.added_oil_ml * OIL_DENSITY
            totals.total_grams += oil_g
            for key, per100 in OIL_PER_100G.items():
                _add(totals, key, scale_nutrient(per100, oil_g))

    # Round for display
    totals.kcal = round(totals.kcal)
    totals.protein = round(totals.protein, 1)
    totals.carbs = round(totals.carbs, 1)
    totals.fat = round(totals.fat, 1)
    totals.total_grams = round(totals.total_grams, 1)
    for k in list(totals.micronutrients):
        totals.micronutrients[k] = round(totals.micronutrients[k], 2)

    return totals


def _add(totals: ComposedTotals, key: str, value: float) -> None:
    if key == "kcal":
        totals.kcal += value
    elif key == "protein":
        totals.protein += value
    elif key == "carbs":
        totals.carbs += value
    elif key == "fat":
        totals.fat += value
    else:
        totals.micronutrients[key] = totals.micronutrients.get(key, 0.0) + value
