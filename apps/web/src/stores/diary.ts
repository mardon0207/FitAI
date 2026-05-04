/**
 * Persisted local diary store — source of truth for:
 * - meal entries (breakfast/lunch/dinner/snack)
 * - water intake (glasses)
 * - weight log
 * - step count
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { todayYmd as today } from '@/data/date';
import type { MealType, Unit, DiaryEntry, WaterEntry, WeightEntry, StepEntry, ActivityEntry } from '@fit/shared-types';
import { supabase } from '@/lib/supabase';
import { useProfile } from './profile';

// Types imported from @fit/shared-types

export interface AddEntryParams {
  foodSlug: string;
  foodName?: string;
  foodEmoji?: string;
  mealType: MealType;
  quantity: number;
  unit: Unit;
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  micros?: Record<string, number>;
  date?: string;
  note?: string;
  foodPhotoUrl?: string | null;
}

interface DiaryState {
  entries: DiaryEntry[];
  water: WaterEntry[];
  weight: WeightEntry[];
  steps: StepEntry[];
  activities: ActivityEntry[];

  // Actions
  addEntry: (p: AddEntryParams) => DiaryEntry;
  addComposedMeal: (p: { name: string; mealType: MealType; ingredients: Array<{ slug: string; quantity: number; unit: Unit; grams: number; per100g: Record<string, number> }>; date?: string }) => DiaryEntry | null;
  removeEntry: (id: string) => void;
  entriesForDate: (date: string) => DiaryEntry[];

  addWater: (ml: number) => void;
  removeWater: (id: string) => void;
  waterMlForDate: (date: string) => number;
  
  addWeight: (kg: number, note?: string) => Promise<void>;
  weightLatest: () => number | null;
  
  setSteps: (steps: number, date?: string) => void;
  stepsForDate: (date: string) => number;

  addActivity: (p: Omit<ActivityEntry, 'id' | 'addedAt'>) => void;
  removeActivity: (id: string) => void;
  activitiesForDate: (date: string) => ActivityEntry[];
  totalBurnedKcal: (date: string) => number;

  clearAll: () => void;

  // Supabase Sync
  pullFromSupabase: () => Promise<void>;
  pushAllToSupabase: () => Promise<void>;
  pushEntryToSupabase: (entry: DiaryEntry) => Promise<void>;
  deleteEntryFromSupabase: (id: string) => Promise<void>;
  pushWaterToSupabase: (entry: WaterEntry) => Promise<void>;
  deleteWaterFromSupabase: (id: string) => Promise<void>;
  pushWeightToSupabase: (entry: WeightEntry) => Promise<void>;
  pushStepsToSupabase: (entry: StepEntry) => Promise<void>;
  pushActivityToSupabase: (a: ActivityEntry) => Promise<void>;
  deleteActivityFromSupabase: (id: string) => Promise<void>;
}

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function round1(n: number): number { return Math.round(n * 10) / 10; }
function round2(n: number): number { return Math.round(n * 100) / 100; }

export const useDiary = create<DiaryState>()(
  persist(
    (set, get) => ({
      entries: [],
      water: [],
      weight: [],
      steps: [],
      activities: [],

      addEntry: (p) => {
        const entry: DiaryEntry = {
          id: uid(),
          foodSlug: p.foodSlug,
          foodName: p.foodName,
          foodEmoji: p.foodEmoji,
          mealType: p.mealType,
          date: p.date ?? today(),
          addedAt: Date.now(),
          quantity: p.quantity,
          unit: p.unit,
          grams: round1(p.grams),
          kcal: Math.round(p.kcal),
          protein: round1(p.protein),
          carbs: round1(p.carbs),
          fat: round1(p.fat),
          micros: Object.fromEntries(
            Object.entries(p.micros ?? {}).map(([k, v]) => [k, round2(v)]),
          ),
          note: p.note,
          foodPhotoUrl: p.foodPhotoUrl,
        };
        set((s) => ({ entries: [...s.entries, entry] }));
        get().pushEntryToSupabase(entry);
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
        get().pushEntryToSupabase(entry);
        return entry;
      },

      removeEntry: (id) => {
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
        get().deleteEntryFromSupabase(id);
      },

      entriesForDate: (date) => get().entries.filter((e) => e.date === date),

      addWater: (ml) => {
        const entry = { id: uid(), date: today(), addedAt: Date.now(), ml };
        set((s) => ({ water: [...s.water, entry] }));
        get().pushWaterToSupabase(entry);
      },
      removeWater: (id) => {
        set((s) => ({ water: s.water.filter((w) => w.id !== id) }));
        get().deleteWaterFromSupabase(id);
      },
      waterMlForDate: (date) => get().water.filter((w) => w.date === date).reduce((sum, w) => sum + w.ml, 0),

      addWeight: async (kg, note) => {
        const entry = { id: uid(), date: today(), addedAt: Date.now(), kg, note };
        set((s) => ({ weight: [...s.weight, entry] }));
        await get().pushWeightToSupabase(entry);
      },
      weightLatest: () => {
        const sorted = [...get().weight].sort((a, b) => b.addedAt - a.addedAt);
        return sorted[0]?.kg ?? null;
      },

      setSteps: (steps, date) => {
        const d = date ?? today();
        const entry = { date: d, steps };
        set((s) => {
          const existing = s.steps.find((x) => x.date === d);
          if (existing) {
            return { steps: s.steps.map((x) => (x.date === d ? entry : x)) };
          }
          return { steps: [...s.steps, entry] };
        });
        get().pushStepsToSupabase(entry);
        
        // Also update activity for unified view
        get().addActivity({
          type: 'steps',
          label: 'Qadamlar',
          date: d,
          value: steps,
          unit: 'steps',
          kcalBurned: Math.round(steps * 0.04),
        });
      },
      stepsForDate: (date) => get().steps.find((x) => x.date === date)?.steps ?? 0,

      addActivity: (p) => {
        const entry: ActivityEntry = { ...p, id: uid(), addedAt: Date.now() };
        set((s) => {
          // If it's a singleton activity like steps, replace it for that date
          if (p.type === 'steps') {
            return { activities: [...s.activities.filter(x => !(x.type === 'steps' && x.date === p.date)), entry] };
          }
          return { activities: [...s.activities, entry] };
        });
        get().pushActivityToSupabase(entry);
      },
      removeActivity: (id) => {
        set((s) => ({ activities: s.activities.filter(x => x.id !== id) }));
        get().deleteActivityFromSupabase(id);
      },
      activitiesForDate: (date) => (get().activities || []).filter(x => x.date === date),
      totalBurnedKcal: (date) => (get().activities || []).filter(x => x.date === date).reduce((sum, x) => sum + (x.kcalBurned || 0), 0),

      clearAll: () => set({ entries: [], water: [], weight: [], steps: [], activities: [] }),

      pullFromSupabase: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const uid = session.user.id;

        // Pull Diary
        const { data: diaryData } = await supabase.from('diary_entries').select('*').eq('user_id', uid);
        if (diaryData) {
          const mapped: DiaryEntry[] = diaryData.map((d: any) => ({
            id: d.id,
            foodSlug: d.food_id,
            foodName: d.name,
            mealType: d.meal_type as MealType,
            date: d.entry_date,
            addedAt: new Date(d.created_at).getTime(),
            quantity: d.amount,
            unit: d.unit as Unit,
            grams: d.grams,
            kcal: d.kcal,
            protein: d.protein,
            carbs: d.carbs,
            fat: d.fat,
            micros: d.micros || {},
          }));
          set((s) => ({
            entries: [...s.entries.filter(e => !mapped.find(m => m.id === e.id)), ...mapped]
          }));
        }

        // Pull Water
        const { data: waterData } = await supabase.from('water_logs').select('*').eq('user_id', uid);
        if (waterData) {
          const mapped: WaterEntry[] = waterData.map((w: any) => ({ id: w.id, date: w.entry_date, addedAt: new Date(w.created_at).getTime(), ml: w.amount_ml }));
          set((s) => ({
            water: [...s.water.filter(e => !mapped.find(m => m.id === e.id)), ...mapped]
          }));
        }

        // Pull Weight
        const { data: weightData } = await supabase.from('weight_logs').select('*').eq('user_id', uid);
        if (weightData) {
          const mapped: WeightEntry[] = weightData.map((w: any) => ({ id: w.id, date: w.entry_date, addedAt: new Date(w.created_at).getTime(), kg: w.weight_kg, note: w.note }));
          set((s) => ({
            weight: [...s.weight.filter(e => !mapped.find(m => m.id === e.id)), ...mapped]
          }));
        }

        // Pull Steps
        const { data: stepsData } = await supabase.from('steps_logs').select('*').eq('user_id', uid);
        if (stepsData) {
          const mapped: StepEntry[] = stepsData.map((s: any) => ({ date: s.entry_date, steps: s.steps }));
          set((s) => ({
            steps: [...s.steps.filter(e => !mapped.find(m => m.date === e.date)), ...mapped]
          }));
        }

        // Pull Activities
        const { data: actData } = await supabase.from('activity_logs').select('*').eq('user_id', uid);
        if (Array.isArray(actData)) {
          const mapped: ActivityEntry[] = actData.map(a => ({
            id: a.id,
            type: a.activity_type,
            label: a.label,
            date: a.entry_date,
            value: a.amount,
            unit: a.unit as any,
            kcalBurned: Number(a.kcal_burned) || 0,
            addedAt: new Date(a.created_at).getTime(),
          }));
          set((s) => ({
            activities: [...s.activities.filter(e => !mapped.find(m => m.id === e.id)), ...mapped]
          }));
        }
      },

      pushAllToSupabase: async () => {
        const { entries, water, weight, steps, activities } = get();
        for (const e of entries) await get().pushEntryToSupabase(e);
        for (const w of water) await get().pushWaterToSupabase(w);
        for (const wg of weight) await get().pushWeightToSupabase(wg);
        for (const s of steps) await get().pushStepsToSupabase(s);
        for (const a of activities) await get().pushActivityToSupabase(a);
      },

      pushEntryToSupabase: async (e) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        await supabase.from('diary_entries').upsert({
          id: e.id,
          user_id: session.user.id,
          food_id: e.foodSlug,
          name: e.foodName || e.note || 'Unnamed',
          kcal: e.kcal,
          protein: e.protein,
          fat: e.fat,
          carbs: e.carbs,
          grams: e.grams,
          micros: e.micros,
          amount: e.quantity,
          unit: e.unit,
          meal_type: e.mealType,
          entry_date: e.date,
        });
      },

      deleteEntryFromSupabase: async (id) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        await supabase.from('diary_entries').delete().eq('id', id).eq('user_id', session.user.id);
      },

      pushWaterToSupabase: async (e) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        await supabase.from('water_logs').upsert({
          id: e.id,
          user_id: session.user.id,
          amount_ml: e.ml,
          entry_date: e.date,
        });
      },

      deleteWaterFromSupabase: async (id) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        await supabase.from('water_logs').delete().eq('id', id).eq('user_id', session.user.id);
      },

      pushWeightToSupabase: async (e) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        // 1. Log to history
        await supabase.from('weight_logs').upsert({
          id: e.id,
          user_id: session.user.id,
          weight_kg: e.kg,
          note: e.note,
          entry_date: e.date,
        });

        // 2. Update main profile weight in Supabase
        await supabase.from('profiles').update({
          weight: e.kg,
          updated_at: new Date().toISOString(),
        }).eq('id', session.user.id);

        // 3. Update local profile store
        useProfile.getState().updateProfile({ weight: e.kg });
      },

      pushStepsToSupabase: async (e) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        await supabase.from('steps_logs').upsert({
          user_id: session.user.id,
          steps: e.steps,
          entry_date: e.date,
        });
      },

      pushActivityToSupabase: async (a: ActivityEntry) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        await supabase.from('activity_logs').upsert({
          id: a.id,
          user_id: session.user.id,
          activity_type: a.type,
          label: a.label,
          amount: a.value,
          unit: a.unit,
          kcal_burned: a.kcalBurned,
          entry_date: a.date,
        });
      },

      deleteActivityFromSupabase: async (id: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        await supabase.from('activity_logs').delete().eq('id', id).eq('user_id', session.user.id);
      },
    }),
    { name: 'fit-diary' },
  ),
);

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
