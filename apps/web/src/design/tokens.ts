// FitAI Design Tokens — ported from design/tokens.jsx
// Keep values in sync with apps/web/src/styles/global.css CSS variables.
// `primary`/`primaryDark`/`primarySoft` are intentionally mutable so the
// Tweaks panel can retint inline styles at runtime.

export const FIT = {
  primary: 'var(--fit-primary)',
  primaryDark: 'var(--fit-primary-dark)',
  primarySoft: 'var(--fit-primary-soft)',
  accent: 'var(--fit-accent)',
  accentSoft: 'var(--fit-accent-soft)',
  danger: 'var(--fit-danger)',
  dangerSoft: 'var(--fit-danger-soft)',

  protein: 'var(--fit-protein)',
  carbs: 'var(--fit-carbs)',
  fat: 'var(--fit-fat)',

  // Neon Palette - Updated to match design image
  cyan: '#00f2ff',
  neonPink: '#ff00f2',
  lime: '#d4ff00',
  orange: '#ff4d00',
  purple: '#7c3aed',
  blue: '#00aaff',

  bg: 'var(--fit-bg)',
  surface: 'var(--fit-surface)',
  surfaceAlt: 'var(--fit-surface-alt)',

  text: 'var(--fit-text)',
  textMuted: 'var(--fit-text-muted)',
  textSubtle: 'var(--fit-text-subtle)',

  border: 'var(--fit-border)',
  borderSoft: 'var(--fit-border-soft)',

  shadowSm: 'var(--fit-shadow-sm)',
  shadowMd: 'var(--fit-shadow-md)',
  shadowLg: 'var(--fit-shadow-lg)',

  sans: 'var(--fit-sans)',
  mono: 'var(--fit-mono)',

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
  left: string;
  proteinShort: string;
  carbsShort: string;
  fatShort: string;
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
  sport: string;
  offlineNotice: string;
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  remainingToGoal: string;
  todaysMeals: string;
  all: string;
  healthStatus: string;
  healthAnalysis: string;
  aiTipProtein: string;
  aiTipKcalHigh: string;
  aiTipKcalLow: string;
  aiTipBalance: string;
  aiTipWater: string;
  activities: string;
  resetPassword: string;
  newPassword: string;
  sendLink: string;
  passwordUpdated: string;
  editName: string;
  editMetric: string;
  logoutConfirm: string;
  healthData: string;
  connections: string;
  reminders: string;
  appSettings: string;
  language: string;
  theme: string;
  unit: string;
  age: string;
  invalidEmail: string;
  goalWeight: string;
  targetKcal: string;
  days: string;
  meals: string;
  connected: string;
  notConnected: string;
  halal: string;
  soon: string;
  logout: string;
  week: string;
  month: string;
  year: string;
  intake: string;
  average: string;
  kcalBalance: string;
  goal: string;
  weightTrend: string;
  change: string;
  dailyHistory: string;
  noData: string;
  daysShort: string[];
  resultToday: string;
  myMeal: string;
  deleteConfirm: string;
  unitTbsp: string;
  unitTsp: string;
  unitServing: string;
  activityBreakdown: string;
  welcomeBack: string;
  loginSub: string;
  or: string;
  appleLogin: string;
  googleLogin: string;
  noAccount: string;
  registerAction: string;
  createAccount: string;
  strongPassword: string;
  termsAgreement: string;
  haveAccount: string;
  loginAction: string;
  checkEmail: string;
  enterNewPasswordSub: string;
  forgotSub: string;
  other: string;
  addActivity: string;
  amount: string;
  minutes: string;
  reps: string;
  minShort: string;
  repsShort: string;
  estBurn: string;
  noActivities: string;
  weeklyReport: string;
  report: string;
  logged: string;
  avgKcalLabel: string;
  avgStepsLabel: string;
  weightChange: string;
  compliance: string;
  mostConsumed: string;
  weeklySummary: string;
  exportPdf: string;
  noReportData: string;
  complianceNote: string;
  highKcalNote: string;
  goodBalanceNote: string;
  weightLossNote: string;
  weightGainNote: string;
  perDay: string;
  national: string;
  ingredient: string;
  selectIngredient: string;
  searchFood: string;
  searchPlaceholder: string;
  popularSearches: string;
  noResults: string;
  noResultsMsg: string;
  addManual: string;
  extraOptions: string;
  compose: string;
  manual: string;
  barcode: string;
  loadError: string;
  preparing: string;
  nationalDish: string;
  atWhatTime: string;
  composition: string;
  added: string;
  saving: string;
  addToDiary: string;
  unit_g: string;
  unit_ml: string;
  unit_piece: string;
  unit_cup: string;
  unit_tbsp: string;
  unit_tsp: string;
  unit_serving: string;
  assemble: string;
  clearAll: string;
  clear: string;
  mealName: string;
  addIngredients: string;
  composerExample: string;
  addIngredient: string;
  composerSearchSub: string;
  total: string;
  cooking_raw: string;
  cooking_boiled: string;
  cooking_fried: string;
  cooking_baked: string;
  cooking_grilled: string;
  oil: string;
  waterIntake: string;
  logWeight: string;
  last: string;
  firstEntry: string;
  noteOptional: string;
  weightNoteExample: string;
  errorOccurred: string;
  close: string;
  decrease: string;
  goal_lose: string;
  goal_gain: string;
  goal_maintain: string;
  level_sedentary: string;
  level_light: string;
  level_moderate: string;
  level_active: string;
  level_very_active: string;
  level_low: string;
  level_medium: string;
  level_high: string;
  dark: string;
  light: string;
  metric: string;
  appleHealth: string;
  appleWatch: string;
  items: string;
  microNutrients: string;
  aiAdvisor: string;
  manageProducts: string;
  addProduct: string;
  editProduct: string;
  saveProduct: string;
  deleteProduct: string;
  productName: string;
  productKcal: string;
  productProtein: string;
  productCarbs: string;
  productFat: string;
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
    left: 'qoldi',
    proteinShort: 'OQS',
    carbsShort: 'UGL',
    fatShort: 'YOG',
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
    sport: 'Sport',
    offlineNotice: "Internetga ulanish yo'q. Ma'lumotlar saqlanmasligi mumkin.",
    goodMorning: 'Xayrli tong',
    goodAfternoon: 'Xayrli kun',
    goodEvening: 'Xayrli kech',
    remainingToGoal: 'Maqsadga qoldi',
    todaysMeals: 'Bugungi taomlar',
    all: 'Barchasi',
    healthStatus: 'Salomatlik holati',
    healthAnalysis: 'Salomatlik tahlili',
    aiTipProtein: "Bugun oqsil juda kam. Mushaklar tiklanishi uchun ko'proq go'sht yoki dukkaklilar yeng.",
    aiTipKcalHigh: 'Kaloriya me\'yordan oshdi. Kechki payt faqat sabzavotli salat bilan cheklanishni maslahat beramiz.',
    aiTipKcalLow: 'Bugun energiya kam oldingiz. Miya yaxshi ishlashi uchun foydali uglevodlar qo\'shing.',
    aiTipBalance: 'Ajoyib balans! Bugun siz haqiqiy chempionsiz, shu ruhda davom eting!',
    aiTipWater: 'Suv ichishni unutmang. Har bir stakan suv metabolizmni 20% gacha tezlashtirishi mumkin.',
    activities: "Mashg'ulotlar",
    resetPassword: 'Parolni tiklash',
    newPassword: 'Yangi parol',
    sendLink: 'Link yuborish',
    passwordUpdated: 'Parol muvaffaqiyatli yangilandi',
    editName: 'Ismingiz:',
    editMetric: 'kiritng:',
    logoutConfirm: 'Ilovadan chiqmoqchimisiz?',
    healthData: "Sog'liq ma'lumotlari",
    connections: 'Birkmalar',
    reminders: 'Bildirishnomalar',
    appSettings: 'Ilova',
    language: 'Til',
    theme: 'Tema',
    unit: "O'lchov birligi",
    age: 'Yosh',
    invalidEmail: "Email manzili noto'g'ri",
    goalWeight: 'Sizning maqsadingiz',
    targetKcal: 'kkal/kun',
    days: 'kun',
    meals: 'ovqat',
    connected: 'Ulangan',
    notConnected: 'Ulanmagan',
    halal: 'Halal',
    soon: 'Yaqinda!',
    logout: 'Chiqish',
    week: 'Hafta',
    month: 'Oy',
    year: 'Yil',
    intake: 'Qabul',
    average: "O'RTACHA",
    kcalBalance: 'Kaloriya balansi',
    goal: 'Maqsad',
    weightTrend: 'Vazn trendi',
    change: "O'zgarish",
    dailyHistory: 'Kunlik tarix',
    noData: "Ma'lumotlar yo'q",
    daysShort: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
    resultToday: 'Bugungi natija',
    myMeal: 'Mening ovqatim',
    deleteConfirm: "o'chirishni tasdiqlaysizmi?",
    unitTbsp: 'osh q.',
    unitTsp: 'choy q.',
    unitServing: 'porsiya',
    activityBreakdown: 'Mashg\'ulotlar tarkibi',
    welcomeBack: 'Qaytib keldingizmi?',
    loginSub: 'Hisobingizga kiring',
    or: 'YOKI',
    appleLogin: 'Apple bilan kirish',
    googleLogin: 'Google bilan kirish',
    noAccount: 'Hisobingiz yo\'qmi?',
    registerAction: 'Ro\'yxatdan o\'ting',
    createAccount: 'Yangi hisob yarating',
    strongPassword: 'Kuchli parol',
    termsAgreement: 'Foydalanish shartlariga va maxfiylik siyosatiga roziman',
    haveAccount: 'Hisobingiz bormi?',
    loginAction: 'Kiring',
    checkEmail: 'Emailingizni tekshiring',
    enterNewPasswordSub: 'Hisobingiz uchun yangi xavfsiz parol tanlang.',
    forgotSub: '{email} kiriting, biz sizga parol tiklash havolasini yuboramiz.',
    other: 'Boshqa',
    addActivity: 'Faollik qo\'shish',
    amount: 'miqdori',
    minutes: 'daqiqa',
    reps: 'marta',
    minShort: 'daq',
    repsShort: 'mart',
    estBurn: 'Taxminiy sarf',
    noActivities: 'Hali mashg\'ulotlar yo\'q',
    weeklyReport: 'Haftalik hisobot',
    report: 'Hisobot',
    logged: 'kun logged',
    avgKcalLabel: 'O\'rt. kaloriya',
    avgStepsLabel: 'O\'rt. qadam',
    weightChange: 'Vazn o\'zgarishi',
    compliance: 'Mos kelish',
    mostConsumed: 'Eng ko\'p iste\'mol qilingan',
    weeklySummary: 'Haftaning xulosasi',
    exportPdf: 'PDF eksport qilish',
    noReportData: 'Bu hafta hali ma\'lumot kiritmadingiz. Hisobot tayyor bo\'lishi uchun ovqatlaringizni yozib boring.',
    complianceNote: 'Bu hafta siz maqsadingizga {pct}% mos keldingiz.',
    highKcalNote: 'O\'rtacha kaloriya ({avg}) belgilangan me\'yordan biroz yuqori bo\'ldi.',
    goodBalanceNote: 'Kaloriya balansi yaxshi saqlandi.',
    weightLossNote: 'Vazningiz {val} kg ga kamaydi — ajoyib natija!',
    weightGainNote: 'Vazn biroz oshgan ({val} kg), lekin bu suv yoki mushak massasi bo\'lishi ham mumkin.',
    perDay: '/kun',
    national: 'Milliy',
    ingredient: 'Ingredient',
    selectIngredient: 'Ingredient tanlash',
    searchFood: 'Ovqat qidirish',
    searchPlaceholder: 'Nima yedingiz?',
    popularSearches: 'Mashhur qidiruvlar',
    noResults: 'Hech narsa topilmadi',
    noResultsMsg: '"{query}" bo\'yicha natija yo\'q. Iltimos, boshqa so\'z bilan qidirib ko\'ring yoki o\'zingiz qo\'shing.',
    addManual: 'O\'zim qo\'shaman',
    extraOptions: 'Qo\'shimcha imkoniyatlar',
    compose: 'Yig\'ish',
    manual: 'Qo\'lda',
    barcode: 'Barkod',
    loadError: 'Yuklashda xatolik yuz berdi',
    preparing: 'Tayyorlanmoqda...',
    nationalDish: 'Milliy taom',
    atWhatTime: 'Qaysi vaqtda?',
    composition: 'Tarkibi (100g uchun emas, tanlangan miqdor uchun)',
    added: 'Qo\'shildi',
    saving: 'Saqlanmoqda...',
    addToDiary: 'Kundalikka qo\'shish',
    unit_g: 'gramm',
    unit_ml: 'millilitr',
    unit_piece: 'dona',
    unit_cup: 'piyola',
    unit_tbsp: 'osh qoshiq',
    unit_tsp: 'choy qoshiq',
    unit_serving: 'porsiya',
    assemble: 'Ingredientlardan yig\'ish',
    clearAll: 'Barchasini tozalash?',
    clear: 'Tozalash',
    mealName: 'Ovqat nomi',
    addIngredients: 'Ingredientlarni qo\'shing',
    composerExample: 'Masalan: 2 dona qovurilgan kolbasa + 2 dona qaynatilgan tuxum + 0.5 pomidor',
    addIngredient: 'Ingredient qo\'shish',
    composerSearchSub: 'Minglab mahsulotlar va milliy retseptlar',
    total: 'JAMI',
    cooking_raw: 'Xom',
    cooking_boiled: 'Qaynatilgan',
    cooking_fried: 'Qovurilgan',
    cooking_baked: 'Pishirilgan',
    cooking_grilled: 'Grilled',
    oil: 'Yog\'',
    waterIntake: 'Suv iste\'moli',
    logWeight: 'Vaznni yozish',
    last: 'Oxirgi',
    firstEntry: 'Birinchi yozuv',
    noteOptional: 'IZOH (ixtiyoriy)',
    weightNoteExample: 'Masalan: ertalab nonushtadan keyin',
    errorOccurred: 'Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.',
    close: 'Yopish',
    decrease: 'Kamaytirish',
    goal_lose: 'Vazn kamaytirish',
    goal_gain: 'Vazn orttirish',
    goal_maintain: 'Vazn saqlash',
    level_sedentary: 'Kam harakat',
    level_light: 'Yengil faol',
    level_moderate: 'O\'rtacha faol',
    level_active: 'Juda faol',
    level_very_active: 'Ekstremal faol',
    level_low: 'Past',
    level_medium: 'O\'rtacha',
    level_high: 'Yuqori',
    dark: 'To\'q',
    light: 'Yorug\'',
    metric: 'Metrik',
    appleHealth: 'Apple Salomatlik',
    appleWatch: 'Apple Watch',
    items: 'ta',
    microNutrients: 'Mikroelementlar',
    aiAdvisor: 'AI Tavsiyasi',
    manageProducts: 'Mahsulotlarni boshqarish',
    addProduct: 'Yangi mahsulot',
    editProduct: 'Tahrirlash',
    saveProduct: 'Saqlash',
    deleteProduct: "O'chirish",
    productName: 'Nomi',
    productKcal: 'Kkal',
    productProtein: 'Oqsil',
    productCarbs: 'Uglevod',
    productFat: "Yog'",
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
    left: 'осталось',
    proteinShort: 'БЕЛ',
    carbsShort: 'УГЛ',
    fatShort: 'ЖИР',
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
    sport: 'Спорт',
    offlineNotice: 'Нет подключения к интернету. Данные могут не сохраниться.',
    goodMorning: 'Доброе утро',
    goodAfternoon: 'Добрый день',
    goodEvening: 'Добрый вечер',
    remainingToGoal: 'Осталось до цели',
    todaysMeals: 'Сегодняшние блюда',
    all: 'Все',
    healthStatus: 'Состояние здоровья',
    healthAnalysis: 'Анализ здоровья',
    aiTipProtein: 'Сегодня очень мало белка. Ешьте больше мяса или бобовых для восстановления мышц.',
    aiTipKcalHigh: 'Калории превышены. Советуем ограничиться овощным салатом на ужин.',
    aiTipKcalLow: 'Сегодня вы получили мало энергии. Добавьте полезные углеводы для работы мозга.',
    aiTipBalance: 'Отличный баланс! Вы сегодня настоящий чемпион, продолжайте в том же духе!',
    aiTipWater: 'Не забывайте пить воду. Каждый стакан воды может ускорить метаболизм до 20%.',
    activities: 'Тренировки',
    resetPassword: 'Восстановление пароля',
    newPassword: 'Новый пароль',
    sendLink: 'Отправить ссылку',
    passwordUpdated: 'Пароль успешно обновлен',
    editName: 'Ваше имя:',
    editMetric: 'Введите:',
    logoutConfirm: 'Вы уверены, что хотите выйти?',
    healthData: 'Данные о здоровье',
    connections: 'Подключения',
    reminders: 'Уведомления',
    appSettings: 'Приложение',
    language: 'Язык',
    theme: 'Тема',
    unit: 'Единицы измерения',
    age: 'Возраст',
    invalidEmail: 'Некорректный email',
    goalWeight: 'Ваша цель',
    targetKcal: 'ккал/день',
    days: 'дней',
    meals: 'приемов пищи',
    connected: 'Подключено',
    notConnected: 'Не подключено',
    halal: 'Халяль',
    soon: 'Скоро!',
    logout: 'Выйти',
    week: 'Неделя',
    month: 'Месяц',
    year: 'Год',
    intake: 'Прием',
    average: 'СРЕДНЕЕ',
    kcalBalance: 'Баланс калорий',
    goal: 'Цель',
    weightTrend: 'Тренд веса',
    change: 'Изменение',
    dailyHistory: 'Дневная история',
    noData: 'Нет данных',
    daysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    resultToday: 'Сегодняшний результат',
    myMeal: 'Моя еда',
    deleteConfirm: 'удалить?',
    unitTbsp: 'ст. л.',
    unitTsp: 'ч. л.',
    unitServing: 'порция',
    activityBreakdown: 'Распределение активностей',
    welcomeBack: 'С возвращением!',
    loginSub: 'Войдите в свой аккаунт',
    or: 'ИЛИ',
    appleLogin: 'Войти через Apple',
    googleLogin: 'Войти через Google',
    noAccount: 'Нет аккаунта?',
    registerAction: 'Зарегистрируйтесь',
    createAccount: 'Создайте новый аккаунт',
    strongPassword: 'Надежный пароль',
    termsAgreement: 'Я согласен с условиями использования и политикой конфиденциальности',
    haveAccount: 'Уже есть аккаунт?',
    loginAction: 'Войдите',
    checkEmail: 'Проверьте почту',
    enterNewPasswordSub: 'Выберите новый надежный пароль для вашего аккаунта.',
    forgotSub: 'Введите {email}, и мы отправим вам ссылку для восстановления пароля.',
    other: 'Другое',
    addActivity: 'Добавить активность',
    amount: 'количество',
    minutes: 'минут',
    reps: 'раз',
    minShort: 'мин',
    repsShort: 'раз',
    estBurn: 'Примерный расход',
    noActivities: 'Тренировок еще нет',
    weeklyReport: 'Еженедельный отчет',
    report: 'ОТЧЕТ',
    logged: 'дн. записано',
    avgKcalLabel: 'Сред. калории',
    avgStepsLabel: 'Сред. шаги',
    weightChange: 'Изм. веса',
    compliance: 'Соответствие',
    mostConsumed: 'Самое популярное',
    weeklySummary: 'Итоги недели',
    exportPdf: 'Экспорт в PDF',
    noReportData: 'На этой неделе вы еще не вводили данные. Записывайте еду, чтобы отчет был готов.',
    complianceNote: 'На этой неделе вы на {pct}% соответствовали своей цели.',
    highKcalNote: 'Средние калории ({avg}) были немного выше нормы.',
    goodBalanceNote: 'Калорийный баланс хорошо соблюдался.',
    weightLossNote: 'Ваш вес снизился на {val} кг — отличный результат!',
    weightGainNote: 'Вес немного увеличился ({val} кг), но это может быть вода или мышечная масса.',
    perDay: '/день',
    national: 'Местное',
    ingredient: 'Ингредиент',
    selectIngredient: 'Выбор ингредиента',
    searchFood: 'Поиск еды',
    searchPlaceholder: 'Что вы ели?',
    popularSearches: 'Популярные запросы',
    noResults: 'Ничего не найдено',
    noResultsMsg: 'По запросу "{query}" ничего не найдено. Попробуйте другое слово или добавьте сами.',
    addManual: 'Добавить вручную',
    extraOptions: 'Дополнительные возможности',
    compose: 'Собрать',
    manual: 'Вручную',
    barcode: 'Баркод',
    loadError: 'Ошибка при загрузке',
    preparing: 'Готовится...',
    nationalDish: 'Местное блюдо',
    atWhatTime: 'В какое время?',
    composition: 'Состав (для выбранного количества, а не за 100г)',
    added: 'Добавлено',
    saving: 'Сохранение...',
    addToDiary: 'Добавить в дневник',
    unit_g: 'грамм',
    unit_ml: 'миллилитр',
    unit_piece: 'штука',
    unit_cup: 'чашка',
    unit_tbsp: 'ст. ложка',
    unit_tsp: 'ч. ложка',
    unit_serving: 'порция',
    assemble: 'Собрать из ингредиентов',
    clearAll: 'Очистить всё?',
    clear: 'Очистить',
    mealName: 'Название блюда',
    addIngredients: 'Добавьте ингредиенты',
    composerExample: 'Например: 2 жареные сосиски + 2 вареных яйца + 0.5 помидора',
    addIngredient: 'Добавить ингредиент',
    composerSearchSub: 'Тысячи продуктов и национальных рецептов',
    total: 'ИТОГО',
    cooking_raw: 'Сырое',
    cooking_boiled: 'Вареное',
    cooking_fried: 'Жареное',
    cooking_baked: 'Запеченное',
    cooking_grilled: 'Гриль',
    oil: 'Масло',
    waterIntake: 'Потребление воды',
    logWeight: 'Запись веса',
    last: 'Последний',
    firstEntry: 'Первая запись',
    noteOptional: 'ЗАМЕТКА (необязательно)',
    weightNoteExample: 'Например: утром после завтрака',
    errorOccurred: 'Произошла ошибка. Пожалуйста, попробуйте еще раз.',
    close: 'Закрыть',
    decrease: 'Уменьшить',
    goal_lose: 'Снижение веса',
    goal_gain: 'Набор веса',
    goal_maintain: 'Поддержание веса',
    level_sedentary: 'Сидячий',
    level_light: 'Легкая активность',
    level_moderate: 'Умеренная активность',
    level_active: 'Высокая активность',
    level_very_active: 'Экстремальная активность',
    level_low: 'Низкий',
    level_medium: 'Средний',
    level_high: 'Высокий',
    dark: 'Темная',
    light: 'Светлая',
    metric: 'Метрическая',
    appleHealth: 'Apple Здоровье',
    appleWatch: 'Apple Watch',
    items: 'шт',
    microNutrients: 'Микроэлементы',
    aiAdvisor: 'AI Рекомендация',
    manageProducts: 'Управление продуктами',
    addProduct: 'Новый продукт',
    editProduct: 'Изменить',
    saveProduct: 'Сохранить',
    deleteProduct: 'Удалить',
    productName: 'Название',
    productKcal: 'Ккал',
    productProtein: 'Белки',
    productCarbs: 'Углеводы',
    productFat: 'Жиры',
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
    left: 'left',
    proteinShort: 'PRO',
    carbsShort: 'CAR',
    fatShort: 'FAT',
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
    sport: 'Sport',
    offlineNotice: 'No internet connection. Data may not be saved.',
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    remainingToGoal: 'Remaining to goal',
    todaysMeals: 'Today\'s meals',
    all: 'All',
    healthStatus: 'Health status',
    healthAnalysis: 'Health analysis',
    aiTipProtein: 'Very low protein today. Eat more meat or legumes for muscle recovery.',
    aiTipKcalHigh: 'Calories exceeded. We recommend sticking to a vegetable salad for dinner.',
    aiTipKcalLow: 'Low energy today. Add healthy carbs for brain function.',
    aiTipBalance: 'Great balance! You are a champion today, keep it up!',
    aiTipWater: 'Don\'t forget to drink water. Each glass of water can boost metabolism by up to 20%.',
    activities: 'Activities',
    resetPassword: 'Reset Password',
    newPassword: 'New Password',
    sendLink: 'Send Link',
    passwordUpdated: 'Password updated successfully',
    editName: 'Your Name:',
    editMetric: 'Enter:',
    logoutConfirm: 'Are you sure you want to log out?',
    healthData: 'Health Data',
    connections: 'Connections',
    reminders: 'Notifications',
    appSettings: 'App',
    language: 'Language',
    theme: 'Theme',
    unit: 'Units',
    age: 'Age',
    invalidEmail: 'Invalid email address',
    goalWeight: 'Your Goal',
    targetKcal: 'kcal/day',
    days: 'days',
    meals: 'meals',
    connected: 'Connected',
    notConnected: 'Not Connected',
    halal: 'Halal',
    soon: 'Coming Soon!',
    logout: 'Logout',
    week: 'Week',
    month: 'Month',
    year: 'Year',
    intake: 'Intake',
    average: 'AVERAGE',
    kcalBalance: 'Calorie Balance',
    goal: 'Goal',
    weightTrend: 'Weight Trend',
    change: 'Change',
    dailyHistory: 'Daily History',
    noData: 'No data',
    daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    resultToday: 'Today\'s result',
    myMeal: 'My meal',
    deleteConfirm: 'delete?',
    unitTbsp: 'tbsp',
    unitTsp: 'tsp',
    unitServing: 'serving',
    activityBreakdown: 'Activity Breakdown',
    welcomeBack: 'Welcome back!',
    loginSub: 'Sign in to your account',
    or: 'OR',
    appleLogin: 'Sign in with Apple',
    googleLogin: 'Sign in with Google',
    noAccount: 'No account?',
    registerAction: 'Sign up',
    createAccount: 'Create a new account',
    strongPassword: 'Strong password',
    termsAgreement: 'I agree to the Terms and Privacy Policy',
    haveAccount: 'Have an account?',
    loginAction: 'Sign in',
    checkEmail: 'Check your email',
    enterNewPasswordSub: 'Choose a new secure password for your account.',
    forgotSub: 'Enter your {email}, and we will send you a password reset link.',
    other: 'Other',
    addActivity: 'Add Activity',
    amount: 'amount',
    minutes: 'minutes',
    reps: 'reps',
    minShort: 'min',
    repsShort: 'reps',
    estBurn: 'Est. burn',
    noActivities: 'No activities yet',
    weeklyReport: 'Weekly Report',
    report: 'REPORT',
    logged: 'days logged',
    avgKcalLabel: 'Avg. calories',
    avgStepsLabel: 'Avg. steps',
    weightChange: 'Weight change',
    compliance: 'Compliance',
    mostConsumed: 'Most consumed',
    weeklySummary: 'Weekly Summary',
    exportPdf: 'Export PDF',
    noReportData: 'You haven\'t entered any data this week. Keep logging your food to get a report.',
    complianceNote: 'This week you complied with your goal by {pct}%.',
    highKcalNote: 'Average calories ({avg}) were slightly above the target.',
    goodBalanceNote: 'Calorie balance was well maintained.',
    weightLossNote: 'Your weight decreased by {val} kg — great result!',
    weightGainNote: 'Weight slightly increased ({val} kg), but it could be water or muscle mass.',
    perDay: '/day',
    national: 'National',
    ingredient: 'Ingredient',
    selectIngredient: 'Select Ingredient',
    searchFood: 'Search Food',
    searchPlaceholder: 'What did you eat?',
    popularSearches: 'Popular Searches',
    noResults: 'Nothing found',
    noResultsMsg: 'No results for "{query}". Please try another word or add it yourself.',
    addManual: 'Add manually',
    extraOptions: 'Extra Options',
    compose: 'Compose',
    manual: 'Manual',
    barcode: 'Barcode',
    loadError: 'Error loading data',
    preparing: 'Preparing...',
    nationalDish: 'National dish',
    atWhatTime: 'At what time?',
    composition: 'Composition (for selected amount, not per 100g)',
    added: 'Added',
    saving: 'Saving...',
    addToDiary: 'Add to diary',
    unit_g: 'grams',
    unit_ml: 'milliliters',
    unit_piece: 'piece',
    unit_cup: 'cup',
    unit_tbsp: 'tbsp',
    unit_tsp: 'tsp',
    unit_serving: 'serving',
    assemble: 'Assemble from ingredients',
    clearAll: 'Clear all?',
    clear: 'Clear',
    mealName: 'Meal name',
    addIngredients: 'Add ingredients',
    composerExample: 'Example: 2 fried sausages + 2 boiled eggs + 0.5 tomato',
    addIngredient: 'Add ingredient',
    composerSearchSub: 'Thousands of products and recipes',
    total: 'TOTAL',
    cooking_raw: 'Raw',
    cooking_boiled: 'Boiled',
    cooking_fried: 'Fried',
    cooking_baked: 'Baked',
    cooking_grilled: 'Grilled',
    oil: 'Oil',
    waterIntake: 'Water intake',
    logWeight: 'Log weight',
    last: 'Last',
    firstEntry: 'First entry',
    noteOptional: 'NOTE (optional)',
    weightNoteExample: 'e.g. morning after breakfast',
    errorOccurred: 'An error occurred. Please try again.',
    close: 'Close',
    decrease: 'Decrease',
    goal_lose: 'Weight loss',
    goal_gain: 'Weight gain',
    goal_maintain: 'Maintain weight',
    level_sedentary: 'Sedentary',
    level_light: 'Light active',
    level_moderate: 'Moderate active',
    level_active: 'Very active',
    level_very_active: 'Extremely active',
    level_low: 'Low',
    level_medium: 'Medium',
    level_high: 'High',
    dark: 'Dark',
    light: 'Light',
    metric: 'Metric',
    appleHealth: 'Apple Health',
    appleWatch: 'Apple Watch',
    items: 'pcs',
    microNutrients: 'Micronutrients',
    aiAdvisor: 'AI Advice',
    manageProducts: 'Manage Products',
    addProduct: 'New Product',
    editProduct: 'Edit Product',
    saveProduct: 'Save Product',
    deleteProduct: 'Delete Product',
    productName: 'Name',
    productKcal: 'Kcal',
    productProtein: 'Protein',
    productCarbs: 'Carbs',
    productFat: 'Fat',
  },
};
