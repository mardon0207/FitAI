/**
 * Persisted local diary store — source of truth for:
 * - meal entries (breakfast/lunch/dinner/snack)
 * - water intake (glasses)
 * - weight log
 * - step count
 *
 * Everything is scoped per-day. localStorage is the ground truth until a real
 * backend is wired up.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getFood, nutrientsForGrams, resolveGrams } from '@/data/db';
import { todayYmd as today } from '@/data/date';
import type { MealType, Unit } from '@fit/shared-types';

export interface DiaryEntry {
  id: string;           // uuid-ish
  foodSlug: string;
  mealType: MealType;
  date: string;         // YYYY-MM-DD
  addedAt: number;      // ms timestamp
  quantity: number;
  unit: Unit;
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  micros: Record<string, number>;
  note?: string;
}

export interface WaterEntry { id: string; date: string; addedAt: number; ml: number }
export interface WeightEntry { id: string; date: string; addedAt: number; kg: number; note?: string }
export interface StepEntry { date: string; steps: number }

interface DiaryState {
  entries: DiaryEntry[];
  water: WaterEntry[];
  weight: WeightEntry[];
  steps: StepEntry[];

  addEntry: (p: { foodSlug: string; mealType: MealType; quantity: number; unit: Unit; date?: string; note?: string }) => DiaryEntry | null;
  addComposedMeal: (p: { name: string; mealType: MealType; ingredients: Array<{ slug: string; quantity: number; unit: Unit; grams: number; per100g: Record<string, number> }>; date?: string }) => DiaryEntry | null;
  removeEntry: (id: string) => void;
  entriesForDate: (date: string) => DiaryEntry[];

  addWater: (ml: number) => void;
  removeWater: (id: string) => void;
  waterMlForDate: (date: string) => number;
  addWeight: (kg: number, note?: string) => void;
  weightLatest: () => number | null;
  setSteps: (steps: number, date?: string) => void;
  stepsForDate: (date: string) => number;

  clearAll: () => void;
}

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useDiary = create<DiaryState>()(
  persist(
    (set, get) => ({
      entries: [],
      water: [],
      weight: [],
      steps: [],

      addEntry: ({ foodSlug, mealType, quantity, unit, date, note }) => {
        const food = getFood(foodSlug);
        if (!food) return null;
        const grams = resolveGrams(food, quantity, unit);
        const n = nutrientsForGrams(food, grams);
        const entry: DiaryEntry = {
          id: uid(),
          foodSlug,
          mealType,
          date: date ?? today(),
          addedAt: Date.now(),
          quantity,
          unit,
          grams: round1(grams),
          kcal: Math.round(n.kcal ?? 0),
          protein: round1(n.protein ?? 0),
          carbs: round1(n.carbs ?? 0),
          fat: round1(n.fat ?? 0),
          micros: Object.fromEntries(
            Object.entries(n).filter(([k]) => !['kcal', 'protein', 'carbs', 'fat'].includes(k))
              .map(([k, v]) => [k, round2(v)]),
          ),
          note,
        };
        set((s) => ({ entries: [...s.entries, entry] }));
        return entry;
      },

      addComposedMeal: ({ name, mealType, ingredients, date }) => {
        if (ingredients.length === 0) return null;
        const totals = ingredients.reduce(
          (acc, i) => {
            const scaled = Object.entries(i.per100g).reduce<Record<string, number>>((m, [k, v]) => {
              m[k] = (m[k] ?? 0) + (v * i.grams) / 100;
              return m;
            }, {});
            acc.kcal += scaled.kcal ?? 0;
            acc.protein += scaled.protein ?? 0;
            acc.carbs += scaled.carbs ?? 0;
            acc.fat += scaled.fat ?? 0;
            acc.grams += i.grams;
            for (const [k, v] of Object.entries(scaled)) {
              if (!['kcal', 'protein', 'carbs', 'fat'].includes(k)) {
                acc.micros[k] = (acc.micros[k] ?? 0) + v;
              }
            }
            return acc;
          },
          { kcal: 0, protein: 0, carbs: 0, fat: 0, grams: 0, micros: {} as Record<string, number> },
        );

        const entry: DiaryEntry = {
          id: uid(),
          foodSlug: '__composed__',
          mealType,
          date: date ?? today(),
          addedAt: Date.now(),
          quantity: 1,
          unit: 'serving',
          grams: round1(totals.grams),
          kcal: Math.round(totals.kcal),
          protein: round1(totals.protein),
          carbs: round1(totals.carbs),
          fat: round1(totals.fat),
          micros: Object.fromEntries(
            Object.entries(totals.micros).map(([k, v]) => [k, round2(v)]),
          ),
          note: name,
        };
        set((s) => ({ entries: [...s.entries, entry] }));
        return entry;
      },

      removeEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),

      entriesForDate: (date) => get().entries.filter((e) => e.date === date),

      addWater: (ml) => set((s) => ({
        water: [...s.water, { id: uid(), date: today(), addedAt: Date.now(), ml }],
      })),
      removeWater: (id) => set((s) => ({ water: s.water.filter((w) => w.id !== id) })),
      waterMlForDate: (date) => get().water.filter((w) => w.date === date).reduce((sum, w) => sum + w.ml, 0),

      addWeight: (kg, note) => set((s) => ({
        weight: [...s.weight, { id: uid(), date: today(), addedAt: Date.now(), kg, note }],
      })),
      weightLatest: () => {
        const sorted = [...get().weight].sort((a, b) => b.addedAt - a.addedAt);
        return sorted[0]?.kg ?? null;
      },

      setSteps: (steps, date) => set((s) => {
        const d = date ?? today();
        const existing = s.steps.find((x) => x.date === d);
        if (existing) {
          return { steps: s.steps.map((x) => (x.date === d ? { date: d, steps } : x)) };
        }
        return { steps: [...s.steps, { date: d, steps }] };
      }),
      stepsForDate: (date) => get().steps.find((x) => x.date === date)?.steps ?? 0,

      clearAll: () => set({ entries: [], water: [], weight: [], steps: [] }),
    }),
    { name: 'fit-diary' },
  ),
);

function round1(n: number): number { return Math.round(n * 10) / 10; }
function round2(n: number): number { return Math.round(n * 100) / 100; }

/** Derived totals for a date's diary. */
export function totalsForDate(date: string): {
  kcal: number; protein: number; carbs: number; fat: number; micros: Record<string, number>;
} {
  const entries = useDiary.getState().entries.filter((e) => e.date === date);
  return entries.reduce(
    (acc, e) => {
      acc.kcal += e.kcal;
      acc.protein += e.protein;
      acc.carbs += e.carbs;
      acc.fat += e.fat;
      for (const [k, v] of Object.entries(e.micros)) {
        acc.micros[k] = (acc.micros[k] ?? 0) + v;
      }
      return acc;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0, micros: {} as Record<string, number> },
  );
}
