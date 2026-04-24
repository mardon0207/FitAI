"""Create the initial application schema.

Revision ID: 002_initial_schema
Revises: 001
Create Date: 2026-04-24
"""
from __future__ import annotations

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "002_initial_schema"
down_revision: str | Sequence[str] | None = "001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


food_source_enum = sa.Enum("usda", "off", "uz", "user", name="food_source")
unit_enum = sa.Enum("g", "ml", "piece", "cup", "tbsp", "tsp", "serving", name="unit")
gender_enum = sa.Enum("male", "female", name="gender")
goal_enum = sa.Enum("lose", "maintain", "gain", name="goal")
activity_enum = sa.Enum(
    "sedentary",
    "light",
    "moderate",
    "active",
    "very_active",
    name="activity",
)
meal_type_enum = sa.Enum("breakfast", "lunch", "dinner", "snack", name="meal_type")


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=True),
        sa.Column("height_cm", sa.Float(), nullable=True),
        sa.Column("weight_kg", sa.Float(), nullable=True),
        sa.Column("birth_date", sa.Date(), nullable=True),
        sa.Column("gender", gender_enum, nullable=True),
        sa.Column("goal", goal_enum, nullable=True),
        sa.Column("activity", activity_enum, nullable=True),
        sa.Column("target_kcal", sa.Float(), nullable=True),
        sa.Column("target_protein_g", sa.Float(), nullable=True),
        sa.Column("target_carbs_g", sa.Float(), nullable=True),
        sa.Column("target_fat_g", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "foods",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("source", food_source_enum, nullable=False),
        sa.Column("source_id", sa.String(length=64), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("brand", sa.String(length=255), nullable=True),
        sa.Column("category", sa.String(length=64), nullable=True),
        sa.Column("emoji", sa.String(length=8), nullable=True),
        sa.Column("default_unit", unit_enum, nullable=False),
        sa.Column("default_qty", sa.Float(), nullable=False, server_default="100"),
        sa.Column("grams_per_unit", sa.Float(), nullable=True),
        sa.Column("is_recipe", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("is_public", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_by_user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_foods_source", "foods", ["source"], unique=False)
    op.create_index("ix_foods_source_id", "foods", ["source_id"], unique=False)
    op.create_index("ix_foods_name", "foods", ["name"], unique=False)
    op.create_index("ix_foods_category", "foods", ["category"], unique=False)

    op.create_table(
        "food_aliases",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("food_id", sa.Integer(), sa.ForeignKey("foods.id", ondelete="CASCADE"), nullable=False),
        sa.Column("alias", sa.String(length=255), nullable=False),
        sa.Column("lang", sa.String(length=8), nullable=False),
    )
    op.create_index("ix_food_aliases_food_id", "food_aliases", ["food_id"], unique=False)
    op.create_index("ix_food_aliases_alias", "food_aliases", ["alias"], unique=False)

    op.create_table(
        "food_nutrients",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("food_id", sa.Integer(), sa.ForeignKey("foods.id", ondelete="CASCADE"), nullable=False),
        sa.Column("nutrient", sa.String(length=64), nullable=False),
        sa.Column("per_100g", sa.Float(), nullable=False),
        sa.Column("unit", sa.String(length=16), nullable=False, server_default="g"),
    )
    op.create_index("ix_food_nutrients_food_id", "food_nutrients", ["food_id"], unique=False)
    op.create_index("ix_food_nutrients_nutrient", "food_nutrients", ["nutrient"], unique=False)

    op.create_table(
        "recipes",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("food_id", sa.Integer(), sa.ForeignKey("foods.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("servings", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("total_weight_g", sa.Float(), nullable=False),
        sa.Column("instructions", sa.String(length=4000), nullable=True),
    )

    op.create_table(
        "recipe_ingredients",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("recipe_id", sa.Integer(), sa.ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("food_id", sa.Integer(), sa.ForeignKey("foods.id"), nullable=False),
        sa.Column("grams", sa.Float(), nullable=False),
        sa.Column("note", sa.String(length=255), nullable=True),
    )
    op.create_index("ix_recipe_ingredients_recipe_id", "recipe_ingredients", ["recipe_id"], unique=False)

    op.create_table(
        "diary_entries",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("food_id", sa.Integer(), sa.ForeignKey("foods.id"), nullable=True),
        sa.Column("meal_type", meal_type_enum, nullable=False),
        sa.Column("logged_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("log_date", sa.Date(), nullable=False),
        sa.Column("quantity", sa.Float(), nullable=False),
        sa.Column("unit", unit_enum, nullable=False),
        sa.Column("grams", sa.Float(), nullable=False),
        sa.Column("kcal", sa.Float(), nullable=False),
        sa.Column("protein_g", sa.Float(), nullable=False),
        sa.Column("carbs_g", sa.Float(), nullable=False),
        sa.Column("fat_g", sa.Float(), nullable=False),
        sa.Column("note", sa.String(length=500), nullable=True),
    )
    op.create_index("ix_diary_entries_user_id", "diary_entries", ["user_id"], unique=False)
    op.create_index("ix_diary_entries_log_date", "diary_entries", ["log_date"], unique=False)

    op.create_table(
        "step_logs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("log_date", sa.Date(), nullable=False),
        sa.Column("steps", sa.Integer(), nullable=False),
        sa.Column("kcal_burned", sa.Float(), nullable=False),
        sa.Column("source", sa.String(length=32), nullable=False, server_default="manual"),
    )
    op.create_index("ix_step_logs_user_id", "step_logs", ["user_id"], unique=False)
    op.create_index("ix_step_logs_log_date", "step_logs", ["log_date"], unique=False)

    op.create_table(
        "water_logs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("logged_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("log_date", sa.Date(), nullable=False),
        sa.Column("ml", sa.Float(), nullable=False),
    )
    op.create_index("ix_water_logs_user_id", "water_logs", ["user_id"], unique=False)
    op.create_index("ix_water_logs_log_date", "water_logs", ["log_date"], unique=False)

    op.create_table(
        "weight_logs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("logged_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("log_date", sa.Date(), nullable=False),
        sa.Column("weight_kg", sa.Float(), nullable=False),
        sa.Column("note", sa.String(length=255), nullable=True),
    )
    op.create_index("ix_weight_logs_user_id", "weight_logs", ["user_id"], unique=False)
    op.create_index("ix_weight_logs_log_date", "weight_logs", ["log_date"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_weight_logs_log_date", table_name="weight_logs")
    op.drop_index("ix_weight_logs_user_id", table_name="weight_logs")
    op.drop_table("weight_logs")

    op.drop_index("ix_water_logs_log_date", table_name="water_logs")
    op.drop_index("ix_water_logs_user_id", table_name="water_logs")
    op.drop_table("water_logs")

    op.drop_index("ix_step_logs_log_date", table_name="step_logs")
    op.drop_index("ix_step_logs_user_id", table_name="step_logs")
    op.drop_table("step_logs")

    op.drop_index("ix_diary_entries_log_date", table_name="diary_entries")
    op.drop_index("ix_diary_entries_user_id", table_name="diary_entries")
    op.drop_table("diary_entries")

    op.drop_index("ix_recipe_ingredients_recipe_id", table_name="recipe_ingredients")
    op.drop_table("recipe_ingredients")
    op.drop_table("recipes")

    op.drop_index("ix_food_nutrients_nutrient", table_name="food_nutrients")
    op.drop_index("ix_food_nutrients_food_id", table_name="food_nutrients")
    op.drop_table("food_nutrients")

    op.drop_index("ix_food_aliases_alias", table_name="food_aliases")
    op.drop_index("ix_food_aliases_food_id", table_name="food_aliases")
    op.drop_table("food_aliases")

    op.drop_index("ix_foods_category", table_name="foods")
    op.drop_index("ix_foods_name", table_name="foods")
    op.drop_index("ix_foods_source_id", table_name="foods")
    op.drop_index("ix_foods_source", table_name="foods")
    op.drop_table("foods")

    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")

    meal_type_enum.drop(op.get_bind(), checkfirst=True)
    activity_enum.drop(op.get_bind(), checkfirst=True)
    goal_enum.drop(op.get_bind(), checkfirst=True)
    gender_enum.drop(op.get_bind(), checkfirst=True)
    unit_enum.drop(op.get_bind(), checkfirst=True)
    food_source_enum.drop(op.get_bind(), checkfirst=True)
