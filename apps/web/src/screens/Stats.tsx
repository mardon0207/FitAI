import { useState, useMemo } from 'react';
import { Phone, TopBar, TabBar, Card } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useTabNav } from '@/hooks/useTabNav';
import { useDiary } from '@/stores/diary';
import { useProfile } from '@/stores/profile';
import { ymd, todayYmd } from '@/data/date';

const PERIOD_KEYS = ['week', 'month', 'year'] as const;
const ACTIVITY_COLORS = [FIT.accent, FIT.primary, FIT.protein, FIT.fat, FIT.carbs];

export function StatsScreen() {
  const t = useT();
  const dark = usePrefs((s) => s.theme === 'dark');
  const lang = usePrefs((s) => s.lang);
  const onTab = useTabNav();
  const [period, setPeriod] = useState<(typeof PERIOD_KEYS)[number]>('week');

  const targetKcal = useProfile(s => s.targetKcal) || 2000;
  const entries = useDiary(s => s.entries) || [];
  const activities = useDiary(s => s.activities) || [];
  const weightRecords = useDiary(s => s.weight) || [];
  const waterRecords = useDiary(s => s.water) || [];

  const daysCount = period === 'week' ? 7 : period === 'month' ? 30 : 12; // 12 months for Year
  const today = new Date();

  // Data generation for the selected period
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
    return p.isMonth ? Math.round(kcal / 30) : kcal; // Avg daily for month in Year view
  }), [entries, dataPoints]);

  const burnedData = useMemo(() => dataPoints.map(p => {
    const dayActs = p.isMonth 
      ? activities.filter(a => a.date.startsWith(p.dateKey))
      : activities.filter(a => a.date === p.dateKey);
    const kcal = dayActs.reduce((sum, a) => sum + (a.kcalBurned || 0), 0);
    return p.isMonth ? Math.round(kcal / 30) : kcal;
  }), [activities, dataPoints]);

  const weightData = useMemo(() => dataPoints.map(p => {
    // For weight, we take the last record of that period
    const records = p.isMonth
      ? weightRecords.filter(r => r.date.startsWith(p.dateKey))
      : weightRecords.filter(r => r.date === p.dateKey);
    
    const last = records[records.length - 1];
    if (last) return last.kg;
    
    // If no record for this day/month, find the closest previous one
    const prevRecords = weightRecords.filter(r => r.date <= p.dateKey).sort((a, b) => b.date.localeCompare(a.date));
    return prevRecords[0]?.kg || null;
  }), [weightRecords, dataPoints]);

  const waterData = useMemo(() => dataPoints.map(p => {
    const records = p.isMonth
      ? waterRecords.filter(r => r.date.startsWith(p.dateKey))
      : waterRecords.filter(r => r.date === p.dateKey);
    const ml = records.reduce((sum, r) => sum + r.ml, 0);
    return p.isMonth ? ml / 1000 : ml; // Liters for year, ml for week/month
  }), [waterRecords, dataPoints]);

  const avgKcal = Math.round(caloriesData.reduce((a, b) => a + b, 0) / dataPoints.length);
  const avgBurned = Math.round(burnedData.reduce((a, b) => a + b, 0) / dataPoints.length);
  const currentWeight = weightRecords[weightRecords.length - 1]?.kg ?? '—';

  const weightTrend = useMemo(() => {
    const valid = weightRecords.filter(r => r && r.kg).sort((a, b) => a.addedAt - b.addedAt);
    if (valid.length < 2) return null;
    const last = valid[valid.length - 1];
    const prev = valid[valid.length - 2];
    if (!last || !prev) return null;
    return last.kg - prev.kg;
  }, [weightRecords]);

  const weightChangeStr = useMemo(() => {
    const first = weightRecords[0];
    const last = weightRecords[weightRecords.length - 1];
    if (weightRecords.length > 1 && first && last) {
      return `${t.change}: ${(last.kg - first.kg).toFixed(1)} kg`;
    }
    return t.noData;
  }, [weightRecords, t.stats]);

  const kcalTrend = avgKcal - targetKcal;

  // Stats Card data
  const statsCards = [
    { 
      icon: '🍎', 
      label: t.intake, 
      value: avgKcal, 
      unit: t.kcal, 
      color: FIT.primary,
      trend: kcalTrend,
      trendUnit: t.kcal
    },
    { 
      icon: '🔥', 
      label: t.burned, 
      value: avgBurned, 
      unit: t.kcal, 
      color: FIT.accent 
    },
    { 
      icon: '⚖️', 
      label: t.weight, 
      value: currentWeight, 
      unit: 'kg', 
      color: FIT.protein,
      trend: weightTrend,
      trendUnit: 'kg'
    },
    { 
      icon: '💧', 
      label: t.water, 
      value: (waterData.reduce((a, b) => a + b, 0) / (dataPoints.length || 1)).toFixed(1), 
      unit: period === 'year' ? 'L' : t.ml, 
      color: '#3B82F6' 
    },
  ];

  return (
    <Phone dark={dark}>
      <TopBar title={t.stats} transparent right={<Icon name="filter" size={20} color={FIT.text} />} />

      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ 
          display: 'flex', background: dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9', 
          borderRadius: 14, padding: 4
        }}>
          {PERIOD_KEYS.map((p) => {
            const active = p === period;
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 10, border: 'none',
                  background: active ? (dark ? '#334155' : '#fff') : 'transparent',
                  color: active ? FIT.text : FIT.textMuted,
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: active ? FIT.shadowSm : 'none'
                }}
              >
                {t[p]}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 100px' }}>
        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {statsCards.map(c => <StatCard key={c.label} {...c} />)}
        </div>

        {/* Calories Trend Chart (Consumed vs Burned) */}
        <ChartCard 
          title={t.kcalBalance} 
          subtitle={`${t.goal}: ${targetKcal} ${t.kcal}/${t.days}`}
          data={caloriesData}
          secondaryData={burnedData}
          labels={dataPoints.map(p => p.label)}
          max={Math.max(...caloriesData, ...burnedData, targetKcal) * 1.2}
          target={targetKcal}
          dark={dark}
        />

        {/* Weight Progress Chart */}
        <ChartCard 
          title={t.weightTrend} 
          subtitle={weightChangeStr}
          data={weightData.filter((v): v is number => v !== null)}
          color={FIT.protein}
          labels={dataPoints.filter((_, i) => weightData[i] !== null).map(p => p.label)}
          max={Math.max(...weightData.filter((v): v is number => v !== null), 100) + 5}
          min={Math.min(...weightData.filter((v): v is number => v !== null), 50) - 5}
          dark={dark}
          showArea={false}
        />

        {/* Activity Mix Breakdown */}
        <Card pad={0} style={{ marginBottom: 24 }}>
           <div style={{ padding: 20 }}>
             <div style={{ fontSize: 16, fontWeight: 800, color: FIT.text, marginBottom: 16 }}>{t.activities}</div>
             <ActivityMix activities={activities} t={t} dark={dark} />
           </div>
        </Card>

      {/* Daily History List (Only for Week view) */}
      {period === 'week' && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: FIT.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="calendar" size={20} color={FIT.primary} />
            {t.dailyHistory}
          </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[...dataPoints].reverse().map((d, i) => {
                const kcalIn = caloriesData[dataPoints.length - 1 - i] || 0;
                const kcalOut = burnedData[dataPoints.length - 1 - i] || 0;
                const weight = weightData[dataPoints.length - 1 - i];
                const isToday = d.dateKey === todayYmd();

                return (
                  <Card key={d.dateKey} pad={14} style={{ 
                    border: isToday ? `1px solid ${FIT.primary}44` : 'none',
                    background: isToday ? (dark ? 'rgba(16,185,129,0.05)' : '#F0FDF4') : (dark ? 'rgba(255,255,255,0.02)' : '#fff')
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: isToday ? FIT.primary : FIT.text }}>
                          {isToday ? t.today : d.label}
                          <span style={{ fontSize: 10, color: FIT.textMuted, fontWeight: 600, marginLeft: 8 }}>{d.dateKey.split('-').slice(1).reverse().join('.')}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: FIT.textMuted }}>
                            <span style={{ color: FIT.primary }}>↓</span> {kcalIn} {t.kcal}
                          </div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: FIT.textMuted }}>
                            <span style={{ color: FIT.accent }}>↑</span> {kcalOut} {t.kcal}
                          </div>
                          {weight && (
                            <div style={{ fontSize: 11, fontWeight: 700, color: FIT.textMuted }}>
                              <span style={{ color: FIT.protein }}>⚖️</span> {weight} kg
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ 
                        width: 32, height: 32, borderRadius: 10, 
                        background: kcalIn <= targetKcal ? (dark ? '#064E3B' : '#DCFCE7') : (dark ? '#7F1D1D' : '#FEE2E2'),
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Icon 
                          name={kcalIn <= targetKcal ? 'check' : 'alert'} 
                          size={18} 
                          color={kcalIn <= targetKcal ? '#10B981' : '#EF4444'} 
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <TabBar
        active="stats" onTab={onTab}
        labels={{ home: t.home, diary: t.diary, stats: t.stats, profile: t.profile }}
        dark={dark}
      />
    </Phone>
  );
}

function StatCard({ icon, label, value, unit, color, trend, trendUnit }: any) {
  const isNegative = trend < 0;
  const absTrend = trend ? Math.abs(trend).toFixed(1) : null;
  
  return (
    <Card pad={16} style={{ border: 'none', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 800, textTransform: 'uppercase' }}>{label}</span>
          <span style={{ fontSize: 9, color: FIT.textMuted, fontWeight: 600 }}>{useT().average}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 24, fontWeight: 900, color: color, fontFamily: FIT.mono }}>{value}</span>
        <span style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 600 }}>{unit}</span>
      </div>
      {trend !== undefined && trend !== null && (
        <div style={{ 
          marginTop: 8, 
          fontSize: 10, 
          fontWeight: 800, 
          color: (label === 'Vazn' ? (isNegative ? '#10B981' : '#EF4444') : (isNegative ? '#EF4444' : '#10B981')),
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          {isNegative ? '↓' : '↑'} {absTrend}{trendUnit}
        </div>
      )}
    </Card>
  );
}

function ChartCard({ title, subtitle, data, secondaryData, labels, max, min = 0, target, color = FIT.primary, dark, showArea = true }: any) {
  const height = 160;
  const width = 300;
  const range = max - min;
  
  const getX = (i: number) => (i / (data.length - 1)) * width;
  const getY = (v: number) => height - ((v - min) / range) * height;

  const points = data.map((v: number, i: number) => `${getX(i)},${getY(v)}`).join(' ');
  const secondaryPoints = secondaryData?.map((v: number, i: number) => `${getX(i)},${getY(v)}`).join(' ');

  return (
    <Card pad={20} style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: FIT.text }}>{title}</div>
        <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 600 }}>{subtitle}</div>
      </div>
      
      <div style={{ height, position: 'relative' }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
          {/* Target Line */}
          {target && (
            <line x1="0" y1={getY(target)} x2={width} y2={getY(target)} stroke={dark ? '#334155' : '#E2E8F0'} strokeDasharray="4 4" />
          )}

          {/* Main Area */}
          {showArea && (
            <path d={`M 0,${height} L ${points} L ${width},${height} Z`} fill={`url(#grad-${title})`} opacity="0.3" />
          )}
          <defs>
            <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Secondary Line (Burned) */}
          {secondaryData && (
            <path d={`M ${secondaryPoints}`} fill="none" stroke={FIT.accent} strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
          )}

          {/* Main Line */}
          <path d={`M ${points}`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Points */}
          {data.length < 15 && data.map((v: number, i: number) => (
            <circle key={i} cx={getX(i)} cy={getY(v)} r="4" fill={color} stroke={dark ? '#1e293b' : '#fff'} strokeWidth="2" />
          ))}
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
         {labels.filter((_:any, i:number) => labels.length < 15 || i % 3 === 0).map((l: string, i: number) => (
           <span key={i} style={{ fontSize: 9, color: FIT.textMuted, fontWeight: 700, textAlign: 'center' }}>{l}</span>
         ))}
      </div>
    </Card>
  );
}

function ActivityMix({ activities, t, dark }: any) {
  const mix = useMemo(() => {
    const counts: Record<string, { kcal: number, label: string, emoji: string }> = {};
    activities.forEach((a: any) => {
      const type = a.type || 'unknown';
      if (!counts[type]) counts[type] = { kcal: 0, label: a.label || t.other, emoji: '🏃' };
      counts[type].kcal += (a.kcalBurned || 0);
    });
    // Sort by kcal and take top 5
    return Object.entries(counts).sort((a, b) => b[1].kcal - a[1].kcal).slice(0, 5);
  }, [activities]);

  if (mix.length === 0) return <div style={{ fontSize: 13, color: FIT.textMuted }}>{t.noData}</div>;

  const total = mix.reduce((s: number, m: any) => s + m[1].kcal, 0);

  // SVG Donut calculation
  const size = 110;
  const center = size / 2;
  const radius = 40;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {/* Donut Chart */}
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle for "empty" state */}
          <circle 
            cx={center} cy={center} r={radius} 
            fill="none" stroke={dark ? '#1E293B' : '#F1F5F9'} 
            strokeWidth={strokeWidth} 
          />
          {mix.map(([id, data], i) => {
            const pct = data.kcal / total;
            const sliceLength = pct * circumference;
            const strokeDasharray = `${sliceLength} ${circumference}`;
            const strokeDashoffset = -currentOffset;
            currentOffset += sliceLength;
            
            return (
              <circle
                key={id}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={ACTIVITY_COLORS[i % ACTIVITY_COLORS.length]}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap={pct > 0.99 ? 'butt' : 'round'}
                transform={`rotate(-90 ${center} ${center})`}
                style={{ transition: 'all 0.5s ease' }}
              />
            );
          })}
        </svg>
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: FIT.text, lineHeight: 1 }}>{total}</span>
          <span style={{ fontSize: 9, fontWeight: 800, color: FIT.textMuted, textTransform: 'uppercase', marginTop: 2 }}>{t.kcal}</span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {mix.map(([id, data], i) => {
          const pct = Math.round((data.kcal / total) * 100);
          return (
            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ 
                width: 10, height: 10, borderRadius: 3, 
                background: ACTIVITY_COLORS[i % ACTIVITY_COLORS.length] 
              }} />
              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700 }}>
                <span style={{ color: FIT.text }}>{data.label}</span>
                <span style={{ color: FIT.textMuted }}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
