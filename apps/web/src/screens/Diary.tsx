import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Phone, TabBar, Card, FoodThumb, Ring } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useTabNav } from '@/hooks/useTabNav';
import { useDiary } from '@/stores/diary';
import { ymd as formatDate } from '@/data/date';
import type { MealType } from '@fit/shared-types';
import { useProfile } from '@/stores/profile';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
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
  const dark = true; // Premium is dark only
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

  const targetKcal = useProfile((s) => s.targetKcal) || 2000;
  const targetP = useProfile((s) => s.targetProtein) || 150;
  const targetC = useProfile((s) => s.targetCarbs) || 200;
  const targetF = useProfile((s) => s.targetFat) || 60;

  const pct = (x: number, y: number) => (y > 0 ? Math.min(1, x / y) : 0);

  const meals: Array<{ n: string; type: MealType; icon: string; color: string }> = [
    { n: t.breakfast, type: 'breakfast', icon: '🥐', color: FIT.cyan },
    { n: t.lunch, type: 'lunch', icon: '🍱', color: FIT.lime },
    { n: t.dinner, type: 'dinner', icon: '🍲', color: FIT.neonPink },
    { n: t.snack, type: 'snack', icon: '🍎', color: FIT.purple },
  ];

  return (
    <Phone dark showStatus mesh stagger>
      {/* Header & Date Strip */}
      <div style={{ padding: '8px 24px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: -1 }}>{t.diary}</div>
          <motion.button 
             whileTap={{ scale: 0.9 }}
             style={{ width: 44, height: 44, borderRadius: 15, background: 'rgba(255,255,255,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="calendar" size={22} color={FIT.cyan} />
          </motion.button>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          {strip.map((d) => {
            const active = d.ymd === selectedYmd;
            return (
              <motion.button
                whileTap={!d.isFuture ? { scale: 0.92 } : {}}
                type="button"
                key={d.ymd}
                onClick={() => !d.isFuture && setSelectedYmd(d.ymd)}
                disabled={d.isFuture}
                className={active ? "neon-glow-cyan" : ""}
                style={{
                  flex: 1, height: 74, borderRadius: 20,
                  background: active ? FIT.cyan : 'rgba(255,255,255,0.03)',
                  border: active ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 4,
                  color: active ? '#000' : '#64748B',
                  opacity: d.isFuture ? 0.3 : 1,
                  cursor: d.isFuture ? 'not-allowed' : 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5 }}>{d.label}</span>
                <span style={{ fontSize: 22, fontWeight: 900, fontFamily: FIT.mono }}>{d.day}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 120px' }}>
        <div data-fit-stagger>
          {/* Daily Summary Glass Card */}
          <motion.div variants={itemVariants} key={selectedYmd}>
            <Card variant="glass" pad={24} style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
                <Ring 
                   size={100} stroke={10} 
                   progress={pct(totals.kcal, targetKcal)} 
                   color={FIT.cyan}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, fontFamily: FIT.mono, color: '#fff' }}>
                      {Math.round(pct(totals.kcal, targetKcal) * 100)}%
                    </div>
                  </div>
                </Ring>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>
                    {t.resultToday}
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, fontFamily: FIT.mono, color: '#fff', letterSpacing: -1 }}>
                    {totals.kcal.toLocaleString()} <span style={{ fontSize: 14, color: '#64748B', fontWeight: 800 }}>/ {targetKcal} kcal</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <MacroBarMini label={t.proteinShort || 'PRO'} value={totals.p} target={targetP} color={FIT.neonPink} />
                <MacroBarMini label={t.carbsShort || 'CAR'} value={totals.c} target={targetC} color={FIT.lime} />
                <MacroBarMini label={t.fatShort || 'FAT'} value={totals.f} target={targetF} color={FIT.purple} />
              </div>
            </Card>
          </motion.div>

          {/* Meals Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {meals.map((m) => {
              const mealEntries = dayEntries.filter((e) => e.mealType === m.type);
              const mealKcal = Math.round(mealEntries.reduce((sum, e) => sum + e.kcal, 0));
              const isEmpty = mealEntries.length === 0;

              return (
                <motion.div variants={itemVariants} key={m.type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ 
                        width: 44, height: 44, borderRadius: 16, background: `${m.color}15`, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                        border: `1px solid ${m.color}22`
                      }}>
                        {m.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{m.n}</div>
                        <div style={{ fontSize: 11, color: m.color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                          {mealKcal} {t.kcal}
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(`/search?meal=${m.type}`)}
                      style={{
                        width: 40, height: 40, borderRadius: 14, background: FIT.cyan,
                        border: 'none', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 4px 20px ${FIT.cyan}44`
                      }}
                    >
                      <Icon name="plus" size={20} strokeWidth={3} />
                    </motion.button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {isEmpty ? (
                      <Card variant="glass" pad={16} onClick={() => navigate(`/search?meal=${m.type}`)} style={{
                        border: '1px dashed rgba(255,255,255,0.1)', background: 'transparent'
                      }}>
                        <div style={{ fontSize: 14, color: '#64748B', fontWeight: 700, textAlign: 'center' }}>
                          + {t.addFood}
                        </div>
                      </Card>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {mealEntries.map((e) => {
                          const isComposed = e.foodSlug === '__composed__';
                          const name = isComposed ? (e.note ?? t.myMeal) : (e.foodName || e.foodSlug);
                          const emoji = isComposed ? '🧩' : (e.foodEmoji || '🍽');
                          
                          return (
                            <motion.div 
                              key={e.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              layout
                            >
                              <Card variant="glass" pad={16} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                <FoodThumb emoji={emoji} photo={e.foodPhotoUrl ?? undefined} tone={m.color === FIT.cyan ? 'green' : (m.color === FIT.lime ? 'amber' : 'pink')} size={52} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {name}
                                  </div>
                                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>
                                    {e.grams}g · {Math.round(e.kcal)} kcal
                                  </div>
                                </div>
                                <motion.button
                                  whileTap={{ scale: 0.8 }}
                                  onClick={() => { if (confirm(`${name} ${t.deleteConfirm}`)) removeEntry(e.id); }}
                                  style={{ width: 36, height: 36, background: 'rgba(244,63,94,0.1)', borderRadius: 12, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  <Icon name="trash" size={16} color={FIT.danger} />
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
        </div>
      </div>

      <TabBar active="diary" onTab={onTab} labels={{ home: t.home, diary: t.diary, stats: t.stats, profile: t.profile }} dark />
    </Phone>
  );
}

function MacroBarMini({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  const p = Math.min(1, value / target);
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', fontFamily: FIT.mono, marginBottom: 6 }}>{Math.round(value)}g</div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${p * 100}%` }}
           style={{ height: '100%', background: color, borderRadius: 2 }}
        />
      </div>
    </div>
  );
}
