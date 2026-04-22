// Weekly report. Ported from design/screens-c.jsx::ScreenReport.

import { useNavigate } from 'react-router-dom';
import { Phone, TopBar, Card, Button } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs } from '@/stores/prefs';

export function ReportScreen() {
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();

  return (
    <Phone dark={dark}>
      <TopBar
        back onBack={() => navigate(-1)}
        title="Haftalik hisobot"
        transparent
        right={<Icon name="settings" size={20} color={FIT.text} />}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
        <Card
          pad={20}
          style={{
            background: `linear-gradient(135deg, ${FIT.primary}, ${FIT.primaryDark})`,
            border: 'none', color: '#fff',
          }}
        >
          <div style={{
            fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.85, fontWeight: 600,
          }}>
            HISOBOT
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, letterSpacing: -0.5 }}>
            14 – 20 Aprel 2026
          </div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
            Aziz Karimov · 7 kun
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
          {[
            { l: "O'rt. kaloriya", v: '1,980', u: 'kkal', t: '↑ 2%', c: FIT.primary },
            { l: 'Qadam', v: '7,420', u: '/kun', t: '↑ 12%', c: FIT.accent },
            { l: 'Vazn', v: '-0.8', u: 'kg', t: '↓', c: FIT.protein },
            { l: 'Mos kelish', v: '86', u: '%', t: 'yaxshi', c: FIT.primary },
          ].map((s) => (
            <Card key={s.l} pad={14}>
              <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 600 }}>{s.l}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 4 }}>
                <span style={{
                  fontSize: 22, fontWeight: 800, fontFamily: FIT.mono,
                  color: s.c, letterSpacing: -0.5,
                }}>
                  {s.v}
                </span>
                <span style={{ fontSize: 11, color: FIT.textMuted }}>{s.u}</span>
              </div>
              <div style={{
                fontSize: 10, color: FIT.textMuted, marginTop: 2, fontFamily: FIT.mono,
              }}>
                {s.t}
              </div>
            </Card>
          ))}
        </div>

        <Card pad={16} style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Kunlik kaloriya</div>
          <svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="none">
            <line x1="0" y1="35" x2="300" y2="35" stroke={FIT.textSubtle} strokeDasharray="3 4" />
            <path
              d="M0,50 L50,30 L100,42 L150,22 L200,55 L250,18 L300,38"
              fill="none" stroke={FIT.primary} strokeWidth="2.5"
            />
          </svg>
        </Card>

        <Card pad={16} style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
            Eng ko&apos;p iste&apos;mol
          </div>
          {[
            { e: '🍚', n: 'Osh', f: '5 marta', k: '2,100' },
            { e: '🥚', n: 'Tuxum', f: '8 marta', k: '620' },
            { e: '🍞', n: 'Non', f: '12 marta', k: '1,620' },
            { e: '🍵', n: 'Choy', f: '18 marta', k: '36' },
          ].map((it, i, arr) => (
            <div
              key={it.n}
              style={{
                display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0',
                borderBottom: i < arr.length - 1 ? `1px solid ${FIT.borderSoft}` : 'none',
              }}
            >
              <span style={{ fontSize: 20 }}>{it.e}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{it.n}</span>
              <span style={{ fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono }}>{it.f}</span>
              <span style={{
                fontSize: 12, fontWeight: 700, fontFamily: FIT.mono,
                color: FIT.primary, minWidth: 50, textAlign: 'right',
              }}>
                {it.k}
              </span>
            </div>
          ))}
        </Card>

        <Card pad={16} style={{ marginTop: 12, background: FIT.primarySoft, border: 'none' }}>
          <div style={{
            fontSize: 11, color: FIT.primaryDark, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1,
          }}>
            Haftaning xulosasi
          </div>
          <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>
            Bu hafta siz maqsadingizdan <b>86% mos</b> keldingiz. Oqsil biroz kam bo&apos;ldi (o&apos;rtacha 92g, maqsad 145g). Temir va B12 darajasini ko&apos;tarish tavsiya etiladi.
          </div>
        </Card>

        <Button variant="secondary" full style={{ marginTop: 16 }}>
          PDF eksport qilish
        </Button>
      </div>
    </Phone>
  );
}
