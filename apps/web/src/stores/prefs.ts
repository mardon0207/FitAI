import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { I18N, type Lang } from '@/design/tokens';

export type { Lang };
export type Theme = 'light' | 'dark' | 'auto';

/** Primary accent palette — each entry defines the full trio of hues
 *  used across buttons, rings and chips in light mode. */
export interface PrimaryPalette {
  base: string;
  dark: string;
  soft: string;
}

export const PRIMARY_PALETTES: Record<string, PrimaryPalette> = {
  '#10B981': { base: '#10B981', dark: '#059669', soft: '#D1FAE5' }, // emerald
  '#0EA5E9': { base: '#0EA5E9', dark: '#0284C7', soft: '#E0F2FE' }, // sky (default)
  '#8B5CF6': { base: '#8B5CF6', dark: '#7C3AED', soft: '#EDE9FE' }, // violet
  '#F59E0B': { base: '#F59E0B', dark: '#D97706', soft: '#FEF3C7' }, // amber
  '#EC4899': { base: '#EC4899', dark: '#DB2777', soft: '#FCE7F3' }, // pink
};

export const DEFAULT_PRIMARY = '#0EA5E9';

interface PrefsState {
  lang: Lang;
  theme: Theme;
  primaryColor: string;
  hasOnboarded: boolean;
  setLang: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
  setPrimaryColor: (color: string) => void;
  setHasOnboarded: (val: boolean) => void;
}

export const usePrefs = create<PrefsState>()(
  persist(
    (set) => ({
      lang: 'uz',
      theme: 'light',
      primaryColor: DEFAULT_PRIMARY,
      hasOnboarded: false,
      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
      setPrimaryColor: (primaryColor) => set({ primaryColor }),
      setHasOnboarded: (hasOnboarded) => set({ hasOnboarded }),
    }),
    { name: 'fit-prefs' },
  ),
);

/**
 * Hook to get translations for the currently selected language.
 * Usage: const t = useT(); t.home -> "Bosh sahifa"
 */
export function useT() {
  const lang = usePrefs((s) => s.lang);
  return I18N[lang];
}
