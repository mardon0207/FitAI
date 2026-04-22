// Shared FitAI UI components — phone-screen sized (375 wide)

// ═══════════════════════════════════════════════════════
// Phone screen — lightweight iOS-styled screen wrapper
// ═══════════════════════════════════════════════════════
function Phone({ children, bg = FIT.bg, width = 375, height = 720, showStatus = true, dark = false, statusColor }) {
  const sc = statusColor || (dark ? '#fff' : '#0F172A');
  return (
    <div style={{
      width, height, background: dark ? '#0F172A' : bg,
      position: 'relative', overflow: 'hidden',
      fontFamily: FIT.sans, color: dark ? '#F8FAFC' : FIT.text,
      display: 'flex', flexDirection: 'column',
    }}>
      {showStatus && (
        <div style={{
          height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 22px 0', flexShrink: 0,
          fontFamily: FIT.sans, fontSize: 15, fontWeight: 600, color: sc,
        }}>
          <span>9:41</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <svg width="17" height="11" viewBox="0 0 17 11"><path d="M1 10h2v-1H1zM5 10h2V7H5zM9 10h2V4H9zM13 10h2V1h-2z" fill={sc}/></svg>
            <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 2.5A6 6 0 0112 4L13.5 2.5A8 8 0 001.5 2.5L3 4a6 6 0 014.5-1.5zM7.5 6a3 3 0 012.1.9L11 5.4A5 5 0 004 5.4L5.4 6.9A3 3 0 017.5 6zM7.5 9.5A1 1 0 107.5 7.5 1 1 0 007.5 9.5z" fill={sc}/></svg>
            <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke={sc} fill="none" opacity="0.4"/><rect x="2" y="2" width="17" height="7" rx="1" fill={sc}/><rect x="21" y="3.5" width="1.5" height="4" rx="0.5" fill={sc} opacity="0.4"/></svg>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Bottom tab bar
// ═══════════════════════════════════════════════════════
function TabBar({ active = 'home', onTab, t, dark }) {
  const tabs = [
    { id: 'home', icon: 'home', label: t.home },
    { id: 'diary', icon: 'diary', label: t.diary },
    { id: 'add', icon: null, label: null },
    { id: 'stats', icon: 'stats', label: t.stats },
    { id: 'profile', icon: 'profile', label: t.profile },
  ];
  return (
    <div style={{
      height: 84, background: dark ? 'rgba(30,41,59,0.96)' : 'rgba(255,255,255,0.96)',
      borderTop: `1px solid ${dark ? '#334155' : FIT.border}`,
      backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'flex-start',
      paddingTop: 10, position: 'relative', flexShrink: 0,
    }}>
      {tabs.map(tab => tab.id === 'add' ? (
        <div key="add" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28, background: FIT.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 24px ${FIT.primary}66, 0 2px 8px ${FIT.primary}44`,
            marginTop: -24, cursor: 'pointer',
          }} onClick={() => onTab && onTab('add')}>
            <Icon name="plus" size={28} color="#fff" strokeWidth={2.5} />
          </div>
        </div>
      ) : (
        <div key={tab.id} onClick={() => onTab && onTab(tab.id)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer',
          color: active === tab.id ? FIT.primary : (dark ? '#94A3B8' : FIT.textMuted),
        }}>
          <Icon name={tab.icon} size={24} strokeWidth={active === tab.id ? 2 : 1.5} />
          <span style={{ fontSize: 10, fontWeight: active === tab.id ? 600 : 500 }}>{tab.label}</span>
        </div>
      ))}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 134, height: 5, borderRadius: 3, background: dark ? '#fff' : '#0F172A', opacity: 0.9,
      }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Top app bar
// ═══════════════════════════════════════════════════════
function TopBar({ title, subtitle, back, onBack, right, dark, transparent }) {
  return (
    <div style={{
      padding: '8px 20px 12px', display: 'flex', alignItems: 'center', gap: 12,
      background: transparent ? 'transparent' : (dark ? '#0F172A' : FIT.bg),
      flexShrink: 0, minHeight: 48,
    }}>
      {back && (
        <div onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 20,
          background: dark ? '#1E293B' : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: FIT.shadowSm, cursor: 'pointer',
        }}>
          <Icon name="back" size={20} color={dark ? '#F8FAFC' : FIT.text} strokeWidth={2} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: 18, fontWeight: 700, color: dark ? '#F8FAFC' : FIT.text, letterSpacing: -0.3 }}>{title}</div>}
        {subtitle && <div style={{ fontSize: 13, color: dark ? '#94A3B8' : FIT.textMuted, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Progress ring (Apple Watch style)
// ═══════════════════════════════════════════════════════
function Ring({ size = 160, stroke = 14, progress = 0.6, color = FIT.primary, bgColor, children, track = 0.15 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const bg = bgColor || `${color}${Math.round(track * 255).toString(16).padStart(2, '0')}`;
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(progress, 1))} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(.2,.7,.3,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Multi-ring (calories + macros)
// ═══════════════════════════════════════════════════════
function MultiRing({ size = 180, rings, children }) {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      {rings.map((r, i) => {
        const sw = 10;
        const sz = size - i * (sw * 2 + 6);
        const rad = (sz - sw) / 2;
        const c = 2 * Math.PI * rad;
        return (
          <svg key={i} width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
            <circle cx={size/2} cy={size/2} r={rad} fill="none" stroke={r.color + '22'} strokeWidth={sw} />
            <circle cx={size/2} cy={size/2} r={rad} fill="none" stroke={r.color} strokeWidth={sw}
              strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(r.progress, 1))} strokeLinecap="round" />
          </svg>
        );
      })}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Button
// ═══════════════════════════════════════════════════════
function Button({ children, variant = 'primary', size = 'md', full, leading, trailing, onClick, disabled, dark }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: 12, fontWeight: 600, fontFamily: FIT.sans, cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none', transition: 'all .15s', letterSpacing: -0.2,
    width: full ? '100%' : 'auto',
    opacity: disabled ? 0.4 : 1,
  };
  const sizes = {
    sm: { height: 36, padding: '0 14px', fontSize: 14 },
    md: { height: 48, padding: '0 20px', fontSize: 15 },
    lg: { height: 56, padding: '0 24px', fontSize: 16 },
  };
  const variants = {
    primary: { background: FIT.primary, color: '#fff' },
    secondary: { background: dark ? '#1E293B' : '#fff', color: dark ? '#F8FAFC' : FIT.text, border: `1px solid ${dark ? '#334155' : FIT.border}` },
    ghost: { background: 'transparent', color: FIT.primary },
    danger: { background: FIT.danger, color: '#fff' },
    dark: { background: '#0F172A', color: '#fff' },
    white: { background: '#fff', color: FIT.text, border: `1px solid ${FIT.border}` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant] }}>
      {leading}{children}{trailing}
    </button>
  );
}

// ═══════════════════════════════════════════════════════
// Chip / Pill
// ═══════════════════════════════════════════════════════
function Chip({ children, active, color = FIT.primary, size = 'md', onClick, leading, dark }) {
  const h = size === 'sm' ? 28 : 34;
  return (
    <div onClick={onClick} style={{
      height: h, padding: '0 14px', borderRadius: h/2, display: 'inline-flex', alignItems: 'center', gap: 6,
      background: active ? color : (dark ? '#1E293B' : '#fff'),
      color: active ? '#fff' : (dark ? '#F8FAFC' : FIT.text),
      border: active ? `1px solid ${color}` : `1px solid ${dark ? '#334155' : FIT.border}`,
      fontSize: size === 'sm' ? 12 : 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
      whiteSpace: 'nowrap',
    }}>
      {leading}{children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Card
// ═══════════════════════════════════════════════════════
function Card({ children, pad = 16, style, dark, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: dark ? '#1E293B' : '#fff',
      borderRadius: 16, padding: pad,
      boxShadow: dark ? 'none' : FIT.shadowSm,
      border: dark ? '1px solid #334155' : 'none',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

// ═══════════════════════════════════════════════════════
// Input
// ═══════════════════════════════════════════════════════
function Input({ label, placeholder, value, type = 'text', right, leading, dark }) {
  return (
    <div style={{ position: 'relative' }}>
      {label && <div style={{ fontSize: 12, color: dark ? '#94A3B8' : FIT.textMuted, marginBottom: 6, fontWeight: 600, letterSpacing: 0.2, textTransform: 'uppercase' }}>{label}</div>}
      <div style={{
        height: 52, borderRadius: 12, background: dark ? '#1E293B' : '#fff',
        border: `1px solid ${dark ? '#334155' : FIT.border}`,
        display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
      }}>
        {leading}
        <input readOnly value={value || ''} placeholder={placeholder} type={type}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontSize: 15, fontFamily: FIT.sans, color: dark ? '#F8FAFC' : FIT.text,
          }} />
        {right}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Macro bar (stacked)
// ═══════════════════════════════════════════════════════
function MacroBar({ p = 30, c = 45, f = 25, h = 8 }) {
  const total = p + c + f;
  return (
    <div style={{ display: 'flex', height: h, borderRadius: h/2, overflow: 'hidden', background: FIT.borderSoft, gap: 2 }}>
      <div style={{ width: `${p/total*100}%`, background: FIT.protein }} />
      <div style={{ width: `${c/total*100}%`, background: FIT.carbs }} />
      <div style={{ width: `${f/total*100}%`, background: FIT.fat }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Food thumbnail — styled placeholder (no slop SVGs)
// ═══════════════════════════════════════════════════════
// Emoji → real photo URL map (Unsplash source — free)
const FOOD_PHOTOS = {
  '🍚': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&h=200&fit=crop', // plov/rice
  '🥟': 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=200&h=200&fit=crop', // manti/dumplings
  '🥪': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=200&h=200&fit=crop', // somsa
  '🍎': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200&h=200&fit=crop', // apple
  '🥛': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop', // milk
  '🥚': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop', // egg
  '🍳': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=200&h=200&fit=crop', // omelette
  '🥮': 'https://images.unsplash.com/photo-1625938145744-533e82c1d2ec?w=200&h=200&fit=crop', // chuchvara
  '🌮': 'https://images.unsplash.com/photo-1592415486689-125cbbfcbee2?w=200&h=200&fit=crop', // sandwich
  '🍞': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop', // bread
  '🍯': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop', // tea/honey
  '🥗': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop', // salad
  '🍵': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop', // tea
  '🌭': 'https://images.unsplash.com/photo-1619740455993-7077c1cda1ca?w=200&h=200&fit=crop', // sausage
  '🍅': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=200&fit=crop', // tomato
  '🥩': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=200&h=200&fit=crop', // beef
  '🐟': 'https://images.unsplash.com/photo-1559717201-fbb671ff56b7?w=200&h=200&fit=crop', // fish
};

function FoodThumb({ name, size = 48, emoji, tone = 'green', photo }) {
  const tones = {
    green: { bg: '#D1FAE5', fg: '#059669' },
    amber: { bg: '#FEF3C7', fg: '#D97706' },
    red: { bg: '#FEE2E2', fg: '#DC2626' },
    purple: { bg: '#EDE9FE', fg: '#7C3AED' },
    blue: { bg: '#DBEAFE', fg: '#2563EB' },
    pink: { bg: '#FCE7F3', fg: '#DB2777' },
    neutral: { bg: '#F1F5F9', fg: '#475569' },
  }[tone];
  const src = photo || FOOD_PHOTOS[emoji];
  if (src) {
    return (
      <div style={{
        width: size, height: size, borderRadius: size * 0.28, flexShrink: 0,
        background: `${tones.bg} url(${src}) center/cover no-repeat`,
        boxShadow: 'inset 0 0 0 1px rgba(15,23,42,0.06)',
      }}/>
    );
  }
  const initials = name ? name.slice(0, 2).toUpperCase() : '··';
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28, background: tones.bg, color: tones.fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      fontSize: emoji ? size * 0.5 : size * 0.34, fontWeight: 700, fontFamily: FIT.sans,
    }}>
      {emoji || initials}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Big stat display (tabular numbers)
// ═══════════════════════════════════════════════════════
function Stat({ value, unit, label, color, size = 'md', dark }) {
  const sizes = {
    sm: { v: 18, u: 11, l: 11 },
    md: { v: 28, u: 14, l: 12 },
    lg: { v: 40, u: 16, l: 13 },
    xl: { v: 56, u: 18, l: 13 },
  }[size];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: sizes.v, fontWeight: 700, fontFamily: FIT.mono, color: color || (dark ? '#F8FAFC' : FIT.text), letterSpacing: -1, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        {unit && <span style={{ fontSize: sizes.u, fontWeight: 500, color: dark ? '#94A3B8' : FIT.textMuted }}>{unit}</span>}
      </div>
      {label && <div style={{ fontSize: sizes.l, color: dark ? '#94A3B8' : FIT.textMuted, marginTop: 2, fontWeight: 500 }}>{label}</div>}
    </div>
  );
}

Object.assign(window, { Phone, TabBar, TopBar, Ring, MultiRing, Button, Chip, Card, Input, MacroBar, FoodThumb, Stat });
