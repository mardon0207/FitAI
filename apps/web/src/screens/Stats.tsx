// Stats / Progress charts. Ported from design/screens-c.jsx::ScreenStats.

import { useState } from 'react';
import { Phone, TopBar, TabBar, Card } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useTabNav } from '@/App';

const PERIODS = ['Hafta', 'Oy', '3 oy', 'Yil'] as const;
const DAYS_UZ = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

export function StatsScreen() {
  const t = useT();
  const dark = usePrefs((s) => s.theme === 'dark');
  const onTab = useTabNav();
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('Hafta');

  const caloriesData = [1820, 2050, 1900, 2180, 1780, 2240, 1980];
  const calMax = 2400;
  const weightData = [73.1, 72.9, 73.0, 72.7, 72.5, 72.6, 72.3];

  return (
    <Phone dark={dark}>
      <TopBar
        title={t.stats}
        transparent
        right={<Icon name="filter" size={20} color={FIT.text} />}
      />

      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ display: 'flex', background: FIT.surfaceAlt, borderRadius: 10, padding: 3 }}>
          {PERIODS.map((p) => {
            const active = p === period;
            return (
              <button
                type="button"
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  flex: 1, textAlign: 'center', padding: '7px 0', borderRadius: 8,
                  background: active ? '#fff' : 'transparent',
                  boxShadow: active ? FIT.shadowSm : 'none',
                  fontSize: 12, fontWeight: 600,
                  color: active ? FIT.text : FIT.textMuted,
                  border: 'none', cursor: 'pointer',
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 6, fontFamily: FIT.mono }}>
          14 Apr – 20 Apr 2026
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 20px 20px' }}>
        {/* KPI cards */}
        <div style={{ display: 'flex', gap: 10, overflow: 'auto', marginBottom: 16, paddingBottom: 4 }}>
          {[
            { icon: '🔥', label: "O'rt. kaloriya", value: '1,980', unit: t.kcal, trend: '↑ 2%', color: FIT.primary },
            { icon: '⚖️', label: t.weight, value: '-0.8', unit: 'kg', trend: 'hafta', color: FIT.protein },
            { icon: '🚶', label: t.steps, value: '7,420', unit: '/kun', trend: '↑ 12%', color: FIT.accent },
            { icon: '💧', label: t.water, value: '7.1', unit: t.glass, trend: '88%', color: '#3B82F6' },
          ].map((s) => (
            <Card key={s.label} pad={14} style={{ minWidth: 150, flexShrink: 0 }}>
              <div style={{ fontSize: 18 }}>{s.icon}</div>
              <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 4, fontWeight: 600 }}>
                {s.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 4 }}>
                <span style={{
                  fontSize: 22, fontWeight: 800, fontFamily: FIT.mono,
                  letterSpacing: -0.5, color: s.color,
                }}>
                  {s.value}
                </span>
                <span style={{ fontSize: 10, color: FIT.textMuted }}>{s.unit}</span>
              </div>
              <div style={{ fontSize: 10, color: FIT.textMuted, marginTop: 2, fontFamily: FIT.mono }}>
                {s.trend}
              </div>
            </Card>
          ))}
        </div>

        {/* Calories chart */}
        <Card pad={16} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Kaloriya</div>
          <div style={{ fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono, marginBottom: 14 }}>
            Maqsad: 2,150 {t.kcal}/kun
          </div>
          <svg width="100%" height="130" viewBox="0 0 300 130" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gcal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={FIT.primary} stopOpacity="0.3" />
                <stop offset="100%" stopColor={FIT.primary} stopOpacity="0" />
              </linearGradient>
            </defs>
            <line
              x1="0" y1={130 - (2150 / calMax) * 110}
              x2="300" y2={130 - (2150 / calMax) * 110}
              stroke={FIT.textSubtle} strokeDasharray="3 4" strokeWidth="1"
            />
            <path
              d={
                'M ' +
                caloriesData.map((v, i) => `${i * (300 / 6)},${130 - (v / calMax) * 110}`).join(' L ') +
                ' L 300,130 L 0,130 Z'
              }
              fill="url(#gcal)"
            />
            <path
              d={
                'M ' +
                caloriesData.map((v, i) => `${i * (300 / 6)},${130 - (v / calMax) * 110}`).join(' L ')
              }
              fill="none" stroke={FIT.primary} strokeWidth="2.5" strokeLinecap="round"
            />
            {caloriesData.map((v, i) => (
              <circle
                key={i}
                cx={i * (300 / 6)}
                cy={130 - (v / calMax) * 110}
                r={i === caloriesData.length - 2 ? 5 : 3}
                fill={FIT.primary}
                stroke="#fff"
                strokeWidth="2"
              />
            ))}
          </svg>
          <div style={{
            display: 'flex', justifyContent: 'space-between', fontSize: 10,
            color: FIT.textMuted, fontFamily: FIT.mono, marginTop: 6,
          }}>
            {DAYS_UZ.map((d) => <span key={d}>{d}</span>)}
          </div>
        </Card>

        {/* Macro donut */}
        <Card pad={16} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Makro taqsimoti</div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ width: 120, height: 120, position: 'relative' }}>
              <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke={FIT.protein} strokeWidth="18"
                  strokeDasharray={`${0.22 * 314} ${314}`} />
                <circle cx="60" cy="60" r="50" fill="none" stroke={FIT.carbs} strokeWidth="18"
                  strokeDasharray={`${0.5 * 314} ${314}`} strokeDashoffset={-0.22 * 314} />
                <circle cx="60" cy="60" r="50" fill="none" stroke={FIT.fat} strokeWidth="18"
                  strokeDasharray={`${0.28 * 314} ${314}`} strokeDashoffset={-0.72 * 314} />
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ fontSize: 10, color: FIT.textMuted, fontWeight: 600 }}>JAMI</div>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: FIT.mono }}>1,980</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {[
                { n: t.protein, v: '108g', p: '22%', c: FIT.protein },
                { n: t.carbs, v: '248g', p: '50%', c: FIT.carbs },
                { n: t.fat, v: '62g', p: '28%', c: FIT.fat },
              ].map((m) => (
                <div key={m.n} style={{
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: 5, background: m.c }} />
                  <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{m.n}</span>
                  <span style={{ fontSize: 12, fontFamily: FIT.mono, fontWeight: 700 }}>{m.v}</span>
                  <span style={{ fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono, width: 32 }}>
                    {m.p}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Weight trend */}
        <Card pad={16} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Vazn trendi</div>
            <div style={{ fontSize: 11, color: FIT.primary, fontWeight: 700 }}>+ Yozish</div>
          </div>
          <svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="none">
            {weightData.map((w, i) => {
              const y = ((73.2 - w) / 1) * 60 + 10;
              const prevW = i > 0 ? weightData[i - 1] : null;
              const prevY = prevW !== undefined && prevW !== null ? ((73.2 - prevW) / 1) * 60 + 10 : null;
              return (
                <g key={i}>
                  {i > 0 && prevY !== null && (
                    <line x1={(i - 1) * 50} y1={prevY} x2={i * 50} y2={y} stroke={FIT.protein} strokeWidth="2" />
                  )}
                  <circle cx={i * 50} cy={y} r="4" fill={FIT.protein} stroke="#fff" strokeWidth="2" />
                </g>
              );
            })}
          </svg>
        </Card>

        {/* Nutrient compliance */}
        <Card pad={16} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Nutrient qoplam</div>
          {[
            { n: 'Temir', p: 32, c: FIT.danger },
            { n: 'B12', p: 45, c: FIT.danger },
            { n: 'Vit D', p: 58, c: FIT.accent },
            { n: 'Kalsiy', p: 72, c: FIT.accent },
            { n: 'Vit C', p: 96, c: FIT.primary },
          ].map((n) => (
            <div key={n.n} style={{ marginBottom: 8 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3,
              }}>
                <span style={{ fontWeight: 600 }}>{n.n}</span>
                <span style={{ fontFamily: FIT.mono, fontWeight: 700, color: n.c }}>{n.p}%</span>
              </div>
              <div style={{ height: 5, background: `${n.c}22`, borderRadius: 3 }}>
                <div style={{ height: '100%', width: `${n.p}%`, background: n.c, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </Card>

        {/* Streak */}
        <Card pad={16} style={{
          background: `linear-gradient(135deg, ${FIT.primarySoft}, ${FIT.accentSoft})`,
          border: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🔥</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>5 kunlik kombо</div>
              <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 2 }}>
                Kuniga ovqat yozdingiz
              </div>
            </div>
            <div style={{
              fontSize: 24, fontWeight: 800, fontFamily: FIT.mono, color: FIT.primary,
            }}>
              5
            </div>
          </div>
          <div style={{ display: 'flex', gap: 3, marginTop: 10 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 22, borderRadius: 4,
                background: i < 5 ? FIT.primary : '#fff',
              }} />
            ))}
          </div>
        </Card>
      </div>

      <TabBar
        active="stats"
        onTab={onTab}
        labels={{ home: t.home, diary: t.diary, stats: t.stats, profile: t.profile }}
        dark={dark}
      />
    </Phone>
  );
}
