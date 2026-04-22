// Home dashboard — wired to diary store + localStorage persistence.

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, TabBar, Card, MultiRing, FoodThumb } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { AnimatedNumber } from '@/design/AnimatedNumber';
import { FIT } from '@/design/tokens';
import { useT, usePrefs } from '@/stores/prefs';
import { useTabNav } from '@/App';
import { useDiary } from '@/stores/diary';
import { getFood } from '@/data/db';
import { todayYmd } from '@/data/date';
import { CONSEQUENCES, triggeredConsequences } from '@/data/consequences';
import type { MealType } from '@fit/shared-types';

const TARGETS = { kcal: 2150, protein: 145, carbs: 240, fat: 65 };

export function HomeScreen() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const dark = usePrefs((s) => s.theme === 'dark');
  const onTab = useTabNav();
  const navigate = useNavigate();

  // Reactive subscriptions — raw arrays so every change triggers a re-render.
  const entries = useDiary((s) => s.entries);
  const water = useDiary((s) => s.water);
  const stepsRecords = useDiary((s) => s.steps);
  const weightRecords = useDiary((s) => s.weight);

  const ymd = todayYmd();
  const waterMl = useMemo(
    () => water.filter((w) => w.date === ymd).reduce((sum, w) => sum + w.ml, 0),
    [water, ymd],
  );
  const steps = useMemo(
    () => stepsRecords.find((x) => x.date === ymd)?.steps ?? 0,
    [stepsRecords, ymd],
  );
  const weightLatest = useMemo(() => {
    const sorted = [...weightRecords].sort((a, b) => b.addedAt - a.addedAt);
    return sorted[0]?.kg ?? null;
  }, [weightRecords]);

  const today = useMemo(() => {
    const todays = entries.filter((e) => e.date === ymd);
    const kcal = todays.reduce((s, e) => s + e.kcal, 0);
    const p = todays.reduce((s, e) => s + e.protein, 0);
    const c = todays.reduce((s, e) => s + e.carbs, 0);
    const f = todays.reduce((s, e) => s + e.fat, 0);
    const micros: Record<string, number> = {};
    for (const e of todays) {
      for (const [k, v] of Object.entries(e.micros)) {
        micros[k] = (micros[k] ?? 0) + v;
      }
    }
    return { entries: todays, kcal, p, c, f, micros };
  }, [entries]);

  const burnedKcal = Math.round(steps * 0.04 * ((weightLatest ?? 70) / 70));
  const pct = (x: number, y: number) => (y > 0 ? Math.min(1, x / y) : 0);

  const mealSummary: Array<{ n: string; type: MealType; time: string; target: number }> = [
    { n: t.breakfast, type: 'breakfast', time: '~08:00', target: 538 },
    { n: t.lunch, type: 'lunch', time: '~13:30', target: 860 },
    { n: t.dinner, type: 'dinner', time: '~19:00', target: 538 },
  ];

  const hh = new Date().getHours();
  const greet = hh < 12 ? 'Xayrli tong' : hh < 17 ? 'Xayrli kun' : 'Xayrli kech';
  const dateLabel = new Date().toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <Phone dark={dark}>
      <div style={{
        padding: '8px 20px 14px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 13, color: FIT.textMuted, fontWeight: 500 }}>
            {dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginTop: 2 }}>
            {greet} 👋
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/micro')}
          aria-label="Mikronutrientlar"
          style={{
            width: 40, height: 40, borderRadius: 20, background: '#fff',
            boxShadow: FIT.shadowSm, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          }}
        >
          <Icon name="bell" size={20} color={FIT.text} />
          {(today.micros.iron ?? 0) < 4 && (
            <div style={{
              position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4,
              background: FIT.danger, border: '2px solid #fff',
            }} />
          )}
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 16px' }}>
        {/* Calorie hero */}
        <Card pad={24} style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 12 }}>
          <MultiRing
            size={150}
            rings={[
              { progress: pct(today.kcal, TARGETS.kcal), color: FIT.primary },
              { progress: pct(today.p, TARGETS.protein), color: FIT.protein },
              { progress: pct(today.c, TARGETS.carbs), color: FIT.carbs },
              { progress: pct(today.f, TARGETS.fat), color: FIT.fat },
            ]}
          >
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: FIT.mono, letterSpacing: -0.5 }}>
              <AnimatedNumber value={today.kcal} />
            </div>
            <div style={{ fontSize: 10, color: FIT.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
              / {TARGETS.kcal.toLocaleString()}
            </div>
          </MultiRing>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 600 }}>QOLGAN</div>
              <div style={{
                fontSize: 26, fontWeight: 800, fontFamily: FIT.mono,
                color: FIT.primary, letterSpacing: -0.5,
              }}>
                <AnimatedNumber value={Math.max(0, TARGETS.kcal - today.kcal)} />{' '}
                <span style={{ fontSize: 12, color: FIT.textMuted }}>{t.kcal}</span>
              </div>
            </div>
            {([
              { n: t.protein, cur: today.p, tar: TARGETS.protein, c: FIT.protein },
              { n: t.carbs, cur: today.c, tar: TARGETS.carbs, c: FIT.carbs },
              { n: t.fat, cur: today.f, tar: TARGETS.fat, c: FIT.fat },
            ] as const).map((m) => (
              <div key={m.n}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 11, marginBottom: 3,
                }}>
                  <span style={{ color: FIT.textMuted, fontWeight: 600 }}>{m.n}</span>
                  <span style={{ fontFamily: FIT.mono, fontWeight: 600 }}>
                    {m.cur.toFixed(0)}/{m.tar}g
                  </span>
                </div>
                <div style={{ height: 4, background: `${m.c}22`, borderRadius: 2 }}>
                  <div style={{
                    height: 4, width: `${pct(m.cur, m.tar) * 100}%`,
                    background: m.c, borderRadius: 2,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick stats 2x2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <StatTile
            icon="🚶" label={t.steps} value={steps.toLocaleString()} unit="/ 10,000"
            pct={Math.min(1, steps / 10000)} color={FIT.primary}
            onClick={() => navigate('/steps-input')}
          />
          <StatTile
            icon="💧" label={t.water}
            value={Math.round(waterMl / 250).toString()} unit={`/ 8 ${t.glass}`}
            pct={Math.min(1, waterMl / 2000)} color="#3B82F6"
            onClick={() => navigate('/water')}
          />
          <StatTile
            icon="🔥" label={t.burned}
            value={burnedKcal.toString()} unit={t.kcal}
            color={FIT.accent}
          />
          <StatTile
            icon="⚖️" label={t.weight}
            value={weightLatest ? weightLatest.toFixed(1) : '—'} unit="kg"
            color={FIT.protein}
            onClick={() => navigate('/weight')}
          />
        </div>

        {/* Meals */}
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Bugungi taomlar</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {mealSummary.map((m) => {
            const mealEntries = today.entries.filter((e) => e.mealType === m.type);
            const mealKcal = Math.round(mealEntries.reduce((s, e) => s + e.kcal, 0));
            const isEmpty = mealEntries.length === 0;
            return (
              <Card key={m.type} pad={14} onClick={() => navigate('/diary')}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: isEmpty ? 0 : 10,
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>
                      {m.n}{' '}
                      <span style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 500 }}>{m.time}</span>
                    </div>
                    <div style={{
                      fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono, marginTop: 2,
                    }}>
                      {mealKcal} / {m.target} {t.kcal}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); navigate(`/search?meal=${m.type}`); }}
                    aria-label={t.addFood}
                    style={{
                      width: 32, height: 32, borderRadius: 16,
                      background: FIT.primarySoft, border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Icon name="plus" size={18} color={FIT.primary} strokeWidth={2.5} />
                  </button>
                </div>
                {isEmpty ? (
                  <div style={{
                    border: `1.5px dashed ${FIT.border}`, borderRadius: 10,
                    padding: '10px 12px', fontSize: 12, color: FIT.textMuted,
                    textAlign: 'center', marginTop: 8,
                  }}>
                    + {t.addFood}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {mealEntries.slice(0, 3).map((e) => {
                      const isComposed = e.foodSlug === '__composed__';
                      const food = !isComposed ? getFood(e.foodSlug) : null;
                      const emoji = isComposed ? '🧩' : (food?.emoji ?? '🍽');
                      const name = isComposed
                        ? (e.note ?? 'Meal')
                        : (food?.namesAll[lang] ?? food?.name ?? e.foodSlug);
                      return (
                        <div key={e.id} style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          background: FIT.surfaceAlt, padding: 6, borderRadius: 8,
                        }}>
                          <FoodThumb emoji={emoji} photo={food?.photoUrl} size={24} />
                          <span style={{ fontSize: 11, fontWeight: 600, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {name}
                          </span>
                        </div>
                      );
                    })}
                    {mealEntries.length > 3 && (
                      <div style={{
                        padding: '4px 8px', background: FIT.surfaceAlt,
                        borderRadius: 8, fontSize: 11, fontWeight: 600, color: FIT.textMuted,
                      }}>
                        +{mealEntries.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Rule-based tip */}
        {today.kcal > 0 && (
          <Card pad={16} style={{
            background: `linear-gradient(135deg, ${FIT.primarySoft}, ${FIT.accentSoft})`,
            border: 'none',
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 24 }}>💡</div>
              <div>
                <div style={{
                  fontSize: 12, color: FIT.primaryDark, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: 1,
                }}>
                  TAVSIYA
                </div>
                <div style={{ fontSize: 13, color: FIT.text, fontWeight: 500, marginTop: 4, lineHeight: 1.5 }}>
                  {getTip(today.p, today.c, today.f, today.kcal, TARGETS)}
                </div>
              </div>
            </div>
          </Card>
        )}

        {today.entries.length === 0 && (
          <Card pad={20} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🍽</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              Bugun hali ovqat qo&apos;shmadingiz
            </div>
            <div style={{ fontSize: 12, color: FIT.textMuted, marginBottom: 16 }}>
              Qidirish, ingredientlardan yig&apos;ish yoki qo&apos;lda kiriting
            </div>
            <button
              type="button"
              onClick={() => navigate('/add')}
              style={{
                padding: '10px 20px', borderRadius: 12, background: FIT.primary,
                color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer',
              }}
            >
              Ovqat qo&apos;shish
            </button>
          </Card>
        )}

        {/* ─── Consequences strip at the bottom ─── */}
        <ConsequencesStrip
          intake={{
            kcal: today.kcal, protein: today.p, carbs: today.c, fat: today.f,
            micros: today.micros, steps, waterMl,
          }}
          lang={lang}
          onViewAll={() => navigate('/consequences')}
        />
      </div>

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
    <Card pad={14} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 18 }}>{icon}</div>
        <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 600 }}>{label}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 800, fontFamily: FIT.mono, letterSpacing: -0.5 }}>
          {value}
        </span>
        <span style={{ fontSize: 10, color: FIT.textMuted, fontWeight: 600 }}>{unit}</span>
      </div>
      {pct !== undefined && (
        <div style={{ height: 4, background: `${color}22`, borderRadius: 2, marginTop: 8 }}>
          <div style={{ height: 4, width: `${pct * 100}%`, background: color, borderRadius: 2 }} />
        </div>
      )}
    </Card>
  );
}

// ─── Consequences preview at bottom of Home ───────────────
interface ConsequencesStripProps {
  intake: { kcal: number; protein: number; carbs: number; fat: number; micros: Record<string, number>; steps: number; waterMl: number };
  lang: 'uz' | 'ru' | 'en';
  onViewAll: () => void;
}

function ConsequencesStrip({ intake, lang, onViewAll }: ConsequencesStripProps) {
  const active = useMemo(() => triggeredConsequences(intake), [intake]);
  const title = active.length > 0 ? 'Oqibatlar (ogohlantirish)' : 'Oqibatlar — salomatligingiz';
  const subtitle = active.length > 0
    ? `${active.length} ta faol · e'tibor bering`
    : 'Hammasi yaxshi — lekin bilib qo\'ying';
  const stripCards = active.length > 0 ? active.slice(0, 5) : [
    // When nothing is triggered, show a few educational cards in random order
    ...['steps-low', 'protein-deficit', 'iron-deficit', 'fat-excess', 'water-low'],
  ].slice(0, 5);

  // Resolve card data (either real Consequence object from triggered, or id string)
  const cards = stripCards.map((x) => {
    if (typeof x === 'string') {
      return (
        active.find((a) => a.id === x) ??
        (typeof x === 'string'
          ? ({ id: x } as unknown as ReturnType<typeof triggeredConsequences>[number])
          : x)
      );
    }
    return x;
  });

  // If any are just IDs (when nothing active), load from CONSEQUENCES
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            {active.length > 0 ? '⚠️' : '🛡️'} {title}
          </div>
          <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 2 }}>{subtitle}</div>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          style={{
            fontSize: 12, color: FIT.primary, fontWeight: 700,
            background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          Hammasi →
        </button>
      </div>
      <div style={{ display: 'flex', gap: 10, overflow: 'auto', paddingBottom: 4 }}>
        {cards.map((c, i) => (
          <StripCard key={c.id ?? `stub-${i}`} id={c.id} lang={lang} onClick={onViewAll} />
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
    <button
      type="button"
      onClick={onClick}
      style={{
        minWidth: 170, flexShrink: 0, padding: 14, background: '#fff',
        borderRadius: 14, border: `1px solid ${color}33`,
        boxShadow: FIT.shadowSm, cursor: 'pointer', textAlign: 'left',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 12, fontSize: 22,
        background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {c.emoji}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
        {c.title[lang]}
      </div>
      <div style={{ fontSize: 10, color: FIT.textMuted, lineHeight: 1.3 }}>
        {c.tagline[lang]}
      </div>
    </button>
  );
}

function getTip(p: number, _c: number, _f: number, kcal: number, targets: typeof TARGETS): string {
  const pr = p / targets.protein;
  const kr = kcal / targets.kcal;
  if (pr < 0.4 && kr > 0.5) return 'Bugun oqsil yetmayapti. Tovuq, tuxum yoki no\'xat qo\'shing.';
  if (kr > 1.1) return 'Bugun maqsaddan oshdingiz. Kechki ovqat yengilroq bo\'lsin.';
  if (kr < 0.3 && new Date().getHours() > 15) return 'Hali kam iste\'mol qildingiz — energiya oling.';
  if (kr > 0.8 && pr > 0.8) return 'Ajoyib balans! Davom eting.';
  return 'Muntazam ovqatlanish — eng muhimi.';
}
