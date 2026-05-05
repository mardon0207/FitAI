# FitAI — Modern Design Prompts Pack (v3) 🚀

> **v3 Highlights:** 
> - **Primary Color:** Indigo (#4F46E5) & Emerald (#10B981)
> - **Typography:** Outfit (Headings) + Inter (Body) + JetBrains Mono (Stats)
> - **Style:** Premium Glassmorphism, 28px/20px border radius, subtle shadows.
> - **Tech Context:** Optimized for React + Framer Motion + primitives.tsx components.

---

## 🎨 PROMPT 0 — MODERN DESIGN SYSTEM (Foundation)

```text
Create a premium mobile app design system for "FitAI" — a high-end calorie & nutrition tracker.

STYLE: Modern, "Apple-esque" aesthetics, premium feel, high contrast, clean whitespace.
VISUALS: Glassmorphism (blur: 12px), rounded shapes (28px for main cards, 16px for small elements).

COLOR PALETTE (Indigo System):
- Primary: #4F46E5 (Indigo — professional, deep)
- Primary Soft: rgba(79, 70, 229, 0.1)
- Accent: #10B981 (Emerald — health, activity, success)
- Danger: #EF4444 (Red — warning, high fat, alerts)
- Amber: #F59E0B (Orange — warning, recipes)
- Background (Light): #F8FAFC (Slate 50)
- Background (Dark): #0F172A (Slate 900)
- Surface: White (Light) / #1E293B (Dark)
- Border: #F1F5F9 (Light) / rgba(255, 255, 255, 0.05) (Dark)

TYPOGRAPHY:
- Headings: "Outfit" (SemiBold/Bold) — Elegant and modern.
- Body: "Inter" (Medium) — Highly readable.
- Data/Numbers: "JetBrains Mono" (Bold) — For calories, weights, and timestamps.

CORE COMPONENTS:
1. Phone: Mobile wrapper with max-width 430px and centered layout.
2. TopBar: Transparent background, large Heading, and subtitle.
3. TabBar: Floating glassmorphism bar with 5 icons (Home, Diary, Add [+], Stats, Profile).
4. StatTile: 2x2 grid cards with icons, labels, and trend arrows (up/down).
5. MultiRing: SVG-based triple concentric rings (Calories, Protein, Activity).
6. FoodThumb: Circular/Rounded container for food emojis or photos with "tone" background (Green/Amber).
7. Button: Primary (Indigo fill), Secondary (Ghost/Outline), Large (56px height, 18px radius).

Produce a visual style guide page showing all these tokens and components in one cohesive layout.
```

---

## 🏠 PROMPT 1 — PREMIUM HOME DASHBOARD

```text
Design the Home Dashboard for FitAI using the Indigo Design System (v3).

LAYOUT:
- TOP: "Xayrli tong, Aziz 👋" in Outfit Bold, current date in Inter Medium.
- HERO: "MultiRing" component. Big center ring (Indigo) for Calories, middle (Purple) for Protein, outer (Emerald) for Steps. 
- CENTER STATS: 2x2 Grid of "StatTiles":
  1. Steps (Walking icon, 8,420 steps, target 10k).
  2. Water (Water drop, 1.5L / 2.5L, simple glass icons).
  3. Weight (Scale icon, 72.5kg, trend ↓ 0.2kg).
  4. Burned (Fire icon, 450 kcal).
- AI ADVISOR CARD: Glassmorphism card with gradient border. 
  Text: "💡 Bugun oqsil miqdori kam. Tushlikka tovuq go'shti qo'shishni tavsiya qilaman."
- RECENT MEALS: Horizontal scroll of "FoodThumb" cards (Image + Title + Kcal).
- FAB: Floating Indigo "+" button in the center of the TabBar.

Show light and dark mode versions. Focus on depth, blur effects, and premium typography.
```

---

## 🧩 PROMPT 2 — INGREDIENT COMPOSER (Flagship UI)

```text
Design the "Ingredient Composer" screen for FitAI. This is where users "build" a custom meal from raw ingredients.

UI ELEMENTS:
- HEADER: Title "Ingredientlardan yig'ish", subtitle showing live total "0 ta ingredient · 0 kcal".
- INPUT: Floating input for "Taom nomi" (e.g., "Mening nonushtam").
- LIST AREA: Cards for ingredients added:
  - Left: "FoodThumb" with ingredient icon.
  - Middle: Name, sub-details (e.g., "100g").
  - Controls: A custom "Stepper" (- [num] +) and a "Unit Dropdown".
  - Cooking Chips: Horizontal row (Raw, Boiled, Fried, Baked, Grilled).
- SPECIAL UI: When "Fried" is selected, show an "Oil Slider" (ml) with a yellow tint.
- BOTTOM SUMMARY: Sticky glassmorphism panel showing:
  - Total Kcal (Large Outfit font).
  - MacroBar: Stacked horizontal progress bar (Protein/Carbs/Fat).
  - Button: Large Indigo "Kundalikka qo'shish" button.

Demonstrate adding "2 Eggs" + "50g Bread" + "10ml Oil (Fried)".
```

---

## ⚠️ PROMPT 3 — HEALTH CONSEQUENCES (AI Analysis)

```text
Design the "Consequences" (Health Analysis) screen for FitAI. 

STYLE: Informative, professional but visually engaging (not clinical).

FEATURES:
- CATEGORY TABS: All, Active (⚠️), Macros, Vitamins, Activity.
- WARNING CARDS:
  - Visual: Large 64x64 rounded image/icon showing the health aspect.
  - Status: Red "FAOL" (ACTIVE) badge if the user is deficient TODAY.
  - Title: e.g., "B12 vitamini yetishmovchiligi".
  - Tagline: "Charchoq va diqqat pasayishi xavfi".
- EXPANDABLE CONTENT:
  1. "Oqibatlari": Numbered list of what happens if not fixed.
  2. "Nima qilish kerak": Checklist of food recommendations (e.g., "Tuxum", "Go'sht").
- FOOTER: Amber disclaimer box about medical advice.

Show a "Danger" state card for "Water Dehydration" and a "Warning" state for "Low Protein".
```

---

## 📊 PROMPT 4 — ADVANCED STATS & TRENDS

```text
Design the "Statistics" tab for FitAI using high-end data visualization.

COMPONENTS:
- PERIOD PICKER: Indigo sliding pill (Hafta / Oy / Yil).
- KPI GRID: Stat cards for "Average Intake", "Total Burned", and "Weight Change".
- MAIN CHART (Calories): A beautiful line chart with a gradient fill under the line. Dashed horizontal line for "Goal".
- DONUT CHART (Activity Mix): Showing percentage of Plov vs Salads vs Snacks. Centered total kcal number.
- HISTORY LIST: List of previous days. Each row shows Kcal In (Indigo icon) vs Kcal Out (Fire icon) and a "Status Circle" (Green check if target met, Red alert if over limit).

Use Slate-900 for dark mode background and ensure chart lines are vibrant Indigo and Emerald.
```

---

## 🥘 PROMPT 5 — FOOD DETAIL & NUTRIENTS

```text
Design the "Food Detail" page for a specific item (e.g., "Palov" or "Apple").

LAYOUT:
- TOP HERO: Vibrant background gradient with a large (140px) "FoodThumb" in the center.
- HEADER CARD: Floating white/slate card with Title, Category badge, and Large Calorie count.
- PORTION CONTROLS: Two cards side-by-side:
  - "Miqdori": Large number with [-] [+] buttons.
  - "Birlik": Dropdown (g, ml, dona, porsiya).
- COMPOSITION: 3-column grid for Protein, Carbs, Fat with tinted backgrounds.
- MICRONUTRIENTS: A clean 3-column grid of small labels showing mg/mcg values for vitamins and minerals.
- ACTION: Fixed bottom button "Kundalikka qo'shish" with a success animation state.

Ensure the "JetBrains Mono" font is used for all nutritional values.
```
