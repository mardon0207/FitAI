// Water + Weight trackers — persisted to diary store.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, TopBar, Chip, Button, Input } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useDiary } from '@/stores/diary';
import { todayYmd } from '@/data/date';

const GLASS_ML = 250;
const DAILY_TARGET_ML = 2000;

export function WaterScreen() {
  const t = useT();
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const addWater = useDiary((s) => s.addWater);
  const ml = useDiary((s) => s.waterMlForDate(todayYmd()));

  const glasses = Math.round(ml / GLASS_ML);
  const total = 8;

  return (
    <Phone dark={dark}>
      <TopBar
        back onBack={() => navigate(-1)}
        right={
          <button
            type="button" onClick={() => navigate('/')}
            aria-label="Yopish"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <Icon name="close" size={20} color={FIT.textMuted} />
          </button>
        }
        title="Suv iste'moli"
        transparent
      />
      <div style={{
        flex: 1, padding: '0 20px 20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{ width: 140, height: 220, position: 'relative', marginTop: 10 }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '40% 40% 20px 20px',
            background: '#EEF2FF', border: '2px solid #C7D2FE',
          }} />
          <div style={{
            position: 'absolute', left: 2, right: 2, bottom: 2,
            height: `${Math.min(96, (ml / (DAILY_TARGET_ML)) * 96)}%`,
            borderRadius: '0 0 18px 18px',
            background: 'linear-gradient(180deg, #60A5FA, #3B82F6)',
            transition: 'height 0.5s',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', color: '#fff',
          }}>
            <div style={{ fontSize: 40, fontWeight: 800, fontFamily: FIT.mono, letterSpacing: -1 }}>
              {glasses}/{total}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
              {t.glass.toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, marginTop: 24, alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => addWater(-GLASS_ML)}
            disabled={ml < GLASS_ML}
            aria-label="Kamaytirish"
            style={{
              width: 56, height: 56, borderRadius: 28, background: '#fff',
              boxShadow: FIT.shadowMd, border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700,
              color: ml < GLASS_ML ? FIT.textSubtle : FIT.text,
              cursor: ml < GLASS_ML ? 'not-allowed' : 'pointer',
              opacity: ml < GLASS_ML ? 0.5 : 1,
            }}
          >−</button>
          <div style={{ fontSize: 13, color: FIT.textMuted, fontFamily: FIT.mono }}>
            {ml} / {DAILY_TARGET_ML} ml
          </div>
          <button
            type="button"
            onClick={() => addWater(GLASS_ML)}
            aria-label="Qo'shish"
            style={{
              width: 56, height: 56, borderRadius: 28, background: '#3B82F6',
              boxShadow: '0 8px 24px #3B82F666', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <Icon name="plus" size={28} color="#fff" strokeWidth={2.5} />
          </button>
        </div>

        <div style={{
          display: 'flex', gap: 4, marginTop: 24, width: '100%', justifyContent: 'center',
        }}>
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 24, height: 32,
                borderRadius: '8px 8px 4px 4px',
                background: i < glasses ? '#3B82F6' : '#E0E7FF',
                border: `1px solid ${i < glasses ? '#2563EB' : '#C7D2FE'}`,
                transition: 'background 200ms',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          {[{ l: '+250 ml', v: 250 }, { l: '+500 ml', v: 500 }, { l: '+1 L', v: 1000 }].map((q) => (
            <Chip key={q.l} size="md" onClick={() => addWater(q.v)}>
              {q.l}
            </Chip>
          ))}
        </div>
      </div>
    </Phone>
  );
}

export function WeightScreen() {
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const latestKg = useDiary((s) => s.weightLatest());
  const addWeight = useDiary((s) => s.addWeight);
  const [weight, setWeight] = useState<number>(latestKg ?? 72.3);
  const [note, setNote] = useState('');

  return (
    <Phone dark={dark}>
      <div style={{
        flex: 1, background: 'rgba(15,23,42,0.4)',
        display: 'flex', alignItems: 'flex-end',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) navigate(-1); }}>
        <div style={{
          width: '100%', background: '#fff',
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          padding: '16px 20px 24px',
        }}>
          <div style={{
            width: 36, height: 4, background: FIT.border,
            borderRadius: 2, margin: '0 auto 14px',
          }} />
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Vaznni yozish</div>
          <div style={{ fontSize: 12, color: FIT.textMuted, marginBottom: 20 }}>
            {latestKg ? `Oxirgi: ${latestKg.toFixed(1)} kg` : 'Birinchi yozuv'}
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 16, marginBottom: 20,
          }}>
            <button
              type="button"
              onClick={() => setWeight((w) => Math.max(20, round1(w - 0.1)))}
              style={roundBtn(FIT.surfaceAlt, FIT.text)} aria-label="−"
            >−</button>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 54, fontWeight: 800, fontFamily: FIT.mono,
                color: FIT.text, letterSpacing: -2,
              }}>
                {weight.toFixed(1)}
              </div>
              <div style={{ fontSize: 12, color: FIT.textMuted, marginTop: -4 }}>kg</div>
            </div>
            <button
              type="button"
              onClick={() => setWeight((w) => round1(w + 0.1))}
              style={roundBtn(FIT.primary, '#fff')} aria-label="+"
            >+</button>
          </div>

          <Input
            label="IZOH (ixtiyoriy)"
            value={note}
            onChange={setNote}
            placeholder="Masalan: ertalab nonushtadan keyin"
          />
          <div style={{ height: 10 }} />
          <Button
            variant="primary" size="lg" full
            onClick={() => {
              addWeight(weight, note || undefined);
              navigate(-1);
            }}
          >
            Saqlash
          </Button>
        </div>
      </div>
    </Phone>
  );
}

function roundBtn(bg: string, color: string): React.CSSProperties {
  return {
    width: 44, height: 44, borderRadius: 22, background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18, fontWeight: 700, color, border: 'none', cursor: 'pointer',
  };
}

function round1(n: number): number { return Math.round(n * 10) / 10; }
