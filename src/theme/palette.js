/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

// Ordered ramp, yellow-green (Poor) -> purple (Elite), so the six classes read apart in charts.
const TIER_LIGHT = {
  Poor: '#65a30d',
  'Lower Middle': '#d97706',
  Middle: '#ea580c',
  'Upper Middle': '#dc2626',
  Rich: '#db2777',
  Elite: '#9333ea',
};

const TIER_DARK = {
  Poor: '#a3e635',
  'Lower Middle': '#fbbf24',
  Middle: '#fb923c',
  'Upper Middle': '#f87171',
  Rich: '#f472b6',
  Elite: '#c084fc',
};

// Vivid, well-separated colors for the multi-series price chart.
const SERIES = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
  '#f97316',
  '#14b8a6',
];

const CHART_LIGHT = { accent: '#0e8a5f', grid: '#e3e5e9', axis: '#6b7280', surface: '#ffffff', text: '#1a1c1e' };
const CHART_DARK = { accent: '#2dd4a0', grid: '#282b31', axis: '#8d96a0', surface: '#16181c', text: '#e9eaec' };

export const tierColors = (theme) => (theme === 'dark' ? TIER_DARK : TIER_LIGHT);

export const seriesColors = () => SERIES;

export const chartTheme = (theme) => {
  const base = theme === 'dark' ? CHART_DARK : CHART_LIGHT;
  return {
    ...base,
    tooltip: {
      contentStyle: {
        backgroundColor: base.surface,
        border: `1px solid ${base.grid}`,
        borderRadius: 10,
        fontSize: 12,
      },
      itemStyle: { color: base.text },
      labelStyle: { color: base.text },
    },
  };
};
