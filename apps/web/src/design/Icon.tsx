// Icon primitives — outlined, 24px, 1.5px stroke (ported from design/tokens.jsx)

export type IconName =
  | 'home' | 'diary' | 'plus' | 'stats' | 'profile' | 'search' | 'bell'
  | 'back' | 'close' | 'check' | 'chevron' | 'chevronDown' | 'heart'
  | 'flame' | 'droplet' | 'camera' | 'mic' | 'edit' | 'trash' | 'lock'
  | 'eye' | 'barcode' | 'apple' | 'google' | 'settings' | 'leaf'
  | 'alert' | 'sparkle' | 'trophy' | 'calendar' | 'fire' | 'star'
  | 'scale' | 'filter' | 'globe' | 'moon' | 'sun' | 'flash' | 'grid'
  | 'chat' | 'qr' | 'robot' | 'steps';

const PATHS: Record<IconName, string> = {
  home: 'M3 12L12 3l9 9M5 10v10h5v-6h4v6h5V10',
  diary: 'M6 3h12a1 1 0 011 1v16a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1zM9 8h6M9 12h6M9 16h4',
  plus: 'M12 5v14M5 12h14',
  stats: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  profile: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35',
  bell: 'M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 004 0',
  back: 'M19 12H5M12 19l-7-7 7-7',
  close: 'M18 6L6 18M6 6l12 12',
  check: 'M20 6L9 17l-5-5',
  chevron: 'M9 18l6-6-6-6',
  chevronDown: 'M6 9l6 6 6-6',
  heart: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z',
  flame: 'M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.07-2.1-.5-4 1.5-6 .5 2.5 2 4.5 4 6 2 1.5 3.5 4 3.5 6a7 7 0 11-14 0c0-1.15.23-2.24.66-3.23.76 1.28 1.84 2.23 3.34 2.73',
  droplet: 'M12 2s-5 6-5 12a5 5 0 0010 0c0-6-5-12-5-12z',
  camera: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z',
  mic: 'M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3zM19 10v1a7 7 0 01-14 0v-1M12 18v4M8 22h8',
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  trash: 'M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z',
  lock: 'M5 11h14a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8a1 1 0 011-1zM8 11V7a4 4 0 118 0v4',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 100-6 3 3 0 000 6z',
  barcode: 'M3 5v14M6 5v14M10 5v10M14 5v14M18 5v10M21 5v14',
  apple: 'M12 3c1-1 2-1 3 0M8 7c-3 0-5 3-5 6 0 5 3 8 5 8 1 0 2-1 4-1s3 1 4 1c2 0 5-3 5-8 0-3-2-6-5-6-2 0-3 1-4 1s-2-1-4-1z',
  google: 'M22 12a10 10 0 11-3-7l-3 3a6 6 0 102 5h-6v-4h10v3z',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  leaf: 'M11 20A7 7 0 014 13V5a1 1 0 011-1h9a7 7 0 017 7v2a7 7 0 01-7 7M11 20c0-5 4-9 9-9',
  alert: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
  sparkle: 'M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7zM19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zM5 4l.7 2L8 6.7 5.7 7.5 5 10l-.7-2.5L2 6.7 4.3 6z',
  trophy: 'M6 9a6 6 0 1012 0V3H6zM8 21h8M12 17v4M2 5h4M18 5h4M5 4c-2 0-3 2-2 4 0 2 2 3 3 3M19 4c2 0 3 2 2 4 0 2-2 3-3 3',
  calendar: 'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18',
  fire: 'M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.07-2.1-.5-4 1.5-6 .5 2.5 2 4.5 4 6 2 1.5 3.5 4 3.5 6a7 7 0 11-14 0c0-1.15.23-2.24.66-3.23',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  scale: 'M16 21h-8a2 2 0 01-2-2V8l4-5h4l4 5v11a2 2 0 01-2 2zM9 8h6M12 3v5',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  globe: 'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20',
  moon: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
  sun: 'M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 8a4 4 0 100 8 4 4 0 000-8z',
  flash: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  chat: 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z',
  qr: 'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15v3h3v3h3v-3h-3v-3M12 3v6M3 12h6M21 12h-3',
  robot: 'M12 8V4m0 0H8m4 0h4M7 13v-3a5 5 0 0110 0v3M5 20v-4a3 3 0 013-3h8a3 3 0 013 3v4M9 16h.01M15 16h.01',
  steps: 'M13 4v4l3 1-1 3 3 1-2 5h-4l1-4-3-1 1-4-3-1M10 20h4',
};

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

export function Icon({ name, size = 24, color = 'currentColor', strokeWidth = 1.5, style }: IconProps) {
  const d = PATHS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d={d} />
    </svg>
  );
}
