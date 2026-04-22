// Micronutrients panel + Deficiency warning.
// Ported from design/screens-c.jsx (ScreenMicro / ScreenDeficiency).

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, TopBar, Card, Button } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs } from '@/stores/prefs';

export function MicroScreen() {
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const [tab, setTab] = useState<'vitamins' | 'minerals'>('vitamins');

  const items = [
    { n: 'Vitamin C', v: 96, s: 'yetarli', c: FIT.primary, group: 'vitamins' as const },
    { n: 'Vitamin A', v: 84, s: 'yetarli', c: FIT.primary, group: 'vitamins' as const },
    { n: 'Vitamin D', v: 58, s: 'kam', c: FIT.accent, group: 'vitamins' as const },
    { n: 'Vitamin E', v: 72, s: 'yetarli', c: FIT.primary, group: 'vitamins' as const },
    { n: 'B12', v: 45, s: 'kam', c: FIT.danger, group: 'vitamins' as const, warn: true },
    { n: 'B6', v: 68, s: 'kam', c: FIT.accent, group: 'vitamins' as const },
    { n: 'Temir', v: 32, s: 'kam', c: FIT.danger, group: 'minerals' as const, warn: true },
    { n: 'Kalsiy', v: 72, s: 'yetarli', c: FIT.primary, group: 'minerals' as const },
    { n: 'Magniy', v: 54, s: 'kam', c: FIT.accent, group: 'minerals' as const },
    { n: 'Sink', v: 88, s: 'yetarli', c: FIT.primary, group: 'minerals' as const },
  ];

  const filtered = items.filter((i) => i.group === tab);

  return (
    <Phone dark={dark}>
      <TopBar
        back
        onBack={() => navigate(-1)}
        title="Mikroelementlar"
        subtitle="Bugungi ko'rsatkichlar"
        transparent
      />
      <div style={{ padding: '0 20px 12px' }}>
        <div style={{ display: 'flex', background: FIT.surfaceAlt, borderRadius: 10, padding: 3 }}>
          {(['vitamins', 'minerals'] as const).map((id) => {
            const active = id === tab;
            return (
              <button
                type="button"
                key={id}
                onClick={() => setTab(id)}
                style={{
                  flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 8,
                  background: active ? '#fff' : 'transparent',
                  boxShadow: active ? FIT.shadowSm : 'none',
                  fontSize: 13, fontWeight: 600,
                  color: active ? FIT.text : FIT.textMuted,
                  border: 'none', cursor: 'pointer',
                }}
              >
                {id === 'vitamins' ? 'Vitaminlar' : 'Mineralar'}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{
        padding: '0 20px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: 11, color: FIT.textMuted, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 1,
        }}>
          Yetishmayotganlar ↑
        </span>
        <span style={{ fontSize: 11, color: FIT.primary, fontWeight: 700 }}>Saralash ⇅</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {filtered.map((it) => (
            <Card
              key={it.n}
              pad={14}
              style={{ borderLeft: `3px solid ${it.c}` }}
              onClick={it.warn ? () => navigate('/deficiency') : undefined}
            >
              <div style={{ fontSize: 12, color: FIT.textMuted, fontWeight: 600 }}>{it.n}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 4 }}>
                <span style={{
                  fontSize: 26, fontWeight: 800, fontFamily: FIT.mono, color: it.c, letterSpacing: -1,
                }}>
                  {it.v}
                </span>
                <span style={{ fontSize: 12, color: FIT.textMuted }}>%</span>
              </div>
              <div style={{ height: 4, background: `${it.c}22`, borderRadius: 2, marginTop: 6 }}>
                <div style={{
                  height: '100%', width: `${Math.min(it.v, 100)}%`, background: it.c, borderRadius: 2,
                }} />
              </div>
              <div style={{
                fontSize: 10, color: it.c, fontWeight: 700, marginTop: 6,
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                {it.s}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Phone>
  );
}

export function DeficiencyScreen() {
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();

  return (
    <Phone dark={dark}>
      <TopBar
        back
        onBack={() => navigate(-1)}
        right={<Icon name="close" size={20} color={FIT.textMuted} />}
        transparent
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
        <div style={{
          display: 'inline-flex', padding: '6px 12px',
          background: FIT.dangerSoft, borderRadius: 999, gap: 6,
          alignItems: 'center', marginBottom: 12,
        }}>
          <Icon name="alert" size={14} color={FIT.danger} />
          <span style={{
            fontSize: 11, fontWeight: 700, color: FIT.danger,
            textTransform: 'uppercase', letterSpacing: 1,
          }}>
            Ogohlantirish
          </span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.2 }}>
          B12 vitamin yetishmovchiligi
        </div>
        <div style={{ fontSize: 13, color: FIT.textMuted, marginTop: 6 }}>
          Sizda 3 kundan beri B12 yetishmayapti
        </div>

        {/* Side-by-side illustration */}
        <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          <div style={{
            flex: 1, aspectRatio: '1', borderRadius: 20,
            background: `linear-gradient(135deg, ${FIT.primarySoft}, #A7F3D0)`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontSize: 64 }}>😊</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: FIT.primaryDark, marginTop: 4 }}>
              Salomat
            </div>
            <div style={{
              position: 'absolute', top: 8, left: 8, right: 8,
              height: 3, background: FIT.primary, borderRadius: 2, opacity: 0.5,
            }} />
          </div>
          <div style={{
            flex: 1, aspectRatio: '1', borderRadius: 20,
            background: 'linear-gradient(135deg, #F1F5F9, #E2E8F0)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden', filter: 'grayscale(0.3)',
          }}>
            <div style={{ fontSize: 64, opacity: 0.7 }}>😔</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: FIT.textMuted, marginTop: 4 }}>
              Yetishmovchilik
            </div>
          </div>
        </div>

        <Card pad={14} style={{ marginTop: 14 }}>
          <div style={{
            fontSize: 11, color: FIT.textMuted, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1,
          }}>
            So&apos;nggi 7 kun
          </div>
          <div style={{
            display: 'flex', gap: 4, marginTop: 10, alignItems: 'flex-end', height: 50,
          }}>
            {[55, 48, 52, 40, 38, 42, 35].map((v, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: v < 50 ? FIT.danger : FIT.accent,
                  borderRadius: 3, height: `${v}%`,
                  opacity: 0.3 + v / 100,
                }}
              />
            ))}
          </div>
        </Card>

        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>
          Oqibatlari
        </div>
        <Card pad={14}>
          {['Charchoq va holsizlik', 'Xotira muammolari', 'Anemia', 'Nerv buzilishi (uzoq muddatli)'].map((s, i, arr) => (
            <div
              key={s}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                borderBottom: i < arr.length - 1 ? `1px solid ${FIT.borderSoft}` : 'none',
              }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: 12, background: FIT.dangerSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: FIT.danger,
              }}>
                {i + 1}
              </div>
              <span style={{ fontSize: 13 }}>{s}</span>
            </div>
          ))}
        </Card>

        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>
          Tavsiya etiladi
        </div>
        <div style={{ display: 'flex', gap: 8, overflow: 'auto' }}>
          {[
            { e: '🥩', n: "Mol go'shti", k: '2.4µg' },
            { e: '🥚', n: 'Tuxum', k: '0.6µg' },
            { e: '🐟', n: 'Baliq', k: '3.2µg' },
            { e: '🥛', n: 'Sut', k: '0.9µg' },
          ].map((r) => (
            <Card key={r.n} pad={10} style={{ minWidth: 110, flexShrink: 0, textAlign: 'center' }}>
              <div style={{ fontSize: 36 }}>{r.e}</div>
              <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>{r.n}</div>
              <div style={{
                fontSize: 10, color: FIT.primary, fontFamily: FIT.mono, fontWeight: 700, marginTop: 2,
              }}>
                B12: {r.k}
              </div>
            </Card>
          ))}
        </div>

        <div style={{
          marginTop: 14, padding: 12, background: FIT.accentSoft, borderRadius: 12,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <div style={{ fontSize: 11, color: '#92400E', lineHeight: 1.5 }}>
            <b>Bu tibbiy tashxis EMAS.</b> Davomli bo&apos;lsa, shifokor bilan maslahatlashing.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Button variant="secondary" full onClick={() => navigate(-1)}>Yopish</Button>
          <Button variant="primary" full onClick={() => navigate('/search')}>
            Ovqat qo&apos;shish
          </Button>
        </div>
      </div>
    </Phone>
  );
}
