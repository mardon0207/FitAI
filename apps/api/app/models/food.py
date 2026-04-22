"""Food / ingredient / recipe ORM models.

Schema goals:
- One `Food` row per canonical item (an apple, rice, plov…). Data sourced from:
  * USDA FoodData Central (public domain) — `source = "usda"`
  * OpenFoodFacts — `source = "off"`
  * Uzbek custom DB — `source = "uz"`
  * User-created — `source = "user"`, `created_by_user_id` set
- Nutrients are stored per 100g (canonical) in `FoodNutrient` rows (normalized so
  we can add vitamins/minerals without migrations).
- `Recipe` = composite food built from ingredients. A `Food` marked
  `is_recipe=True` gets a matching `Recipe` row with `RecipeIngredient` children.
- Multi-language search via `FoodAlias` rows (uz / ru / en / brand variants).
"""
from __future__ import annotations

from datetime import datetime
from enum import Enum

from sqlalchemy import Boolean, DateTime, Enum as SAEnum, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class FoodSource(str, Enum):
    usda = "usda"
    off = "off"  # OpenFoodFacts
    uz = "uz"
    user = "user"


class Unit(str, Enum):
    g = "g"
    ml = "ml"
    piece = "piece"  # dona / шт
    cup = "cup"  # piyola / пиала
    tbsp = "tbsp"  # osh qoshiq
    tsp = "tsp"  # chay qoshiq
    serving = "serving"


class Food(Base):
    __tablename__ = "foods"

    id: Mapped[int] = mapped_column(primary_key=True)
    source: Mapped[FoodSource] = mapped_column(SAEnum(FoodSource, name="food_source"), index=True)
    source_id: Mapped[str | None] = mapped_column(String(64), index=True)  # e.g. USDA fdc_id

    # Display
    name: Mapped[str] = mapped_column(String(255), index=True)  # canonical name
    brand: Mapped[str | None] = mapped_column(String(255))
    category: Mapped[str | None] = mapped_column(String(64), index=True)
    emoji: Mapped[str | None] = mapped_column(String(8))  # single emoji for UI

    # Default portion
    default_unit: Mapped[Unit] = mapped_column(SAEnum(Unit, name="unit"), default=Unit.g)
    default_qty: Mapped[float] = mapped_column(Float, default=100.0)
    grams_per_unit: Mapped[float | None] = mapped_column(Float)  # e.g. 1 egg = 50g

    # Flags
    is_recipe: Mapped[bool] = mapped_column(Boolean, default=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)

    # Provenance
    created_by_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relations
    nutrients: Mapped[list["FoodNutrient"]] = relationship(
        back_populates="food", cascade="all, delete-orphan"
    )
    aliases: Mapped[list["FoodAlias"]] = relationship(
        back_populates="food", cascade="all, delete-orphan"
    )


class FoodAlias(Base):
    """Search aliases: 'osh' ↔ 'plov' ↔ 'pilaf' ↔ 'плов'. Used by FTS."""
    __tablename__ = "food_aliases"

    id: Mapped[int] = mapped_column(primary_key=True)
    food_id: Mapped[int] = mapped_column(ForeignKey("foods.id", ondelete="CASCADE"), index=True)
    alias: Mapped[str] = mapped_column(String(255), index=True)
    lang: Mapped[str] = mapped_column(String(8))  # 'uz' | 'ru' | 'en' | 'other'

    food: Mapped["Food"] = relationship(back_populates="aliases")


class FoodNutrient(Base):
    """Nutrient values normalized per 100g (canonical). E.g. protein, vit_c, iron."""
    __tablename__ = "food_nutrients"

    id: Mapped[int] = mapped_column(primary_key=True)
    food_id: Mapped[int] = mapped_column(ForeignKey("foods.id", ondelete="CASCADE"), index=True)
    nutrient: Mapped[str] = mapped_column(String(64), index=True)  # 'kcal' | 'protein' | 'vit_c' | ...
    per_100g: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str] = mapped_column(String(16), default="g")  # 'g' | 'mg' | 'mcg' | 'kcal' | 'IU'

    food: Mapped["Food"] = relationship(back_populates="nutrients")


class Recipe(Base):
    """Composite food — e.g. 'Toshkent oshi'. Nutrients computed from ingredients."""
    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(primary_key=True)
    food_id: Mapped[int] = mapped_column(ForeignKey("foods.id", ondelete="CASCADE"), unique=True)
    servings: Mapped[int] = mapped_column(Integer, default=1)
    total_weight_g: Mapped[float] = mapped_column(Float)
    instructions: Mapped[str | None] = mapped_column(String(4000))


class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    id: Mapped[int] = mapped_column(primary_key=True)
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipes.id", ondelete="CASCADE"), index=True)
    food_id: Mapped[int] = mapped_column(ForeignKey("foods.id"))  # base ingredient
    grams: Mapped[float] = mapped_column(Float)
    note: Mapped[str | None] = mapped_column(String(255))
