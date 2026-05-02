import { PRIMARY_PALETTES, usePrefs, type Lang } from '@/stores/prefs';
import { FIT } from '@/design/tokens';

const LANGS: Lang[] = ['uz', 'ru', 'en'];
const THEMES = [
  { k: 'light', n: '☀️ Light' },
  { k: 'dark', n: '🌙 Dark' },
] as const;
const COLORS = Object.keys(PRIMARY_PALETTES);

/** Pure UI for tweaks panel — removed floating button logic. 
 *  This is now used as a modal or inline element in the Profile settings. */
export function TweaksPanelContent({ onClose }: { onClose: () => void }) {
  const { lang, theme, primaryColor, setLang, setTheme, setPrimaryColor } = usePrefs();

  return (
    <div style={{
      width: '100%', background: 'transparent',
      fontFamily: 'Inter, sans-serif',
      color: '#0F172A',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: FIT.text }}>Tweak Panel</div>
        <div onClick={onClose} style={{ cursor: 'pointer', color: FIT.textMuted, fontSize: 24 }}>×</div>
      </div>

      <Label>Til (Language)</Label>
      <Row>
        {LANGS.map((l) => (
          <Pill key={l} active={lang === l} onClick={() => setLang(l)} color={primaryColor}>
            {l.toUpperCase()}
          </Pill>
        ))}
      </Row>

      <Label>Tema (Theme)</Label>
      <Row>
        {THEMES.map((th) => (
          <Pill key={th.k} active={theme === th.k} onClick={() => setTheme(th.k)} color={primaryColor}>
            {th.n}
          </Pill>
        ))}
      </Row>

      <Label>Primary Rang (Accent)</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {COLORS.map((c) => (
          <div
            key={c}
            onClick={() => setPrimaryColor(c)}
            style={{
              width: 44, height: 44, borderRadius: 12, background: c, cursor: 'pointer',
              border: primaryColor === c ? '3px solid #0F172A' : '4px solid transparent',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
          />
        ))}
      </div>

      <div style={{ fontSize: 12, color: FIT.textMuted, lineHeight: 1.5, background: `${FIT.primary}10`, padding: 12, borderRadius: 12 }}>
        Bu sozlamalar butun ilova bo'ylab darhol qo'llaniladi.
      </div>
    </div>
  );
}

// Keep original for back-compat if needed, but remove the floating button
export function TweaksPanel() { return null; }

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 800, color: FIT.textMuted,
      textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
    }}>{children}</div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>{children}</div>;
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
        flex: 1, padding: '12px 0', textAlign: 'center', borderRadius: 12,
        background: active ? color : (active ? '#fff' : '#F1F5F9'),
        color: active ? '#fff' : '#0F172A',
        fontSize: 13, fontWeight: 800, cursor: 'pointer',
        boxShadow: active ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
      }}
    >
      {children}
    </div>
  );
}
