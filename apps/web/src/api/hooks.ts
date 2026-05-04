/** React Query hooks for Supabase endpoints. Use these in screens. */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type {
  FoodDetail, FoodSummary,
} from '@fit/shared-types';

// ─── Foods ───────────────────────────────────────────────
const STORAGE_URL = 'https://vuxpysphjpqpnutpfbux.supabase.co/storage/v1/object/public/foods';

export function useSearchFoods(q: string, lang: string, enabled = true) {
  return useQuery({
    queryKey: ['uq_products', 'search', q, lang],
    queryFn: async () => {
      // Querying the new unique products table directly
      const { data, error } = await supabase
        .from('uq_products')
        .select('*')
        .ilike('name_uz', `%${q}%`)
        .limit(50);

      if (error) throw error;
      
      return (data as any[]).map(food => ({
        id: food.slug,
        name: food.name_uz,
        emoji: food.emoji,
        category: food.category,
        source: 'uz',
        kcalPer100g: food.per_100g.kcal,
        proteinG: food.per_100g.protein,
        carbsG: food.per_100g.carbs,
        fatG: food.per_100g.fat,
        defaultUnit: food.default_unit || 'g',
        defaultQty: 100,
        isRecipe: food.per_100g.type === 'recipe',
        photoUrl: `${STORAGE_URL}/${food.slug}.jpeg`,
      })) as FoodSummary[];
    },
    enabled: enabled && q.length > 0,
    staleTime: 60_000,
  });
}

export function useFood(id: string | undefined) {
  return useQuery({
    queryKey: ['uq_products', id],
    queryFn: async () => {
      // First try to find in uq_products
      const { data: food, error: foodError } = await supabase
        .from('uq_products')
        .select('*')
        .eq('slug', id)
        .maybeSingle();
      
      if (food) {
          return {
            id: food.slug as any,
            name: food.name_uz,
            emoji: food.emoji,
            category: food.category,
            source: 'uz',
            defaultUnit: food.default_unit || 'g',
            defaultQty: 100,
            kcalPer100g: food.per_100g.kcal,
            proteinG: food.per_100g.protein,
            carbsG: food.per_100g.carbs,
            fatG: food.per_100g.fat,
            gramsPerUnit: food.grams_per_unit,
            isRecipe: false,
            nutrients: {
              kcal: food.per_100g.kcal,
              protein: food.per_100g.protein,
              carbs: food.per_100g.carbs,
              fat: food.per_100g.fat,
              ...(food.per_100g.micros || {}),
            },
            photoUrl: `${STORAGE_URL}/${food.slug}.jpeg`,
          } as FoodDetail;
      }

      // If not found, try recipes
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .select('*, recipe_ingredients(*, uq_products:foods(*))') // Note: related table might still be named 'foods' in foreign keys, but we can't easily change DB relationships here.
        .eq('slug', id)
        .maybeSingle();

      if (recipe) {
        return {
          id: recipe.slug as any,
          name: recipe.name_uz,
          emoji: recipe.emoji,
          category: recipe.category,
          source: 'uz',
          defaultUnit: recipe.default_unit || 'serving',
          defaultQty: 1,
          kcalPer100g: recipe.kcal_per_100g,
          proteinG: recipe.protein_per_100g,
          carbsG: recipe.carbs_per_100g,
          fatG: recipe.fat_per_100g,
          gramsPerUnit: recipe.grams_per_unit || recipe.serving_grams,
          isRecipe: true,
          nutrients: {
            kcal: recipe.kcal_per_100g,
            protein: recipe.protein_per_100g,
            carbs: recipe.carbs_per_100g,
            fat: recipe.fat_per_100g,
          },
          photoUrl: `${STORAGE_URL}/${recipe.slug}.jpeg`,
        } as FoodDetail;
      }

      throw new Error('Food not found');
    },
    enabled: id !== undefined,
  });
}

export function useFoods(slugs: string[]) {
  return useQuery({
    queryKey: ['uq_products', 'batch', slugs.join(',')],
    queryFn: async () => {
      if (slugs.length === 0) return [];
      
      const [foodsRes, recipesRes] = await Promise.all([
        supabase.from('uq_products').select('*').in('slug', slugs),
        supabase.from('recipes').select('*').in('slug', slugs),
      ]);

      const results: FoodDetail[] = [];
      
      if (foodsRes.data) {
        (foodsRes.data as any[]).forEach(food => {
          results.push({
            id: food.slug as any,
            name: food.name_uz,
            emoji: food.emoji,
            category: food.category,
            source: 'uz',
            defaultUnit: food.default_unit || 'g',
            defaultQty: 100,
            kcalPer100g: food.per_100g.kcal,
            proteinG: food.per_100g.protein,
            carbsG: food.per_100g.carbs,
            fatG: food.per_100g.fat,
            gramsPerUnit: food.grams_per_unit,
            isRecipe: false,
            nutrients: {
              kcal: food.per_100g.kcal,
              protein: food.per_100g.protein,
              carbs: food.per_100g.carbs,
              fat: food.per_100g.fat,
              ...(food.per_100g.micros || {}),
            },
            photoUrl: `${STORAGE_URL}/${food.slug}.jpeg`,
          } as FoodDetail);
        });
      }

      if (recipesRes.data) {
        (recipesRes.data as any[]).forEach(recipe => {
          results.push({
            id: recipe.slug as any,
            name: recipe.name_uz,
            emoji: recipe.emoji,
            category: recipe.category,
            source: 'uz',
            defaultUnit: recipe.default_unit || 'serving',
            defaultQty: 1,
            kcalPer100g: recipe.kcal_per_100g,
            proteinG: recipe.protein_per_100g,
            carbsG: recipe.carbs_per_100g,
            fatG: recipe.fat_per_100g,
            gramsPerUnit: recipe.grams_per_unit || recipe.serving_grams,
            isRecipe: true,
            nutrients: {
              kcal: recipe.kcal_per_100g,
              protein: recipe.protein_per_100g,
              carbs: recipe.carbs_per_100g,
              fat: recipe.fat_per_100g,
            },
            photoUrl: `${STORAGE_URL}/${recipe.slug}.jpeg`,
          } as FoodDetail);
        });
      }

      return results;
    },
    enabled: slugs.length > 0,
  });
}
