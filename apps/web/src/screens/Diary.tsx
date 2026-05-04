import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, TopBar, TabBar, Card, FoodThumb } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useTabNav } from '@/hooks/useTabNav';
import { useDiary } from '@/stores/diary';
import { ymd as formatDate } from '@/data/date';
import type { MealType } from '@fit/shared-types';
import { useProfile } from '@/stores/profile';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};


function buildDayStrip(today: Date, daysShort: string[]) {
  const dow = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      label: daysShort[i]!,
      day: d.getDate(),
      ymd: formatDate(d),
      isToday: formatDate(d) === formatDate(today),
      isFuture: d > today,
    };
  });
}

export function DiaryScreen() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const onTab = useTabNav();
  const entries = useDiary((s) => s.entries);
  const removeEntry = useDiary((s) => s.removeEntry);

  const todayDate = new Date();
  const [selectedYmd, setSelectedYmd] = useState(formatDate(todayDate));
  const strip = useMemo(() => buildDayStrip(todayDate, t.daysShort), [todayDate, t.daysShort]);

  const dayEntries = useMemo(
    () => entries.filter((e) => e.date === selectedYmd).sort((a, b) => a.addedAt - b.addedAt),
    [entries, selectedYmd],
  );

  const totals = useMemo(() => {
    return dayEntries.reduce(
      (acc, e) => {
        acc.kcal += e.kcal;
        acc.p += e.protein;
        acc.c += e.carbs;
        acc.f += e.fat;
        return acc;
      },
      { kcal: 0, p: 0, c: 0, f: 0 },
    );
  }, [dayEntries]);

  const target = useProfile((s) => s.targetKcal) || 2000;
  const pct = Math.min(100, Math.round((totals.kcal / target) * 100));

  const meals: Array<{ n: string; type: MealType; time: string; target: number; icon: string; color: string }> = [
    { n: t.breakfast, type: 'breakfast', time: '08:00', target: Math.round(target * 0.25), icon: '🥐', color: FIT.primary },
    { n: t.lunch, type: 'lunch', time: '13:30', target: Math.round(target * 0.40), icon: '🍱', color: FIT.accent },
    { n: t.dinner, type: 'dinner', time: '19:00', target: Math.round(target * 0.25), icon: '🍲', color: FIT.protein },
    { n: t.snack, type: 'snack', time: '', target: Math.round(target * 0.10), icon: '🍎', color: FIT.fat },
  ];

  return (
    <Phone dark={dark}>
      <TopBar title={t.diary} transparent right={<Icon name="calendar" size={22} color={FIT.text} />} />

      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          {strip.map((d) => {
            const active = d.ymd === selectedYmd;
            return (
              <motion.button
                whileTap={!d.isFuture ? { scale: 0.9 } : {}}
                type="button"
                key={d.ymd}
                onClick={() => !d.isFuture && setSelectedYmd(d.ymd)}
                disabled={d.isFuture}
                style={{
                  flex: 1, height: 64, borderRadius: 16,
                  background: active ? FIT.primary : (dark ? 'rgba(255,255,255,0.03)' : '#fff'),
                  border: `1px solid ${active ? FIT.primary : (dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9')}`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 2,
                  color: active ? '#fff' : FIT.text,
                  opacity: d.isFuture ? 0.3 : 1,
                  cursor: d.isFuture ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: active ? `0 8px 16px ${FIT.primary}33` : 'none',
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', opacity: 0.7 }}>{d.label}</span>
                <span style={{ fontSize: 18, fontWeight: 900, fontFamily: FIT.mono }}>{d.day}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        key={selectedYmd}
        style={{ flex: 1, overflow: 'auto', padding: '0 20px 100px' }}
      >
        <motion.div variants={itemVariants}>
          <Card pad={20} style={{ 
            marginBottom: 20, background: dark ? 'rgba(30, 41, 59, 0.4)' : '#fff',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                  {selectedYmd === formatDate(todayDate) ? t.resultToday : selectedYmd}
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, fontFamily: FIT.mono, letterSpacing: -1, color: FIT.text }}>
                  {totals.kcal.toLocaleString()}{' '}
                  <span style={{ fontSize: 14, color: FIT.textMuted, fontWeight: 700 }}>/ {target.toLocaleString()} {t.kcal}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                 <div style={{ fontSize: 20, fontWeight: 900, color: FIT.primary, fontFamily: FIT.mono }}>{pct}%</div>
              </div>
            </div>
            
            <div style={{ height: 8, background: dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9', borderRadius: 4, marginTop: 12, overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1 }}
                style={{ height: '100%', background: FIT.primary, borderRadius: 4 }} 
              />
            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
              <MacroInfo label={t.protein} value={totals.p} color={FIT.protein} t={t} />
              <MacroInfo label={t.carbs} value={totals.c} color={FIT.carbs} t={t} />
              <MacroInfo label={t.fat} value={totals.f} color={FIT.fat} t={t} />
            </div>
          </Card>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {meals.map((m) => {
            const mealEntries = dayEntries.filter((e) => e.mealType === m.type);
            const mealKcal = Math.round(mealEntries.reduce((sum, e) => sum + e.kcal, 0));
            const isEmpty = mealEntries.length === 0;

            return (
              <motion.div variants={itemVariants} key={m.type}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '0 4px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                     <span style={{ fontSize: 18 }}>{m.icon}</span>
                     <span style={{ fontSize: 16, fontWeight: 800, color: FIT.text }}>{m.n}</span>
                     <span style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 600 }}>· {mealKcal} {t.kcal}</span>
                   </div>
                   <motion.button
                     whileTap={{ scale: 0.9 }}
                     onClick={() => navigate(`/search?meal=${m.type}`)}
                     style={{
                       width: 28, height: 28, borderRadius: 8, background: `${m.color}15`,
                       border: 'none', color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                       cursor: 'pointer'
                     }}
                   >
                     <Icon name="plus" size={16} strokeWidth={3} />
                   </motion.button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {isEmpty ? (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/search?meal=${m.type}`)}
                      style={{
                        padding: 16, borderRadius: 16, background: 'transparent',
                        border: `1.5px dashed ${dark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`,
                        color: FIT.textMuted, fontSize: 13, fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      + {t.addFood}
                    </motion.button>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {mealEntries.map((e) => {
                        const isComposed = e.foodSlug === '__composed__';
                        const name = isComposed ? (e.note ?? t.myMeal) : (e.foodName || e.foodSlug);
                        const emoji = isComposed ? '🧩' : (e.foodEmoji || '🍽');
                        
                        return (
                          <motion.div 
                            key={e.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, x: 50 }}
                            layout
                          >
                            <Card pad={12} style={{ display: 'flex', gap: 12, alignItems: 'center', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                              <FoodThumb emoji={emoji} photo={e.foodPhotoUrl ?? undefined} tone={isComposed ? 'purple' : 'amber'} size={44} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: FIT.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {name}
                                </div>
                                <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 600, marginTop: 2 }}>
                                  {isComposed ? `${e.grams}${t.gram}` : `${e.quantity} ${unitShort(e.unit, t)} · ${e.grams}${t.gram}`}
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                 <div style={{ fontSize: 15, fontWeight: 800, color: FIT.primary, fontFamily: FIT.mono }}>{Math.round(e.kcal)}</div>
                                 <div style={{ fontSize: 9, color: FIT.textMuted, fontWeight: 800, textTransform: 'uppercase' }}>{t.kcal}</div>
                              </div>
                              <motion.button
                                whileTap={{ scale: 0.8, color: FIT.danger }}
                                onClick={() => { if (confirm(`${name} ${t.deleteConfirm}`)) removeEntry(e.id); }}
                                style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer', marginLeft: 4 }}
                              >
                                <Icon name="trash" size={14} color={FIT.textSubtle} />
                              </motion.button>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <TabBar
        active="diary" onTab={onTab}
        labels={{ home: t.home, diary: t.diary, stats: t.stats, profile: t.profile }}
        dark={dark}
      />
    </Phone>
  );
}

function MacroInfo({ label, value, color, t }: { label: string; value: number; color: string; t: any }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10, color: FIT.textMuted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <div style={{ width: 6, height: 6, borderRadius: 3, background: color }} />
        <span style={{ fontSize: 14, fontWeight: 800, color: FIT.text, fontFamily: FIT.mono }}>{value.toFixed(0)}<span style={{ fontSize: 10 }}>{t.gram}</span></span>
      </div>
    </div>
  );
}

function unitShort(u: string, t: any): string {
  return { g: t.gram, ml: t.ml, piece: t.donor, cup: t.piyola, tbsp: t.unitTbsp, tsp: t.unitTsp, serving: t.unitServing }[u] ?? u;
}
