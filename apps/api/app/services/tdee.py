"""Mifflin-St Jeor BMR + TDEE + daily target calculations.

Mirrors `packages/nutrition-core/src/tdee.ts` exactly — keep logic in sync.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

Gender = Literal["male", "female"]
Activity = Literal["sedentary", "light", "moderate", "active", "very_active"]
Goal = Literal["lose", "maintain", "gain"]

ACTIVITY_MULT: dict[Activity, float] = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "active": 1.725,
    "very_active": 1.9,
}

GOAL_DELTA: dict[Goal, int] = {
    "lose": -500,
    "maintain": 0,
    "gain": 300,
}


@dataclass(frozen=True)
class ProfileInput:
    gender: Gender
    age_years: int
    height_cm: float
    weight_kg: float
    activity: Activity
    goal: Goal


@dataclass(frozen=True)
class DailyTargets:
    bmr: int
    tdee: int
    kcal: int
    protein_g: int
    carbs_g: int
    fat_g: int


def bmr(p: ProfileInput) -> float:
    """Mifflin-St Jeor BMR."""
    base = 10 * p.weight_kg + 6.25 * p.height_cm - 5 * p.age_years
    return base + 5 if p.gender == "male" else base - 161


def tdee(p: ProfileInput) -> float:
    return bmr(p) * ACTIVITY_MULT[p.activity]


def daily_targets(p: ProfileInput) -> DailyTargets:
    """Calories + macro split for the user's goal."""
    base = round(tdee(p))
    kcal = max(1200, base + GOAL_DELTA[p.goal])
    protein_per_kg = 1.8 if p.activity in ("active", "very_active") else 1.4
    protein_g = round(p.weight_kg * protein_per_kg)
    fat_g = round((kcal * 0.25) / 9)
    carbs_kcal = kcal - protein_g * 4 - fat_g * 9
    carbs_g = max(0, round(carbs_kcal / 4))
    return DailyTargets(
        bmr=round(bmr(p)),
        tdee=base,
        kcal=kcal,
        protein_g=protein_g,
        carbs_g=carbs_g,
        fat_g=fat_g,
    )


def steps_to_kcal(steps: int, weight_kg: float) -> int:
    """1 step ≈ 0.04 kcal at 70kg, scaled linearly."""
    return round(steps * 0.04 * (weight_kg / 70))
