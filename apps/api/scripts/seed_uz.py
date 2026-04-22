"""Seed the local DB with Uzbek ingredients + recipes from JSON fixtures.

Usage:
    cd apps/api
    python -m scripts.seed_uz
"""
from __future__ import annotations

import asyncio
import json
import logging
from pathlib import Path

from sqlalchemy import select

from app.db import SessionLocal
from app.models.food import Food, FoodAlias, FoodNutrient, FoodSource, Recipe, RecipeIngredient, Unit

logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).resolve().parents[1] / "data"


async def _seed_ingredients() -> dict[str, int]:
    """Insert ingredient `Food` rows; returns slug -> food_id map."""
    path = DATA_DIR / "uz_ingredients.json"
    payload = json.loads(path.read_text(encoding="utf-8"))
    slug_to_id: dict[str, int] = {}
    async with SessionLocal() as db:
        for ing in payload["ingredients"]:
            # Upsert by (source='uz', source_id=slug)
            stmt = select(Food).where(Food.source == FoodSource.uz, Food.source_id == ing["slug"])
            existing = (await db.execute(stmt)).scalar_one_or_none()
            if existing:
                slug_to_id[ing["slug"]] = existing.id
                continue

            food = Food(
                source=FoodSource.uz,
                source_id=ing["slug"],
                name=ing["names"]["uz"],
                category=ing.get("category"),
                emoji=ing.get("emoji"),
                default_unit=Unit(ing.get("default_unit", "g")),
                default_qty=ing.get("default_qty", 100),
                grams_per_unit=ing.get("grams_per_unit"),
                is_recipe=False,
            )
            db.add(food)
            await db.flush()

            # Aliases for each language
            for lang, alias in ing["names"].items():
                db.add(FoodAlias(food_id=food.id, alias=alias, lang=lang))

            # Nutrients
            for nutrient_key, value in ing["per_100g"].items():
                unit = _nutrient_unit(nutrient_key)
                db.add(FoodNutrient(food_id=food.id, nutrient=nutrient_key, per_100g=value, unit=unit))

            slug_to_id[ing["slug"]] = food.id

        await db.commit()
    logger.info("Seeded %d ingredients", len(slug_to_id))
    return slug_to_id


async def _seed_recipes(slug_to_id: dict[str, int]) -> int:
    """Insert recipe `Food` + `Recipe` + `RecipeIngredient` rows."""
    path = DATA_DIR / "uz_recipes.json"
    payload = json.loads(path.read_text(encoding="utf-8"))
    count = 0
    async with SessionLocal() as db:
        for r in payload["recipes"]:
            # Upsert recipe Food
            stmt = select(Food).where(Food.source == FoodSource.uz, Food.source_id == r["slug"])
            food = (await db.execute(stmt)).scalar_one_or_none()
            if food is None:
                food = Food(
                    source=FoodSource.uz,
                    source_id=r["slug"],
                    name=r["names"]["uz"],
                    category=r.get("category"),
                    emoji=r.get("emoji"),
                    default_unit=Unit(r.get("default_unit", "serving") if r.get("default_unit") in {u.value for u in Unit} else "serving"),
                    default_qty=1,
                    grams_per_unit=r.get("grams_per_unit") or r["serving_grams"],
                    is_recipe=True,
                )
                db.add(food)
                await db.flush()
                for lang, alias in r["names"].items():
                    db.add(FoodAlias(food_id=food.id, alias=alias, lang=lang))

            # Recipe row
            stmt = select(Recipe).where(Recipe.food_id == food.id)
            recipe = (await db.execute(stmt)).scalar_one_or_none()
            if recipe is None:
                total_g = sum(i["grams"] for i in r["ingredients"])
                recipe = Recipe(food_id=food.id, servings=r["servings"], total_weight_g=total_g)
                db.add(recipe)
                await db.flush()
                for ing in r["ingredients"]:
                    if ing["slug"] not in slug_to_id:
                        logger.warning("Ingredient slug not found: %s", ing["slug"])
                        continue
                    db.add(RecipeIngredient(
                        recipe_id=recipe.id,
                        food_id=slug_to_id[ing["slug"]],
                        grams=ing["grams"],
                        note=ing.get("note"),
                    ))

            # TODO: compute aggregate nutrients for the recipe Food (sum of ingredients)
            # and insert into FoodNutrient as per-100g values.

            count += 1

        await db.commit()
    logger.info("Seeded %d recipes", count)
    return count


def _nutrient_unit(key: str) -> str:
    """Default unit per nutrient key. Keep in sync with etl_usda.USDA_NUTRIENT_MAP."""
    mapping = {
        "kcal": "kcal",
        "protein": "g", "fat": "g", "carbs": "g", "fiber": "g",
        "calcium": "mg", "iron": "mg", "magnesium": "mg", "potassium": "mg",
        "zinc": "mg", "sodium": "mg",
        "vit_a": "mcg", "vit_d": "mcg", "vit_k": "mcg", "vit_b12": "mcg", "folate": "mcg",
        "vit_e": "mg", "vit_c": "mg", "vit_b1": "mg", "vit_b2": "mg", "vit_b3": "mg", "vit_b6": "mg",
    }
    return mapping.get(key, "g")


async def main() -> None:
    slug_to_id = await _seed_ingredients()
    await _seed_recipes(slug_to_id)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(message)s")
    asyncio.run(main())
