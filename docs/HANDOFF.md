# HANDOFF — Keyingi model (Haiku 4.5 / Sonnet 4.6) uchun yo'riqnoma

> Salom! Men Opus'da skeletni qurdim. Endi siz (arzonroq model) **dizayn ekranlarini porting** va **biznes-logikani yozish** bilan shug'ullanasiz.
> Hammasi tayyor — faqat ergashing, hech narsa o'ylab topmang.

---

## 🗺 Loyiha xaritasi

```
C:\Project\fit\
├── apps/
│   ├── web/                          # Vite + React + TS (PWA)
│   │   └── src/
│   │       ├── App.tsx               # React Router setup
│   │       ├── main.tsx              # Entry
│   │       ├── design/
│   │       │   ├── tokens.ts         # FIT palette + I18N strings ✅
│   │       │   ├── Icon.tsx          # 40+ SVG icons ✅
│   │       │   └── primitives.tsx    # Phone, TopBar, Button, Card, Chip, MacroBar, Ring, MultiRing, FoodThumb ✅
│   │       ├── screens/
│   │       │   ├── Home.tsx          # ✅ PORTED
│   │       │   ├── FabMenu.tsx       # ✅ PORTED
│   │       │   ├── _stub.tsx         # Placeholder for not-yet-ported screens
│   │       │   ├── Search.tsx        # 🔴 TODO — port from design/screens-b.jsx:ScreenSearch
│   │       │   ├── Composer.tsx      # 🔴 TODO — port from design/screens-b.jsx:ScreenComposer ⭐ FLAGSHIP
│   │       │   ├── Diary.tsx         # 🔴 TODO — port from design/screens-b.jsx:ScreenDiary
│   │       │   ├── Stats.tsx         # 🔴 TODO — port from design/screens-c.jsx:ScreenStats
│   │       │   └── Profile.tsx       # 🔴 TODO — port from design/screens-c.jsx:ScreenProfile
│   │       ├── stores/
│   │       │   └── prefs.ts          # Zustand: lang + theme ✅
│   │       └── styles/global.css     # CSS vars (light + dark) ✅
│   │
│   └── api/                          # FastAPI backend
│       ├── app/
│       │   ├── main.py               # ✅ Route registration
│       │   ├── config.py             # ✅ Settings (pydantic-settings)
│       │   ├── db.py                 # ✅ Async SQLAlchemy
│       │   ├── models/               # ✅ User, Food, FoodAlias, FoodNutrient, Recipe, RecipeIngredient, DiaryEntry, etc.
│       │   └── routes/
│       │       ├── auth.py           # 🔴 TODO implement signup/login with JWT
│       │       ├── users.py          # 🔴 TODO implement /me
│       │       ├── foods.py          # 🔴 TODO implement search (pg_trgm + aliases) + detail
│       │       ├── ingredients.py    # 🔴 TODO implement /compose
│       │       └── diary.py          # 🔴 TODO implement CRUD + /today
│       ├── alembic/                  # ✅ Configured; NO MIGRATIONS YET — run autogenerate
│       ├── scripts/
│       │   ├── seed_uz.py            # ✅ Seed Uzbek ingredients+recipes
│       │   └── etl_usda.py           # 🟡 Stub — implement CSV parsing
│       └── data/
│           ├── uz_ingredients.json   # ✅ 25 seed items (target: 500)
│           └── uz_recipes.json       # ✅ 10 seed recipes (target: 200)
│
├── packages/
│   ├── nutrition-core/               # ✅ Shared TS: tdee, units, rda, compose
│   └── shared-types/                 # ✅ API contract types
│
├── design/                           # ⚠️ DO NOT EDIT — reference from Claude Design
│   ├── FitAI.html                    # Preview (open in browser)
│   ├── tokens.jsx / components.jsx
│   └── screens-a.jsx / screens-b.jsx / screens-c.jsx
│
└── infra/
    └── docker-compose.yml            # ✅ Postgres + Redis
```

---

## 🚀 Birinchi boshlash (bir martalik)

```bash
# 1. Web dependencies
cd C:\Project\fit
pnpm install

# 2. Web dev server (localhost:5173) — hoziroq ishlashi kerak
pnpm --filter @fit/web dev

# 3. Postgres (Docker)
cd infra
docker compose up -d db

# 4. API setup
cd ../apps/api
python -m venv .venv
# Windows: .venv\Scripts\activate
# Bash: source .venv/Scripts/activate
pip install -r requirements.txt
cp .env.example .env

# 5. Alembic — birinchi migratsiyani yaratish
alembic revision --autogenerate -m "initial schema"
alembic upgrade head

# 6. Seed o'zbek DB
python -m scripts.seed_uz

# 7. API dev server (localhost:8000)
uvicorn app.main:app --reload
```

Agar hammasi ishlasa: `http://localhost:5173` — web, `http://localhost:8000/docs` — API Swagger.

---

## 📋 Keyingi vazifalar (tartib bilan)

### Sprint 1 — Ekranlarni porting (web-frontend)

Har ekran uchun bir xil pattern:
1. `design/screens-*.jsx` ichidan tegishli `ScreenX` funksiyasini o'qing.
2. `apps/web/src/screens/X.tsx` ichiga ko'chiring.
3. O'zgartirishlar:
   - `function ScreenX({ dark })` → `export function XScreen()` + `const dark = usePrefs(s => s.theme === 'dark')`
   - JSX ichidagi qattiq `'Bosh sahifa'` kabi o'zbek matnlarni `t.home` (`useT()` dan) bilan almashtiring
   - `TabBar t={I18N.uz}` → `<TabBar labels={{ home: t.home, ... }} dark={dark} />`
   - Navigatsiya: `onClick={() => navigate('/search')}` (useNavigate dan)
   - Rasmlarni `FoodThumb emoji="🍚"` orqali ishlating
4. `Home.tsx` ga qarang — allaqachon portlangan, namuna sifatida.

**Prioritet tartibi:**
1. `Composer.tsx` ⭐⭐ (core feature, `screens-b.jsx:ScreenComposer`)
2. `Search.tsx` ⭐ (primary input, `screens-b.jsx:ScreenSearch`)
3. `Diary.tsx` (`screens-b.jsx:ScreenDiary`)
4. `Profile.tsx` (`screens-c.jsx:ScreenProfile`)
5. `Stats.tsx` (`screens-c.jsx:ScreenStats`)
6. Qolganlari: Splash, Onboarding, Auth, Quiz, Detail, Micro, Deficiency, Water, Weight, Achieve, Report, Lang, Theme, Perms

### Sprint 2 — Auth (backend)

`apps/api/app/routes/auth.py`:
```python
from passlib.context import CryptContext
from jose import jwt
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/signup", response_model=TokenResponse)
async def signup(body: SignupBody, db: AsyncSession = Depends(get_db)):
    # 1. check email uniqueness
    # 2. hash password: pwd.hash(body.password)
    # 3. insert User
    # 4. compute default targets via nutrition-core.dailyTargets (port to Python or call as endpoint)
    # 5. issue JWT with sub=user.id
```

### Sprint 3 — Food search (backend)

`apps/api/app/routes/foods.py::search_foods`:
```sql
-- Enable pg_trgm in migration: CREATE EXTENSION IF NOT EXISTS pg_trgm;
SELECT f.*, n_kcal.per_100g AS kcal, n_p.per_100g AS protein, ...
FROM foods f
LEFT JOIN food_aliases a ON a.food_id = f.id AND a.lang = :lang
LEFT JOIN food_nutrients n_kcal ON n_kcal.food_id = f.id AND n_kcal.nutrient = 'kcal'
LEFT JOIN food_nutrients n_p ON n_p.food_id = f.id AND n_p.nutrient = 'protein'
WHERE a.alias % :q  -- trigram similarity
ORDER BY similarity(a.alias, :q) DESC
LIMIT :limit;
```

### Sprint 4 — Ingredient composer (backend)

`apps/api/app/routes/ingredients.py::compose_meal`:
- `packages/nutrition-core/src/compose.ts::compose` funksiyasi **to'g'ri logika** — Python'ga ko'chiring (identical math).
- Har ingredient uchun `Food` + `FoodNutrient`'dan ma'lumot oling.
- `typical weights` uchun `Food.grams_per_unit` ishlating.
- Result: `ComposedTotals` (kcal, macros, micronutrients dict).

### Sprint 5 — Diary + dashboard wiring

Web tarafda:
- Home'dagi hardcoded mock data o'rniga `useQuery(['diary', 'today'], () => fetch('/api/diary/today'))`.
- `ComposerScreen`'da ingredient qo'shilganda `POST /api/ingredients/compose` chaqiring (debounce 300ms) → live total.

### Sprint 6 — Pedometer (manual)

MVP'da web'da native step API yo'q. Shuning uchun:
- Home dashboard'da qadam kartasi tap'ni `/steps-manual` modaliga ochadi.
- Foydalanuvchi qo'lda raqam kiritadi → `POST /api/diary/steps` → `StepLog` saqlaydi.
- `nutrition-core.stepsToKcal()` bilan kaloriya hisoblanadi.
- V2: Capacitor + HealthKit/Health Connect plugins.

### Sprint 7 — Deficiency engine

`packages/nutrition-core/src/rda.ts` allaqachon RDA jadvali + `evaluate()` funksiyasi bor.
- Backend'da kunlik diary summasini hisoblang.
- Har nutrient uchun `evaluate()` chaqiring.
- Frontend'da mikroelementlar panelida va "Yetishmovchilik ogohlantirishi" ekranida ishlating.

### Sprint 8 — USDA ETL

`apps/api/scripts/etl_usda.py` — stub. To'liqlash tartibi:
1. Download **Foundation Foods** zip'ni <https://fdc.nal.usda.gov/download-datasets/> dan (`data/raw/` ga).
2. `food.csv`, `food_nutrient.csv`, `nutrient.csv` ni pandas orqali o'qing.
3. `USDA_NUTRIENT_MAP` dagi id'larni ishlating — boshqalarini tashlab yuboring.
4. Bulk insert (`asyncpg.copy_records_to_table` yoki SQLAlchemy `bulk_insert_mappings`).
5. Aliases: English nom → `food_aliases` lang='en'.
6. **Tekshirish:** `SELECT COUNT(*) FROM foods WHERE source='usda'` > 1000.

---

## 🧭 Kod qoidalari

1. **TypeScript strict.** `any` ishlatilmaydi. `noUncheckedIndexedAccess: true` yoqilgan.
2. **Inline styles OK.** Dizayn shunday qilingan, qayta yozmang — tezlik muhim.
3. **Dark mode.** Har ekran `dark` propni olishi kerak — `usePrefs(s => s.theme === 'dark')` orqali.
4. **i18n.** `useT()` hook orqali faqat `t.someKey` ishlatib. Yangi kalit kerak bo'lsa `tokens.ts::I18N`'ga qo'shing (uchala tilga ham!).
5. **Commitlar:** `feat: port ComposerScreen`, `feat(api): implement food search`, `fix: ...`.
6. **Test:** Frontend muhim logika uchun Vitest, backend uchun pytest. Minimal, bo'lsa yaxshi.

---

## ⚠️ CAMERA / AI MUHIM

❌ Camera-based food recognition, LogMeal, Gemini/Claude/GPT Vision — **butunlay yo'q**.
✅ Faqat: Food Search (katta baza) + Ingredient Composer + Barcode (shtrix-kod, AI emas).

---

## 📞 Agar bir narsa tushunarsiz bo'lsa

1. `docs/design_prompts.md` — har ekran uchun dizayn yo'riqnomasi
2. `C:\Users\asus\.claude\plans\smooth-frolicking-llama.md` — to'liq TZ
3. `design/FitAI.html` — vizual referens (brauzerda oching)
4. `design/screens-*.jsx` — aynan nima portlash kerakligi

**Foydalanuvchidan so'ramasdan o'zgartirmang:** platforma (PWA), stack (Vite + FastAPI), ovqat kiritish strategiyasi (search + composer + barcode), tijorat yo'qligi.

---

## ✅ Tayyor chekilishi

- [ ] `pnpm --filter @fit/web dev` — web dev server ishlaydi
- [ ] `curl http://localhost:8000/health` → `{"status": "ok"}`
- [ ] `alembic upgrade head` — DB schema yaratildi
- [ ] `python -m scripts.seed_uz` — 25 ingredient + 10 retsept saqlandi
- [ ] Barcha 20 ekran portlangan va `/` dan navigatsiya ishlaydi
- [ ] TypeScript: 0 xato (`pnpm --filter @fit/web typecheck`)
- [ ] Ruff: 0 xato (`cd apps/api && ruff check .`)

Omad tilayman! 🚀
