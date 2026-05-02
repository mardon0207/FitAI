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
            aria-label={t.close}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <Icon name="close" size={20} color={FIT.textMuted} />
          </button>
        }
        title={t.waterIntake}
        transparent
      />
      <div style={{
        flex: 1, padding: '0 20px 20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <style>{`
          @keyframes wave {
            0% { transform: translate(-50%, 0) rotate(0deg); }
            100% { transform: translate(-50%, 0) rotate(360deg); }
          }
          .water-container {
            width: 160px;
            height: 240px;
            position: relative;
            margin-top: 20px;
            background: rgba(238, 242, 255, 0.5);
            border: 4px solid #C7D2FE;
            border-radius: 40px 40px 25px 25px;
            overflow: hidden;
            box-shadow: inset 0 10px 20px rgba(0,0,0,0.05);
          }
          .water-liquid {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(180deg, #60A5FA, #3B82F6);
            transition: height 1s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .water-wave {
            position: absolute;
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 45%;
            top: -285px;
            left: 50%;
            animation: wave 7s infinite linear;
          }
          .water-wave-back {
            position: absolute;
            width: 320px;
            height: 320px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 40%;
            top: -295px;
            left: 50%;
            animation: wave 10s infinite linear;
          }
        `}</style>
        
        <div className="water-container">
          <div 
            className="water-liquid" 
            style={{ height: `${Math.min(100, (ml / DAILY_TARGET_ML) * 100)}%` }}
          >
            <div className="water-wave" />
            <div className="water-wave-back" />
          </div>
          
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', color: ml > 1000 ? '#fff' : (dark ? '#fff' : FIT.text),
            textShadow: ml > 1000 ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            zIndex: 10
          }}>
            <div style={{ fontSize: 44, fontWeight: 900, fontFamily: FIT.mono, letterSpacing: -2 }}>
              {glasses}/{total}
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, opacity: 0.8 }}>
              {t.glass}
            </div>
          </div>

          {/* Glossy overlay */}
          <div style={{ 
            position: 'absolute', top: 10, left: 15, width: 20, height: 100, 
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4), transparent)',
            borderRadius: 10, zIndex: 5
          }} />
        </div>

        <div style={{ display: 'flex', gap: 20, marginTop: 24, alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => addWater(-GLASS_ML)}
            disabled={ml < GLASS_ML}
            aria-label={t.decrease}
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
            aria-label={t.add}
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
  const t = useT();
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
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{t.logWeight}</div>
          <div style={{ fontSize: 12, color: FIT.textMuted, marginBottom: 20 }}>
            {latestKg ? `${t.last}: ${latestKg.toFixed(1)} kg` : t.firstEntry}
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
              <input
              type="number"
              step="0.1"
              value={weight || ''}
              onChange={(e) => {
                const val = e.target.value;
                setWeight(val === '' ? 0 : parseFloat(val));
              }}
              style={{
                width: '100%', fontSize: 48, fontWeight: 900, border: 'none',
                outline: 'none', background: 'transparent', color: FIT.text,
                textAlign: 'center', fontFamily: FIT.mono,
              }}
            />
              <div style={{ fontSize: 12, color: FIT.textMuted, marginTop: -4 }}>kg</div>
            </div>
            <button
              type="button"
              onClick={() => setWeight((w) => round1(w + 0.1))}
              style={roundBtn(FIT.primary, '#fff')} aria-label="+"
            >+</button>
          </div>

          <Input
            label={t.noteOptional}
            value={note}
            onChange={setNote}
            placeholder={t.weightNoteExample}
          />
          <div style={{ height: 10 }} />
          <Button
            variant="primary" size="lg" full
            onClick={async () => {
              try {
                console.log('Logging weight:', weight, note);
                await addWeight(weight, note || undefined);
                navigate(-1);
              } catch (err) {
                console.error('Failed to log weight:', err);
                alert(t.errorOccurred);
              }
            }}
          >
            {t.save}
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
