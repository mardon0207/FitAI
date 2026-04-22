/**
 * Ingredient Composer math — sum up nutrients for a user-built meal.
 *
 * This mirrors the backend `/api/ingredients/compose` endpoint so the UI can
 * show a *live preview* of totals before hitting the network.
 */

import { toGrams, scaleNutrient, type Unit, type UnitContext } from './units';

export interface NutrientMap {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  [key: string]: number;
}

export interface ComposerIngredient {
  id: string | number;
  name: string;
  quantity: number;
  unit: Unit;
  /** nutrients per 100g — from Food DB */
  per100g: Partial<NutrientMap>;
  /** unit context */
  ctx?: UnitContext;
  /** cooking method affects oil added */
  cooking?: 'raw' | 'boiled' | 'fried' | 'baked' | 'grilled';
  addedOilMl?: number;
}

export interface ComposedTotals {
  totalGrams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  micronutrients: Record<string, number>;
}

/** Sunflower oil nutrient profile — per 100g = per 100ml × density (0.92). */
const OIL_PER_100G = { kcal: 884, fat: 100, vit_e: 41.08 };
const OIL_DENSITY = 0.92;

export function compose(ingredients: ComposerIngredient[]): ComposedTotals {
  const totals: ComposedTotals = {
    totalGrams: 0,
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    micronutrients: {},
  };

  for (const ing of ingredients) {
    const grams = toGrams(ing.quantity, ing.unit, ing.ctx);
    totals.totalGrams += grams;
    for (const [key, per100] of Object.entries(ing.per100g)) {
      if (per100 === undefined) continue;
      const v = scaleNutrient(per100, grams);
      addMacroOrMicro(totals, key, v);
    }
    // Fried → add oil by volume
    if (ing.cooking === 'fried' && ing.addedOilMl) {
      const oilG = ing.addedOilMl * OIL_DENSITY;
      totals.totalGrams += oilG;
      for (const [key, per100] of Object.entries(OIL_PER_100G)) {
        addMacroOrMicro(totals, key, scaleNutrient(per100, oilG));
      }
    }
  }

  // Round for display
  totals.kcal = Math.round(totals.kcal);
  totals.protein = round1(totals.protein);
  totals.carbs = round1(totals.carbs);
  totals.fat = round1(totals.fat);
  for (const k in totals.micronutrients) {
    const current = totals.micronutrients[k];
    if (current !== undefined) totals.micronutrients[k] = round1(current);
  }

  return totals;
}

function addMacroOrMicro(totals: ComposedTotals, key: string, value: number): void {
  if (key === 'kcal' || key === 'protein' || key === 'carbs' || key === 'fat') {
    totals[key] += value;
  } else {
    totals.micronutrients[key] = (totals.micronutrients[key] ?? 0) + value;
  }
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
