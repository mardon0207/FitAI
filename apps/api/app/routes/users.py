"""User profile routes — /me GET + PATCH (profile quiz submits here)."""
from __future__ import annotations

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models.user import Activity, Gender, Goal, User
from app.services.security import current_user
from app.services.tdee import ProfileInput, daily_targets

router = APIRouter()


class UserRead(BaseModel):
    id: int
    email: str
    name: str | None
    height_cm: float | None
    weight_kg: float | None
    birth_date: date | None
    gender: Gender | None
    goal: Goal | None
    activity: Activity | None
    target_kcal: float | None
    target_protein_g: float | None
    target_carbs_g: float | None
    target_fat_g: float | None

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    name: str | None = None
    height_cm: float | None = Field(default=None, ge=50, le=260)
    weight_kg: float | None = Field(default=None, ge=20, le=400)
    birth_date: date | None = None
    gender: Gender | None = None
    goal: Goal | None = None
    activity: Activity | None = None


@router.get("/me", response_model=UserRead)
async def get_me(user: Annotated[User, Depends(current_user)]) -> User:
    return user


@router.patch("/me", response_model=UserRead)
async def update_me(
    body: UserUpdate,
    user: Annotated[User, Depends(current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """Update profile. If enough fields present, recompute daily nutrition targets."""
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(user, field, value)

    # Recompute targets if profile is complete enough
    if all([user.height_cm, user.weight_kg, user.birth_date, user.gender, user.activity, user.goal]):
        age = _years_between(user.birth_date, date.today())  # type: ignore[arg-type]
        profile = ProfileInput(
            gender=user.gender.value if hasattr(user.gender, "value") else user.gender,  # type: ignore[union-attr]
            age_years=age,
            height_cm=user.height_cm,  # type: ignore[arg-type]
            weight_kg=user.weight_kg,  # type: ignore[arg-type]
            activity=user.activity.value if hasattr(user.activity, "value") else user.activity,  # type: ignore[union-attr]
            goal=user.goal.value if hasattr(user.goal, "value") else user.goal,  # type: ignore[union-attr]
        )
        targets = daily_targets(profile)
        user.target_kcal = targets.kcal
        user.target_protein_g = targets.protein_g
        user.target_carbs_g = targets.carbs_g
        user.target_fat_g = targets.fat_g

    await db.commit()
    await db.refresh(user)
    return user


def _years_between(born: date, today: date) -> int:
    return today.year - born.year - ((today.month, today.day) < (born.month, born.day))
