/** React Query hooks for API endpoints. Use these in screens. */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from './client';
import { useAuth } from '@/stores/auth';
import type {
  ComposedTotals, ComposerIngredient, DiaryEntry, FoodDetail, FoodSummary, MealType, Unit,
} from '@fit/shared-types';

// ─── Auth ────────────────────────────────────────────────
interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
}

export function useLogin() {
  const setAuth = useAuth((s) => s.setAuth);
  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      apiFetch<AuthResponse>('/api/auth/login', { method: 'POST', body }),
    onSuccess: (data) => setAuth(data.access_token, data.user_id),
  });
}

export function useSignup() {
  const setAuth = useAuth((s) => s.setAuth);
  return useMutation({
    mutationFn: (body: { email: string; password: string; name?: string }) =>
      apiFetch<AuthResponse>('/api/auth/signup', { method: 'POST', body }),
    onSuccess: (data) => setAuth(data.access_token, data.user_id),
  });
}

// ─── Foods ───────────────────────────────────────────────
export function useSearchFoods(q: string, lang: string, enabled = true) {
  return useQuery({
    queryKey: ['foods', 'search', q, lang],
    queryFn: ({ signal }) =>
      apiFetch<FoodSummary[]>('/api/foods/search', { query: { q, lang }, signal }),
    enabled: enabled && q.length > 0,
    staleTime: 60_000,
  });
}

export function useFood(id: number | string | undefined) {
  return useQuery({
    queryKey: ['foods', id],
    queryFn: ({ signal }) => apiFetch<FoodDetail>(`/api/foods/${id}`, { signal }),
    enabled: id !== undefined,
  });
}

// ─── Composer ────────────────────────────────────────────
export function useCompose() {
  return useMutation({
    mutationFn: (ingredients: ComposerIngredient[]) =>
      apiFetch<ComposedTotals>('/api/ingredients/compose', {
        method: 'POST',
        body: { ingredients },
      }),
  });
}

// ─── Diary ───────────────────────────────────────────────
export interface TodaySummary {
  log_date: string;
  consumed_kcal: number;
  consumed_protein_g: number;
  consumed_carbs_g: number;
  consumed_fat_g: number;
  target_kcal: number | null;
  target_protein_g: number | null;
  target_carbs_g: number | null;
  target_fat_g: number | null;
  steps: number;
  kcal_burned: number;
  water_ml: number;
  weight_kg: number | null;
  meals: Record<MealType, DiaryEntry[]>;
}

export function useToday(targetDate?: string) {
  const token = useAuth((s) => s.token);
  return useQuery({
    queryKey: ['diary', 'today', targetDate ?? 'today'],
    queryFn: ({ signal }) =>
      apiFetch<TodaySummary>('/api/diary/today', {
        query: targetDate ? { date: targetDate } : undefined,
        signal,
      }),
    enabled: !!token,
    staleTime: 30_000,
  });
}

export function useAddEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      food_id: number;
      meal_type: MealType;
      quantity: number;
      unit: Unit;
      note?: string;
    }) =>
      apiFetch<DiaryEntry>('/api/diary/entry', { method: 'POST', body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diary'] }),
  });
}

export function useAddWater() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ml: number) => apiFetch<{ id: number }>('/api/diary/water', { method: 'POST', body: { ml } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diary'] }),
  });
}

export function useAddWeight() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { weight_kg: number; note?: string }) =>
      apiFetch<{ id: number }>('/api/diary/weight', { method: 'POST', body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diary'] }),
  });
}

export function useAddSteps() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (steps: number) =>
      apiFetch<{ id: number }>('/api/diary/steps', { method: 'POST', body: { steps } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diary'] }),
  });
}
