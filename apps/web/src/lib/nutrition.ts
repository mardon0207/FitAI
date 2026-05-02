import type { Unit, ActivityLevel, Goal, Gender } from '@fit/shared-types';

/** 
 * Units & Grams Resolution 
 */

export const ALL_UNITS: Unit[] = ['g', 'ml', 'piece', 'cup', 'tbsp', 'tsp', 'serving'];

export function resolveGrams(qty: number, unit: Unit, gramsPerUnit?: number | null): number {
  if (unit === 'g' || unit === 'ml') return qty;
  
  const defaults: Record<string, number> = {
    piece: 100,
    cup: 240,
    tbsp: 15,
    tsp: 5,
    serving: 100,
  };

  const perUnit = gramsPerUnit ?? defaults[unit] ?? 100;
  return qty * perUnit;
}

export function scaleNutrients(nutrients: Record<string, number>, grams: number): Record<string, number> {
  const factor = grams / 100;
  return Object.fromEntries(
    Object.entries(nutrients).map(([k, v]) => [k, v * factor])
  );
}

export function unitLabelUz(u: Unit): string {
  return ({
    g: 'gramm', ml: 'millilitr', piece: 'dona', cup: 'piyola',
    tbsp: 'osh qoshiq', tsp: 'choy qoshiq', serving: 'porsiya',
  } as Record<string, string>)[u] ?? u;
}

/**
 * TDEE & Macros (Mifflin-St Jeor)
 */

const ACTIVITY_MULT: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
  low: 1.2,
  medium: 1.55,
  high: 1.725,
};

const GOAL_DELTA: Record<Goal, number> = {
  lose: -500,
  maintain: 0,
  gain: 300,
};

export interface ProfileInput {
  gender: Gender;
  ageYears: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export function calculateBmr(p: ProfileInput): number {
  const base = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.ageYears;
  return p.gender === 'male' ? base + 5 : base - 161;
}

export function calculateTdee(p: ProfileInput): number {
  return calculateBmr(p) * (ACTIVITY_MULT[p.activityLevel] || 1.2);
}

export function calculateDailyTargets(p: ProfileInput) {
  const base = Math.round(calculateTdee(p));
  const kcal = Math.max(1200, base + GOAL_DELTA[p.goal]);
  const proteinPerKg = p.activityLevel === 'active' || p.activityLevel === 'very_active' || p.activityLevel === 'high' ? 1.8 : 1.4;
  const proteinG = Math.round(p.weightKg * proteinPerKg);
  const fatG = Math.round((kcal * 0.25) / 9);
  const carbsKcal = kcal - proteinG * 4 - fatG * 9;
  const carbsG = Math.max(0, Math.round(carbsKcal / 4));
  return { bmr: Math.round(calculateBmr(p)), tdee: base, kcal, protein: proteinG, carbs: carbsG, fat: fatG };
}

/**
 * RDA (Recommended Daily Allowance)
 */

export interface RdaEntry {
  key: string;
  unit: string;
  rda: number;
  ul?: number;
  names: { uz: string; ru: string; en: string };
}

export const RDA_ADULT: Record<string, RdaEntry> = {
  protein: { key: 'protein', unit: 'g', rda: 60, names: { uz: 'Oqsil', ru: 'Белки', en: 'Protein' } },
  carbs: { key: 'carbs', unit: 'g', rda: 275, names: { uz: 'Uglevod', ru: 'Углеводы', en: 'Carbs' } },
  fat: { key: 'fat', unit: 'g', rda: 78, names: { uz: "Yog'", ru: 'Жиры', en: 'Fat' } },
  fiber: { key: 'fiber', unit: 'g', rda: 28, names: { uz: 'Tolali', ru: 'Клетчатка', en: 'Fiber' } },
  vit_c: { key: 'vit_c', unit: 'mg', rda: 90, ul: 2000, names: { uz: 'Vitamin C', ru: 'Витамин C', en: 'Vitamin C' } },
  vit_d: { key: 'vit_d', unit: 'mcg', rda: 15, ul: 100, names: { uz: 'Vitamin D', ru: 'Витамин D', en: 'Vitamin D' } },
  iron: { key: 'iron', unit: 'mg', rda: 11, ul: 45, names: { uz: 'Temir', ru: 'Железо', en: 'Iron' } },
  calcium: { key: 'calcium', unit: 'mg', rda: 1000, ul: 2500, names: { uz: 'Kalsiy', ru: 'Кальций', en: 'Calcium' } },
  magnesium: { key: 'magnesium', unit: 'mg', rda: 400, ul: 350, names: { uz: 'Magniy', ru: 'Магний', en: 'Magnesium' } },
  potassium: { key: 'potassium', unit: 'mg', rda: 3400, names: { uz: 'Kaliy', ru: 'Калий', en: 'Potassium' } },
};

/**
 * Composer Constants
 */
export const OIL_DENSITY = 0.92;
export const OIL_KCAL_PER_G = 8.84;
