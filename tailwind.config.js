/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic surface + text tokens (defined as CSS vars in index.css).
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        info: 'var(--info)',
        // Single brand accent: swap the --accent vars to re-theme the whole app.
        accent: {
          DEFAULT: 'var(--accent)',
          weak: 'var(--accent-weak)',
          fg: 'var(--accent-fg)',
        },
        // Restrained functional signals.
        danger: {
          DEFAULT: 'var(--danger)',
          weak: 'var(--danger-weak)',
        },
        warn: {
          DEFAULT: 'var(--warn)',
          weak: 'var(--warn-weak)',
        },
        // Wealth ladder: one ordered ramp instead of six clashing hues.
        tier: {
          poor: 'var(--tier-poor)',
          lower: 'var(--tier-lower)',
          middle: 'var(--tier-middle)',
          upper: 'var(--tier-upper)',
          rich: 'var(--tier-rich)',
          elite: 'var(--tier-elite)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgb(0 0 0 / 0.03), 0 1px 3px rgb(0 0 0 / 0.04)',
      },
      borderRadius: {
        xl: '0.9rem',
      },
    },
  },
  plugins: [],
}
