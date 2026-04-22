# FitAI

Oilaviy kaloriya, qadam va mikroelement tracker — tijorat emas, yaqinlar uchun.

## 🏗 Strategik qarorlar

| Parametr | Qaror | Sabab |
|----------|-------|-------|
| Platforma | **PWA (web-first)** + Capacitor wrapper V2 | Dizayn React web'da, 90% qayta ishlatiladi. iOS + Android home-screen'ga o'rnatish. App Store shart emas. |
| Frontend | Vite + React 18 + TypeScript | Design kod bazasiga mos, tez dev loop |
| Backend | FastAPI + PostgreSQL + Alembic | Nutrition ETL uchun Python ideal |
| Nutrition DB | USDA FoodData Central + OpenFoodFacts + uz custom | CC0 / bepul manbalar |
| Ovqat kiritish | Search + **Ingredient Composer** + Barcode | Camera/AI Vision YO'Q |
| Pedometer (MVP) | Manual qadam kiritish | Web'da native Health API yo'q, Capacitor'da V2 qo'shamiz |
| Auth | Supabase (MVP) → self-host keyinchalik | Tez start |
| Hosting | Vercel/Netlify (web) + Fly.io/Railway (api) | Free tier yetarli |

## 📁 Tuzilma

```
fit/
├── apps/
│   ├── web/              # Vite React TS — PWA
│   └── api/              # FastAPI backend
├── packages/
│   ├── nutrition-core/   # Umumiy biznes-logika (RDA, kaloriya hisoblash)
│   └── shared-types/     # TS type'lar + JSON schema
├── design/               # Claude Design handoff (reference)
│   ├── FitAI.html        # Dizayn preview (browser'da ochiladi)
│   ├── tokens.jsx        # Design tokens
│   ├── components.jsx    # UI komponentlari
│   ├── screens-a/b/c.jsx # 20+ ekran mockups
│   └── HANDOFF_README.md
├── docs/
│   ├── design_prompts.md # Dizayn promptlari
│   ├── HANDOFF.md        # Keyingi model uchun yo'riqnoma ⭐
│   └── ARCHITECTURE.md
└── infra/
    └── docker-compose.yml
```

## 🚀 Boshlash

```bash
# 1. Dependencies
pnpm install

# 2. Web (PWA)
pnpm --filter @fit/web dev

# 3. API
cd apps/api && python -m venv .venv && .venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# 4. Dizayn preview (HTML)
# apps/web/public/design-preview.html ni brauzerda oching
# yoki: npx serve design/
```

## 📖 Keyingi qadam

`docs/HANDOFF.md` — keyingi model (Haiku/Sonnet) uchun batafsil yo'riqnoma.

## 📄 Reja

`C:\Users\asus\.claude\plans\smooth-frolicking-llama.md` — to'liq TZ (uz + ru).
