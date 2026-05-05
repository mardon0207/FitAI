import { useState, useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Phone, TabBar, Card, Stat } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT, type I18NStrings } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useTabNav } from '@/hooks/useTabNav';
import { useDiary } from '@/stores/diary';
import { useProfile } from '@/stores/profile';
import { ymd, todayYmd } from '@/data/date';

const PERIOD_KEYS = ['week', 'month', 'year'] as const;
const ACTIVITY_COLORS = [FIT.cyan, FIT.lime, FIT.neonPink, FIT.purple, FIT.orange];

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export function StatsScreen() {
  const t = useT();
  const dark = true; // Premium is dark
  const lang = usePrefs((s) => s.lang);
  const onTab = useTabNav();
  const [period, setPeriod] = useState<(typeof PERIOD_KEYS)[number]>('week');

  const targetKcal = useProfile(s => s.targetKcal) || 2000;
  const entries = useDiary(s => s.entries) || [];
  const activities = useDiary(s => s.activities) || [];
  const weightRecords = useDiary(s => s.weight) || [];
  const waterRecords = useDiary(s => s.water) || [];

  const daysCount = period === 'week' ? 7 : period === 'month' ? 30 : 12;
  const today = new Date();

  const dataPoints = useMemo(() => {
    if (period === 'year') {
      return Array.from({ length: 12 }).map((_, i) => {
        const d = new Date(today.getFullYear(), i, 1);
        const mKey = `${d.getFullYear()}-${String(i + 1).padStart(2, '0')}`;
        return {
          label: d.toLocaleString(lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'short' }),
          dateKey: mKey,
          isMonth: true
        };
      });
    }
    return Array.from({ length: daysCount }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (daysCount - 1 - i));
      const dKey = ymd(d);
      return {
        label: daysCount === 7 ? t.daysShort[(d.getDay() + 6) % 7] : d.getDate().toString(),
        dateKey: dKey,
        isMonth: false
      };
    });
  }, [period, daysCount, t.daysShort, lang]);

  const caloriesData = useMemo(() => dataPoints.map(p => {
    const dayEntries = p.isMonth 
      ? entries.filter(e => e.date.startsWith(p.dateKey))
      : entries.filter(e => e.date === p.dateKey);
    const kcal = dayEntries.reduce((sum, e) => sum + e.kcal, 0);
    return p.isMonth ? Math.round(kcal / 30) : kcal;
  }), [entries, dataPoints]);

  const burnedData = useMemo(() => dataPoints.map(p => {
    const dayActs = p.isMonth 
      ? activities.filter(a => a.date.startsWith(p.dateKey))
      : activities.filter(a => a.date === p.dateKey);
    const kcal = dayActs.reduce((sum, a) => sum + (a.kcalBurned || 0), 0);
    return p.isMonth ? Math.round(kcal / 30) : kcal;
  }), [activities, dataPoints]);

  const weightData = useMemo(() => dataPoints.map(p => {
    const records = p.isMonth
      ? weightRecords.filter(r => r.date.startsWith(p.dateKey))
      : weightRecords.filter(r => r.date === p.dateKey);
    const last = records[records.length - 1];
    if (last) return last.kg;
    const prevRecords = weightRecords.filter(r => r.date <= p.dateKey).sort((a, b) => b.date.localeCompare(a.date));
    return prevRecords[0]?.kg || null;
  }), [weightRecords, dataPoints]);

  const avgKcal = Math.round(caloriesData.reduce((a, b) => a + b, 0) / dataPoints.length);
  const avgBurned = Math.round(burnedData.reduce((a, b) => a + b, 0) / dataPoints.length);
  const currentWeight = weightRecords[weightRecords.length - 1]?.kg ?? '—';

  const statsCards = [
    { icon: '🍎', label: t.intake, value: avgKcal, unit: t.kcal, color: FIT.cyan },
    { icon: '🔥', label: t.burned, value: avgBurned, unit: t.kcal, color: FIT.lime },
    { icon: '⚖️', label: t.weight, value: currentWeight, unit: 'kg', color: FIT.neonPink },
    { icon: '💧', label: t.water, value: Math.round(waterRecords.reduce((s, r) => s + r.ml, 0) / 7), unit: 'ml', color: FIT.cyan },
  ];

  return (
    <Phone dark showStatus mesh stagger>
      <div style={{ padding: '8px 24px 20px' }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 24 }}>{t.stats}</div>
        
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: 4, borderRadius: 18, border: '1px solid rgba(255,255,255,0.05)' }}>
          {PERIOD_KEYS.map((p) => (
            <motion.button
              key={p}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPeriod(p)}
              className={p === period ? "neon-glow-cyan" : ""}
              style={{
                flex: 1, padding: '12px 0', borderRadius: 14, border: 'none',
                background: p === period ? FIT.cyan : 'transparent',
                color: p === period ? '#000' : '#64748B',
                fontSize: 13, fontWeight: 900, cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: 1,
                transition: 'all 0.25s'
              }}
            >
              {t[p]}
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 120px' }}>
        <div data-fit-stagger>
          {/* KPI Grid */}
          <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {statsCards.map((c, i) => (
              <Card key={i} variant="glass" pad={16}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>{c.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>{c.label}</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', fontFamily: FIT.mono }}>
                  {c.value}<span style={{ fontSize: 11, color: '#64748B', marginLeft: 4 }}>{c.unit}</span>
                </div>
              </Card>
            ))}
          </motion.div>

          {/* Calories Chart */}
          <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
            <Card variant="glass" pad={20}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{t.kcalBalance}</div>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>{t.goal}: {targetKcal} kcal</div>
                </div>
                <Icon name="stats" size={24} color={FIT.cyan} />
              </div>

              {/* Chart Legend */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 16, paddingLeft: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 3, borderRadius: 1.5, background: FIT.cyan }} />
                  <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>{t.intake}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 1, borderTop: `1px dashed ${FIT.neonPink}`, opacity: 0.8 }} />
                  <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>{t.goal}</span>
                </div>
              </div>

              <PremiumChart 
                data={caloriesData} 
                labels={dataPoints.map(p => p.label as string)} 
                color={FIT.cyan} 
                target={targetKcal}
              />
            </Card>
          </motion.div>

          {/* Activity Mix */}
          <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
             <Card variant="glass" pad={20}>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 24 }}>{t.activities}</div>
                <ActivityDonut activities={activities} t={t} />
             </Card>
          </motion.div>

          {/* Daily History */}
          <motion.div variants={itemVariants}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 16, paddingLeft: 4 }}>{t.dailyHistory}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {dataPoints.slice(-5).reverse().map((d: any, i: number) => {
                const kcal = caloriesData[dataPoints.length - 1 - i] || 0;
                return (
                  <Card key={i} variant="glass" pad={16}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{d.label}</div>
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>{d.dateKey}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: kcal > targetKcal ? FIT.neonPink : FIT.cyan, fontFamily: FIT.mono }}>
                          {kcal} <span style={{ fontSize: 10 }}>KCAL</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <TabBar active="stats" onTab={onTab} labels={{ home: t.home, diary: t.diary, stats: t.stats, profile: t.profile }} dark />
    </Phone>
  );
}

function PremiumChart({ data, labels, color, target }: { data: number[]; labels: string[]; color: string; target: number }) {
  const max = Math.max(...data, target, 1000) * 1.2;
  const height = 120;
  const width = 300;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - (v / max) * height}`).join(' ');
  const targetY = height - (target / max) * height;

  return (
    <div style={{ width: '100%' }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Target Line (Neon Pink Laser) */}
        <line 
          x1="0" y1={targetY} x2={width} y2={targetY} 
          stroke={FIT.neonPink} 
          strokeWidth="1.5" 
          strokeDasharray="4 4" 
          opacity="0.4"
        />

        <path d={`M 0,${height} L ${points} L ${width},${height} Z`} fill="url(#chartGrad)" />
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5 }}
          d={`M ${points}`}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        {labels.filter((_, i) => labels.length < 8 || i % 2 === 0).map((l, i) => (
          <span key={i} style={{ fontSize: 9, color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function ActivityDonut({ activities, t }: { activities: any[]; t: any }) {
  const mix = useMemo(() => {
    const counts: Record<string, number> = {};
    activities.forEach(a => {
      const label = a.label || t.other;
      counts[label] = (counts[label] || 0) + (a.kcalBurned || 0);
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [activities, t]);

  if (mix.length === 0) return <div style={{ fontSize: 14, color: '#64748B' }}>{t.noData}</div>;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
       <div style={{ width: 100, height: 100, borderRadius: 50, border: '8px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{mix.length}</div>
            <div style={{ fontSize: 8, color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>Types</div>
          </div>
       </div>
       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mix.map(([label, kcal], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
               <div style={{ width: 10, height: 10, borderRadius: 3, background: ACTIVITY_COLORS[i % ACTIVITY_COLORS.length] }} />
               <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: '#CBD5E1' }}>{label}</div>
               <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: FIT.mono }}>{kcal}</div>
            </div>
          ))}
       </div>
    </div>
  );
}
