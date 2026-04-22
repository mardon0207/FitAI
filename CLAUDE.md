# FitAI — agent guide

> **Birinchi ishing:** `docs/HANDOFF.md` ni to'liq o'qi. Undan keyin nima qilish kerakligi aniq bo'ladi.

## Muhim konstanta qoidalar

- **Tijorat emas** — faqat oila/yaqinlar uchun. Monetizatsiya, reklama, paywall YO'Q.
- **Camera / AI Vision YO'Q** — Food Search + Ingredient Composer + Barcode faqat.
- **Platforma: PWA** (Vite + React + TS). React Native emas.
- **Backend: FastAPI** + PostgreSQL + Alembic.
- **Til: uz (asosiy)** + ru + en. `useT()` hook orqali, `tokens.ts::I18N` da.

## Stack (hech qachon o'zgartirmang foydalanuvchi so'ramasa)

- Frontend: Vite 5 + React 18 + TypeScript strict + Zustand + React Query + React Router
- Backend: FastAPI + SQLAlchemy 2 async + Alembic + Pydantic 2
- DB: PostgreSQL 16 + pg_trgm (FTS uchun)
- Shared logic: `packages/nutrition-core` (pure TS, framework-free)

## Dizayn

- **Reference:** `design/` (Claude Design handoff). **O'zgartirmang** — faqat porting manbai.
- **Tokens:** `apps/web/src/design/tokens.ts` — ranglar va i18n.
- **Komponentlar:** `apps/web/src/design/primitives.tsx` — Phone, TopBar, Card, Button, Chip, Icon, FoodThumb, MultiRing, MacroBar.
- **Port namunasi:** `apps/web/src/screens/Home.tsx` — `design/screens-b.jsx::ScreenHome` dan portlangan.

## Ekranlarni porting tartibi

1. Composer (flagship feature) → `design/screens-b.jsx::ScreenComposer`
2. Search → `design/screens-b.jsx::ScreenSearch`
3. Diary → `design/screens-b.jsx::ScreenDiary`
4. Profile → `design/screens-c.jsx::ScreenProfile`
5. Stats → `design/screens-c.jsx::ScreenStats`
6. Qolganlar (Splash, Auth, Quiz, Detail, Micro, Deficiency, Water, Weight, Achieve, Report, Lang, Theme, Perms)

## Build / test

```bash
# Web
pnpm --filter @fit/web dev        # localhost:5173
pnpm --filter @fit/web typecheck

# API
cd apps/api
uvicorn app.main:app --reload     # localhost:8000
alembic upgrade head
python -m scripts.seed_uz
```

## Nomenklatura

- **TS fayllari:** `PascalCase.tsx` komponent, `camelCase.ts` util
- **Python fayllari:** `snake_case.py`
- **DB:** `snake_case` jadval va kolonkalar
- **Nutrient keys:** `kcal`, `protein`, `carbs`, `fat`, `vit_a`, `vit_b12`, `iron`, ... (tokenlar yagona)

## Qilmang

- ❌ `any` TypeScript'da
- ❌ Yangi library qo'shmang — foydalanuvchidan so'ramasdan
- ❌ `design/` papkasini o'zgartirmang
- ❌ Inline styles o'rniga CSS fayllar yaratmang (dizayn shunday qilingan)
- ❌ App Store / Play Store release bo'yicha hech narsa qilmang (tijorat emas)

## CLAUDE Code skills

Keraklilari: `init`, `less-permission-prompts`, `review`, `security-review`.
Kerak emaslari: `stitch-loop`, `remotion`, `skill-creator`, `schedule`, `loop`.
