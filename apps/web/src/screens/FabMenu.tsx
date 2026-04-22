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
    <Phone dark={dark}>
      <div
        onClick={() => navigate(-1)}
        style={{
          flex: 1, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(8px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '20px 20px 120px',
        }}
      >
        <div style={{
          fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, textAlign: 'center',
        }}>
          QANDAY QO&apos;SHAMIZ?
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((it) => (
            <button
              type="button"
              key={it.name}
              onClick={(e) => {
                e.stopPropagation();
                navigate(it.route);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: '#fff',
                borderRadius: 16, boxShadow: FIT.shadowMd, border: 'none', cursor: 'pointer',
                textAlign: 'left', width: '100%',
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14, background: `${it.color}1a`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
              }}>
                {it.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: FIT.text }}>{it.name}</div>
                <div style={{ fontSize: 12, color: FIT.textMuted, marginTop: 2 }}>{it.desc}</div>
              </div>
              <Icon name="chevron" size={18} color={FIT.textSubtle} />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Close"
          style={{
            position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
            width: 56, height: 56, borderRadius: 28, background: '#fff',
            boxShadow: FIT.shadowLg, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon name="close" size={24} color={FIT.text} strokeWidth={2.5} />
        </button>
      </div>
    </Phone>
  );
}
