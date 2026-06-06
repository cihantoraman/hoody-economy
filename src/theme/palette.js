/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

// Same-lightness, same-saturation ramp. Hue sweeps warm (Poor) to cool (Elite),
// so stacked classes read as one harmonious family instead of a clown rainbow.
const TIER_LIGHT = {
  Poor: '#d4756b',
  'Lower Middle': '#d49d5a',
  Middle: '#a3b75f',
  'Upper Middle': '#5fb19a',
  Rich: '#6f8fce',
  Elite: '#a684c5',
};

const TIER_DARK = {
  Poor: '#e89992',
  'Lower Middle': '#e8bc7f',
  Middle: '#c2d18a',
  'Upper Middle': '#85cdb8',
  Rich: '#94aee0',
  Elite: '#bda2d6',
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
