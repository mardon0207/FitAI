# FitAI — agent guide

> **Birinchi ishing:** `docs/HANDOFF.md` ni to'liq o'qi. Undan keyin nima qilish kerakligi aniq bo'ladi.

## Muhim konstanta qoidalar

- **Tijorat emas** — faqat oila/yaqinlar uchun. Monetizatsiya, reklama, paywall YO'Q.
- **Camera / AI Vision YO'Q** — Food Search + Ingredient Composer + Barcode faqat.
- **Platforma: PWA** (Vite + React + TS). React Native emas.
- **Backend: Supabase** (Auth, Database, RLS).
- **Til: uz (asosiy)** + ru + en. `useT()` hook orqali, `tokens.ts::I18N` da.

## Stack (hech qachon o'zgartirmang foydalanuvchi so'ramasa)

- Frontend: Vite 5 + React 18 + TypeScript strict + Zustand + React Query + React Router
- Backend: Supabase (BaaS)
- DB: PostgreSQL (Managed by Supabase)
- Logic: `apps/web/src/lib/nutrition.ts` (centralized nutrition engine)

## Dizayn

- **Reference:** `design/` (Claude Design handoff). **O'zgartirmang** — faqat porting manbai.
- **Tokens:** `apps/web/src/design/tokens.ts` — ranglar va i18n.
- **Komponentlar:** `apps/web/src/design/primitives.tsx` — Phone, TopBar, Card, Button, Chip, Icon, FoodThumb, MultiRing, MacroBar.
- **Port namunasi:** `apps/web/src/screens/Home.tsx` — `design/screens-b.jsx::ScreenHome` dan portlangan.

## Loyiha holati (Project Status)

- ✅ **Porting:** Barcha ekranlar `design/` manbasidan porting qilingan.
- ✅ **Backend:** Supabase'ga to'liq ko'chirilgan (Auth, Database, RLS).
- ✅ **Type-safety:** TypeScript strict mode va TSC build barqaror.
- ✅ **Localization:** 100% I18N (uz, ru, en) `tokens.ts` orqali.
- ✅ **Deployment:** Vercel'ga tayyor (root `vercel.json` orqali).

## Build / test

```bash
# Web
pnpm --filter @fit/web dev        # localhost:5173
pnpm --filter @fit/web build      # Production build
pnpm --filter @fit/web typecheck  # Type safety check
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
