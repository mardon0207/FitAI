import { useState } from 'react';
import { PRIMARY_PALETTES, usePrefs, type Lang } from '@/stores/prefs';

const LANGS: Lang[] = ['uz', 'ru', 'en'];
const THEMES = [
  { k: 'light', n: '☀️ Light' },
  { k: 'dark', n: '🌙 Dark' },
] as const;
const COLORS = Object.keys(PRIMARY_PALETTES);

/** Floating developer tweaks panel — ports `design/FitAI.html::Tweaks`.
 *  Toggles language, theme, and primary accent live across the app. */
export function TweaksPanel() {
  const [open, setOpen] = useState(false);
  const { lang, theme, primaryColor, setLang, setTheme, setPrimaryColor } = usePrefs();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Open tweaks"
        style={{
          position: 'fixed', bottom: 16, right: 16, zIndex: 9999,
          width: 44, height: 44, borderRadius: 999,
          background: '#fff', border: '1px solid #E5E7EB',
          boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
          fontSize: 18, cursor: 'pointer',
        }}
      >⚙️</button>
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      width: 280, background: '#fff', borderRadius: 16,
      boxShadow: '0 12px 48px rgba(0,0,0,0.18)', padding: 18,
      fontFamily: 'Inter, sans-serif', border: '1px solid #E5E7EB',
      color: '#0F172A',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Tweaks</div>
        <div onClick={() => setOpen(false)} style={{ cursor: 'pointer', color: '#64748B', fontSize: 18 }}>×</div>
      </div>

      <Label>Til</Label>
      <Row>
        {LANGS.map((l) => (
          <Pill key={l} active={lang === l} onClick={() => setLang(l)} color={primaryColor}>
            {l.toUpperCase()}
          </Pill>
        ))}
      </Row>

      <Label>Tema</Label>
      <Row>
        {THEMES.map((th) => (
          <Pill key={th.k} active={theme === th.k} onClick={() => setTheme(th.k)} color={primaryColor}>
            {th.n}
          </Pill>
        ))}
      </Row>

      <Label>Primary rang</Label>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {COLORS.map((c) => (
          <div
            key={c}
            onClick={() => setPrimaryColor(c)}
            style={{
              width: 36, height: 36, borderRadius: 10, background: c, cursor: 'pointer',
              border: primaryColor === c ? '3px solid #0F172A' : '3px solid transparent',
            }}
          />
        ))}
      </div>

      <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>
        Til, tema va primary rang butun app bo'ylab darhol qo'llanadi.
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: '#64748B',
      textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6,
    }}>{children}</div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>{children}</div>;
}

interface PillProps {
  active: boolean;
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}

function Pill({ active, color, onClick, children }: PillProps) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1, padding: '8px 0', textAlign: 'center', borderRadius: 8,
        background: active ? color : '#F5F5F4',
        color: active ? '#fff' : '#0F172A',
        fontSize: 12, fontWeight: 600, cursor: 'pointer',
      }}
    >
      {children}
    </div>
  );
}

