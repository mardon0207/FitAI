// Shared UI primitives — Enhanced for WOW-factor.
// Keeps inline styles from the design + premium CSS classes.

import { useState, type CSSProperties, type ReactNode } from 'react';
import { FIT } from './tokens';
import { Icon } from './Icon';
export { Icon };

// ═══════════════════════════════════════════════════════
// Mesh Background Component for the WOW factor
// ═══════════════════════════════════════════════════════
export function MeshBg({ dark }: { dark?: boolean }) {
  return (
    <div className="mesh-bg">
      <div className="mesh-blob" style={{ 
        width: '120%', height: '80%', top: '-20%', left: '-10%', 
        background: dark ? '#4F46E5' : '#EEF2FF' 
      }} />
      <div className="mesh-blob" style={{ 
        width: '100%', height: '70%', bottom: '-10%', right: '-20%', 
        background: dark ? '#00FFFF' : '#ECFDF5',
        animationDelay: '-5s'
      }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Phone screen wrapper
// ═══════════════════════════════════════════════════════
interface PhoneProps {
  children: ReactNode;
  bg?: string;
  height?: number | string;
  showStatus?: boolean;
  dark?: boolean;
  statusColor?: string;
  mesh?: boolean;
  stagger?: boolean;
}

export function Phone({
  children, bg = FIT.bg, height = '100dvh',
  showStatus = false, dark = true, statusColor,
  mesh = true, stagger = true,
}: PhoneProps) {
  const sc = statusColor ?? (dark ? '#fff' : FIT.text);
  return (
    <div 
      data-fit-page 
      style={{
        width: '100%', maxWidth: 430, height, background: dark ? '#020617' : bg,
        position: 'relative', overflow: 'hidden',
        fontFamily: FIT.sans, color: dark ? '#F8FAFC' : FIT.text,
        display: 'flex', flexDirection: 'column', margin: '0 auto',
        touchAction: 'pan-y pinch-zoom',
      }}
    >
      {mesh && <MeshBg dark={dark} />}
      
      {showStatus && (
        <div style={{
          height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 22px 0', flexShrink: 0, position: 'relative', zIndex: 10,
          fontSize: 15, fontWeight: 600, color: sc,
        }}>
          {/* Status bar icons/time removed as requested */}
        </div>
      )}
      
      <div 
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          position: 'relative', 
          zIndex: 1,
          overflow: 'hidden'
        }}
        {...(stagger ? { 'data-fit-stagger': true } : {})}
      >
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Bottom tab bar
// ═══════════════════════════════════════════════════════
export type TabId = 'home' | 'diary' | 'add' | 'stats' | 'profile';

interface TabBarProps {
  active?: TabId;
  onTab?: (id: TabId) => void;
  labels: Record<Exclude<TabId, 'add'>, string>;
  dark?: boolean;
}

export function TabBar({ active = 'home', onTab, labels, dark = true }: TabBarProps) {
  const items: Array<{ id: TabId; icon?: 'home' | 'diary' | 'stats' | 'profile'; label?: string }> = [
    { id: 'home', icon: 'home', label: labels.home },
    { id: 'diary', icon: 'diary', label: labels.diary },
    { id: 'add' },
    { id: 'stats', icon: 'stats', label: labels.stats },
    { id: 'profile', icon: 'profile', label: labels.profile },
  ];
  return (
    <div 
      style={{
        height: 90, margin: '0 16px 16px', borderRadius: 32,
        background: 'rgba(10, 14, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center',
        position: 'relative', flexShrink: 0,
        zIndex: 1000,
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.4)',
      }}
    >
      {items.map(tab => tab.id === 'add' ? (
        <div key="add" style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: -45, width: 74, height: 74, borderRadius: 37,
            background: 'rgba(1, 4, 17, 1)', border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <button
              type="button"
              onClick={() => onTab?.('add')}
              className="neon-glow-cyan"
              style={{
                width: 62, height: 62, borderRadius: 31, background: FIT.cyan, border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: `0 0 25px rgba(0, 242, 255, 0.6)`,
              }}
              aria-label="Quick add"
            >
              <Icon name="plus" size={32} color="#000" strokeWidth={3} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          key={tab.id}
          onClick={() => onTab?.(tab.id)}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            cursor: 'pointer', background: 'none', border: 'none', padding: 0,
            color: active === tab.id ? FIT.cyan : (dark ? '#64748B' : FIT.textMuted),
            transition: 'all 0.3s cubic-bezier(.2,.7,.3,1)',
          }}
        >
          {tab.icon && (
            <div style={{ position: 'relative' }}>
              <Icon name={tab.icon} size={26} strokeWidth={active === tab.id ? 2.5 : 1.5} color={active === tab.id ? FIT.cyan : undefined} />
              {active === tab.id && (
                <div style={{ 
                  position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)',
                  width: 4, height: 4, borderRadius: 2, background: FIT.cyan,
                  boxShadow: `0 0 10px ${FIT.cyan}`
                }} />
              )}
            </div>
          )}
          <span style={{ 
            fontSize: 10, 
            fontWeight: 800, 
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            opacity: active === tab.id ? 1 : 0.6,
            marginTop: 4
          }}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// Top bar
// ═══════════════════════════════════════════════════════
interface TopBarProps {
  title?: string;
  subtitle?: string;
  back?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  dark?: boolean;
  transparent?: boolean;
}

export function TopBar({ title, subtitle, back, onBack, right, dark, transparent }: TopBarProps) {
  return (
    <div style={{
      padding: '8px 20px 12px', display: 'flex', alignItems: 'center', gap: 12,
      background: transparent ? 'transparent' : (dark ? '#0F172A' : FIT.bg),
      flexShrink: 0, minHeight: 64, position: 'relative', zIndex: 10,
    }}>
      {back && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="glass-premium"
          style={{
            width: 40, height: 40, borderRadius: 16,
            border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Icon name="back" size={20} color={dark ? '#F8FAFC' : FIT.text} strokeWidth={2.5} />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, color: dark ? '#fff' : FIT.text }}>{title}</div>}
        {subtitle && <div style={{ fontSize: 13, color: FIT.textMuted, fontWeight: 500 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Button
// ═══════════════════════════════════════════════════════
export interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark' | 'white' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  full?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  dark?: boolean;
  style?: CSSProperties;
}

export function Button({
  children, variant = 'primary', size = 'md', full, leading, trailing,
  onClick, disabled, loading, type = 'button', dark = true, style,
}: ButtonProps) {
  const sizes: Record<NonNullable<ButtonProps['size']>, CSSProperties> = {
    sm: { height: 38, padding: '0 16px', fontSize: 14 },
    md: { height: 50, padding: '0 22px', fontSize: 15 },
    lg: { height: 58, padding: '0 26px', fontSize: 16 },
  };
  
  const variants: Record<NonNullable<ButtonProps['variant']>, CSSProperties> = {
    primary: { background: FIT.cyan, color: '#000' },
    secondary: {
      background: 'rgba(255,255,255,0.05)',
      color: '#fff',
      border: `1px solid rgba(255,255,255,0.1)`,
      backdropFilter: 'blur(10px)',
    },
    ghost: { background: 'transparent', color: FIT.cyan },
    danger: { background: FIT.danger, color: '#fff' },
    dark: { background: '#0F172A', color: '#fff' },
    white: { background: '#fff', color: FIT.text, border: `1px solid ${FIT.border}` },
    premium: { 
      background: `linear-gradient(135deg, ${FIT.cyan}, ${FIT.neonPink})`, 
      color: '#000',
      boxShadow: '0 8px 32px rgba(0, 255, 255, 0.3)'
    },
  };
  
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        borderRadius: 18, fontWeight: 800, fontFamily: FIT.sans,
        textTransform: 'uppercase', letterSpacing: 0.5,
        cursor: isDisabled ? 'not-allowed' : 'pointer', border: 'none',
        transition: 'all .2s',
        width: full ? '100%' : 'auto',
        opacity: isDisabled ? 0.5 : 1,
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
    >
      {loading ? (
        <div style={{
          width: 18, height: 18, border: '2px solid rgba(0,0,0,0.1)',
          borderTopColor: '#000', borderRadius: '50%',
          animation: 'fit-spin 0.6s linear infinite'
        }} />
      ) : (
        <>
          {leading}
          {children}
          {trailing}
        </>
      )}
      <style>{`
        @keyframes fit-spin { to { transform: rotate(360deg); } }
      `}</style>
    </button>
  );
}

// ═══════════════════════════════════════════════════════
// Card
// ═══════════════════════════════════════════════════════
interface CardProps {
  children: ReactNode;
  pad?: number;
  style?: CSSProperties;
  dark?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'outline';
}

export function Card({ children, pad = 20, style, dark = true, onClick, variant = 'glass' }: CardProps) {
  const isGlass = variant === 'glass';
  return (
    <div
      onClick={onClick}
      className={isGlass ? 'glass-premium' : ''}
      {...(onClick ? { 'data-fit-card': true, 'data-fit-tap': true, role: 'button' } : {})}
      style={{
        background: isGlass ? undefined : (dark ? 'rgba(15, 23, 42, 0.6)' : '#fff'),
        borderRadius: 28, padding: pad,
        boxShadow: 'none',
        border: !isGlass ? (dark ? '1px solid rgba(255,255,255,0.05)' : 'none') : undefined,
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        transition: 'transform 0.2s cubic-bezier(.2,.7,.3,1)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Chip / Pill
// ═══════════════════════════════════════════════════════
interface ChipProps {
  children: ReactNode;
  active?: boolean;
  color?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
  leading?: ReactNode;
  dark?: boolean;
  style?: CSSProperties;
}

export function Chip({
  children, active, color = FIT.cyan, size = 'md', onClick, leading, dark = true, style,
}: ChipProps) {
  const h = size === 'sm' ? 30 : 36;
  return (
    <div
      onClick={onClick}
      style={{
        height: h, padding: '0 16px', borderRadius: 14,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: active ? color : 'rgba(255,255,255,0.05)',
        color: active ? '#000' : '#fff',
        border: active ? `1px solid ${color}` : `1px solid rgba(255,255,255,0.1)`,
        fontSize: size === 'sm' ? 12 : 13, fontWeight: 800,
        cursor: onClick ? 'pointer' : 'default', flexShrink: 0, whiteSpace: 'nowrap',
        transition: 'all 0.2s',
        ...style,
      }}
    >
      {leading}
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Macro bar (stacked)
// ═══════════════════════════════════════════════════════
export function MacroBar({ p = 30, c = 45, f = 25, h = 8 }: { p?: number; c?: number; f?: number; h?: number }) {
  const total = p + c + f || 1;
  return (
    <div style={{ display: 'flex', height: h, borderRadius: h / 2, overflow: 'hidden', background: 'rgba(255,255,255,0.05)', gap: 2 }}>
      <div style={{ width: `${(p / total) * 100}%`, background: FIT.neonPink }} />
      <div style={{ width: `${(c / total) * 100}%`, background: FIT.lime }} />
      <div style={{ width: `${(f / total) * 100}%`, background: FIT.purple }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Ring (Apple-Watch style)
// ═══════════════════════════════════════════════════════
interface RingProps {
  size?: number;
  stroke?: number;
  progress?: number;
  color?: string;
  bgColor?: string;
  track?: number;
  children?: ReactNode;
  glow?: boolean;
}

export function Ring({
  size = 160, stroke = 16, progress = 0.6, color = FIT.cyan,
  bgColor, track = 0.1, children, glow = true
}: RingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const bg = bgColor ?? `${color}15`;
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} className={glow ? 'neon-glow-cyan' : ''}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(progress, 1))}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.2,.7,.3,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Multi-ring (calories + macros)
// ═══════════════════════════════════════════════════════
interface RingSpec { progress: number; color: string }

export function MultiRing({
  size = 200, rings, children,
}: { size?: number; rings: RingSpec[]; children?: ReactNode }) {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      {rings.map((r, i) => {
        const sw = 18;
        const diameter = size - i * (sw + 8);
        const rad = (diameter - sw) / 2;
        const c = 2 * Math.PI * rad;
        const glowClass = r.color === FIT.cyan ? 'neon-glow-cyan' : (r.color === FIT.neonPink ? 'neon-glow-pink' : (r.color === FIT.lime ? 'neon-glow-lime' : ''));
        
        return (
          <svg key={i} width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }} className={glowClass}>
            <circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke={`${r.color}15`} strokeWidth={sw} />
            <circle
              cx={size / 2} cy={size / 2} r={rad} fill="none" stroke={r.color} strokeWidth={sw}
              strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(r.progress, 1))}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.2,.7,.3,1)' }}
            />
          </svg>
        );
      })}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
      }}>
        {children}
      </div>
    </div>
  );
}



// ═══════════════════════════════════════════════════════
// FoodThumb
// ═══════════════════════════════════════════════════════
type Tone = 'green' | 'amber' | 'red' | 'purple' | 'blue' | 'pink' | 'neutral';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  green: { bg: 'rgba(0, 255, 255, 0.1)', fg: '#00FFFF' },
  amber: { bg: 'rgba(204, 255, 0, 0.1)', fg: '#CCFF00' },
  red: { bg: 'rgba(255, 87, 51, 0.1)', fg: '#FF5733' },
  purple: { bg: 'rgba(191, 64, 191, 0.1)', fg: '#BF40BF' },
  blue: { bg: 'rgba(79, 70, 229, 0.1)', fg: '#4F46E5' },
  pink: { bg: 'rgba(255, 0, 255, 0.1)', fg: '#FF00FF' },
  neutral: { bg: 'rgba(255, 255, 255, 0.05)', fg: '#94A3B8' },
};

export function FoodThumb({
  name, size = 48, emoji, tone = 'green', photo,
}: { name?: string | null; size?: number; emoji?: string | null; tone?: Tone; photo?: string | null | undefined }) {
  const toneColors = TONES[tone];
  const [photoFailed, setPhotoFailed] = useState(false);
  const initials = name ? name.slice(0, 2).toUpperCase() : '··';

  return (
    <div style={{
      width: size, height: size, borderRadius: 18,
      background: toneColors.bg, color: toneColors.fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      fontSize: emoji ? size * 0.5 : size * 0.34, fontWeight: 800, fontFamily: FIT.sans,
      position: 'relative', overflow: 'hidden',
      border: `1px solid ${toneColors.fg}33`,
    }}>
      {emoji ?? initials}
      {photo && !photoFailed && (
        <img
          src={photo}
          alt=""
          loading="lazy"
          onError={() => setPhotoFailed(true)}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', borderRadius: 18,
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Input
// ═══════════════════════════════════════════════════════
interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  right?: ReactNode;
  leading?: ReactNode;
  dark?: boolean;
  readOnly?: boolean;
}

export function Input({
  label, placeholder, value, onChange, type = 'text', right, leading, dark = true, readOnly,
}: InputProps) {
  return (
    <div style={{ position: 'relative' }}>
      {label && (
        <div style={{
          fontSize: 10, color: '#64748B', marginBottom: 8,
          fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase',
        }}>{label}</div>
      )}
      <div 
        className="glass-premium"
        style={{
          height: 56, borderRadius: 18,
          display: 'flex', alignItems: 'center', padding: '0 18px', gap: 12,
          boxShadow: 'none', border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {leading}
        <input
          readOnly={readOnly}
          value={value ?? ''}
          placeholder={placeholder}
          type={type}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontSize: 15, fontFamily: FIT.sans, color: '#fff',
            fontWeight: 600,
          }}
        />
        {right}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Stat
// ═══════════════════════════════════════════════════════
export function Stat({
  value, unit, label, color, size = 'md', dark = true,
}: {
  value: string | number; unit?: string; label?: string; color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl'; dark?: boolean;
}) {
  const sizes = {
    sm: { v: 20, u: 11, l: 11 },
    md: { v: 30, u: 14, l: 11 },
    lg: { v: 44, u: 16, l: 12 },
    xl: { v: 60, u: 18, l: 12 },
  }[size];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{
          fontSize: sizes.v, fontWeight: 800, fontFamily: FIT.mono,
          color: color ?? '#fff', letterSpacing: -1,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {value}
        </span>
        {unit && <span style={{ fontSize: sizes.u, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>{unit}</span>}
      </div>
      {label && (
        <div style={{ fontSize: sizes.l, color: '#64748B', marginTop: 4, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
          {label}
        </div>
      )}
    </div>
  );
}
