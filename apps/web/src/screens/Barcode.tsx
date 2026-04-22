// Barcode scanner (barcode reading only — NOT AI vision).
// Ported from design/screens-b.jsx::ScreenBarcode.

import { useNavigate } from 'react-router-dom';
import { Phone, Button, FoodThumb } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';

export function BarcodeScreen() {
  const navigate = useNavigate();

  return (
    <Phone dark statusColor="#fff">
      <div style={{
        flex: 1, background: '#000', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 50%, #334155 0%, #0F172A 100%)',
        }} />

        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 50, left: 0, right: 0,
          padding: '0 20px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', zIndex: 10,
        }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Yopish"
            style={{
              width: 40, height: 40, borderRadius: 20,
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
            }}
          >
            <Icon name="close" size={20} color="#fff" strokeWidth={2.5} />
          </button>
          <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Shtrix-kod</div>
          <button
            type="button"
            aria-label="Flash"
            style={{
              width: 40, height: 40, borderRadius: 20,
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
            }}
          >
            <Icon name="flash" size={20} color={FIT.accent} strokeWidth={2} />
          </button>
        </div>

        {/* Scan frame */}
        <div style={{
          position: 'absolute', top: '32%', left: '50%',
          transform: 'translateX(-50%)', width: 240, height: 160,
        }}>
          <Corner position="tl" />
          <Corner position="tr" />
          <Corner position="bl" />
          <Corner position="br" />
          <div style={{
            position: 'absolute', top: '50%', left: 10, right: 10,
            height: 2, background: FIT.danger, boxShadow: `0 0 12px ${FIT.danger}`,
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', display: 'flex', gap: 2,
          }}>
            {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 3, 1, 2, 3, 1, 2].map((w, i) => (
              <div key={i} style={{ width: w, height: 80, background: '#fff', opacity: 0.3 }} />
            ))}
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 180, left: 0, right: 0,
          textAlign: 'center', color: '#fff', fontSize: 13,
        }}>
          <div style={{ fontWeight: 600 }}>Shtrix-kodni ramka ichiga joylashtiring</div>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>OpenFoodFacts bazasidan</div>
        </div>

        {/* Preview sheet */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
          padding: '16px 20px 24px',
        }}>
          <div style={{
            width: 36, height: 4, background: FIT.border, borderRadius: 2, margin: '0 auto 12px',
          }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <FoodThumb emoji="🥛" tone="blue" size={52} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Sut 2.5% · Nestle</div>
              <div style={{ fontSize: 11, color: FIT.textMuted }}>1 stakan (200ml) · 120 kkal</div>
              <div style={{
                display: 'flex', gap: 10, fontSize: 10, fontFamily: FIT.mono,
                marginTop: 4, fontWeight: 600,
              }}>
                <span style={{ color: FIT.protein }}>P 7g</span>
                <span style={{ color: FIT.carbs }}>C 9g</span>
                <span style={{ color: FIT.fat }}>F 5g</span>
              </div>
            </div>
            <Button size="sm" variant="primary" onClick={() => navigate('/diary')}>
              Qo&apos;shish
            </Button>
          </div>
        </div>
      </div>
    </Phone>
  );
}

function Corner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const common = {
    position: 'absolute' as const, width: 30, height: 30,
    borderStyle: 'solid', borderColor: FIT.primary, borderWidth: 0,
  };
  const specific: Record<typeof position, React.CSSProperties> = {
    tl: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 12 },
    tr: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 12 },
    bl: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 12 },
    br: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 12 },
  };
  return <div style={{ ...common, ...specific[position] }} />;
}
