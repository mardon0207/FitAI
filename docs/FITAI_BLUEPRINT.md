# FitAI Blueprint — The "Skill" Guide

This document defines the core architecture, design principles, and implementation rules for the FitAI platform. Use this as a "Skill" (Blueprint) to replicate or extend the application.

## 1. Core Architecture
- **Type:** Progressive Web App (PWA)
- **Stack:** Vite + React + TypeScript
- **State Management:** 
  - **Zustand:** For synchronous app state (Auth, UI Prefs, Diary draft).
  - **React Query:** For server-side data fetching (Food search, Profiles).
- **Backend-as-a-Service:** **Supabase** (Auth, PostgREST, Storage).

## 2. Design Principles (The "Wow" Factor)
- **Aesthetic:** Modern, "Apple-style" minimalist UI.
- **Tokens:** Centralized in `design/tokens.ts`. Use HSL-based color palettes (e.g., `FIT.primary`, `FIT.surface`).
- **Layout:** "Phone-first" containment. All screens are rendered inside a `Phone` primitive.
- **Glassmorphism:** Heavy use of `backdrop-filter: blur()` and semi-transparent surfaces.
- **Micro-animations:** Use `framer-motion` for screen transitions and interactive elements.

## 3. Flagship Feature: Ingredient Composer
The Composer is the heart of FitAI.
- **Logic:** Allows users to combine raw ingredients into a final meal.
- **Calculations:** Real-time calculation of totals based on grams and cooking coefficients (oil, water absorption).
- **UX:** Rapid search -> Add to draft -> Adjust weight -> Save to Diary.

## 4. Technical Rules (The Guardrails)
- **Primary Language:** Uzbek (`uz`). Secondary: Russian (`ru`), English (`en`). Use `useT()` hook.
- **Nutrition Logic:** Must be centralized in `lib/nutrition.ts`. All macronutrient calculations must follow the same formulas.
- **Supabase Integration:** 
  - Use `supabase-js` client directly in hooks.
  - Rely on Row Level Security (RLS) for data privacy.
- **Strict Typing:** No `any`. Use shared interfaces from `@fit/shared-types`.

## 5. Development Workflow
1. **Design First:** Port from a high-fidelity design source (e.g., `design_prompts.md`).
2. **Atomic Components:** Build Primitives (`design/primitives.tsx`) first.
3. **Screen Porting:** Map logic to state stores (`stores/`) and then to UI.
4. **Localization:** Wrap all strings in the translation hook immediately.

## 6. Directory Structure (Standard)
```text
/apps/web/src/
  api/        # Supabase hooks
  design/     # UI Primitives & Tokens
  lib/        # Business logic (Nutrition, Pedometer)
  screens/    # Page components
  stores/     # Zustand state
/packages/
  shared-types/ # Shared TS interfaces
```
