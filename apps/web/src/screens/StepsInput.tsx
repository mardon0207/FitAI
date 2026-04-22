// Steps input — manual number OR live accelerometer pedometer.

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, TopBar, Button, Card } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs } from '@/stores/prefs';
import { useDiary } from '@/stores/diary';
import { todayYmd } from '@/data/date';
import { pedometer, type PedometerState } from '@/lib/pedometer';

type Mode = 'manual' | 'live';

export function StepsInputScreen() {
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const setSteps = useDiary((s) => s.setSteps);
  const current = useDiary((s) => s.stepsForDate(todayYmd()));

  const [mode, setMode] = useState<Mode>('manual');
  const [manual, setManual] = useState(String(current || 0));
  const [live, setLive] = useState<PedometerState>(pedometer.getState());
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const startBaseRef = useRef<number>(current);

  // Subscribe to pedometer state updates
  useEffect(() => pedometer.subscribe(setLive), []);

  // Stop pedometer when leaving screen
  useEffect(() => () => pedometer.stop(), []);

  const handleStartLive = async () => {
    const ok = await pedometer.requestPermission();
    if (!ok) {
      setPermissionError(
        'Ruxsat berilmadi yoki qurilma qo\'llab-quvvatlamaydi. Qo\'lda kiriting.'
      );
      return;
    }
    startBaseRef.current = current;
    pedometer.reset();
    pedometer.start();
    setMode('live');
  };

  const handleStopAndSave = () => {
    pedometer.stop();
    const total = startBaseRef.current + live.steps;
    setSteps(total);
    navigate(-1);
  };

  const handleSaveManual = () => {
    const n = Math.max(0, Math.floor(Number(manual) || 0));
    setSteps(n);
    navigate(-1);
  };

  return (
    <Phone dark={dark}>
      <TopBar
        back onBack={() => { pedometer.stop(); navigate(-1); }}
        title="Qadamlar"
        transparent
      />

      <div style={{ padding: '0 20px 20px', flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'flex', background: FIT.surfaceAlt, borderRadius: 10, padding: 3, marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => setMode('manual')}
            style={tabBtn(mode === 'manual')}
          >
            ✏️ Qo&apos;lda
          </button>
          <button
            type="button"
            onClick={() => mode !== 'live' && handleStartLive()}
            style={tabBtn(mode === 'live')}
          >
            📱 Telefon orqali
          </button>
        </div>

        {mode === 'manual' && (
          <ManualInput
            value={manual}
            onChange={setManual}
            onSave={handleSaveManual}
          />
        )}

        {mode === 'live' && (
          <LivePedometer
            state={live}
            baseSteps={startBaseRef.current}
            onStop={handleStopAndSave}
            error={permissionError}
          />
        )}

        <Card pad={14} style={{ marginTop: 16, background: FIT.primarySoft, border: 'none' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18 }}>ℹ️</span>
            <div style={{ fontSize: 12, color: FIT.primaryDark, lineHeight: 1.5 }}>
              <b>Qo&apos;lda:</b> telefon sog&apos;liq ilovasidan raqamni ko&apos;chiring.<br/>
              <b>Telefon orqali:</b> akselerometr orqali haqiqiy vaqtda sanaydi. Sahifa ochiq turishi kerak — orqada ishlamaydi (web cheklovi).
            </div>
          </div>
        </Card>
      </div>
    </Phone>
  );
}

function ManualInput({
  value, onChange, onSave,
}: { value: string; onChange: (v: string) => void; onSave: () => void }) {
  return (
    <>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <div style={{ fontSize: 48 }}>🚶</div>
        <div style={{
          fontSize: 44, fontWeight: 800, fontFamily: FIT.mono,
          color: FIT.primary, letterSpacing: -2, marginTop: 4,
        }}>
          {Number(value || 0).toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: FIT.textMuted }}>qadam</div>
      </div>

      <div style={{
        height: 52, borderRadius: 12, background: '#fff',
        border: `1px solid ${FIT.border}`,
        display: 'flex', alignItems: 'center', padding: '0 14px', marginBottom: 12,
      }}>
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Qadamlar soni"
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontSize: 18, fontWeight: 700, fontFamily: FIT.mono,
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[2000, 5000, 8000, 10000].map((v) => (
          <button
            type="button"
            key={v}
            onClick={() => onChange(String(v))}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 10,
              background: FIT.surfaceAlt, border: 'none',
              fontSize: 12, fontWeight: 600, fontFamily: FIT.mono, cursor: 'pointer',
            }}
          >
            {v.toLocaleString()}
          </button>
        ))}
      </div>

      <Button variant="primary" size="lg" full onClick={onSave}>Saqlash</Button>
    </>
  );
}

function LivePedometer({
  state, baseSteps, onStop, error,
}: { state: PedometerState; baseSteps: number; onStop: () => void; error: string | null }) {
  const displayTotal = baseSteps + state.steps;
  const pulse = state.running;

  return (
    <>
      <div style={{ textAlign: 'center', margin: '30px 0 20px' }}>
        <div style={{
          display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
          gap: 4,
          animation: pulse ? 'pulse 1.2s ease-in-out infinite' : 'none',
        }}>
          <div style={{ fontSize: 80 }}>🚶‍♂️</div>
          {pulse && (
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 8, height: 8, borderRadius: 4, background: FIT.primary,
                    animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <div style={{
          fontSize: 56, fontWeight: 800, fontFamily: FIT.mono,
          color: FIT.primary, letterSpacing: -2, marginTop: 12,
        }}>
          {displayTotal.toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: FIT.textMuted }}>jami qadam (bugun)</div>

        {state.steps > 0 && (
          <div style={{
            marginTop: 8, padding: '6px 12px', display: 'inline-block',
            background: FIT.primarySoft, color: FIT.primaryDark,
            borderRadius: 999, fontSize: 12, fontWeight: 700,
          }}>
            + {state.steps} sessiyada
          </div>
        )}
      </div>

      {error && (
        <Card pad={14} style={{ background: FIT.dangerSoft, border: 'none', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <div style={{ fontSize: 12, color: FIT.danger }}>{error}</div>
          </div>
        </Card>
      )}

      <Button variant="primary" size="lg" full onClick={onStop}>
        {state.running ? 'To\'xtatish va saqlash' : 'Saqlash'}
      </Button>

      <div style={{ fontSize: 11, color: FIT.textMuted, textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
        Telefoningizni cho&apos;ntak yoki qo&apos;lingizda ushlang.<br/>
        Sahifa ochiq turishi kerak — web brauzer orqada sana olmaydi.
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}

function tabBtn(active: boolean): React.CSSProperties {
  return {
    flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
    background: active ? '#fff' : 'transparent',
    boxShadow: active ? FIT.shadowSm : 'none',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    color: active ? FIT.text : FIT.textMuted,
  };
}
