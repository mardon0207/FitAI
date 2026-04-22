/**
 * Composer draft store — holds the current in-progress meal so navigating to
 * Search and back doesn't lose user's work. Cleared after save.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MealType, Unit } from '@fit/shared-types';

export type Cooking = 'raw' | 'boiled' | 'fried' | 'baked' | 'grilled';

export interface DraftIngredient {
  id: string;
  slug: string;
  quantity: number;
  unit: Unit;
  cooking: Cooking;
  addedOilMl?: number;
}

interface ComposerState {
  name: string;
  mealType: MealType;
  ingredients: DraftIngredient[];

  setName: (name: string) => void;
  setMealType: (m: MealType) => void;
  addIngredient: (slug: string, defaultUnit: Unit) => void;
  updateIngredient: (id: string, patch: Partial<DraftIngredient>) => void;
  removeIngredient: (id: string) => void;
  reset: () => void;
}

const DEFAULT_STATE = {
  name: 'Mening ovqatim',
  mealType: 'lunch' as MealType,
  ingredients: [] as DraftIngredient[],
};

export const useComposer = create<ComposerState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setName: (name) => set({ name }),
      setMealType: (mealType) => set({ mealType }),
      addIngredient: (slug, defaultUnit) => set((s) => ({
        ingredients: [
          ...s.ingredients,
          {
            id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
            slug,
            quantity: 1,
            unit: defaultUnit,
            cooking: 'raw',
          },
        ],
      })),
      updateIngredient: (id, patch) => set((s) => ({
        ingredients: s.ingredients.map((i) => (i.id === id ? { ...i, ...patch } : i)),
      })),
      removeIngredient: (id) => set((s) => ({
        ingredients: s.ingredients.filter((i) => i.id !== id),
      })),
      reset: () => set(DEFAULT_STATE),
    }),
    { name: 'fit-composer-draft' },
  ),
);
