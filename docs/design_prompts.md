# FitAI — Claude Design Prompts Pack (v2, camera'siz)

> **v2 o'zgarishlar:** ❌ Camera/Computer Vision/AI Vision butunlay olib tashlandi.
> ✅ Asosiy ovqat kiritish: **Food Search** (katta baza) + **Ingredient Composer** (ingredientlardan yig'ish) + **Shtrix-kod** (oddiy kod o'qish).
>
> Har bir promptni alohida Claude Design'ga yuboring. Birinchi bo'lib **Design System**'ni yarating — u qolgan ekranlar uchun asos bo'ladi.

---

## 🎨 PROMPT 0 — DESIGN SYSTEM / Дизайн-система

```
Create a mobile app design system for "FitAI" — a calorie & nutrition tracker for family use. 

STYLE: Modern, clean, health-focused, friendly but professional. Inspired by Apple Health, Cronometer, and Headspace. Soft and human, not clinical.

COLOR PALETTE:
- Primary: #10B981 (fresh green — healthy, positive)
- Primary dark: #059669
- Accent: #F59E0B (warm amber — energy, food warmth)
- Danger/Warning: #EF4444 (deficiency alerts)
- Success: #10B981
- Background (light): #FAFAF9 (warm off-white)
- Background (dark): #0F172A (deep navy)
- Surface (light): #FFFFFF
- Surface (dark): #1E293B
- Text primary (light): #0F172A
- Text primary (dark): #F8FAFC
- Text secondary: #64748B
- Border: #E2E8F0 (light) / #334155 (dark)
- Macro colors: Protein #8B5CF6 (purple), Carbs #F59E0B (amber), Fat #EC4899 (pink)

TYPOGRAPHY:
- Headings: "SF Pro Display" / "Inter" — bold, -0.02em tracking
- Body: "SF Pro Text" / "Inter" — regular
- Numbers (calories, stats): "SF Mono" / "JetBrains Mono" — medium weight for tabular data
- Sizes: h1 32/40, h2 24/32, h3 20/28, body 16/24, caption 13/18, label 11/16

COMPONENTS to design:
1. Buttons (primary, secondary, ghost, icon) — 12px radius, 48px height
2. Input fields — 12px radius, floating label
3. Cards — 16px radius, subtle shadow (light) / elevated surface (dark)
4. Chips/Pills — for macros, filters, tags, unit selectors (g/ml/pcs)
5. Progress rings (Apple Watch style) for calories/macros
6. Progress bars for vitamins/minerals
7. Bottom tab bar — 5 tabs (Home, Diary, Add FAB, Stats, Profile)
8. Top app bar — title + optional actions
9. Lists with food items (image, name, calories, BZHU badges)
10. Modals and bottom sheets — rounded top, drag handle
11. Stepper component (- [number] +) for quantity inputs
12. Segmented controls — for unit switchers (g/ml/dona/piyola)
13. Empty states (illustrations)
14. Toast/snackbar notifications

LAYOUT:
- Mobile first, 375px and 430px widths
- 16px base padding, 24px section spacing
- Safe area aware
- Support both iOS and Android (Material + Cupertino hybrid)

LANGUAGES: Interface in Uzbek (Latin script), Russian, and English. Show Uzbek as the primary language in mockups.

DELIVERABLES: 
- Color tokens (light + dark)
- Typography scale
- Component library (all states: default, hover, active, disabled)
- Spacing + radius + shadow tokens
- Icon style guide (outlined, 24px, 1.5px stroke)

Produce a visual style guide page showing all these tokens and components in one cohesive layout.
```

---

## 📱 PROMPT 1 — Splash + Onboarding (4 screens)

```
Design 4 onboarding screens for FitAI mobile app, using the established FitAI design system (green primary #10B981, amber accent #F59E0B, Inter font, 16px radius).

SCREEN 1 — SPLASH:
- Logo: stylized leaf forming a plate, green gradient
- App name "FitAI" with tagline "Sog'lom ovqat — yaxshi hayot" (Uzbek)
- Subtle loading animation at bottom
- Full-screen, centered

SCREEN 2 — ONBOARDING SLIDE 1 "Huge food database":
- Illustration: a phone showing a long list of food items with small images (national dishes: osh/plov, manti, somsa + international foods)
- Title: "Minglab ovqatlar bazasidan tanlang"
- Subtitle: "O'zbek milliy taomlari, xalqaro mahsulotlar va shtrix-kod"
- Dots indicator (3 dots, first active)
- "Keyingi" button (primary green) + "O'tkazib yuborish" link (top right)

SCREEN 3 — ONBOARDING SLIDE 2 "Build from ingredients":
- Illustration: 3 ingredients floating (egg icon + tomato icon + sausage icon) combining into a plate with a glowing green "+" symbol and kcal total appearing
- Title: "Ingredientlardan yig'ing"
- Subtitle: "Taom nomini bilmasangiz — nimalardan tayyorlaganingizni qo'shing, biz hisoblaymiz"
- Dots indicator (second active)

SCREEN 4 — ONBOARDING SLIDE 3 "Track & warnings":
- Illustration: split image — healthy vibrant face vs pale tired face, with a gentle warning icon between them
- Title: "Vitamin yetishmovchiligidan himoyalaning"
- Subtitle: "Ilova sizni oldindan ogohlantiradi"
- Dots indicator (third active)
- "Boshlash" button (primary green, full width)

Use warm, illustrated style (not photographs). Show all screens side by side on iPhone 15 Pro mockup frames. Dark mode variants also.
```

---

## 🔐 PROMPT 2 — Authentication (Login, Register, Forgot)

```
Design 3 authentication screens for FitAI mobile app, using the FitAI design system.

SCREEN 1 — LOGIN:
- Top: back arrow, small logo
- Heading: "Qaytib keldingizmi?"
- Subtitle: "Hisobingizga kiring"
- Email input (with floating label)
- Password input (with show/hide eye icon)
- "Parolni unutdingizmi?" link (right aligned)
- Primary button "Kirish" (full width, green)
- OR divider
- Social: "Apple bilan kirish" button (black), "Google bilan kirish" button (white with Google logo)
- Bottom: "Hisobingiz yo'qmi? Ro'yxatdan o'ting" link

SCREEN 2 — REGISTER:
- Same header style
- Heading: "Salom! 👋"
- Subtitle: "Yangi hisob yarating"
- Name input
- Email input
- Password input (with strength indicator below)
- Checkbox: "Foydalanish shartlariga roziman"
- Primary button "Ro'yxatdan o'tish"
- Same social options
- Bottom: "Hisobingiz bormi? Kiring"

SCREEN 3 — FORGOT PASSWORD:
- Heading: "Parolni tiklash"
- Subtitle: "Email kiriting, biz sizga link yuboramiz"
- Email input
- Primary button "Link yuborish"
- Back to login link

Show all 3 screens on iPhone mockups. Include dark mode versions. Ensure biometric icons (FaceID/fingerprint) on login for returning users.
```

---

## 📋 PROMPT 3 — Profile Quiz (Onboarding Questionnaire, 6 screens)

```
Design 6 profile setup screens for FitAI, shown as a step-by-step quiz with a progress bar at top.

Shared header: progress bar (0/6, 1/6, etc.), back arrow, "Skip" link, large heading.

SCREEN 1 — "Sizning maqsadingiz nima?":
- 3 big card options (vertical):
  - 🏃 "Vazn kamaytirish" (ozish)
  - ⚖️ "Vaznni tutib turish"
  - 💪 "Mushaklarni oshirish"
- Each card: icon + title + short description
- Large "Keyingi" button at bottom (disabled until selection)

SCREEN 2 — "Bo'yingiz va vazningiz":
- Two big number inputs side by side
- Bo'y (sm) | Vazn (kg)
- Unit toggle (metric/imperial) at top right
- Visual: minimalist body silhouette on the left that updates size

SCREEN 3 — "Yoshingiz va jinsingiz":
- Year picker wheel (iOS style)
- Gender: 2 large cards "Erkak" / "Ayol" with icons
- Small note: "Bu ma'lumot aniq kaloriya hisobi uchun kerak"

SCREEN 4 — "Qancha faolsiz?":
- 5 option list (radio-like big cards):
  - 🪑 Sedentary — "Kam harakat"
  - 🚶 Light — "Yengil faol"
  - 🏃 Moderate — "O'rtacha"
  - 💪 Active — "Faol"
  - 🔥 Very active — "Juda faol"

SCREEN 5 — "Ovqatlanish cheklovlari?" (multi-select):
- Chip grid: Vegetarian, Vegan, Halal, Lactose-free, Gluten-free, Keto, Low-carb, Diabetic, None
- Selected chips glow green

SCREEN 6 — "Tayyor! 🎉":
- Celebration illustration
- "Sizning kunlik maqsadingiz:" 
- Big number: calories (e.g. 2,150 kcal)
- Macro breakdown below (P/C/F grams with colored dots)
- "Ilovaga kirish" big primary button

Show all 6 screens in a row with progress bar animation hint.
```

---

## 🏠 PROMPT 4 — Home Dashboard (main screen)

```
Design the Home Dashboard for FitAI — the main screen users open daily.

LAYOUT (scrollable):

TOP SECTION — Greeting:
- "Xayrli tong, Aziz 👋" (dynamic by time of day)
- Date: "Seshanba, 20 Aprel"
- Top right: notification bell icon with red dot if alerts

HERO SECTION — Today's Calorie Ring:
- Big circular progress ring (Apple Watch style)
- Center: "1,240 / 2,150" kcal + small "qolgan: 910 kcal" below
- 3 mini rings inside or around: Protein, Carbs, Fat (with gram values)
- Colors: green (calories), purple (protein), amber (carbs), pink (fat)

QUICK STATS CARDS (2x2 grid):
- 🚶 Qadamlar: 6,842 / 10,000 (with small progress bar and burned kcal "312 kcal")
- 💧 Suv: 5 / 8 stakan (with tap-to-add glasses visualization)
- 🔥 Sarflangan: 2,103 kcal (BMR + activity)
- ⚖️ Vazn: 72.3 kg (with trend arrow ↓ 0.2kg)

MEAL SECTION — "Bugungi taomlar":
- Horizontal sections for Nonushta / Tushlik / Kechki ovqat / Gazak
- Each section shows target kcal, consumed kcal, + button
- Example meal cards with thumbnail/emoji, name "Osh", portion "250g", kcal, timestamp
- Empty meal slots have dashed border + "Ovqat qo'shish" text

MICRONUTRIENTS PREVIEW:
- Horizontal scroll of vitamin/mineral chips
- Each chip: icon + name + percentage (e.g. "Vitamin C 84%")
- Red chip if deficient (<50%): "Temir 32% ⚠️"
- "Hammasini ko'rish" link

AI TIP CARD (soft gradient) — rule-based, not AI:
- 💡 icon + "Bugun oqsil yetmayapti. Tovuq yoki no'xat qo'shing."
- Tappable to see food suggestions

FAB (floating action button):
- Big green "+" PLUS icon (center bottom, above tab bar) — NOT a camera icon
- Tapping opens a quick-log menu (see PROMPT 12): Search, Ingredient Composer, Barcode, Manual

BOTTOM TAB BAR (5 icons):
- Home (active), Kundalik (diary), [FAB +], Statistika, Profil

Show light and dark modes, on iPhone 15 Pro + Pixel 9 Pro frames.

IMPORTANT: NO CAMERA icon anywhere. The primary input is text search and ingredient composer.
```

---

## 🔍 PROMPT 5 — Food Search (PRIMARY INPUT METHOD)

```
Design the Food Search screen — this is the PRIMARY way users add food to FitAI. No camera scanning.

TOP SECTION:
- Back arrow + heading "Ovqat qidirish"
- Search bar with magnifier icon, autofocus, placeholder "Ovqat nomini kiriting... (Osh, tuxum, olma)"
- Voice input mic icon on the right of search bar (V1.1)
- Meal picker pills below search: "Nonushta" | "Tushlik" | "Kechki ovqat" | "Gazak" (user selects where to add)

CATEGORY TABS (horizontally scrollable):
- 🔥 Yaqinlar (recent) | ⭐ Sevimlilar | 🍽 Milliy (Uzbek) | 🌍 Xalqaro | 📦 Brendlar | 🧾 Mening taomlarim

RESULT LIST:
- Each row:
  - Small image/emoji/icon on left (48x48, rounded)
  - Middle: food name (bold) + subtitle (brand or category, e.g. "Milliy taom · 1 kosa")
  - Right: kcal per default portion + tiny BZHU row "P22 C60 F28" with colored dots
  - Swipe right → favorite (heart icon)
  - Swipe left → quick add to today (green "+ qo'shish")
  - Tap → opens detail (PROMPT 8) for portion adjustment
- Show multi-language match: if user types "плов" in Russian, show "Osh / Плов" with both names
- Infinite scroll, skeleton placeholder cards while loading

EMPTY STATES:
- No query: show trending foods + recent searches
- No results: "Topilmadi — ingredientlardan yig'ishga harakat qiling" with big button to Ingredient Composer

ADVANCED ACTIONS (below the list, always visible):
- 3 big option cards stacked (or horizontal scroll):
  1. 🧩 "Ingredientlardan yig'ish" → Ingredient Composer
  2. 📊 "Shtrix-kod skaneri" → barcode scanner
  3. ✏️ "Qo'lda qo'shish" → manual entry

FILTER BUTTON (top right):
- Opens bottom sheet with filters: category, brand, max calories, min protein, halal only, etc.

Show light + dark, with a real sample query ("tuxum") and realistic results (6-8 items).
```

---

## 🧩 PROMPT 6 — INGREDIENT COMPOSER (THE CORE NEW FEATURE)

```
Design the Ingredient Composer screen for FitAI — the unique feature where users build a meal from ingredients when they don't know the dish name.

USE CASE EXAMPLE (show this in the mockup):
User made breakfast: "2 fried beef sausages + 2 boiled eggs + half a tomato"
They don't have a recipe name — they just want to log the ingredients.

TOP SECTION:
- Back arrow + heading "Ingredientlardan yig'ish"
- Meal name input (optional, placeholder: "Masalan: Nonushta, yoki meniki #1")
- Meal picker pills: Nonushta | Tushlik | Kechki | Gazak
- Time picker (defaults to now)

INGREDIENT LIST (scrollable middle section):
Show 3 ingredients already added (in our example scenario):

INGREDIENT CARD 1 — "Mol kolbasa (qovurilgan)":
- Food thumbnail/icon on left
- Name (bold) + subtitle "Mol go'shtidan"
- Quantity controls (centered, prominent):
  - Stepper: [−] [2] [+]
  - Unit dropdown: "dona" (with chevron — switchable to g, ml, piyola, osh qoshiq)
  - Tiny text below: "~ 120g"
- Cooking method chip row (small, horizontal):
  - "Xom" | "Qaynatilgan" | "Qovurilgan" (ACTIVE, green highlight) | "Pishirilgan" | "Grilled"
- If "Qovurilgan" active: "Qo'shilgan yog'" mini slider (5-20ml, default 10ml)
- Calorie badge on right: "280 kcal"
- Swipe left to delete, tap to edit

INGREDIENT CARD 2 — "Tuxum (qaynatilgan)":
- Similar structure
- Quantity: 2 dona (~100g)
- Method: Qaynatilgan (active)
- "155 kcal"

INGREDIENT CARD 3 — "Pomidor":
- Quantity: 0.5 dona (~60g)
- Method: Xom (active)
- "11 kcal"

"+ Ingredient qo'shish" CARD (dashed border, prominent):
- Tap → opens bottom-sheet search (reuses Food Search UI, but result → adds to this composer)

LIVE RUNNING TOTAL (sticky at bottom, glassmorphism card):
- Big number: "446 kcal"
- Macro row with colors: "P 32g • C 5g • F 34g"
- Thin horizontal macro bar (stacked, colored)
- Mini vitamins row: "Fe 18% · VitC 12% · B12 45% ..."
- Expandable arrow → opens full nutrition breakdown

BOTTOM ACTION BAR:
- "Shablon sifatida saqlash" (secondary button) — saves as reusable meal
- "Kundaliga qo'shish" (primary green, big) — logs to today's diary

UX DETAILS:
- When user taps quantity stepper, haptic feedback
- When switching unit from "dona" to "g", the quantity auto-converts using typical weights (2 eggs × 50g = 100g → shows "100g")
- Adding same ingredient twice should merge (confirm dialog: "Birlashtirish yoki alohida?")
- If user types an ingredient that maps to a full recipe (e.g. "osh"), show a hint: "Bu tayyor taom — to'g'ridan-to'g'ri qo'shishni xohlaysizmi?"
- Recently used ingredients show at top of search
- Smart defaults: eggs → pieces, oil → ml, rice → grams, milk → ml

COOKING METHOD IMPACT (info tooltip):
- Small "?" icon next to cooking method opens a tooltip: "Tayyorlash usuli ba'zi vitaminlarni yo'qotadi. Qovurish qo'shilgan yog' kaloriyasini qo'shadi."

MOBILE FRAMES: iPhone 15 Pro + Pixel. Light + dark.
Show the screen with 3 ingredients filled in + the live total, so the mockup demonstrates the value clearly.
```

---

## 📊 PROMPT 7 — Barcode Scanner + Manual Entry

```
Design 2 food input screens for FitAI.

SCREEN 1 — BARCODE SCANNER (simple barcode reading, NOT AI vision):
- Full-screen camera with barcode frame in center (clearly a barcode, not a food plate)
- Red laser line animating
- Top: close X, flashlight toggle
- Bottom tip: "Shtrix-kodni ramka ichiga joylashtiring"
- Data source note at bottom: "OpenFoodFacts bazasidan"
- After detection: quick preview bottom sheet with:
  - Product image, name, brand
  - Nutrition per 100g/ml + per selected serving
  - Portion stepper + unit
  - Meal picker (Nonushta/Tushlik/Kechki/Gazak)
  - "Qo'shish" button
- If product not found: "Bu mahsulot bazada yo'q. Qo'lda qo'shish" → Manual Entry

SCREEN 2 — MANUAL FOOD ENTRY (custom food):
- Heading: "Qo'lda qo'shish"
- Subtitle: "Bu ovqat bazada yo'q bo'lsa, o'zingiz qo'shing"
- Name input (with "Plov", "Osh" autocomplete chips if matches exist)
- Brand/source input (optional)
- Portion section:
  - Default quantity input + unit dropdown (g, ml, dona, piyola, kosa, osh qoshiq, chay qoshiq)
  - "1 portion weighs" (grams) — so pieces can convert
- Nutrition input fields (per default portion):
  - Kaloriya (kcal) — required
  - Oqsil (g) — required
  - Yog' (g) — required
  - Uglevod (g) — required
  - Toggle: "Batafsil kiritish" expands to show vitamins/minerals
- Photo upload (optional, personal reference only — NOT for AI analysis)
- Visibility toggle: "Faqat men ko'raman" (default) / "Umumiy bazaga taklif"
- Meal picker (Nonushta/Tushlik/Kechki/Gazak) as segmented control
- Primary button "Saqlash va qo'shish"

Show both screens on mobile frames with keyboard where relevant.
```

---

## 📖 PROMPT 8 — Meal Diary / Daily Log

```
Design the Diary (Kundalik) screen for FitAI — where users see all meals logged for a day.

TOP:
- Date selector (swipeable calendar strip: prev days, today, future greyed)
- Total for the day: "1,240 / 2,150 kcal" with mini progress bar

MEAL SECTIONS (stacked cards, expandable):

NONUSHTA (08:00) — 420 kcal:
- Progress toward meal budget (e.g. 420/538)
- List of foods logged:
  - [img] Tuxum omlet — 2 dona, 180 kcal — [edit icon]
  - [img] Non — 50g, 135 kcal — [edit icon]
  - [img] Choy asal bilan — 200ml, 105 kcal
- "+ Qo'shish" button within card (opens quick-log menu)

TUSHLIK (13:30) — 680 kcal:
- Same structure
- Items: Osh, Sabzi salati, Achchiq choy

KECHKI OVQAT (19:00) — 140 kcal:
- Empty state: dashed placeholder + "Ovqat qo'shing"

GAZAK — 0 kcal:
- Empty

BOTTOM SUMMARY CARD:
- Daily macro breakdown (P/C/F) as stacked horizontal bar
- "Eksport qilish" button (share/PDF)

INTERACTIONS:
- Tap meal item → opens food detail
- Long press item → quick actions (delete, duplicate, change meal, save as "My Meal")
- Pull to refresh re-syncs with health data
- "Copy meal to tomorrow" option in long-press menu

Show empty state of full day (all meals empty), and a fully logged day. Include dark mode.
```

---

## 🥗 PROMPT 9 — Food Detail Page

```
Design a Food Detail page for FitAI — shown when user taps any food item.

HERO:
- Large food image placeholder (60% width, rounded 24px) — if no photo, food-type illustration (bowl, plate, fruit)
- Favorite heart icon top right (toggle)
- Back button top left

TITLE SECTION:
- Big food name "Osh"
- Subtitle: "O'zbek milliy taomi • Retsept"
- Portion selector (prominent):
  - Big stepper: [−] [1] [+]
  - Unit dropdown: "kosa (250g)" — switchable to g, piyola, porsiya, osh qoshiq
  - Real-time nutrient values recalculate

NUTRITION FACTS CARD:
- Big kcal number center (e.g. "420 kcal")
- Macro row (P/C/F) with grams, percentages, colored progress dots
- Horizontal stacked bar showing macro ratio

VITAMINS & MINERALS (collapsible, collapsed by default):
- 2-column grid of micronutrients
- Each row: name + % of daily value + mini bar
- Green if ≥20% DV, amber if 10-20%, grey if <10%

HEALTH SCORE:
- Big circular badge A/B/C/D/E (Nutri-Score style)
- Short text: "Yaxshi oqsil manbai, lekin yog' ko'p"

INGREDIENTS LIST (if recipe):
- Bullet list of main ingredients (showing the ones that make up this dish)
- "Ingredientlarni o'zgartirish" button → opens Ingredient Composer with this recipe pre-filled (user can tweak)

SIMILAR FOODS section:
- Horizontal scroll cards of alternatives

BOTTOM ACTION BAR (sticky):
- Meal picker pills (Nonushta/Tushlik/Kechki/Gazak)
- Big green "Qo'shish" button

Design for both single-ingredient foods (apple) and complex recipe dishes (plov). Show light + dark.
```

---

## 📊 PROMPT 10 — Stats / Progress / Charts

```
Design the Statistika (Stats) tab for FitAI.

TOP:
- Segmented time selector: "Hafta" | "Oy" | "3 oy" | "Yil" (active: Hafta)
- Date range display

KEY METRIC CARDS (horizontal scroll):
- 🔥 O'rtacha kaloriya: 1,980 kcal/kun (with trend ↑ 2%)
- ⚖️ Vazn o'zgarishi: -0.8 kg this week
- 🚶 O'rtacha qadamlar: 7,420/kun
- 💧 Suv: 7.1 stakan/kun

MAIN CHART — Calories over time:
- Beautiful line chart with gradient fill
- X axis: days of week
- Y axis: kcal
- Target line as dashed horizontal
- Tap any point → tooltip with that day's breakdown

MACRO DISTRIBUTION:
- Donut chart of protein/carbs/fat for the period
- Compare to target (two concentric donuts)

WEIGHT TREND:
- Line chart with weight points
- Annotations at key milestones
- Add weight entry FAB

NUTRIENT COMPLIANCE:
- List of all vitamins/minerals
- Horizontal bars showing avg % of DV met
- Sorted by worst first
- Red flag icon for chronically low nutrients

STREAKS:
- "🔥 5 kunlik kombо" gamification card
- Calendar heatmap (green squares for logged days)

INSIGHTS CARD:
- Rule-based short text: "Bu hafta oqsil 15% kam iste'mol qildingiz"
- Food suggestions (from DB)

Export button → PDF report.

Show on mobile frames with sample data, light + dark.
```

---

## 🧬 PROMPT 11 — Micronutrients Panel + Deficiency Warning

```
Design 2 related screens focused on vitamins/minerals.

SCREEN 1 — MICRONUTRIENTS PANEL:
- Heading: "Mikroelementlar"
- Subtitle: "Bugungi ko'rsatkichlar"
- Tab: "Vitaminlar" | "Mineralar" (segmented)
- Grid of nutrient cards (2 columns):
  - Each card: nutrient icon/symbol (e.g. B12, Fe, Ca), name, % DV big number, horizontal progress bar, "yetarli"/"kam"/"ortiqcha" label
  - Color-coded: green (70-100%), amber (40-70%), red (<40%), purple (>120%)
- Sort dropdown: "Yetishmayotganlar birinchi" / "Alifbo" / "Foizi bo'yicha"
- Info icon on each card → tap opens detail

SCREEN 2 — DEFICIENCY WARNING (modal/full-screen):
- Heading: "Ogohlantirish: B12 vitamin yetishmovchilik"
- Hero image: SIDE-BY-SIDE COMPARISON
  - Left: vibrant healthy person illustration (energetic pose, bright colors)
  - Right: same character but tired, pale, slouched (darker colors)
  - Caption: "Salomat ↔ Yetishmovchilik"
- Current status card: "Sizda 3 kundan beri B12 yetishmayapti"
- Progress bar of last 7 days
- "Oqibatlari" section (expandable list):
  - Charchoq va holsizlik
  - Xotira muammolari
  - Nerv buzilishi (uzoq muddatli)
  - Anemia
- "Tavsiyalar" section:
  - Go'sht mahsulotlari, tuxum, sut
  - Food cards (3 horizontal scroll) — each tappable to add to diary
- DISCLAIMER BANNER (yellow/amber): "⚠️ Bu tibbiy tashxis EMAS. Shifokor bilan maslahatlashing."
- Buttons: "Ovqat qo'shish" (primary — opens Food Search filtered by B12-rich foods) + "Yopish" (ghost)

Important: the "negative" visual should be ARTISTIC, not scary. Use soft illustration style, desaturated colors, not medical photos. Emphasize hope and action, not fear.

Show both screens with dark mode.
```

---

## 👤 PROMPT 12 — Profile & Settings

```
Design the Profil tab for FitAI.

TOP — USER CARD:
- Avatar (circular, editable)
- Name "Aziz Karimov"
- Email (small, grey)
- "Tahrirlash" small button
- Stats row below: "28 kun kombo • 2,340 ovqat yozilgan"

GOAL SUMMARY CARD:
- Current goal: "Vazn kamaytirish"
- Target weight + current + progress bar
- Daily kcal target
- "O'zgartirish" link

SETTINGS SECTIONS (list):

"Sog'liq ma'lumotlari":
- Bo'y/vazn/yosh/jins
- Faollik darajasi
- Ovqatlanish cheklovlari (diet tags)

"Mening taomlarim":
- Saqlangan meal'lar (My Meals) — ro'yxat
- Mening retseptlarim (My Recipes) — custom retseptlar
- Eksport/Import

"Birikmalar":
- Apple Health / Health Connect toggle (show status "Ulangan")
- Apple Watch (if applicable)
- Google Fit (Android)

"Bildirishnomalar":
- Ovqat eslatmasi (toggles)
- Suv eslatmasi
- Haftalik hisobot
- Yetishmovchilik ogohlantirishlari

"Ilova sozlamalari":
- Til (Uzbek / Русский / English) dropdown
- Tema (Svetlый / Qorongu / Avtomatik)
- O'lchov birliklari (metric / imperial)

"Maxfiylik va Ma'lumotlar":
- Ma'lumotlarimni yuklab olish
- Ma'lumotlarimni o'chirish (red)
- Maxfiylik siyosati

"Yordam":
- FAQ
- Qo'llab-quvvatlash
- Ilova haqida + version

"Chiqish" button (red text, at bottom)

Each list item: icon + label + optional right text/toggle + chevron.
Show light + dark, include subtle separators.
```

---

## 💧 PROMPT 13 — Water Tracker + Weight Log + Quick-Log FAB

```
Design 3 small but delightful interaction screens.

SCREEN 1 — WATER TRACKER (modal / full screen):
- Top: close X, heading "Suv iste'moli"
- Big visual: animated water bottle illustration that fills based on progress
- Current: "5 / 8 stakan" below bottle
- Plus/minus buttons (large, haptic feedback) to add/remove
- Horizontal row of 8 glass icons (filled/empty based on count)
- Quick add chips: "+250 ml" / "+500 ml" / "+1 L"
- Today's timeline: small dots showing when each glass was logged
- "Eslatmalarni sozlash" link at bottom

SCREEN 2 — WEIGHT LOG (bottom sheet):
- Drag handle
- "Vaznni yozish"
- Large number input (stepper + direct entry)
- Unit toggle (kg/lbs)
- Date/time (defaults to now)
- Optional note field "Izoh"
- Big "Saqlash" button
- Trend mini chart at top showing last 7 entries

SCREEN 3 — QUICK-LOG FAB MENU (on + FAB tap from Home):
- FAB expands into 4 radial/vertical options (NO CAMERA):
  - 🔍 Qidirish (Food Search)
  - 🧩 Ingredientlardan yig'ish (Ingredient Composer)
  - 📊 Shtrix-kod (Barcode)
  - ✏️ Qo'lda qo'shish (Manual Entry)
- Backdrop blurs
- Labels appear beside icons
- Tap outside to close

IMPORTANT: No camera icon anywhere in the FAB menu. The "+" FAB primarily opens Search, with other options listed.

Show all 3 with subtle animation hints.
```

---

## 🏆 PROMPT 14 — Achievements & Streaks

```
Design the Achievements/Streaks screen for FitAI (gamification layer).

TOP HERO:
- Big streak flame: "🔥 12 kun"
- "Sizning eng yaxshi rekordingiz: 34 kun"
- Calendar heatmap of the last 3 months (green squares for days with logged food)

BADGES GRID (3 columns):
- Each badge: circular icon (earned = colorful, locked = greyscale with lock)
- Label below (e.g. "Birinchi hafta", "10,000 qadam", "Hech bir kun o'tkazmadim")
- Progress ring around locked badges showing % completion
- Tap → modal explains how to earn

WEEKLY CHALLENGES CARD:
- "Bu hafta uchun challenge"
- e.g. "5 kun davomida kuniga 8 stakan suv iching" 
- Progress bar 3/5
- Reward preview icon

LEADERBOARD (optional family mode):
- "Oila" tab — shows family members and their streaks
- Avatars with streak numbers

Make it fun and encouraging, not competitive-pressuring. Use soft confetti on unlocked badges (animation hint).

Light + dark.
```

---

## 📄 PROMPT 15 — Weekly Report (PDF-ready)

```
Design a Weekly Report layout for FitAI, optimized for PDF export and in-app viewing.

COVER:
- "Haftalik hisobot"
- Date range: "14–20 Aprel 2026"
- User name + avatar
- Green gradient header

SUMMARY SECTION:
- 4 big stat tiles: Avg calories, Avg steps, Weight change, Compliance score
- Each with trend arrow vs previous week

CALORIE CHART (line chart), WEIGHT CHART (dots + trend line)

MACRO BREAKDOWN:
- Donut chart for the week's average
- Comparison to target

TOP FOODS:
- List of 5 most-eaten foods this week with frequency

NUTRIENT COMPLIANCE TABLE:
- Clean 2-column list of all vitamins/minerals met vs missed
- Red highlight for those below 50% DV

INSIGHTS:
- Rule-based narrative (4-5 sentences) summarizing the week
- "Bu hafta yaxshi..." / "Kelasi haftada..."

RECOMMENDATIONS:
- 3 specific food suggestions for next week

FOOTER:
- FitAI logo + disclaimer "Tibbiy maslahat emas"

Make it printable (A4 ratio option) AND mobile viewable. Elegant, editorial style.
```

---

## 🌐 PROMPT 16 — Language/Theme/Permissions

```
Design 3 micro-screens:

SCREEN 1 — LANGUAGE PICKER (first launch):
- Center logo
- "Tilni tanlang / Выберите язык / Choose language"
- 3 big card buttons:
  - 🇺🇿 O'zbekcha
  - 🇷🇺 Русский
  - 🇬🇧 English
- Each card: flag icon + language name in that language

SCREEN 2 — THEME PICKER:
- "Tema"
- 3 preview cards side by side showing app mockup in each theme:
  - ☀️ Svetlый (light)
  - 🌙 Qorongu (dark)
  - ⚙️ Avtomatik (follows system)
- Selected card has green border + checkmark

SCREEN 3 — PERMISSIONS REQUEST:
- Friendly illustration at top
- Clear list of permissions app needs:
  - 📊 Shtrix-kod kamerasi — "Faqat shtrix-kod o'qish uchun (ovqat aniqlash AI'si YO'Q)"
  - 🏃 Sog'liq/HealthKit — "Qadam sanash uchun"
  - 🔔 Bildirishnomalar — "Ovqat va suv eslatmalari"
- Each has a toggle
- "Davom etish" big green button

Note: camera permission is optional — only used for barcode scanning. User can skip it and still use Search + Ingredient Composer fully.

Show all 3 screens on iPhone + Pixel. Light + dark.
```

---

## 🎬 FOYDALANISH TARTIBI / Порядок использования

1. **PROMPT 0 → Design System** (birinchi, asos)
2. **PROMPT 1-3** → Onboarding (Splash, Auth, Quiz)
3. **PROMPT 4** → Home Dashboard
4. **PROMPT 5** → **Food Search (asosiy ovqat kiritish usuli)** ⭐
5. **PROMPT 6** → **Ingredient Composer (YANGI asosiy feature)** ⭐⭐
6. **PROMPT 7** → Barcode + Manual Entry
7. **PROMPT 8-9** → Diary, Food Detail
8. **PROMPT 10** → Stats
9. **PROMPT 11** → Micronutrients + Deficiency
10. **PROMPT 12-14** → Profile, Water/Weight, Achievements
11. **PROMPT 15** → Report
12. **PROMPT 16** → Micro-screens

---

## 💡 QO'SHIMCHA MASLAHATLAR

- Har bir prompt natijasida olingan design'ni `C:\Project\fit\docs\design\` papkasiga saqlang (screenshot yoki Claude Design URL).
- Claude Design'dan exports/code olsangiz, keyin Haiku/Sonnet modellari uni React Native kodga aylantirishda foydalanadi.
- Agar biror ekran yoqmasa, shu promptni o'zgartirib qayta yuboring (masalan: "make it more minimal", "use more whitespace", "show with real Uzbek food photos").
- **Iteratsiya normal** — 3-5 marta qayta ishlash oddiy holat.
- Dark mode'ni majburiy so'rang har bir promptda.
- Mockup frameworks: iPhone 15 Pro (6.1"), Pixel 9 Pro — realistic preview uchun.

## ⚠️ MUHIM ESLATMA

- **Camera / AI food recognition YO'Q** — hech bir ekranda kamera-skan UI bo'lmasin.
- Barcode kamerasi mumkin, lekin aniq ajratib ko'rsating: "faqat shtrix-kod, AI emas".
- Asosiy ovqat kiritish yo'llari: **Food Search**, **Ingredient Composer**, **Barcode**, **Manual**.
- **Ingredient Composer** — loyihaning **o'ziga xos xususiyati**. Unga alohida e'tibor bering, UX chiroyli va tezkor bo'lsin.
