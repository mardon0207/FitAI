import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { Profile, Goal, ActivityLevel, Gender } from '@fit/shared-types';

interface ProfileState extends Profile {
  hasCompletedQuiz: boolean;
  updateProfile: (p: Partial<ProfileState>) => void;
  pullFromSupabase: () => Promise<void>;
  pushToSupabase: () => Promise<void>;
  reset: () => void;
}

export const useProfile = create<ProfileState>()(
  persist(
    (set, get) => ({
      hasCompletedQuiz: false,
      name: '',
      email: '',
      gender: 'male',
      birthDate: '1990-01-01',
      height: 175,
      weight: 70,
      goal: 'maintain',
      activityLevel: 'moderate',
      age: 30,
      targetKcal: 2000,
      targetProtein: 150,
      targetCarbs: 200,
      targetFat: 65,

      updateProfile: (p) => {
        set((state) => {
          const next = { ...state, ...p };
          if (p.age !== undefined) {
            const year = new Date().getFullYear() - p.age;
            next.birthDate = `${year}-01-01`;
          }
          return next;
        });
        get().pushToSupabase();
      },

      pullFromSupabase: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (data && !error) {
          const birthDate = data.birth_date || get().birthDate;
          const age = birthDate ? Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : get().age;
          
          set({
            name: data.full_name || session.user.user_metadata?.full_name || get().name,
            email: session.user.email || '',
            gender: (data.gender as any) || get().gender,
            birthDate,
            age,
            height: Number(data.height) || get().height,
            weight: Number(data.weight) || get().weight,
            goal: (data.goal as any) || get().goal,
            activityLevel: (data.activity_level as any) || get().activityLevel,
            hasCompletedQuiz: true,
          });
        }
      },

      pushToSupabase: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const s = get();
        await supabase.from('profiles').upsert({
          id: session.user.id,
          full_name: s.name,
          gender: s.gender,
          birth_date: s.birthDate,
          height: s.height,
          weight: s.weight,
          goal: s.goal,
          activity_level: s.activityLevel,
          updated_at: new Date().toISOString(),
        });
      },

      reset: () => {
        set({
          hasCompletedQuiz: false,
          name: '',
          email: '',
          gender: 'male',
          birthDate: '1990-01-01',
          age: 30,
          height: 175,
          weight: 70,
          goal: 'maintain',
          activityLevel: 'moderate',
          targetKcal: 2000,
          targetProtein: 150,
          targetCarbs: 200,
          targetFat: 65,
        });
      },
    }),
    { name: 'fit-profile' }
  )
);
