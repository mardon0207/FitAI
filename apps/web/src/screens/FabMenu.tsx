// Quick-log menu shown when user taps the + FAB in the tab bar.
// Ported from design/screens-c.jsx ScreenFabMenu.

import { useNavigate } from 'react-router-dom';
import { Phone } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs } from '@/stores/prefs';

interface FabItem {
  icon: string;
  name: string;
  desc: string;
  color: string;
  route: string;
}

export function FabMenu() {
  const navigate = useNavigate();
  const dark = usePrefs((s) => s.theme === 'dark');

  const items: FabItem[] = [
    { icon: '🔍', name: 'Qidirish', desc: 'Ovqat nomidan izlash', color: FIT.primary, route: '/search' },
    { icon: '🧩', name: "Ingredientlardan yig'ish", desc: 'Ingredientlardan taom', color: FIT.accent, route: '/composer' },
    { icon: '📊', name: 'Shtrix-kod', desc: "Qadoqdan o'qish", color: FIT.protein, route: '/barcode' },
    { icon: '✏️', name: "Qo'lda qo'shish", desc: 'Yangi taom yaratish', color: FIT.fat, route: '/manual' },
  ];

  return (
    <Phone dark showStatus mesh>
      <div
        onClick={() => navigate(-1)}
        style={{
          flex: 1, 
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '20px 20px 140px',
          background: 'rgba(1, 4, 17, 0.4)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{
          fontSize: 12, color: FIT.cyan, fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16, textAlign: 'center',
        }}>
          QANDAY QO&apos;SHAMIZ?
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((it) => (
            <button
              type="button"
              key={it.name}
              onClick={(e) => {
                e.stopPropagation();
                navigate(it.route);
              }}
              className="glass-premium"
              style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', 
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 24, cursor: 'pointer',
                textAlign: 'left', width: '100%',
                transition: 'transform 0.2s',
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                {it.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{it.name}</div>
                <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4, fontWeight: 500 }}>{it.desc}</div>
              </div>
              <Icon name="chevron" size={18} color="#64748B" />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Close"
          className="neon-glow-cyan"
          style={{
            position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
            width: 64, height: 64, borderRadius: 32, background: FIT.cyan,
            boxShadow: `0 0 30px ${FIT.cyan}66`, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <Icon name="close" size={28} color="#000" strokeWidth={3} />
        </button>
      </div>
    </Phone>
  );
}

