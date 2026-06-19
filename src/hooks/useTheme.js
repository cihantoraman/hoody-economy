/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'hoody-theme';

const queryParams = () => {
  try {
    return new URLSearchParams(window.location.search);
  } catch {
    return new URLSearchParams();
  }
};

// When embedded in another site (iframe), the host owns the theme and chrome.
const readEmbedded = () => typeof window !== 'undefined' && queryParams().get('embed') === '1';

const readInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  try {
    const forced = queryParams().get('theme');
    if (forced === 'light' || forced === 'dark') return forced;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    if (typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  } catch {
    // Window APIs can be unavailable (tests, SSR); fall back to light.
  }
  return 'light';
};

export const useTheme = () => {
  const [theme, setTheme] = useState(readInitialTheme);
  const [embedded] = useState(readEmbedded);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    if (embedded) return; // The host drives the theme; do not persist our own.
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for the session.
    }
  }, [theme, embedded]);

  // Let the host page keep the embedded app in sync with its own light/dark toggle.
  useEffect(() => {
    if (!embedded) return undefined;
    const onMessage = (event) => {
      const next = event.data && event.data.theme;
      if (event.data && event.data.type === 'hoody:theme' && (next === 'light' || next === 'dark')) {
        setTheme(next);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [embedded]);

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme, embedded };
};
