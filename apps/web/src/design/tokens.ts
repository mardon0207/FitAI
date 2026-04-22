// FitAI Design Tokens — ported from design/tokens.jsx
// Keep values in sync with apps/web/src/styles/global.css CSS variables.
// `primary`/`primaryDark`/`primarySoft` are intentionally mutable so the
// Tweaks panel can retint inline styles at runtime.

export const FIT = {
  primary: '#0EA5E9',
  primaryDark: '#0284C7',
  primarySoft: '#E0F2FE',
  accent: '#F59E0B',
  accentSoft: '#FEF3C7',
  danger: '#EF4444',
  dangerSoft: '#FEE2E2',

  protein: '#8B5CF6',
  carbs: '#F59E0B',
  fat: '#EC4899',

  bg: '#FAFAF9',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F5F4',

  text: '#0F172A',
  textMuted: '#64748B',
  textSubtle: '#94A3B8',

  border: '#E5E7EB',
  borderSoft: '#F1F5F9',

  shadowSm: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
  shadowMd: '0 2px 8px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)',
  shadowLg: '0 8px 32px rgba(15,23,42,0.08), 0 24px 48px rgba(15,23,42,0.08)',

  sans: '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  mono: '"JetBrains Mono", "SF Mono", ui-monospace, monospace',

  r: { sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, pill: 9999 } as const,
};

export type Lang = 'uz' | 'ru' | 'en';

/** Shape of all translated UI strings — add new keys here to keep typing strict. */
export interface I18NStrings {
  hello: string;
  today: string;
  kcal: string;
  remaining: string;
  protein: string;
  carbs: string;
  fat: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
  addFood: string;
  search: string;
  diary: string;
  stats: string;
  profile: string;
  home: string;
  water: string;
  steps: string;
  weight: string;
  burned: string;
  next: string;
  skip: string;
  start: string;
  signin: string;
  signup: string;
  email: string;
  password: string;
  name: string;
  forgot: string;
  continue: string;
  save: string;
  add: string;
  glass: string;
  donor: string;
  gram: string;
  ml: string;
  piyola: string;
}

export const I18N: Record<Lang, I18NStrings> = {
  uz: {
    hello: 'Xayrli tong',
    today: 'Bugun',
    kcal: 'kkal',
    remaining: 'qolgan',
    protein: 'Oqsil',
    carbs: 'Uglevod',
    fat: "Yog'",
    breakfast: 'Nonushta',
    lunch: 'Tushlik',
    dinner: 'Kechki ovqat',
    snack: 'Gazak',
    addFood: "Ovqat qo'shish",
    search: 'Qidirish',
    diary: 'Kundalik',
    stats: 'Statistika',
    profile: 'Profil',
    home: 'Bosh sahifa',
    water: 'Suv',
    steps: 'Qadamlar',
    weight: 'Vazn',
    burned: 'Sarflangan',
    next: 'Keyingi',
    skip: "O'tkazib yuborish",
    start: 'Boshlash',
    signin: 'Kirish',
    signup: "Ro'yxatdan o'tish",
    email: 'Email',
    password: 'Parol',
    name: 'Ism',
    forgot: 'Parolni unutdingizmi?',
    continue: 'Davom etish',
    save: 'Saqlash',
    add: "Qo'shish",
    glass: 'stakan',
    donor: 'dona',
    gram: 'g',
    ml: 'ml',
    piyola: 'piyola',
  },
  ru: {
    hello: 'Доброе утро',
    today: 'Сегодня',
    kcal: 'ккал',
    remaining: 'осталось',
    protein: 'Белки',
    carbs: 'Углеводы',
    fat: 'Жиры',
    breakfast: 'Завтрак',
    lunch: 'Обед',
    dinner: 'Ужин',
    snack: 'Перекус',
    addFood: 'Добавить еду',
    search: 'Поиск',
    diary: 'Дневник',
    stats: 'Статистика',
    profile: 'Профиль',
    home: 'Главная',
    water: 'Вода',
    steps: 'Шаги',
    weight: 'Вес',
    burned: 'Сожжено',
    next: 'Далее',
    skip: 'Пропустить',
    start: 'Начать',
    signin: 'Войти',
    signup: 'Регистрация',
    email: 'Email',
    password: 'Пароль',
    name: 'Имя',
    forgot: 'Забыли пароль?',
    continue: 'Продолжить',
    save: 'Сохранить',
    add: 'Добавить',
    glass: 'стакан',
    donor: 'шт',
    gram: 'г',
    ml: 'мл',
    piyola: 'пиала',
  },
  en: {
    hello: 'Good morning',
    today: 'Today',
    kcal: 'kcal',
    remaining: 'remaining',
    protein: 'Protein',
    carbs: 'Carbs',
    fat: 'Fat',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
    addFood: 'Add food',
    search: 'Search',
    diary: 'Diary',
    stats: 'Stats',
    profile: 'Profile',
    home: 'Home',
    water: 'Water',
    steps: 'Steps',
    weight: 'Weight',
    burned: 'Burned',
    next: 'Next',
    skip: 'Skip',
    start: 'Start',
    signin: 'Sign in',
    signup: 'Sign up',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    forgot: 'Forgot password?',
    continue: 'Continue',
    save: 'Save',
    add: 'Add',
    glass: 'glass',
    donor: 'pcs',
    gram: 'g',
    ml: 'ml',
    piyola: 'bowl',
  },
};
