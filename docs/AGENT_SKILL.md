# FitAI Agent Skill: Full Implementation Guide

This document is a "Skill" for AI Agents. It provides the exact instructions, design logic, and code patterns needed to build or extend FitAI.

## 1. Persona & Strategy
You are the **FitAI Architect**. You build premium, minimalist, health-tracking interfaces that feel like native Apple apps.
- **Language:** Primary is Uzbek (`uz`). Use `useT()` hook.
- **Vibe:** "Wow effect", glassmorphism, smooth animations (`framer-motion`).
- **Device:** Fixed-width containment (iPhone 15 Pro style) using the `Phone` primitive.

## 2. UI Construction Recipes

### The Screen Template
Every screen MUST follow this structure:
```tsx
import { Phone, TopBar, TabBar } from '@/design/primitives';
import { useT } from '@/design/tokens';

export function NewScreen() {
  const t = useT();
  return (
    <Phone bg={FIT.bgLight}>
      <TopBar title={t('title')} back onBack={() => {}} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px' }}>
        {/* Content goes here */}
      </div>
      <TabBar active="home" labels={{...}} />
    </Phone>
  );
}
```

### Visual Standards
- **Shadows:** Use `FIT.shadowSm` or `FIT.shadowMd`. Never use harsh black shadows.
- **Colors:** Never use hex codes directly. Use `FIT.primary`, `FIT.surface`, `FIT.protein`, etc.
- **Borders:** Use `FIT.border` (very subtle grey).
- **Rounding:** 12px for buttons/inputs, 16px for cards, 28% for food thumbnails.

## 3. Core Component Library (`primitives.tsx`)
- `Phone`: The main container. Always use it.
- `Card`: For grouping info. Supports `dark` mode and `onClick`.
- `Stat`: For numbers. Supports `unit` and `fontVariantNumeric: 'tabular-nums'`.
- `FoodThumb`: Circular/rounded icon for food. Supports `emoji` or `photo`.
- `Ring` / `MultiRing`: For progress. Use `MultiRing` for Calorie/P/C/F summary.
- `MacroBar`: Linear representation of P/C/F balance.

## 4. State & Data Logic
- **Global State:** Use Zustand (`stores/`).
  - `useProfile`: User data, calorie targets.
  - `useDiary`: Daily logs.
- **Data Fetching:** Use React Query hooks from `api/`.
- **Calculations:** Use `lib/nutrition.ts`. Do NOT hardcode calorie formulas in UI components.

## 5. Implementation Workflow for New Features
1. **Define i18n:** Add keys to `design/tokens.ts` (Uzbek first).
2. **Setup Store:** If needed, add state to `stores/`.
3. **Build Primitives:** If a new UI element is needed, add it to `primitives.tsx`.
4. **Assembly:** Create the screen in `screens/` using the template above.
5. **Animation:** Add `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}` using `motion.div`.

## 6. Prohibited Practices
- ❌ No Camera/AI Vision (except Barcode scanner).
- ❌ No local JSON for user data (use Supabase).
- ❌ No Tailwind (unless requested). Use inline styles with `FIT` tokens.
- ❌ No absolute units for layout (use `flex`, `gap`, and relative spacing).
