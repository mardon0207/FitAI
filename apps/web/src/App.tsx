import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { PRIMARY_PALETTES, usePrefs } from '@/stores/prefs';
import { TweaksPanel } from '@/design/TweaksPanel';
import { FIT } from '@/design/tokens';

// Main tabs
import { HomeScreen } from '@/screens/Home';
import { DiaryScreen } from '@/screens/Diary';
import { StatsScreen } from '@/screens/Stats';
import { ProfileScreen } from '@/screens/Profile';

// Core input flow
import { SearchScreen } from '@/screens/Search';
import { ComposerScreen } from '@/screens/Composer';
import { BarcodeScreen } from '@/screens/Barcode';
import { ManualScreen } from '@/screens/Manual';
import { FoodDetailScreen } from '@/screens/FoodDetail';
import { FabMenu } from '@/screens/FabMenu';

// Nutrition
import { MicroScreen, DeficiencyScreen } from '@/screens/Micro';
import { ConsequencesScreen } from '@/screens/Consequences';

// Gamification + reports
import { AchieveScreen } from '@/screens/Achieve';
import { ReportScreen } from '@/screens/Report';

// Trackers
import { WaterScreen, WeightScreen } from '@/screens/Trackers';
import { StepsInputScreen } from '@/screens/StepsInput';

// Auth + onboarding
import { LoginScreen, RegisterScreen, ForgotScreen } from '@/screens/Auth';
import { SplashScreen, OnboardingScreen } from '@/screens/Onboarding';
import { QuizScreen } from '@/screens/Quiz';

// Settings
import { LangScreen, ThemeScreen, PermsScreen } from '@/screens/Settings';

export function App() {
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

  return (
    <>
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
      <Route path="/steps-input" element={<StepsInputScreen />} />

      {/* Auth + onboarding */}
      <Route path="/splash" element={<SplashScreen />} />
      <Route path="/onboarding/:step" element={<OnboardingStepRoute />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/forgot" element={<ForgotScreen />} />
      <Route path="/quiz/:step" element={<QuizScreen />} />

      {/* Settings */}
      <Route path="/lang" element={<LangScreen />} />
      <Route path="/theme" element={<ThemeScreen />} />
      <Route path="/perms" element={<PermsScreen />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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

/** Shared helper — tab-bar handler that navigates between the main tabs. */
export function useTabNav() {
  const navigate = useNavigate();
  return (id: 'home' | 'diary' | 'add' | 'stats' | 'profile') => {
    const paths: Record<typeof id, string> = {
      home: '/',
      diary: '/diary',
      add: '/add',
      stats: '/stats',
      profile: '/profile',
    };
    navigate(paths[id]);
  };
}
