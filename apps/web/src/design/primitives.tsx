// Shared UI primitives — ported from design/components.jsx into proper TypeScript modules.
// Keeps inline styles from the design (fast path, avoids extra CSS setup).

import { useState, type CSSProperties, type ReactNode } from 'react';
import { FIT } from './tokens';
import { Icon } from './Icon';

// ═══════════════════════════════════════════════════════
// Phone screen wrapper (keeps design preview working on desktop)
// On real mobile, height: '100dvh' lets it fill the screen.
// ═══════════════════════════════════════════════════════
interface PhoneProps {
  children: ReactNode;
  bg?: string;
  height?: number | string;
  showStatus?: boolean;
  dark?: boolean;
  statusColor?: string;
}

export function Phone({
  children, bg = FIT.bg, height = '100dvh',
  showStatus = false, dark = false, statusColor,
}: PhoneProps) {
  const sc = statusColor ?? (dark ? '#fff' : FIT.text);
  return (
    <div data-fit-page style={{
      width: '100%', maxWidth: 430, height, background: dark ? '#0F172A' : bg,
      position: 'relative', overflow: 'hidden',
      fontFamily: FIT.sans, color: dark ? '#F8FAFC' : FIT.text,
      display: 'flex', flexDirection: 'column', margin: '0 auto',
    }}>
      {showStatus && (
        <div style={{
          height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 22px 0', flexShrink: 0,
          fontSize: 15, fontWeight: 600, color: sc,
        }}>
          <span>9:41</span>
        </div>
      )}
      {children}
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

export function TabBar({ active = 'home', onTab, labels, dark }: TabBarProps) {
  const items: Array<{ id: TabId; icon?: 'home' | 'diary' | 'stats' | 'profile'; label?: string }> = [
    { id: 'home', icon: 'home', label: labels.home },
    { id: 'diary', icon: 'diary', label: labels.diary },
    { id: 'add' },
    { id: 'stats', icon: 'stats', label: labels.stats },
    { id: 'profile', icon: 'profile', label: labels.profile },
  ];
  return (
    <div style={{
      height: 84, background: dark ? 'rgba(30,41,59,0.96)' : 'rgba(255,255,255,0.96)',
      borderTop: `1px solid ${dark ? '#334155' : FIT.border}`,
      backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'flex-start',
      paddingTop: 10, position: 'relative', flexShrink: 0,
    }}>
      {items.map(tab => tab.id === 'add' ? (
        <div key="add" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => onTab?.('add')}
            style={{
              width: 56, height: 56, borderRadius: 28, background: FIT.primary, border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 8px 24px ${FIT.primary}66, 0 2px 8px ${FIT.primary}44`,
              marginTop: -24, cursor: 'pointer',
            }}
            aria-label="Quick add"
          >
            <Icon name="plus" size={28} color="#fff" strokeWidth={2.5} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          key={tab.id}
          onClick={() => onTab?.(tab.id)}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            cursor: 'pointer', background: 'none', border: 'none', padding: 0,
            color: active === tab.id ? FIT.primary : (dark ? '#94A3B8' : FIT.textMuted),
          }}
        >
          {tab.icon && <Icon name={tab.icon} size={24} strokeWidth={active === tab.id ? 2 : 1.5} />}
          <span style={{ fontSize: 10, fontWeight: active === tab.id ? 600 : 500 }}>{tab.label}</span>
        </button>
      ))}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 134, height: 5, borderRadius: 3, background: dark ? '#fff' : '#0F172A', opacity: 0.9,
      }} />
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
      flexShrink: 0, minHeight: 48,
    }}>
      {back && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          style={{
            width: 40, height: 40, borderRadius: 20,
            background: dark ? '#1E293B' : '#fff', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: FIT.shadowSm, cursor: 'pointer',
          }}
        >
          <Icon name="back" size={20} color={dark ? '#F8FAFC' : FIT.text} strokeWidth={2} />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>{title}</div>}
        {subtitle && <div style={{ fontSize: 13, color: FIT.textMuted, marginTop: 2 }}>{subtitle}</div>}
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
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark' | 'white';
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
  onClick, disabled, loading, type = 'button', dark, style,
}: ButtonProps) {
  const sizes: Record<NonNullable<ButtonProps['size']>, CSSProperties> = {
    sm: { height: 36, padding: '0 14px', fontSize: 14 },
    md: { height: 48, padding: '0 20px', fontSize: 15 },
    lg: { height: 56, padding: '0 24px', fontSize: 16 },
  };
  const variants: Record<NonNullable<ButtonProps['variant']>, CSSProperties> = {
    primary: { background: FIT.primary, color: '#fff' },
    secondary: {
      background: dark ? '#1E293B' : '#fff',
      color: dark ? '#F8FAFC' : FIT.text,
      border: `1px solid ${dark ? '#334155' : FIT.border}`,
    },
    ghost: { background: 'transparent', color: FIT.primary },
    danger: { background: FIT.danger, color: '#fff' },
    dark: { background: '#0F172A', color: '#fff' },
    white: { background: '#fff', color: FIT.text, border: `1px solid ${FIT.border}` },
  };
  
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        borderRadius: 12, fontWeight: 600, fontFamily: FIT.sans,
        cursor: isDisabled ? 'not-allowed' : 'pointer', border: 'none',
        transition: 'all .15s', letterSpacing: -0.2,
        width: full ? '100%' : 'auto',
        opacity: isDisabled ? 0.6 : 1,
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
    >
      {loading ? (
        <div style={{
          width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)',
          borderTopColor: '#fff', borderRadius: '50%',
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
}

export function Card({ children, pad = 16, style, dark, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      {...(onClick ? { 'data-fit-card': true, 'data-fit-tap': true, role: 'button' } : {})}
      style={{
        background: dark ? '#1E293B' : '#fff',
        borderRadius: 16, padding: pad,
        boxShadow: dark ? 'none' : FIT.shadowSm,
        border: dark ? '1px solid #334155' : 'none',
        cursor: onClick ? 'pointer' : 'default',
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
  children, active, color = FIT.primary, size = 'md', onClick, leading, dark, style,
}: ChipProps) {
  const h = size === 'sm' ? 28 : 34;
  return (
    <div
      onClick={onClick}
      style={{
        height: h, padding: '0 14px', borderRadius: h / 2,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: active ? color : (dark ? '#1E293B' : '#fff'),
        color: active ? '#fff' : (dark ? '#F8FAFC' : FIT.text),
        border: active ? `1px solid ${color}` : `1px solid ${dark ? '#334155' : FIT.border}`,
        fontSize: size === 'sm' ? 12 : 13, fontWeight: 600,
        cursor: onClick ? 'pointer' : 'default', flexShrink: 0, whiteSpace: 'nowrap',
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
    <div style={{ display: 'flex', height: h, borderRadius: h / 2, overflow: 'hidden', background: FIT.borderSoft, gap: 2 }}>
      <div style={{ width: `${(p / total) * 100}%`, background: FIT.protein }} />
      <div style={{ width: `${(c / total) * 100}%`, background: FIT.carbs }} />
      <div style={{ width: `${(f / total) * 100}%`, background: FIT.fat }} />
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
}

export function Ring({
  size = 160, stroke = 14, progress = 0.6, color = FIT.primary,
  bgColor, track = 0.15, children,
}: RingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const bg = bgColor ?? `${color}${Math.round(track * 255).toString(16).padStart(2, '0')}`;
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(progress, 1))}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(.2,.7,.3,1)' }}
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
  size = 180, rings, children,
}: { size?: number; rings: RingSpec[]; children?: ReactNode }) {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      {rings.map((r, i) => {
        const sw = 10;
        const sz = size - i * (sw * 2 + 6);
        const rad = (sz - sw) / 2;
        const c = 2 * Math.PI * rad;
        return (
          <svg key={i} width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
            <circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke={`${r.color}22`} strokeWidth={sw} />
            <circle
              cx={size / 2} cy={size / 2} r={rad} fill="none" stroke={r.color} strokeWidth={sw}
              strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(r.progress, 1))}
              strokeLinecap="round"
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
// FoodThumb — avatar-style emoji tile. Real photos come from food.photoUrl
// (user will drop comic-style renders into /public/foods/<slug>.png).
// ═══════════════════════════════════════════════════════

type Tone = 'green' | 'amber' | 'red' | 'purple' | 'blue' | 'pink' | 'neutral';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  green: { bg: '#D1FAE5', fg: '#059669' },
  amber: { bg: '#FEF3C7', fg: '#D97706' },
  red: { bg: '#FEE2E2', fg: '#DC2626' },
  purple: { bg: '#EDE9FE', fg: '#7C3AED' },
  blue: { bg: '#DBEAFE', fg: '#2563EB' },
  pink: { bg: '#FCE7F3', fg: '#DB2777' },
  neutral: { bg: '#F1F5F9', fg: '#475569' },
};

export function FoodThumb({
  name, size = 48, emoji, tone = 'green', photo,
}: { name?: string; size?: number; emoji?: string; tone?: Tone; photo?: string }) {
  const toneColors = TONES[tone];
  const [photoFailed, setPhotoFailed] = useState(false);
  const initials = name ? name.slice(0, 2).toUpperCase() : '··';

  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: toneColors.bg, color: toneColors.fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      fontSize: emoji ? size * 0.5 : size * 0.34, fontWeight: 700, fontFamily: FIT.sans,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Always render emoji/initials as fallback */}
      {emoji ?? initials}
      {/* Photo on top — invisible until loaded; stays hidden on error */}
      {photo && !photoFailed && (
        <img
          src={photo}
          alt=""
          loading="lazy"
          onError={() => setPhotoFailed(true)}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', borderRadius: size * 0.28,
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Input — label + field (read-only for mockups; cheap model wires real state)
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
  label, placeholder, value, onChange, type = 'text', right, leading, dark, readOnly,
}: InputProps) {
  return (
    <div style={{ position: 'relative' }}>
      {label && (
        <div style={{
          fontSize: 12, color: dark ? '#94A3B8' : FIT.textMuted, marginBottom: 6,
          fontWeight: 600, letterSpacing: 0.2, textTransform: 'uppercase',
        }}>{label}</div>
      )}
      <div style={{
        height: 52, borderRadius: 12, background: dark ? '#1E293B' : '#fff',
        border: `1px solid ${dark ? '#334155' : FIT.border}`,
        display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
      }}>
        {leading}
        <input
          readOnly={readOnly}
          value={value ?? ''}
          placeholder={placeholder}
          type={type}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontSize: 15, fontFamily: FIT.sans, color: dark ? '#F8FAFC' : FIT.text,
          }}
        />
        {right}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Stat — big number with unit + label
// ═══════════════════════════════════════════════════════
export function Stat({
  value, unit, label, color, size = 'md', dark,
}: {
  value: string | number; unit?: string; label?: string; color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl'; dark?: boolean;
}) {
  const sizes = {
    sm: { v: 18, u: 11, l: 11 },
    md: { v: 28, u: 14, l: 12 },
    lg: { v: 40, u: 16, l: 13 },
    xl: { v: 56, u: 18, l: 13 },
  }[size];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{
          fontSize: sizes.v, fontWeight: 700, fontFamily: FIT.mono,
          color: color ?? (dark ? '#F8FAFC' : FIT.text), letterSpacing: -1,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {value}
        </span>
        {unit && <span style={{ fontSize: sizes.u, fontWeight: 500, color: dark ? '#94A3B8' : FIT.textMuted }}>{unit}</span>}
      </div>
      {label && (
        <div style={{ fontSize: sizes.l, color: dark ? '#94A3B8' : FIT.textMuted, marginTop: 2, fontWeight: 500 }}>
          {label}
        </div>
      )}
    </div>
  );
}
