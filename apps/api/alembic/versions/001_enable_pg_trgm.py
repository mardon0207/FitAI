"""Enable pg_trgm extension (must run before table creation migration).

Migration order:
  001 (this) → enable extension
  002 (autogen) → `alembic revision --autogenerate -m "initial schema"`
     — Alembic will set `down_revision = "001"` automatically if run after.
  003 → trigram indices (see 003_trgm_indices.py; runs after tables exist)

Revision ID: 001
Revises:
Create Date: 2026-04-22

"""
from __future__ import annotations

from collections.abc import Sequence

from alembic import op

revision: str = "001"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")


def downgrade() -> None:
    # Keep the extension even on downgrade — it may be used elsewhere.
    pass
