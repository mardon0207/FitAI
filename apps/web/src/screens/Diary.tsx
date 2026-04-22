// Daily meal log — wired to diary store.

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, TopBar, TabBar, Card, FoodThumb } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useTabNav } from '@/App';
import { useDiary } from '@/stores/diary';
import { getFood } from '@/data/db';
import { ymd as formatDate } from '@/data/date';
import type { MealType } from '@fit/shared-types';

const DAY_LABELS_UZ = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

/** Build a 7-day strip around today. Returns {label, day, ymd, isToday}. */
function buildDayStrip(today: Date) {
  // Monday start
  const dow = (today.getDay() + 6) % 7; // 0..6, Monday=0
  const monday = new Date(today);
  monday.setDate(today.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      label: DAY_LABELS_UZ[i]!,
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
  const strip = useMemo(() => buildDayStrip(todayDate), [todayDate]);

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

  const target = 2150;
  const pct = Math.min(100, Math.round((totals.kcal / target) * 100));

  const meals: Array<{ n: string; type: MealType; time: string; target: number }> = [
    { n: t.breakfast, type: 'breakfast', time: '~08:00', target: 538 },
    { n: t.lunch, type: 'lunch', time: '~13:30', target: 860 },
    { n: t.dinner, type: 'dinner', time: '~19:00', target: 538 },
    { n: t.snack, type: 'snack', time: '', target: 215 },
  ];

  return (
    <Phone dark={dark}>
      <TopBar title={t.diary} transparent right={<Icon name="calendar" size={22} color={FIT.text} />} />

      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
          {strip.map((d) => {
            const active = d.ymd === selectedYmd;
            return (
              <button
                type="button"
                key={d.ymd}
                onClick={() => !d.isFuture && setSelectedYmd(d.ymd)}
                disabled={d.isFuture}
                style={{
                  flex: 1, aspectRatio: '1', borderRadius: 12,
                  background: active ? FIT.primary : '#fff',
                  border: `1px solid ${active ? FIT.primary : FIT.border}`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 2,
                  color: active ? '#fff' : FIT.text,
                  opacity: d.isFuture ? 0.35 : 1,
                  cursor: d.isFuture ? 'not-allowed' : 'pointer',
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.7 }}>{d.label}</span>
                <span style={{ fontSize: 16, fontWeight: 700, fontFamily: FIT.mono }}>{d.day}</span>
                {d.isToday && (
                  <div style={{
                    width: 4, height: 4, borderRadius: 2,
                    background: active ? '#fff' : FIT.primary,
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Card style={{ margin: '12px 20px' }} pad={14}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6,
        }}>
          <div style={{
            fontSize: 11, color: FIT.textMuted, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1,
          }}>
            {selectedYmd === formatDate(todayDate) ? 'Bugun jami' : selectedYmd}
          </div>
          <div style={{ fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono }}>{pct}%</div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, fontFamily: FIT.mono, letterSpacing: -0.5 }}>
          {totals.kcal.toLocaleString()}{' '}
          <span style={{ fontSize: 13, color: FIT.textMuted }}>
            / {target.toLocaleString()} {t.kcal}
          </span>
        </div>
        <div style={{ height: 6, background: FIT.primarySoft, borderRadius: 3, marginTop: 8 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: FIT.primary, borderRadius: 3 }} />
        </div>
        <div style={{
          display: 'flex', gap: 10, marginTop: 10, fontSize: 11,
          fontFamily: FIT.mono, fontWeight: 600,
        }}>
          <span style={{ color: FIT.protein }}>P {totals.p.toFixed(1)}g</span>
          <span style={{ color: FIT.carbs }}>C {totals.c.toFixed(1)}g</span>
          <span style={{ color: FIT.fat }}>F {totals.f.toFixed(1)}g</span>
        </div>
      </Card>

      <div style={{
        flex: 1, overflow: 'auto', padding: '0 20px 20px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {meals.map((m) => {
          const mealEntries = dayEntries.filter((e) => e.mealType === m.type);
          const mealKcal = mealEntries.reduce((sum, e) => sum + e.kcal, 0);
          const isEmpty = mealEntries.length === 0;

          return (
            <Card key={m.type} pad={14}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: isEmpty ? 0 : 12,
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>
                    {m.n}
                    {m.time && <span style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 500 }}> {m.time}</span>}
                  </div>
                  <div style={{
                    fontSize: 12, color: FIT.textMuted, fontFamily: FIT.mono, marginTop: 2,
                  }}>
                    {Math.round(mealKcal)} / {m.target} {t.kcal}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/search?meal=${m.type}`)}
                  aria-label={t.addFood}
                  style={{
                    width: 32, height: 32, borderRadius: 16,
                    background: FIT.primarySoft, border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Icon name="plus" size={18} color={FIT.primary} strokeWidth={2.5} />
                </button>
              </div>

              {isEmpty ? (
                <button
                  type="button"
                  onClick={() => navigate(`/search?meal=${m.type}`)}
                  style={{
                    border: `1.5px dashed ${FIT.border}`, borderRadius: 10,
                    padding: 12, fontSize: 12, color: FIT.textMuted,
                    textAlign: 'center', marginTop: 8, width: '100%',
                    background: 'transparent', cursor: 'pointer',
                  }}
                >
                  + {t.addFood}
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {mealEntries.map((e) => {
                    const isComposed = e.foodSlug === '__composed__';
                    const food = !isComposed ? getFood(e.foodSlug) : null;
                    const name = isComposed
                      ? (e.note ?? 'Mening ovqatim')
                      : (food?.namesAll[lang] ?? food?.name ?? e.foodSlug);
                    const emoji = isComposed ? '🧩' : (food?.emoji ?? '🍽');
                    return (
                      <div key={e.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <FoodThumb emoji={emoji} photo={food?.photoUrl} tone={isComposed ? 'purple' : 'amber'} size={36} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
                          <div style={{ fontSize: 11, color: FIT.textMuted }}>
                            {isComposed ? `${e.grams}g` : `${e.quantity} ${unitShort(e.unit)} · ${e.grams}g`}
                            {' · '}
                            <span style={{ color: FIT.primary, fontWeight: 600 }}>
                              {e.kcal} {t.kcal}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`${name} ni o'chirish?`)) removeEntry(e.id);
                          }}
                          aria-label="O'chirish"
                          style={{
                            width: 28, height: 28, borderRadius: 14, border: 'none',
                            background: 'transparent', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Icon name="trash" size={14} color={FIT.textSubtle} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <TabBar
        active="diary" onTab={onTab}
        labels={{ home: t.home, diary: t.diary, stats: t.stats, profile: t.profile }}
        dark={dark}
      />
    </Phone>
  );
}

function unitShort(u: string): string {
  return { g: 'g', ml: 'ml', piece: 'dona', cup: 'piyola', tbsp: 'osh q', tsp: 'chay q', serving: 'porsiya' }[u] ?? u;
}
