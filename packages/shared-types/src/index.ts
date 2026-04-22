/**
 * @fit/shared-types — API contract types shared between web + api.
 *
 * Keep in sync with `apps/api/app/routes/*.py` Pydantic models.
 * TODO (cheap model): auto-generate from OpenAPI using `openapi-typescript`.
 */

export type Lang = 'uz' | 'ru' | 'en';
export type Theme = 'light' | 'dark' | 'auto';

export type Unit = 'g' | 'ml' | 'piece' | 'cup' | 'tbsp' | 'tsp' | 'serving';
export type FoodSource = 'usda' | 'off' | 'uz' | 'user';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodSummary {
  id: number;
  name: string;
  brand?: string | null;
  category?: string | null;
  emoji?: string | null;
  source: FoodSource;
  default_unit: Unit;
  default_qty: number;
  kcal_per_100g?: number | null;
  protein_g?: number | null;
  carbs_g?: number | null;
  fat_g?: number | null;
}

export interface FoodDetail extends FoodSummary {
  grams_per_unit?: number | null;
  is_recipe: boolean;
  nutrients: Record<string, number>;
}

export interface ComposerIngredient {
  food_id: number;
  quantity: number;
  unit: Unit;
  cooking?: 'raw' | 'boiled' | 'fried' | 'baked' | 'grilled' | null;
  added_oil_ml?: number | null;
}

export interface ComposedTotals {
  total_grams: number;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  micronutrients: Record<string, number>;
}

export interface DiaryEntry {
  id: number;
  food_id: number | null;
  meal_type: MealType;
  logged_at: string;
  log_date: string;
  quantity: number;
  unit: Unit;
  grams: number;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  note?: string | null;
}
