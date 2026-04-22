/** Unit conversion for ingredient portions. */

export type Unit = 'g' | 'ml' | 'piece' | 'cup' | 'tbsp' | 'tsp' | 'serving';

/** Default volume→gram approximations when density is unknown (1 ml ≈ 1 g for liquids). */
const VOLUME_TO_ML: Record<Exclude<Unit, 'g' | 'ml' | 'piece' | 'serving'>, number> = {
  cup: 200, // piyola
  tbsp: 15, // osh qoshiq
  tsp: 5, // chay qoshiq
};

export interface UnitContext {
  /** grams corresponding to 1 "piece" of this food (egg=50, apple=180). */
  gramsPerPiece?: number | null;
  /** grams corresponding to 1 "serving" (recipe portion). */
  gramsPerServing?: number | null;
  /** density in g/ml for liquids (milk=1.03, oil=0.92). Defaults to 1.0. */
  densityGPerMl?: number;
}

/** Convert any `Unit` + `quantity` to grams for nutrient scaling. */
export function toGrams(qty: number, unit: Unit, ctx: UnitContext = {}): number {
  const density = ctx.densityGPerMl ?? 1;
  switch (unit) {
    case 'g':
      return qty;
    case 'ml':
      return qty * density;
    case 'piece':
      return qty * (ctx.gramsPerPiece ?? 100);
    case 'serving':
      return qty * (ctx.gramsPerServing ?? 100);
    case 'cup':
    case 'tbsp':
    case 'tsp':
      return qty * VOLUME_TO_ML[unit] * density;
  }
}

export function scaleNutrient(per100g: number, grams: number): number {
  return (per100g * grams) / 100;
}
