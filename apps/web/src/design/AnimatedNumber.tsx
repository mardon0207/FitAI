/**
 * Smoothly tween a number from its previous value to the new one.
 * Uses requestAnimationFrame with ease-out cubic — no deps.
 */
import { useEffect, useRef, useState } from 'react';

export interface AnimatedNumberProps {
  value: number;
  duration?: number;      // ms, default 500
  format?: (n: number) => string;
}

export function AnimatedNumber({ value, duration = 500, format }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const current = from + (to - from) * eased;
      setDisplay(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);

  const formatted = format
    ? format(display)
    : Math.round(display).toLocaleString();
  return <>{formatted}</>;
}
