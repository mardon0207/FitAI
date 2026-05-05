import { PRIMARY_PALETTES, usePrefs, type Lang } from '@/stores/prefs';
import { FIT } from '@/design/tokens';
import { useProfile } from '@/stores/profile';

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
  const role = useProfile(s => s.role);
  const updateProfile = useProfile(s => s.updateProfile);

  const isActuallyAdmin = role === 'admin';

  return (
    <div style={{
      width: '100%', height: '100%',
      fontFamily: FIT.sans,
      color: '#0F172A',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexShrink: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: FIT.text }}>Tweak Panel</div>
        <div onClick={onClose} style={{ cursor: 'pointer', color: FIT.textMuted, fontSize: 24, padding: 4 }}>×</div>
      </div>

      <div className="fit-scroll" style={{ 
        flex: 1, 
        overflowY: 'auto', 
        paddingRight: 4,
        marginRight: -4,
        paddingBottom: 20
      }}>

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

      <div style={{ fontSize: 12, color: FIT.textMuted, lineHeight: 1.5, background: `${FIT.primary}10`, padding: 12, borderRadius: 12, marginBottom: 20 }}>
        Bu sozlamalar butun ilova bo'ylab darhol qo'llaniladi.
      </div>

      <Label>Tizim (System)</Label>
      <div 
        onClick={() => {
          const next = isActuallyAdmin ? 'user' : 'admin';
          updateProfile({ role: next });
        }}
        style={{
          width: '100%', padding: '16px', borderRadius: 16,
          background: isActuallyAdmin ? `${FIT.cyan}15` : 'rgba(255,255,255,0.05)',
          border: `1px solid ${isActuallyAdmin ? FIT.cyan : 'rgba(255,255,255,0.1)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', transition: 'all 0.2s'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: isActuallyAdmin ? FIT.cyan : '#fff' }}>
            {isActuallyAdmin ? 'Admin Mode Active' : 'Enable Admin Mode'}
          </div>
          <div style={{ fontSize: 11, color: FIT.textMuted }}>
            {isActuallyAdmin ? 'You have full access to product management.' : 'Click to grant yourself admin privileges.'}
          </div>
        </div>
        <div style={{ 
          width: 48, height: 26, borderRadius: 13, 
          background: isActuallyAdmin ? FIT.cyan : 'rgba(255,255,255,0.1)', 
          position: 'relative',
          transition: 'all 0.3s'
        }}>
          <div style={{ 
            width: 20, height: 20, borderRadius: 10, background: '#fff', 
            position: 'absolute', 
            left: isActuallyAdmin ? 25 : 3, top: 3,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        </div>
        </div>
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
