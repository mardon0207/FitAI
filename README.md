# FitAI - Smart Health & Fitness Tracker

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployment-success?style=flat-square&logo=vercel)](https://fit-ai-web.vercel.app)

Oilaviy kaloriya, qadam va mikroelement tracker — tijorat emas, yaqinlar uchun.

## 🏗 Strategik qarorlar

| Parametr | Qaror | Sabab |
|----------|-------|-------|
| Platforma | **PWA (web-first)** | Dizayn React web'da, iOS + Android home-screen'ga o'rnatish. |
| Frontend | Vite + React 18 + TypeScript | Design kod bazasiga mos, tez dev loop |
| Backend | **Supabase** (Auth, DB, RLS) | Realtime ma'lumotlar va tayyor Auth yechimi |
| Nutrition DB | USDA + OpenFoodFacts + uz custom | Supabase jadvallariga import qilingan |
| Ovqat kiritish | Search + **Ingredient Composer** + Barcode | Murakkab taomlarni yig'ish imkoniyati |
| Pedometer | Manual kiritish | Web/PWA uchun eng oddiy va ishonchli usul |
| Hosting | Vercel | Monorepo va Vite uchun eng yaxshi platforma |

## 📁 Tuzilma

```
fit/
├── apps/
│   └── web/              # Vite React TS — Asosiy PWA ilova
├── packages/
│   └── shared-types/     # Umumiy TS type'lar
├── design/               # Claude Design source (reference)
├── docs/                 # Hujjatlar va yo'riqnomalar
└── vercel.json           # Deployment konfiguratsiyasi
```

## 🚀 Boshlash

```bash
# 1. Kutubxonalarni o'rnatish
pnpm install

# 2. .env faylini sozlash (apps/web/.env)
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...

# 3. Loyihani ishga tushirish
pnpm dev

# 4. Sifatni tekshirish
pnpm --filter @fit/web typecheck
```

## 📖 Muhim hujjatlar

- `docs/FITAI_BLUEPRINT.md` — Loyihaning texnik konsepsiyasi.
- `CLAUDE.md` — Rivojlantirish bo'yicha ko'rsatmalar va joriy holat.
- `docs/design_prompts.md` — UI generatorlari uchun foydalanilgan promptlar.
