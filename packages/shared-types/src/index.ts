/**
 * @fit/shared-types — API contract types shared between web + api.
 * These types define the core data structures used throughout the FitAI ecosystem.
 */

export type Lang = 'uz' | 'ru' | 'en';
export type Theme = 'light' | 'dark' | 'auto';

export type Unit = 'g' | 'ml' | 'piece' | 'cup' | 'tbsp' | 'tsp' | 'serving';
export type FoodSource = 'usda' | 'off' | 'uz' | 'user';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodSummary {
  id: string | number;
  name: string;
  brand?: string | null;
  category?: string | null;
  emoji?: string | null;
  source: FoodSource;
  defaultUnit: Unit;
  defaultQty: number;
  kcalPer100g?: number | null;
  proteinG?: number | null;
  carbsG?: number | null;
  fatG?: number | null;
}

export interface FoodDetail extends FoodSummary {
  gramsPerUnit?: number | null;
  isRecipe: boolean;
  nutrients: Record<string, number>;
}

export interface DiaryEntry {
  id: string;
  foodSlug: string;
  foodName?: string;
  foodEmoji?: string;
  mealType: MealType;
  date: string;
  addedAt: number;
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

export interface WaterEntry {
  id: string;
  date: string;
  addedAt: number;
  ml: number;
}

export interface WeightEntry {
  id: string;
  date: string;
  addedAt: number;
  kg: number;
  note?: string;
}

export interface StepEntry {
  date: string;
  steps: number;
}

export interface ActivityEntry {
  id: string;
  type: string;
  label: string;
  date: string;
  value: number;
  unit: 'min' | 'steps' | 'reps';
  kcalBurned: number;
  addedAt: number;
}

export type Goal = 'lose' | 'maintain' | 'gain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | 'low' | 'medium' | 'high';
export type Gender = 'male' | 'female';

export interface Profile {
  id?: string;
  name: string;
  email: string;
  gender: Gender;
  birthDate: string;
  age: number;
  height: number;
  weight: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  targetKcal: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
}
