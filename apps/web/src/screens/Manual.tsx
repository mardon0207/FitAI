// Manual food entry (create custom food). Ported from design/screens-b.jsx::ScreenManual.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, TopBar, Card, Chip, Button, Input } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';

export function ManualScreen() {
  const t = useT();
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const [name, setName] = useState('Buvimning palovi');
  const [brand, setBrand] = useState('Uy ovqati');
  const [meal, setMeal] = useState(1);

  return (
    <Phone dark={dark}>
      <TopBar back onBack={() => navigate(-1)} title="Qo'lda qo'shish" transparent />

      <div style={{
        flex: 1, padding: '0 20px 20px', overflow: 'auto',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ fontSize: 13, color: FIT.textMuted, marginBottom: 4 }}>
          Bu ovqat bazada yo&apos;q bo&apos;lsa, o&apos;zingiz qo&apos;shing
        </div>
        <Input label="NOMI" value={name} onChange={setName} />
        <Input label="BRAND / MANBA (ixtiyoriy)" value={brand} onChange={setBrand} />

        <Card pad={14}>
          <div style={{
            fontSize: 11, color: FIT.textMuted, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
          }}>
            PORSIYA
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              flex: 1, height: 48, borderRadius: 10, border: `1px solid ${FIT.border}`,
              display: 'flex', alignItems: 'center', padding: '0 12px',
              fontFamily: FIT.mono, fontWeight: 700, fontSize: 15,
            }}>
              250
            </div>
            <div style={{
              width: 100, height: 48, borderRadius: 10, border: `1px solid ${FIT.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 12px', fontSize: 14, fontWeight: 600,
            }}>
              kosa <Icon name="chevronDown" size={14} color={FIT.textMuted} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 8 }}>
            1 kosa = 250g
          </div>
        </Card>

        <Card pad={14}>
          <div style={{
            fontSize: 11, color: FIT.textMuted, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
          }}>
            OZIQLIK (porsiya uchun)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { l: 'Kaloriya', v: '420', u: t.kcal, c: FIT.primary },
              { l: 'Oqsil', v: '22', u: 'g', c: FIT.protein },
              { l: 'Uglevod', v: '60', u: 'g', c: FIT.carbs },
              { l: "Yog'", v: '12', u: 'g', c: FIT.fat },
            ].map((f) => (
              <div key={f.l} style={{ padding: 12, background: FIT.surfaceAlt, borderRadius: 10 }}>
                <div style={{ fontSize: 10, color: FIT.textMuted, fontWeight: 600 }}>{f.l}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 3 }}>
                  <span style={{
                    fontSize: 22, fontWeight: 800, fontFamily: FIT.mono,
                    color: f.c, letterSpacing: -0.5,
                  }}>
                    {f.v}
                  </span>
                  <span style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 600 }}>{f.u}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginTop: 12,
            paddingTop: 12, borderTop: `1px solid ${FIT.border}`,
          }}>
            <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>
              Batafsil kiritish (vitaminlar)
            </div>
            <div style={{
              width: 40, height: 22, borderRadius: 11, background: FIT.border, position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: 2, left: 2, width: 18, height: 18,
                borderRadius: 9, background: '#fff',
              }} />
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', gap: 6 }}>
          {[t.breakfast, t.lunch, t.dinner, t.snack].map((m, i) => (
            <Chip key={m} active={i === meal} size="sm" onClick={() => setMeal(i)}>{m}</Chip>
          ))}
        </div>

        <Button variant="primary" size="lg" full onClick={() => navigate('/diary')}>
          Saqlash va qo&apos;shish
        </Button>
      </div>
    </Phone>
  );
}
