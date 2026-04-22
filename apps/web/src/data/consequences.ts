/**
 * Health consequence cards shown on Home + dedicated /consequences screen.
 *
 * Photos: each consequence has a `photoSlug`. The real comic-style image lives
 * at `/public/consequences/<photoSlug>.png` — user generates and drops them in.
 * If missing, we fall back to the emoji placeholder.
 *
 * These are shown when the user's intake trips a threshold in `evaluate()`.
 * The `triggers` field declares the threshold logic so Home can highlight
 * relevant cards based on today's diary state.
 */

export type Severity = 'info' | 'warn' | 'danger';

export interface Consequence {
  id: string;
  category: 'macro' | 'micro' | 'activity' | 'water' | 'sleep';
  /** Short slug used as filename for the comic photo. */
  photoSlug: string;
  /** Placeholder emoji shown when the photo isn't uploaded yet. */
  emoji: string;
  /** Severity sets border colour + sort order. */
  severity: Severity;
  title: { uz: string; ru: string; en: string };
  /** Short one-liner. */
  tagline: { uz: string; ru: string; en: string };
  /** Bullet list of consequences, ordered most likely → least. */
  consequences: Array<{ uz: string; ru: string; en: string }>;
  /** Bullet list of fixes / advice. */
  fixes: Array<{ uz: string; ru: string; en: string }>;

  /**
   * When this card is actively triggered. Home will pin triggered cards at top.
   * Stats reference today's consumed / RDA ratio or step count.
   */
  triggers?: {
    nutrient?: string;                    // e.g. 'protein', 'iron', 'vit_b12', 'fat'
    kind: 'deficit' | 'excess';
    thresholdPct?: number;                // e.g. 40 for <40% RDA; 150 for >150% RDA
    stepsMaxToday?: number;               // trigger if steps <= this
    waterMlMaxToday?: number;             // trigger if water <= this
  };
}

export const CONSEQUENCES: Consequence[] = [
  // ─── MACRO ────────────────────────────────────────────────
  {
    id: 'protein-deficit',
    category: 'macro',
    photoSlug: 'protein-deficit',
    emoji: '💪',
    severity: 'warn',
    title: { uz: "Oqsil yetishmovchiligi", ru: 'Дефицит белка', en: 'Protein deficiency' },
    tagline: {
      uz: 'Mushak zaiflashadi, yarashish sekin',
      ru: 'Мышцы слабеют, раны заживают медленно',
      en: 'Muscles weaken, slow wound healing',
    },
    consequences: [
      { uz: 'Mushak massasining yo\'qolishi', ru: 'Потеря мышечной массы', en: 'Muscle loss' },
      { uz: 'Immunitet zaiflashuvi', ru: 'Ослабление иммунитета', en: 'Weakened immunity' },
      { uz: 'Soch va tirnoqlarning mo\'rtligi', ru: 'Ломкость волос и ногтей', en: 'Brittle hair + nails' },
      { uz: 'Doimiy charchoq', ru: 'Хроническая усталость', en: 'Chronic fatigue' },
    ],
    fixes: [
      { uz: "Tovuq, go'sht, tuxum, baliq qo'shing", ru: 'Добавьте курицу, мясо, яйца, рыбу', en: 'Add chicken, meat, eggs, fish' },
      { uz: 'Whey protein (1 porsiya = 25g oqsil)', ru: 'Whey-протеин (1 порция = 25 г)', en: 'Whey protein (25g per scoop)' },
      { uz: 'Kuniga 1.6g/kg tana vazni', ru: '1.6 г на 1 кг веса тела в сутки', en: '1.6 g per kg body weight' },
    ],
    triggers: { nutrient: 'protein', kind: 'deficit', thresholdPct: 70 },
  },
  {
    id: 'fat-excess',
    category: 'macro',
    photoSlug: 'fat-excess',
    emoji: '🫀',
    severity: 'danger',
    title: { uz: "Yog' ortiqcha", ru: 'Избыток жиров', en: 'Excess fat intake' },
    tagline: {
      uz: "Yurak-qon tomir va diabet xavfi",
      ru: 'Риск сердечно-сосудистых и диабета',
      en: 'Cardiovascular + diabetes risk',
    },
    consequences: [
      { uz: 'Yurak-qon tomir kasalliklari', ru: 'Сердечно-сосудистые заболевания', en: 'Cardiovascular disease' },
      { uz: '2-tur diabet xavfi', ru: 'Риск диабета 2 типа', en: 'Type-2 diabetes risk' },
      { uz: 'Jigar yog\'lanishi (NAFLD)', ru: 'Жировой гепатоз печени', en: 'Fatty liver (NAFLD)' },
      { uz: 'Xolesterol va qon bosimi oshishi', ru: 'Рост холестерина и давления', en: 'High cholesterol + BP' },
    ],
    fixes: [
      { uz: "Qovurilgan taom o'rniga qaynatilgan/pishirilgan", ru: 'Вместо жарки — варка/запекание', en: 'Boil/bake instead of frying' },
      { uz: "Hayvon yog' o'rniga zaytun/kungaboqar", ru: 'Меньше сливочного — больше оливкового', en: 'Swap butter → olive oil' },
      { uz: 'Qandolat va fast-food kamroq', ru: 'Меньше сладкого и фаст-фуда', en: 'Less sweets + fast food' },
    ],
    triggers: { nutrient: 'fat', kind: 'excess', thresholdPct: 150 },
  },
  {
    id: 'carbs-excess',
    category: 'macro',
    photoSlug: 'sugar-excess',
    emoji: '🍬',
    severity: 'warn',
    title: { uz: 'Uglevod/shakar ortiqcha', ru: 'Избыток углеводов/сахара', en: 'Excess carbs/sugar' },
    tagline: {
      uz: "Insulin muammolari va semirish",
      ru: 'Проблемы с инсулином и лишний вес',
      en: 'Insulin spikes + weight gain',
    },
    consequences: [
      { uz: 'Qondagi shakarning beqarorligi', ru: 'Скачки сахара в крови', en: 'Blood sugar spikes' },
      { uz: 'Insulin rezistentligi', ru: 'Инсулинорезистентность', en: 'Insulin resistance' },
      { uz: 'Yog\'ning to\'planishi (qorinda)', ru: 'Накопление жира (живот)', en: 'Fat accumulation (belly)' },
      { uz: 'Tishlarning chirishi', ru: 'Кариес', en: 'Tooth decay' },
    ],
    fixes: [
      { uz: "Oq non va shakar o'rniga grechka, guruch", ru: 'Замените белый хлеб и сахар на гречку/рис', en: 'Swap white bread+sugar → buckwheat/rice' },
      { uz: 'Murabba, kola, shokoladni kamaytiring', ru: 'Меньше варенья, колы, шоколада', en: 'Cut jam, cola, chocolate' },
      { uz: 'Tolasi ko\'p sabzavotlar yeng', ru: 'Больше овощей с клетчаткой', en: 'More high-fiber veg' },
    ],
    triggers: { nutrient: 'carbs', kind: 'excess', thresholdPct: 150 },
  },

  // ─── MICRONUTRIENTS ──────────────────────────────────────
  {
    id: 'iron-deficit',
    category: 'micro',
    photoSlug: 'iron-deficit',
    emoji: '🩸',
    severity: 'danger',
    title: { uz: 'Temir yetishmovchiligi', ru: 'Дефицит железа', en: 'Iron deficiency' },
    tagline: {
      uz: "Anemiya, holsizlik, nafas qisilishi",
      ru: 'Анемия, слабость, одышка',
      en: 'Anemia, weakness, shortness of breath',
    },
    consequences: [
      { uz: 'Temir yetishmovchiligi anemiyasi', ru: 'Железодефицитная анемия', en: 'Iron-deficiency anemia' },
      { uz: "Teri oqarishi, ko'z ostlari", ru: 'Бледная кожа, круги под глазами', en: 'Pale skin, dark under-eyes' },
      { uz: "Soch to'kilishi", ru: 'Выпадение волос', en: 'Hair loss' },
      { uz: "Diqqat va xotira muammolari", ru: 'Проблемы с концентрацией и памятью', en: 'Poor focus + memory' },
    ],
    fixes: [
      { uz: "Mol go'shti, jigar, qizil go'sht", ru: 'Говядина, печень, красное мясо', en: 'Beef, liver, red meat' },
      { uz: 'Ispinoq, loviya, no\'xat', ru: 'Шпинат, фасоль, нут', en: 'Spinach, beans, chickpeas' },
      { uz: 'Vitamin C bilan (temir yaxshi so\'riladi)', ru: 'С витамином C для усвоения', en: 'Pair with vitamin C' },
    ],
    triggers: { nutrient: 'iron', kind: 'deficit', thresholdPct: 60 },
  },
  {
    id: 'b12-deficit',
    category: 'micro',
    photoSlug: 'b12-deficit',
    emoji: '🧠',
    severity: 'danger',
    title: { uz: 'B12 yetishmovchiligi', ru: 'Дефицит витамина B12', en: 'Vitamin B12 deficiency' },
    tagline: {
      uz: "Nerv va xotira muammolari",
      ru: 'Проблемы с нервами и памятью',
      en: 'Nerve + memory issues',
    },
    consequences: [
      { uz: 'Megaloblastik anemiya', ru: 'Мегалобластная анемия', en: 'Megaloblastic anemia' },
      { uz: "Qo'l-oyoq uvishishi, tikuv", ru: 'Онемение и покалывание', en: 'Numbness + tingling' },
      { uz: 'Xotira susayishi', ru: 'Ухудшение памяти', en: 'Memory decline' },
      { uz: "Uzoq muddat — qaytarib bo'lmas zarar", ru: 'Длительно — необратимый вред', en: 'Long-term — permanent damage' },
    ],
    fixes: [
      { uz: "Go'sht, tuxum, sut mahsulotlari", ru: 'Мясо, яйца, молочные продукты', en: 'Meat, eggs, dairy' },
      { uz: 'Baliq (losos, tuna)', ru: 'Рыба (лосось, тунец)', en: 'Fish (salmon, tuna)' },
      { uz: 'Veganlar uchun — maxsus dori-darmon', ru: 'Веганам — добавки обязательны', en: 'Vegans must supplement' },
    ],
    triggers: { nutrient: 'vit_b12', kind: 'deficit', thresholdPct: 60 },
  },
  {
    id: 'vit-d-deficit',
    category: 'micro',
    photoSlug: 'vit-d-deficit',
    emoji: '☀️',
    severity: 'warn',
    title: { uz: 'Vitamin D kam', ru: 'Дефицит витамина D', en: 'Vitamin D deficiency' },
    tagline: {
      uz: "Zaif suyak, immunitet pastligi",
      ru: 'Слабые кости, низкий иммунитет',
      en: 'Weak bones, low immunity',
    },
    consequences: [
      { uz: "Osteoporoz (keksalikda)", ru: 'Остеопороз (в пожилом возрасте)', en: 'Osteoporosis (in old age)' },
      { uz: "Tez shamollash", ru: 'Частые простуды', en: 'Frequent colds' },
      { uz: "Tushkunlik (SAD)", ru: 'Депрессивное настроение (SAD)', en: 'Seasonal depression' },
      { uz: "Mushak og'rig'i", ru: 'Боль в мышцах', en: 'Muscle pain' },
    ],
    fixes: [
      { uz: "Kuniga 15 daqiqa quyoshda", ru: '15 минут на солнце ежедневно', en: '15 min of sunshine daily' },
      { uz: "Yog'li baliq (losos, sardina)", ru: 'Жирная рыба (лосось, сардина)', en: 'Fatty fish (salmon, sardine)' },
      { uz: "Qishda — D3 qo'shimchasi", ru: 'Зимой — добавки D3', en: 'D3 supplement in winter' },
    ],
    triggers: { nutrient: 'vit_d', kind: 'deficit', thresholdPct: 50 },
  },
  {
    id: 'calcium-deficit',
    category: 'micro',
    photoSlug: 'calcium-deficit',
    emoji: '🦴',
    severity: 'warn',
    title: { uz: 'Kalsiy yetishmovchiligi', ru: 'Дефицит кальция', en: 'Calcium deficiency' },
    tagline: {
      uz: "Suyak va tish buziladi",
      ru: 'Кости и зубы страдают',
      en: 'Bones + teeth suffer',
    },
    consequences: [
      { uz: 'Osteopeniya / osteoporoz', ru: 'Остеопения / остеопороз', en: 'Osteopenia / osteoporosis' },
      { uz: 'Tishlarning kuchsizlanishi', ru: 'Ослабление зубов', en: 'Weakened teeth' },
      { uz: "Mushak spazmlari", ru: 'Мышечные спазмы', en: 'Muscle spasms' },
      { uz: "Tirnoqlarning mo'rtligi", ru: 'Ломкие ногти', en: 'Brittle nails' },
    ],
    fixes: [
      { uz: "Sut, qatiq, suzma, pishloq", ru: 'Молоко, катык, творог, сыр', en: 'Milk, yogurt, cheese, cottage cheese' },
      { uz: 'Kunjut, bodom, brokkoli', ru: 'Кунжут, миндаль, брокколи', en: 'Sesame, almond, broccoli' },
      { uz: "Vitamin D bilan (yaxshi so'riladi)", ru: 'С витамином D для усвоения', en: 'Pair with vitamin D' },
    ],
    triggers: { nutrient: 'calcium', kind: 'deficit', thresholdPct: 60 },
  },

  // ─── WATER ────────────────────────────────────────────────
  {
    id: 'water-low',
    category: 'water',
    photoSlug: 'water-low',
    emoji: '💧',
    severity: 'warn',
    title: { uz: 'Suv yetarli emas', ru: 'Недостаток воды', en: 'Low water intake' },
    tagline: {
      uz: "Dehidratatsiya — bosh og'riq, charchoq",
      ru: 'Обезвоживание — головная боль, усталость',
      en: 'Dehydration — headache, fatigue',
    },
    consequences: [
      { uz: "Bosh og'rig'i, bosh aylanishi", ru: 'Головная боль, головокружение', en: 'Headache, dizziness' },
      { uz: "Buyrak toshlari", ru: 'Камни в почках', en: 'Kidney stones' },
      { uz: "Qabziyat", ru: 'Запоры', en: 'Constipation' },
      { uz: "Teri quruqligi", ru: 'Сухость кожи', en: 'Dry skin' },
    ],
    fixes: [
      { uz: "Kuniga 8 stakan (2 L)", ru: '8 стаканов в день (2 л)', en: '8 glasses daily (2 L)' },
      { uz: "Har 1-2 soatda bir stakan", ru: 'Стакан каждые 1-2 часа', en: 'A glass every 1-2 hours' },
      { uz: 'Choy, sho\'rva ham hisoblanadi', ru: 'Чай и суп тоже считаются', en: 'Tea + soup count too' },
    ],
    triggers: { kind: 'deficit', waterMlMaxToday: 1000 },
  },

  // ─── ACTIVITY ────────────────────────────────────────────
  {
    id: 'steps-low',
    category: 'activity',
    photoSlug: 'steps-low',
    emoji: '🪑',
    severity: 'warn',
    title: { uz: 'Harakat kam', ru: 'Мало движения', en: 'Sedentary lifestyle' },
    tagline: {
      uz: "Kuniga 3000 qadamdan kam — xavf ko'p",
      ru: 'Меньше 3000 шагов — повышенный риск',
      en: 'Under 3000 steps — elevated risk',
    },
    consequences: [
      { uz: "Ortiqcha vazn va semirish", ru: 'Лишний вес и ожирение', en: 'Weight gain + obesity' },
      { uz: "Yurak-qon tomir kasalliklari", ru: 'Сердечно-сосудистые болезни', en: 'Cardiovascular disease' },
      { uz: "Varikoz venalar", ru: 'Варикозное расширение вен', en: 'Varicose veins' },
      { uz: "Orqa og'rig'i, bo'yin", ru: 'Боль в спине и шее', en: 'Back + neck pain' },
      { uz: "Depressiya va uyqu buzilishi", ru: 'Депрессия и бессонница', en: 'Depression + insomnia' },
    ],
    fixes: [
      { uz: 'Kuniga 8-10 ming qadam', ru: '8–10 тысяч шагов в день', en: '8–10 000 steps daily' },
      { uz: 'Har 1 soatda 5 daqiqa yurish', ru: 'Каждый час — 5 минут ходьбы', en: '5 min walk every hour' },
      { uz: 'Liftdan emas, zinapoya', ru: 'Лестница вместо лифта', en: 'Stairs, not elevator' },
    ],
    triggers: { kind: 'deficit', stepsMaxToday: 3000 },
  },
  {
    id: 'steps-zero',
    category: 'activity',
    photoSlug: 'steps-zero',
    emoji: '⚠️',
    severity: 'danger',
    title: { uz: "Hech qadam yo'q", ru: 'Совсем не ходите', en: 'Not moving at all' },
    tagline: {
      uz: "Mushak atrofiyasi va boshqa jiddiy xavflar",
      ru: 'Атрофия мышц и серьёзные риски',
      en: 'Muscle atrophy + serious risks',
    },
    consequences: [
      { uz: 'Mushak atrofiyasi (kuchsizlanish)', ru: 'Атрофия мышц', en: 'Muscle atrophy' },
      { uz: "Chuqur tomir trombozi", ru: 'Тромбоз глубоких вен', en: 'Deep vein thrombosis' },
      { uz: 'Suyak zichligining pasayishi', ru: 'Снижение плотности костей', en: 'Bone density loss' },
      { uz: 'Metabolik sindrom', ru: 'Метаболический синдром', en: 'Metabolic syndrome' },
    ],
    fixes: [
      { uz: "Hech bo'lmaganda har soatda turing", ru: 'Хотя бы вставайте каждый час', en: 'Stand up every hour' },
      { uz: 'Uy ichida ham yurib bo\'ladi', ru: 'Можно ходить дома', en: 'Even indoor walks count' },
      { uz: "Do'kongacha piyoda", ru: 'До магазина пешком', en: 'Walk to the store' },
    ],
    triggers: { kind: 'deficit', stepsMaxToday: 500 },
  },
  {
    id: 'sodium-excess',
    category: 'micro',
    photoSlug: 'salt-excess',
    emoji: '🧂',
    severity: 'warn',
    title: { uz: "Tuz ortiqcha", ru: 'Избыток соли', en: 'Excess salt' },
    tagline: {
      uz: "Qon bosimi va buyraklar",
      ru: 'Давление и почки',
      en: 'Blood pressure + kidneys',
    },
    consequences: [
      { uz: "Yuqori qon bosimi (gipertoniya)", ru: 'Гипертония', en: 'Hypertension' },
      { uz: "Buyraklarga yuk", ru: 'Нагрузка на почки', en: 'Kidney strain' },
      { uz: "Insult xavfi", ru: 'Риск инсульта', en: 'Stroke risk' },
      { uz: "Shishish (yuz, oyoqlar)", ru: 'Отёки (лицо, ноги)', en: 'Swelling (face, legs)' },
    ],
    fixes: [
      { uz: 'Kuniga 2.3g dan kam tuz', ru: 'Менее 2.3 г соли в день', en: 'Under 2.3 g salt daily' },
      { uz: 'Yarim-tayyor ovqat kamroq', ru: 'Меньше полуфабрикатов', en: 'Less processed food' },
      { uz: "Ziravor bilan ta'm qo'shing", ru: 'Вкус — специями, не солью', en: 'Season with spices, not salt' },
    ],
    triggers: { nutrient: 'sodium', kind: 'excess', thresholdPct: 120 },
  },
];

/** RDA for adults — used by evaluate(). Keep in sync with packages/nutrition-core/src/rda.ts */
export const RDA: Record<string, number> = {
  protein: 60, carbs: 275, fat: 78, fiber: 28,
  vit_a: 900, vit_c: 90, vit_d: 15, vit_e: 15, vit_k: 120,
  vit_b1: 1.2, vit_b2: 1.3, vit_b3: 16, vit_b6: 1.7, vit_b12: 2.4,
  folate: 400, calcium: 1000, iron: 11, magnesium: 400, potassium: 3400,
  zinc: 11, sodium: 2300,
};

export interface TodayIntake {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  micros: Record<string, number>;
  steps: number;
  waterMl: number;
}

/** Returns consequences triggered by today's intake, highest severity first. */
export function triggeredConsequences(intake: TodayIntake): Consequence[] {
  const triggered: Array<{ c: Consequence; rank: number }> = [];
  for (const c of CONSEQUENCES) {
    if (!c.triggers) continue;
    const trig = c.triggers;

    // Step-based
    if (trig.stepsMaxToday !== undefined) {
      if (intake.steps <= trig.stepsMaxToday) {
        triggered.push({ c, rank: severityRank(c.severity) });
      }
      continue;
    }

    // Water-based
    if (trig.waterMlMaxToday !== undefined) {
      if (intake.waterMl <= trig.waterMlMaxToday) {
        triggered.push({ c, rank: severityRank(c.severity) });
      }
      continue;
    }

    // Nutrient-based
    if (trig.nutrient) {
      const target = RDA[trig.nutrient];
      if (!target) continue;
      const current =
        trig.nutrient === 'protein' ? intake.protein :
        trig.nutrient === 'carbs' ? intake.carbs :
        trig.nutrient === 'fat' ? intake.fat :
        intake.micros[trig.nutrient] ?? 0;
      const pct = (current / target) * 100;
      if (trig.kind === 'deficit' && pct < (trig.thresholdPct ?? 50)) {
        triggered.push({ c, rank: severityRank(c.severity) });
      } else if (trig.kind === 'excess' && pct > (trig.thresholdPct ?? 150)) {
        triggered.push({ c, rank: severityRank(c.severity) });
      }
    }
  }
  triggered.sort((a, b) => b.rank - a.rank);
  return triggered.map((t) => t.c);
}

function severityRank(s: Severity): number {
  return s === 'danger' ? 3 : s === 'warn' ? 2 : 1;
}
