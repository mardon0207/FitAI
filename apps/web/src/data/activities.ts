export interface ActivityType {
  id: string;
  label: Record<'uz' | 'ru' | 'en', string>;
  emoji: string;
  unit: 'min' | 'steps' | 'reps';
  met?: number; // Metabolic Equivalent of Task (per hour)
  kcalPerUnit?: number; // Fixed kcal per step/rep
}

export const ACTIVITIES: ActivityType[] = [
  {
    id: 'steps',
    label: { uz: 'Qadamlar', ru: 'Шаги', en: 'Steps' },
    emoji: '🚶',
    unit: 'steps',
    kcalPerUnit: 0.04,
  },
  {
    id: 'running',
    label: { uz: 'Yugurish', ru: 'Бег', en: 'Running' },
    emoji: '🏃',
    unit: 'min',
    met: 8.0,
  },
  {
    id: 'tennis',
    label: { uz: 'Tennis', ru: 'Теннис', en: 'Tennis' },
    emoji: '🎾',
    unit: 'min',
    met: 7.3,
  },
  {
    id: 'swimming',
    label: { uz: 'Suzish', ru: 'Плавание', en: 'Swimming' },
    emoji: '🏊',
    unit: 'min',
    met: 6.0,
  },
  {
    id: 'cycling',
    label: { uz: 'Velosiped', ru: 'Велосипед', en: 'Cycling' },
    emoji: '🚴',
    unit: 'min',
    met: 7.5,
  },
  {
    id: 'pullups',
    label: { uz: 'Turnik', ru: 'Турник', en: 'Pull-ups' },
    emoji: '💪',
    unit: 'reps',
    kcalPerUnit: 0.5,
  },
  {
    id: 'pushups',
    label: { uz: 'Otjimaniya', ru: 'Отжимания', en: 'Push-ups' },
    emoji: '🧗',
    unit: 'reps',
    kcalPerUnit: 0.3,
  },
  {
    id: 'gym',
    label: { uz: 'Zal (Mashg\'ulot)', ru: 'Зал', en: 'Gym' },
    emoji: '🏋️',
    unit: 'min',
    met: 5.0,
  },
];

export function calculateKcal(activity: ActivityType, value: number, weightKg: number): number {
  if (activity.kcalPerUnit) {
    return Math.round(value * activity.kcalPerUnit);
  }
  if (activity.met) {
    // Kcal = MET * Weight * (Time_min / 60)
    return Math.round(activity.met * weightKg * (value / 60));
  }
  return 0;
}
