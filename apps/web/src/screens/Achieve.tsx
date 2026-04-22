// Achievements + Streaks. Ported from design/screens-c.jsx::ScreenAchieve.

import { Phone, TopBar, Card } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs } from '@/stores/prefs';

const BADGES = [
  { e: '🔥', n: 'Birinchi hafta', earned: true },
  { e: '💪', n: '30 kun kombo', earned: true },
  { e: '🥇', n: '100 ovqat', earned: true },
  { e: '💧', n: 'Suv sardori', earned: true },
  { e: '⭐', n: 'Mukammal kun', earned: false, p: 0.7 },
  { e: '🏆', n: '100 kun kombo', earned: false, p: 0.28 },
  { e: '🥗', n: 'Sabzavot chempioni', earned: false, p: 0.45 },
  { e: '📊', n: 'Tahlilchi', earned: false, p: 0.1 },
  { e: '🌟', n: 'Legenda', earned: false, p: 0.05 },
];

// Deterministic heatmap (no Math.random in render, for stable mock)
const HEAT_SEED = [
  0.2, 0.8, 0.4, 0, 0.6, 0.9, 0.5, 0.3, 0.7, 0, 0.2, 0.8, 0.6, 0.4,
  0.5, 0, 0.7, 0.3, 0.9, 0.2, 0.4, 0.6, 0.8, 0, 0.1, 0.5, 0.3, 0.7,
  0.9, 0.2, 0.4, 0, 0.6, 0.8, 0.5, 0.3, 0.7, 0, 0.2, 0.8, 0.6, 0.4,
  0.5, 0, 0.7, 0.3, 0.9, 0.2, 0.4, 0.6, 0.8, 0, 0.1, 0.5, 0.3, 0.7,
  0.9, 0.2, 0.4, 0, 0.6, 0.8, 0.5, 0.3, 0.7, 0, 0.2, 0.8, 0.6, 0.4,
  0.5, 0, 0.7, 0.3, 0.9, 0.2, 0.4, 0.6, 0.8, 0, 0.1, 0.5, 0.3, 0.7,
];

export function AchieveScreen() {
  const dark = usePrefs((s) => s.theme === 'dark');

  return (
    <Phone dark={dark}>
      <TopBar
        title="Yutuqlar"
        transparent
        right={<Icon name="trophy" size={22} color={FIT.accent} />}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
        <Card
          pad={20}
          style={{
            background: `linear-gradient(135deg, ${FIT.accent}, #DC2626)`,
            border: 'none', textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 56 }}>🔥</div>
          <div style={{
            fontSize: 48, fontWeight: 800, fontFamily: FIT.mono,
            color: '#fff', letterSpacing: -2, marginTop: -6,
          }}>
            12
          </div>
          <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>Kunlik kombо</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 6 }}>
            Eng yaxshi rekord: 34 kun
          </div>
        </Card>

        <Card pad={16} style={{ marginTop: 12 }}>
          <div style={{
            fontSize: 11, color: FIT.textMuted, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
          }}>
            So&apos;nggi 3 oy
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 3 }}>
            {HEAT_SEED.slice(0, 84).map((v, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '1', borderRadius: 3,
                  background: v === 0 ? '#F1F5F9' : `rgba(16, 185, 129, ${0.25 + v * 0.75})`,
                }}
              />
            ))}
          </div>
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: 4,
            alignItems: 'center', marginTop: 10, fontSize: 10, color: FIT.textMuted,
          }}>
            <span>kam</span>
            {[0.2, 0.4, 0.6, 0.8, 1].map((o) => (
              <div key={o} style={{
                width: 10, height: 10, borderRadius: 2,
                background: `rgba(16,185,129,${o})`,
              }} />
            ))}
            <span>ko&apos;p</span>
          </div>
        </Card>

        <div style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 10 }}>
          Nishonlar
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {BADGES.map((b) => (
            <div
              key={b.n}
              style={{
                background: '#fff', padding: 12, borderRadius: 14, textAlign: 'center',
                border: `1px solid ${FIT.border}`, opacity: b.earned ? 1 : 0.5,
              }}
            >
              <div style={{ fontSize: 36, filter: b.earned ? 'none' : 'grayscale(1)' }}>
                {b.e}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4, lineHeight: 1.2 }}>
                {b.n}
              </div>
              {!b.earned && b.p !== undefined && (
                <div style={{ height: 3, background: FIT.border, borderRadius: 2, marginTop: 6 }}>
                  <div style={{
                    height: '100%', width: `${b.p * 100}%`,
                    background: FIT.primary, borderRadius: 2,
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>

        <Card pad={16} style={{
          marginTop: 16,
          background: `linear-gradient(135deg, ${FIT.primarySoft}, ${FIT.accentSoft})`,
          border: 'none',
        }}>
          <div style={{
            fontSize: 11, color: FIT.primaryDark, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1,
          }}>
            Bu hafta challenge
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>5 kun × 8 stakan suv</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
            {[1, 1, 1, 0, 0].map((d, i) => (
              <div
                key={i}
                style={{
                  flex: 1, height: 28, borderRadius: 6,
                  background: d ? FIT.primary : 'rgba(255,255,255,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: d ? '#fff' : FIT.textMuted, fontSize: 14,
                }}
              >
                {d ? '✓' : i + 1}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 8 }}>
            3/5 kun · Nishon: 🥇 Suv sardori
          </div>
        </Card>
      </div>
    </Phone>
  );
}
