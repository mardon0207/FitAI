import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { PRIMARY_PALETTES, usePrefs, useT } from '@/stores/prefs';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useProfile } from '@/stores/profile';
import { useDiary } from '@/stores/diary';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { useTabNav } from '@/hooks/useTabNav';

import { TweaksPanel } from '@/design/TweaksPanel';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';

// Main tabs
const HomeScreen = lazy(() => import('@/screens/Home').then(m => ({ default: m.HomeScreen })));
const DiaryScreen = lazy(() => import('@/screens/Diary').then(m => ({ default: m.DiaryScreen })));
const StatsScreen = lazy(() => import('@/screens/Stats').then(m => ({ default: m.StatsScreen })));
const ProfileScreen = lazy(() => import('@/screens/Profile').then(m => ({ default: m.ProfileScreen })));

// Core input flow
const SearchScreen = lazy(() => import('@/screens/Search').then(m => ({ default: m.SearchScreen })));
const ComposerScreen = lazy(() => import('@/screens/Composer').then(m => ({ default: m.ComposerScreen })));
const BarcodeScreen = lazy(() => import('@/screens/Barcode').then(m => ({ default: m.BarcodeScreen })));
const ManualScreen = lazy(() => import('@/screens/Manual').then(m => ({ default: m.ManualScreen })));
const FoodDetailScreen = lazy(() => import('@/screens/FoodDetail').then(m => ({ default: m.FoodDetailScreen })));
const FabMenu = lazy(() => import('@/screens/FabMenu').then(m => ({ default: m.FabMenu })));

// Nutrition
const MicroScreen = lazy(() => import('@/screens/Micro').then(m => ({ default: m.MicroScreen })));
const DeficiencyScreen = lazy(() => import('@/screens/Micro').then(m => ({ default: m.DeficiencyScreen })));
const ConsequencesScreen = lazy(() => import('@/screens/Consequences').then(m => ({ default: m.ConsequencesScreen })));

// Gamification + reports
const AchieveScreen = lazy(() => import('@/screens/Achieve').then(m => ({ default: m.AchieveScreen })));
const ReportScreen = lazy(() => import('@/screens/Report').then(m => ({ default: m.ReportScreen })));

const WaterScreen = lazy(() => import('@/screens/Trackers').then(m => ({ default: m.WaterScreen })));
const WeightScreen = lazy(() => import('@/screens/Trackers').then(m => ({ default: m.WeightScreen })));
const SportScreen = lazy(() => import('@/screens/Sport').then(m => ({ default: m.SportScreen })));

// Auth + onboarding
const LoginScreen = lazy(() => import('@/screens/Auth').then(m => ({ default: m.LoginScreen })));
const RegisterScreen = lazy(() => import('@/screens/Auth').then(m => ({ default: m.RegisterScreen })));
const ForgotScreen = lazy(() => import('@/screens/Auth').then(m => ({ default: m.ForgotScreen })));
const ResetPasswordScreen = lazy(() => import('@/screens/Auth').then(m => ({ default: m.ResetPasswordScreen })));
const SplashScreen = lazy(() => import('@/screens/Onboarding').then(m => ({ default: m.SplashScreen })));
const OnboardingScreen = lazy(() => import('@/screens/Onboarding').then(m => ({ default: m.OnboardingScreen })));
const QuizScreen = lazy(() => import('@/screens/Quiz').then(m => ({ default: m.QuizScreen })));

// Settings
const LangScreen = lazy(() => import('@/screens/Settings').then(m => ({ default: m.LangScreen })));
const ThemeScreen = lazy(() => import('@/screens/Settings').then(m => ({ default: m.ThemeScreen })));
const PermsScreen = lazy(() => import('@/screens/Settings').then(m => ({ default: m.PermsScreen })));

export function App() {
  const navigate = useNavigate();
  const theme = usePrefs((s) => s.theme);
  const primaryColor = usePrefs((s) => s.primaryColor);

  // Apply theme to <html> for CSS variables
  useEffect(() => {
    const resolved = theme === 'auto'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    document.documentElement.dataset.theme = resolved;
  }, [theme]);

  // Apply primary-colour palette to CSS variables AND mutate the shared FIT
  // token object so inline-styled components pick up the new hex on re-render.
  useEffect(() => {
    const palette = PRIMARY_PALETTES[primaryColor] ?? PRIMARY_PALETTES['#0EA5E9']!;
    const root = document.documentElement.style;
    root.setProperty('--fit-primary', palette.base);
    root.setProperty('--fit-primary-dark', palette.dark);
    root.setProperty('--fit-primary-soft', palette.soft);
    FIT.primary = palette.base;
    FIT.primaryDark = palette.dark;
    FIT.primarySoft = palette.soft;
  }, [primaryColor]);

  const t = useT();
  const isOnline = useNetworkStatus();
  const setAuth = useAuth((s) => s.setAuth);
  const pullProfile = useProfile((s) => s.pullFromSupabase);
  const pullDiary = useDiary((s) => s.pullFromSupabase);

  // Sync Supabase session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuth(session.access_token, session.user.id);
        pullProfile().then(() => useProfile.getState().pushToSupabase());
        pullDiary().then(() => useDiary.getState().pushAllToSupabase());
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') && session) {
        setAuth(session.access_token, session.user.id);
        pullProfile().then(() => useProfile.getState().pushToSupabase());
        pullDiary().then(() => useDiary.getState().pushAllToSupabase());
        
        if (event === 'PASSWORD_RECOVERY') {
          navigate('/reset-password');
        }
      } else if (event === 'SIGNED_OUT') {
        useAuth.getState().logout();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      {!isOnline && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10000,
          background: FIT.danger, color: '#fff', padding: '12px 10px',
          fontSize: 12, fontWeight: 700, textAlign: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>
          <Icon name="alert" size={16} color="#fff" />
          {t.offlineNotice}
        </div>
      )}
      <Suspense fallback={<div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: FIT.bg, color: FIT.textMuted, fontWeight: 700 }}>FIT AI...</div>}>
        <Routes key={primaryColor}>
          {/* Main tabs */}
          <Route path="/" element={<HomeScreen />} />
          <Route path="/diary" element={<DiaryScreen />} />
          <Route path="/stats" element={<StatsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />

          {/* Quick-log flow */}
          <Route path="/add" element={<FabMenu />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/composer" element={<ComposerScreen />} />
          <Route path="/barcode" element={<BarcodeScreen />} />
          <Route path="/manual" element={<ManualScreen />} />
          <Route path="/food/:id" element={<FoodDetailScreen />} />

          {/* Nutrition panels */}
          <Route path="/micro" element={<MicroScreen />} />
          <Route path="/deficiency" element={<DeficiencyScreen />} />
          <Route path="/consequences" element={<ConsequencesScreen />} />

          {/* Gamification + reports */}
          <Route path="/achieve" element={<AchieveScreen />} />
          <Route path="/report" element={<ReportScreen />} />

          {/* Trackers */}
          <Route path="/water" element={<WaterScreen />} />
          <Route path="/weight" element={<WeightScreen />} />
          <Route path="/steps-input" element={<Navigate to="/sport" replace />} />
          <Route path="/sport" element={<SportScreen />} />

          {/* Auth + onboarding */}
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/onboarding/:step" element={<OnboardingStepRoute />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/forgot" element={<ForgotScreen />} />
          <Route path="/reset-password" element={<ResetPasswordScreen />} />
          <Route path="/quiz/:step" element={<QuizScreen />} />

          {/* Settings */}
          <Route path="/lang" element={<LangScreen />} />
          <Route path="/theme" element={<ThemeScreen />} />
          <Route path="/perms" element={<PermsScreen />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <TweaksPanel />
    </>
  );
}


/** Wrapper to parse :step param for onboarding. */
function OnboardingStepRoute() {
  const step = Number(window.location.pathname.split('/').pop()) || 1;
  const clamped = (step >= 1 && step <= 3 ? step : 1) as 1 | 2 | 3;
  return <OnboardingScreen step={clamped} />;
}
