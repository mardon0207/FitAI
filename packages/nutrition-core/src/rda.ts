/**
 * Recommended Daily Allowance (RDA) table for adults.
 *
 * Sources: NIH ODS Fact Sheets + EFSA DRVs, averaged where gender-specific values differ.
 * Used by the deficiency engine: compare user's daily intake to these targets,
 * flag deficiency (<50% for 3+ days) and excess (>200%).
 *
 * TODO (cheap model): specialize by age/gender/pregnancy.
 */

import type { Gender } from './tdee';

export interface RdaEntry {
  /** nutrient key (matches FoodNutrient.nutrient in DB). */
  key: string;
  /** unit (g | mg | mcg | IU). */
  unit: string;
  /** recommended daily amount for an adult. */
  rda: number;
  /** upper tolerable intake level (UL) — exceeding this can cause harm. */
  ul?: number;
  /** display name per language. */
  names: { uz: string; ru: string; en: string };
  /** deficiency consequences (used by the warning screen). */
  deficiencyConsequences?: { uz: string; ru: string; en: string };
  /** top food sources (slug refs to uz_ingredients when available). */
  topSources?: string[];
}

export const RDA_ADULT: Record<string, RdaEntry> = {
  protein: {
    key: 'protein', unit: 'g', rda: 60,
    names: { uz: 'Oqsil', ru: 'Белки', en: 'Protein' },
  },
  carbs: {
    key: 'carbs', unit: 'g', rda: 275,
    names: { uz: 'Uglevod', ru: 'Углеводы', en: 'Carbs' },
  },
  fat: {
    key: 'fat', unit: 'g', rda: 78,
    names: { uz: "Yog'", ru: 'Жиры', en: 'Fat' },
  },
  fiber: {
    key: 'fiber', unit: 'g', rda: 28,
    names: { uz: 'Tolali', ru: 'Клетчатка', en: 'Fiber' },
  },
  vit_a: {
    key: 'vit_a', unit: 'mcg', rda: 900, ul: 3000,
    names: { uz: 'Vitamin A', ru: 'Витамин A', en: 'Vitamin A' },
    deficiencyConsequences: {
      uz: "Ko'z muammolari, immuniteti zaifligi",
      ru: 'Проблемы со зрением, слабый иммунитет',
      en: 'Vision problems, weakened immunity',
    },
    topSources: ['uz_sabzi', 'uz_sariyog'],
  },
  vit_c: {
    key: 'vit_c', unit: 'mg', rda: 90, ul: 2000,
    names: { uz: 'Vitamin C', ru: 'Витамин C', en: 'Vitamin C' },
    deficiencyConsequences: {
      uz: 'Milk qon ketishi, yaralarning sekin bitishi, charchoq',
      ru: 'Кровоточивость дёсен, медленное заживление ран, усталость',
      en: 'Bleeding gums, slow wound healing, fatigue',
    },
    topSources: ['uz_bulgor_qalampir', 'uz_pomidor', 'uz_olma'],
  },
  vit_d: {
    key: 'vit_d', unit: 'mcg', rda: 15, ul: 100,
    names: { uz: 'Vitamin D', ru: 'Витамин D', en: 'Vitamin D' },
    deficiencyConsequences: {
      uz: 'Suyak zaifligi, mushak og\'rig\'i, depressiya',
      ru: 'Слабость костей, боль в мышцах, депрессия',
      en: 'Weak bones, muscle pain, depression',
    },
    topSources: ['uz_sut', 'uz_tuxum'],
  },
  vit_e: { key: 'vit_e', unit: 'mg', rda: 15, ul: 1000, names: { uz: 'Vitamin E', ru: 'Витамин E', en: 'Vitamin E' } },
  vit_k: { key: 'vit_k', unit: 'mcg', rda: 120, names: { uz: 'Vitamin K', ru: 'Витамин K', en: 'Vitamin K' } },
  vit_b1: { key: 'vit_b1', unit: 'mg', rda: 1.2, names: { uz: 'B1 (Tiamin)', ru: 'B1 (Тиамин)', en: 'B1 (Thiamin)' } },
  vit_b2: { key: 'vit_b2', unit: 'mg', rda: 1.3, names: { uz: 'B2 (Riboflavin)', ru: 'B2 (Рибофлавин)', en: 'B2' } },
  vit_b3: { key: 'vit_b3', unit: 'mg', rda: 16, ul: 35, names: { uz: 'B3 (Niacin)', ru: 'B3 (Ниацин)', en: 'B3' } },
  vit_b6: { key: 'vit_b6', unit: 'mg', rda: 1.7, ul: 100, names: { uz: 'B6', ru: 'B6', en: 'B6' } },
  folate: { key: 'folate', unit: 'mcg', rda: 400, ul: 1000, names: { uz: 'Folat', ru: 'Фолат', en: 'Folate' } },
  vit_b12: {
    key: 'vit_b12', unit: 'mcg', rda: 2.4,
    names: { uz: 'B12', ru: 'B12', en: 'B12' },
    deficiencyConsequences: {
      uz: 'Anemia, xotira muammolari, nerv buzilishi, charchoq',
      ru: 'Анемия, проблемы с памятью, нарушения нервной системы, усталость',
      en: 'Anemia, memory problems, nerve damage, fatigue',
    },
    topSources: ['uz_mol_goshti', 'uz_tuxum', 'uz_sut'],
  },
  calcium: { key: 'calcium', unit: 'mg', rda: 1000, ul: 2500, names: { uz: 'Kalsiy', ru: 'Кальций', en: 'Calcium' } },
  iron: {
    key: 'iron', unit: 'mg', rda: 11, ul: 45,
    names: { uz: 'Temir', ru: 'Железо', en: 'Iron' },
    deficiencyConsequences: {
      uz: 'Anemia, holsizlik, teri oqarishi, soch to\'kilishi',
      ru: 'Анемия, слабость, бледная кожа, выпадение волос',
      en: 'Anemia, weakness, pale skin, hair loss',
    },
    topSources: ['uz_mol_goshti', 'uz_qoy_goshti', 'uz_zira'],
  },
  magnesium: { key: 'magnesium', unit: 'mg', rda: 400, ul: 350, names: { uz: 'Magniy', ru: 'Магний', en: 'Magnesium' } },
  potassium: { key: 'potassium', unit: 'mg', rda: 3400, names: { uz: 'Kaliy', ru: 'Калий', en: 'Potassium' } },
  zinc: { key: 'zinc', unit: 'mg', rda: 11, ul: 40, names: { uz: 'Sink', ru: 'Цинк', en: 'Zinc' } },
  sodium: { key: 'sodium', unit: 'mg', rda: 2300, ul: 2300, names: { uz: 'Natriy', ru: 'Натрий', en: 'Sodium' } },
};

export type Status = 'deficient' | 'low' | 'ok' | 'excess';

/**
 * Evaluate a nutrient intake against RDA.
 * < 40% = deficient, 40-70% = low, 70-120% = ok, > 200% of UL = excess.
 */
export function evaluate(key: string, intake: number): { percent: number; status: Status } | null {
  const entry = RDA_ADULT[key];
  if (!entry) return null;
  const percent = Math.round((intake / entry.rda) * 100);
  let status: Status = 'ok';
  if (percent < 40) status = 'deficient';
  else if (percent < 70) status = 'low';
  else if (entry.ul && intake > entry.ul * 2) status = 'excess';
  return { percent, status };
}

/** Adult RDA defaults — no gender specialization yet (TODO). */
export function rdaFor(_gender: Gender): typeof RDA_ADULT {
  return RDA_ADULT;
}
