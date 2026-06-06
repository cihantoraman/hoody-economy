/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { useEffect, useRef, useState } from 'react';

const hasRaf = typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function';
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

// Eases a displayed number toward its target so values glide instead of jumping.
export const useAnimatedNumber = (target, duration = 500) => {
  const [display, setDisplay] = useState(target);
  const frame = useRef(0);

  useEffect(() => {
    if (!hasRaf) {
      setDisplay(target);
      return undefined;
    }

    let from = display;
    const start = now();
    const tick = () => {
      const progress = Math.min(1, (now() - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(from + (target - from) * eased));
      if (progress < 1) frame.current = window.requestAnimationFrame(tick);
    };

    frame.current = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame.current);
    // Re-run only when the target changes; `display` is read as the start point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return display;
};
