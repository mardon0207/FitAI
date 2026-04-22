/**
 * Local-first food database — loads JSON fixtures at import time, provides
 * search/lookup. When a backend is running, replace with React Query hooks.
 *
 * Nutrient values in fixtures are per 100g.
 */

import ingredientsJson from './uz_ingredients.json';
import recipesJson from './uz_recipes.json';

import type { Unit } from '@fit/shared-types';

// ─── Types ────────────────────────────────────────────────

export interface FoodItem {
  slug: string;
  name: string;           // Current-language display name
  namesAll: Record<string, string>;  // uz/ru/en
  category?: string;
  emoji?: string;
  /** If the user uploaded a photo to /public/foods/<slug>.png, we auto-use it. */
  photoUrl?: string;
  defaultUnit: Unit;
  gramsPerUnit?: number;  // e.g. 1 egg ≈ 50g
  per100g: Record<string, number>;
  isRecipe: boolean;
  /** For recipes — the composing ingredients and their raw grams. */
  ingredients?: Array<{ slug: string; grams: number }>;
  servings?: number;
  servingGrams?: number;
}

// ─── Load + normalize ────────────────────────────────────

interface RawIngredient {
  slug: string;
  names: { uz: string; ru: string; en: string };
  category?: string;
  emoji?: string;
  default_unit?: string;
  grams_per_unit?: number;
  per_100g: Record<string, number>;
}

interface RawRecipe {
  slug: string;
  names: { uz: string; ru: string; en: string };
  emoji?: string;
  category?: string;
  servings: number;
  serving_grams: number;
  default_unit?: string;
  grams_per_unit?: number;
  ingredients: Array<{ slug: string; grams: number }>;
}

function normalizeIngredient(raw: RawIngredient): FoodItem {
  return {
    slug: raw.slug,
    name: raw.names.uz,
    namesAll: raw.names,
    category: raw.category,
    emoji: raw.emoji,
    photoUrl: `/foods/${raw.slug}.png`,
    defaultUnit: (raw.default_unit ?? 'g') as Unit,
    gramsPerUnit: raw.grams_per_unit,
    per100g: raw.per_100g,
    isRecipe: false,
  };
}

/** Compute per-100g nutrients for a recipe by summing scaled ingredient values. */
function normalizeRecipe(raw: RawRecipe, ingredientIndex: Map<string, FoodItem>): FoodItem {
  const per100g: Record<string, number> = {};
  const totalGrams = raw.ingredients.reduce((sum, i) => sum + i.grams, 0);
  if (totalGrams > 0) {
    for (const part of raw.ingredients) {
      const ing = ingredientIndex.get(part.slug);
      if (!ing) continue;
      for (const [key, value] of Object.entries(ing.per100g)) {
        const contribution = (value * part.grams) / 100; // total for this ingredient
        per100g[key] = (per100g[key] ?? 0) + (contribution / totalGrams) * 100;
      }
    }
    for (const k of Object.keys(per100g)) {
      per100g[k] = Math.round(per100g[k]! * 100) / 100;
    }
  }
  return {
    slug: raw.slug,
    name: raw.names.uz,
    namesAll: raw.names,
    category: raw.category,
    emoji: raw.emoji,
    photoUrl: `/foods/${raw.slug}.png`,
    defaultUnit: (raw.default_unit ?? 'serving') as Unit,
    gramsPerUnit: raw.grams_per_unit ?? raw.serving_grams,
    per100g,
    isRecipe: true,
    ingredients: raw.ingredients,
    servings: raw.servings,
    servingGrams: raw.serving_grams,
  };
}

const ingredientsRaw = ingredientsJson.ingredients as unknown as RawIngredient[];
const recipesRaw = recipesJson.recipes as unknown as RawRecipe[];

const ingredientList: FoodItem[] = ingredientsRaw.map(normalizeIngredient);
const ingredientIndex = new Map(ingredientList.map((i) => [i.slug, i]));
const recipeList: FoodItem[] = recipesRaw.map((r) => normalizeRecipe(r, ingredientIndex));

export const ALL_FOODS: FoodItem[] = [...recipeList, ...ingredientList];
const BY_SLUG: Map<string, FoodItem> = new Map(ALL_FOODS.map((f) => [f.slug, f]));

// ─── API ─────────────────────────────────────────────────

export function getFood(slug: string): FoodItem | undefined {
  return BY_SLUG.get(slug);
}

export interface SearchOptions {
  lang?: 'uz' | 'ru' | 'en';
  category?: string;
  onlyRecipes?: boolean;
  onlyIngredients?: boolean;
  limit?: number;
}

/** Case-insensitive substring match across all language names. */
export function searchFoods(query: string, opts: SearchOptions = {}): FoodItem[] {
  const q = query.trim().toLowerCase();
  const lang = opts.lang ?? 'uz';
  const limit = opts.limit ?? 50;

  let pool = ALL_FOODS;
  if (opts.onlyRecipes) pool = pool.filter((f) => f.isRecipe);
  if (opts.onlyIngredients) pool = pool.filter((f) => !f.isRecipe);
  if (opts.category) pool = pool.filter((f) => f.category === opts.category);

  if (!q) return pool.slice(0, limit);

  const scored = pool
    .map((f) => {
      const primary = (f.namesAll[lang] ?? f.name).toLowerCase();
      const others = Object.values(f.namesAll).join(' ').toLowerCase();
      let score = 0;
      if (primary.startsWith(q)) score = 100;
      else if (primary.includes(q)) score = 50;
      else if (others.includes(q)) score = 20;
      return { food: f, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.food);
}

export function allCategories(): string[] {
  const set = new Set<string>();
  for (const f of ALL_FOODS) if (f.category) set.add(f.category);
  return [...set].sort();
}

export function recipes(): FoodItem[] {
  return recipeList;
}

/** Compute grams from a quantity + unit pair, using food's default context. */
export function resolveGrams(food: FoodItem, quantity: number, unit: Unit): number {
  const VOL_ML: Record<string, number> = { cup: 200, tbsp: 15, tsp: 5 };
  switch (unit) {
    case 'g': return quantity;
    case 'ml': return quantity;   // density ≈ 1 for MVP
    case 'piece': return quantity * (food.gramsPerUnit ?? 100);
    case 'serving': return quantity * (food.gramsPerUnit ?? food.servingGrams ?? 100);
    case 'cup':
    case 'tbsp':
    case 'tsp': return quantity * (VOL_ML[unit] ?? 0);
    default: return quantity;
  }
}

/** Scale nutrients for a given gram count. */
export function nutrientsForGrams(food: FoodItem, grams: number): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(food.per100g)) {
    out[k] = (v * grams) / 100;
  }
  return out;
}
