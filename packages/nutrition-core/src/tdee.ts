/** BMR + TDEE + daily calorie target based on Mifflin-St Jeor. */

export type Gender = 'male' | 'female';
export type Activity = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'lose' | 'maintain' | 'gain';

const ACTIVITY_MULT: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
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
  activity: Activity;
  goal: Goal;
}

export interface DailyTargets {
  bmr: number;
  tdee: number;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

/** Mifflin-St Jeor BMR */
export function bmr({ gender, ageYears, heightCm, weightKg }: ProfileInput): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  return gender === 'male' ? base + 5 : base - 161;
}

export function tdee(p: ProfileInput): number {
  return bmr(p) * ACTIVITY_MULT[p.activity];
}

/**
 * Default macro split for calorie target:
 *  - protein: 1.8 g / kg body weight (active) or 1.4 g/kg (sedentary/light)
 *  - fat: 25% of kcal
 *  - carbs: remainder
 */
export function dailyTargets(p: ProfileInput): DailyTargets {
  const base = Math.round(tdee(p));
  const kcal = Math.max(1200, base + GOAL_DELTA[p.goal]);
  const proteinPerKg = p.activity === 'active' || p.activity === 'very_active' ? 1.8 : 1.4;
  const proteinG = Math.round(p.weightKg * proteinPerKg);
  const fatG = Math.round((kcal * 0.25) / 9);
  const carbsKcal = kcal - proteinG * 4 - fatG * 9;
  const carbsG = Math.max(0, Math.round(carbsKcal / 4));
  return { bmr: Math.round(bmr(p)), tdee: base, kcal, proteinG, carbsG, fatG };
}

/** Simple step → calories burned estimate. */
export function stepsToKcal(steps: number, weightKg: number): number {
  // Approximation: 1 step ≈ 0.04 kcal for a 70kg person, scales linearly with weight.
  return Math.round(steps * 0.04 * (weightKg / 70));
}
