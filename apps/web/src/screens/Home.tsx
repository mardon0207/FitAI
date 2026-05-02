import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, TabBar, Card, MultiRing, FoodThumb } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { AnimatedNumber } from '@/design/AnimatedNumber';
import { FIT } from '@/design/tokens';
import { useT, usePrefs } from '@/stores/prefs';
import { useTabNav } from '@/hooks/useTabNav';
import { useDiary } from '@/stores/diary';
import { todayYmd } from '@/data/date';
import { CONSEQUENCES, triggeredConsequences } from '@/data/consequences';
import type { MealType } from '@fit/shared-types';
import { useProfile } from '@/stores/profile';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
} as const;

export function HomeScreen() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const dark = usePrefs((s) => s.theme === 'dark');
  const onTab = useTabNav();
  const navigate = useNavigate();
  const targetKcal = useProfile((s) => s.targetKcal);
  const targetProtein = useProfile((s) => s.targetProtein);
  const targetCarbs = useProfile((s) => s.targetCarbs);
  const targetFat = useProfile((s) => s.targetFat);
  const profileName = useProfile((s) => s.name) || 'User';
  const targets = { kcal: targetKcal, protein: targetProtein, carbs: targetCarbs, fat: targetFat };

  const entries = useDiary((s) => s?.entries) || [];
  const water = useDiary((s) => s?.water) || [];
  const stepsRecords = useDiary((s) => s?.steps) || [];
  const weightRecords = useDiary((s) => s?.weight) || [];

  // Debug logging to catch why it crashes at 44:13
  console.log('HomeScreen Debug:', { 
    entriesCount: entries.length, 
    waterCount: water.length, 
    stepsCount: stepsRecords.length, 
    weightCount: weightRecords.length 
  });

  const ymd = todayYmd();
  const waterMl = useMemo(
    () => water.filter((w) => w && w.date === ymd).reduce((sum, w) => sum + (w.ml || 0), 0),
    [water, ymd],
  );
  const steps = useMemo(
    () => stepsRecords.find((x) => x && x.date === ymd)?.steps ?? 0,
    [stepsRecords, ymd],
  );
  const weightLatest = useMemo(() => {
    if (!Array.isArray(weightRecords)) return 70;
    const sorted = [...weightRecords].filter(Boolean).sort((a, b) => b.addedAt - a.addedAt);
    return sorted[0]?.kg ?? 70;
  }, [weightRecords]);

  const allActivities = useDiary((s) => s.activities || []);
  const burnedKcalTotal = useMemo(() => 
    allActivities.filter(x => x.date === ymd).reduce((sum, x) => sum + (x.kcalBurned || 0), 0),
    [allActivities, ymd]
  );

  const today = useMemo(() => {
    const todays = entries.filter((e) => e.date === ymd);
    const kcal = todays.reduce((s, e) => s + e.kcal, 0);
    const p = todays.reduce((s, e) => s + e.protein, 0);
    const c = todays.reduce((s, e) => s + e.carbs, 0);
    const f = todays.reduce((s, e) => s + e.fat, 0);
    const micros: Record<string, number> = {};
    for (const e of todays) {
      if (e && e.micros) {
        for (const [k, v] of Object.entries(e.micros)) {
          micros[k] = (micros[k] ?? 0) + v;
        }
      }
    }
    return { entries: todays, kcal, p, c, f, micros };
  }, [entries]);

  const burnedKcal = Math.round(steps * 0.04 * ((weightLatest ?? 70) / 70));
  const pct = (x: number, y: number) => (y > 0 ? Math.min(1, x / y) : 0);

  const mealSummary: Array<{ n: string; type: MealType; time: string; target: number; color: string }> = [
    { n: t.breakfast, type: 'breakfast', time: '~08:00', target: Math.round(targetKcal * 0.25), color: FIT.primary },
    { n: t.lunch, type: 'lunch', time: '~13:30', target: Math.round(targetKcal * 0.40), color: FIT.accent },
    { n: t.dinner, type: 'dinner', time: '~19:00', target: Math.round(targetKcal * 0.25), color: FIT.protein },
  ];

  const hh = new Date().getHours();
  const greet = hh < 12 ? t.goodMorning : hh < 17 ? t.goodAfternoon : t.goodEvening;
  const dateLabel = new Date().toLocaleDateString(lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <Phone dark={dark}>
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={containerVariants}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        <div style={{
          padding: '16px 20px 20px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <motion.div variants={itemVariants} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              padding: '4px 10px', borderRadius: 20, marginBottom: 8,
            }}>
              <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: dark ? '#CBD5E1' : '#64748B' }}>
                {dateLabel}
              </span>
            </motion.div>
            <motion.div variants={itemVariants} style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.8, color: FIT.text }}>
              {greet}, {profileName.split(' ')[0]} 👋
            </motion.div>
          </div>
          <motion.button
            variants={itemVariants}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/profile')}
            style={{
              width: 44, height: 44, borderRadius: 22,
              background: `linear-gradient(135deg, ${FIT.primary}, ${FIT.primaryDark})`,
              border: '2px solid #fff', boxShadow: FIT.shadowMd,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, color: '#fff', fontWeight: 800,
            }}
          >
            {profileName.charAt(0)}
          </motion.button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 24px' }}>
          <motion.div variants={itemVariants}>
            <Card pad={24} style={{ 
              display: 'flex', gap: 24, alignItems: 'center', marginBottom: 16,
              background: dark ? 'rgba(30, 41, 59, 0.4)' : '#fff',
              border: dark ? `1px solid rgba(255,255,255,0.05)` : `1px solid #F1F5F9`,
            }}>
              <div style={{ position: 'relative' }}>
                <MultiRing
                  size={140}
                  rings={[
                    { progress: pct(today.kcal, targetKcal), color: FIT.primary },
                    { progress: pct(today.p, targetProtein), color: FIT.protein },
                    { progress: pct(today.c, targetCarbs), color: FIT.carbs },
                    { progress: pct(today.f, targetFat), color: FIT.fat },
                  ]}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 900, fontFamily: FIT.mono, letterSpacing: -1, color: FIT.text }}>
                      <AnimatedNumber value={today.kcal} />
                    </div>
                    <div style={{ fontSize: 10, color: FIT.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
                       {t.kcal}
                    </div>
                  </div>
                </MultiRing>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: FIT.textMuted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {t.remainingToGoal}
                  </div>
                  <div style={{
                    fontSize: 24, fontWeight: 900, fontFamily: FIT.mono,
                    color: FIT.primary, letterSpacing: -0.5,
                  }}>
                    <AnimatedNumber value={Math.max(0, targets.kcal - today.kcal)} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {([
                    { cur: today.p, tar: targets.protein, c: FIT.protein },
                    { cur: today.c, tar: targets.carbs, c: FIT.carbs },
                    { cur: today.f, tar: targets.fat, c: FIT.fat },
                  ] as const).map((m, idx) => (
                    <div key={idx} style={{ flex: 1 }}>
                      <div style={{ height: 4, background: dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9', borderRadius: 2, marginBottom: 4 }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${pct(m.cur, m.tar) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                          style={{ height: 4, background: m.c, borderRadius: 2 }} 
                        />
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: FIT.textMuted, fontFamily: FIT.mono }}>
                        {m.cur.toFixed(0)}{t.gram}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <StatTile
              icon="🏃" label={t.sport || 'Sport'} value={String(burnedKcalTotal ?? 0)} unit={t.kcal}
              pct={Math.min(1, burnedKcalTotal / 500)} color={FIT.primary}
              onClick={() => navigate('/sport')}
            />
            <StatTile
              icon="💧" label={t.water}
              value={Math.round(waterMl / 250).toString()} unit={`/ 8 ${t.glass}`}
              pct={Math.min(1, waterMl / 2000)} color="#3B82F6"
              onClick={() => navigate('/water')}
            />
            <StatTile
              icon="🚶" label={t.steps}
              value={steps.toString()} unit={t.steps.toLowerCase()}
              color={FIT.accent}
              onClick={() => navigate('/sport')}
            />
            <StatTile
              icon="⚖️" label={t.weight}
              value={weightLatest ? weightLatest.toFixed(1) : '—'} unit="kg"
              color={FIT.protein}
              onClick={() => navigate('/weight')}
            />
          </motion.div>

          <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: FIT.text, letterSpacing: -0.5 }}>{t.todaysMeals}</div>
            <button 
              type="button" 
              onClick={() => navigate('/diary')}
              style={{ fontSize: 13, color: FIT.primary, fontWeight: 700, background: 'none', border: 'none' }}
            >
              {t.all} →
            </button>
          </motion.div>
          
          <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {mealSummary.map((m) => {
              const mealEntries = today.entries.filter((e) => e.mealType === m.type);
              const mealKcal = Math.round(mealEntries.reduce((s, e) => s + e.kcal, 0));
              const isEmpty = mealEntries.length === 0;
              return (
                <motion.div key={m.type} whileTap={{ scale: 0.98 }}>
                  <Card pad={0} onClick={() => navigate('/diary')}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 12, 
                          background: `${m.color}15`, 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 18
                        }}>
                          {m.type === 'breakfast' ? '🥐' : m.type === 'lunch' ? '🍱' : '🍲'}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{m.n}</div>
                          <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 600 }}>{mealKcal} {t.kcal}</div>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); navigate(`/search?meal=${m.type}`); }}
                        style={{
                          width: 32, height: 32, borderRadius: 10,
                          background: FIT.primarySoft, border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Icon name="plus" size={16} color={FIT.primary} strokeWidth={3} />
                      </motion.button>
                    </div>
                    {!isEmpty && (
                      <div style={{ 
                        padding: '0 16px 14px', display: 'flex', gap: 6, overflow: 'auto',
                        borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.03)' : '#F8FAFC'}`
                      }}>
                        {mealEntries.map((e) => (
                           <div key={e.id} style={{
                             padding: '4px 10px', background: dark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                             borderRadius: 8, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
                             border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}`
                           }}>
                             {e.foodEmoji} {e.foodName || e.foodSlug}
                           </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {today.kcal > 0 && (
            <motion.div variants={itemVariants} className="glass" style={{
              padding: 20, borderRadius: 20, marginBottom: 20,
              display: 'flex', gap: 14, position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ fontSize: 28 }}>🤖</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 10, color: FIT.primaryDark, fontWeight: 800,
                  textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4
                }}>
                  Smart Fit AI
                </div>
                <div style={{ fontSize: 13, color: FIT.text, fontWeight: 600, lineHeight: 1.6 }}>
                  {getTip(today.p, today.c, today.f, today.kcal, targets, t)}
                </div>
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <ConsequencesStrip
              intake={{
                kcal: today.kcal, protein: today.p, carbs: today.c, fat: today.f,
                micros: today.micros, steps, waterMl,
              }}
              lang={lang}
              onViewAll={() => navigate('/consequences')}
            />
          </motion.div>
        </div>
      </motion.div>

      <TabBar
        active="home" onTab={onTab}
        labels={{ home: t.home, diary: t.diary, stats: t.stats, profile: t.profile }}
        dark={dark}
      />
    </Phone>
  );
}

function StatTile({
  icon, label, value, unit, pct, color, onClick,
}: {
  icon: string; label: string; value: string; unit: string; pct?: number; color: string; onClick?: () => void;
}) {
  return (
    <motion.div whileTap={onClick ? { scale: 0.95 } : {}}>
      <Card pad={16} onClick={onClick} style={{ border: '1px solid #F1F5F9', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ 
            width: 28, height: 28, borderRadius: 8, background: `${color}15`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
          }}>
            {icon}
          </div>
          <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 24, fontWeight: 900, fontFamily: FIT.mono, letterSpacing: -1, color: FIT.text }}>
            {value}
          </span>
          <span style={{ fontSize: 10, color: FIT.textMuted, fontWeight: 700 }}>{unit}</span>
        </div>
        {pct !== undefined && (
          <div style={{ height: 5, background: `${color}15`, borderRadius: 10, marginTop: 10 }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${pct * 100}%` }}
              transition={{ duration: 1, delay: 0.8 }}
              style={{ height: '100%', background: color, borderRadius: 10 }} 
            />
          </div>
        )}
      </Card>
    </motion.div>
  );
}

function ConsequencesStrip({ intake, lang, onViewAll }: ConsequencesStripProps) {
  const t = useT();
  const active = useMemo(() => triggeredConsequences(intake), [intake]);
  const title = active.length > 0 ? t.healthStatus : t.healthAnalysis;
  const cards = active.length > 0 ? active.slice(0, 5) : ['steps-low', 'protein-deficit', 'iron-deficit', 'fat-excess', 'water-low'].slice(0, 5);

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: FIT.text, letterSpacing: -0.5 }}>{title}</div>
        <button onClick={onViewAll} style={{ fontSize: 13, color: FIT.primary, fontWeight: 700, background: 'none', border: 'none' }}>{t.all} →</button>
      </div>
      <div style={{ display: 'flex', gap: 12, overflow: 'auto', paddingBottom: 8, margin: '0 -20px', paddingLeft: 20, paddingRight: 20 }}>
        {cards.map((c) => (
          <StripCard key={typeof c === 'string' ? c : c.id} id={typeof c === 'string' ? c : c.id} lang={lang} onClick={onViewAll} />
        ))}
      </div>
    </div>
  );
}

function StripCard({ id, lang, onClick }: { id: string; lang: 'uz' | 'ru' | 'en'; onClick: () => void }) {
  const c = CONSEQUENCES.find((x) => x.id === id);
  if (!c) return null;
  const color = c.severity === 'danger' ? FIT.danger : c.severity === 'warn' ? FIT.accent : FIT.primary;
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        minWidth: 160, flexShrink: 0, padding: 16, background: '#fff',
        borderRadius: 20, border: `1px solid ${color}20`,
        boxShadow: FIT.shadowSm, cursor: 'pointer', textAlign: 'left',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 14, fontSize: 24, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {c.emoji}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.2, color: FIT.text, marginBottom: 2 }}>{c.title[lang]}</div>
        <div style={{ fontSize: 10, color: FIT.textMuted, fontWeight: 600, lineHeight: 1.4 }}>{c.tagline[lang]}</div>
      </div>
    </motion.button>
  );
}

function getTip(p: number, _c: number, _f: number, kcal: number, targets: { kcal: number; protein: number; carbs: number; fat: number }, t: any): string {
  const pr = p / targets.protein;
  const kr = kcal / targets.kcal;
  if (pr < 0.4 && kr > 0.5) return t.aiTipProtein;
  if (kr > 1.1) return t.aiTipKcalHigh;
  if (kr < 0.3 && new Date().getHours() > 15) return t.aiTipKcalLow;
  if (kr > 0.8 && pr > 0.8) return t.aiTipBalance;
  return t.aiTipWater;
}

interface ConsequencesStripProps {
  intake: { kcal: number; protein: number; carbs: number; fat: number; micros: Record<string, number>; steps: number; waterMl: number };
  lang: 'uz' | 'ru' | 'en';
  onViewAll: () => void;
}
