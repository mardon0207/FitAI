"""Auth routes — signup, login, forgot (stub)."""
from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models.user import User
from app.services.security import create_access_token, hash_password, verify_password

router = APIRouter()


class SignupBody(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str | None = Field(default=None, max_length=255)


class LoginBody(BaseModel):
    email: EmailStr
    password: str


class ForgotBody(BaseModel):
    email: EmailStr


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    body: SignupBody,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TokenResponse:
    """Create a new user and return a JWT.

    Profile quiz (height/weight/activity/goal) is submitted separately to PATCH /users/me.
    Default daily targets are computed then via services.tdee.daily_targets.
    """
    existing = (await db.execute(select(User).where(User.email == body.email))).scalar_one_or_none()
    if existing is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")

    user = User(
        email=body.email,
        password_hash=hash_password(body.password),
        name=body.name,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return TokenResponse(access_token=create_access_token(str(user.id)), user_id=user.id)


@router.post("/login", response_model=TokenResponse)
async def login(
    body: LoginBody,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TokenResponse:
    user = (await db.execute(select(User).where(User.email == body.email))).scalar_one_or_none()
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    return TokenResponse(access_token=create_access_token(str(user.id)), user_id=user.id)


@router.post("/forgot", status_code=status.HTTP_202_ACCEPTED)
async def forgot_password(_body: ForgotBody) -> dict:
    """Send a reset link. Not implemented yet — returns 202 to avoid email enumeration."""
    # TODO: send email with tokenized reset link.
    return {"status": "if the email exists, a reset link has been sent"}
