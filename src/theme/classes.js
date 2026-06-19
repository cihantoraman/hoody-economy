/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

const TIER_TEXT = {
  Elite: 'text-tier-elite font-semibold',
  Rich: 'text-tier-rich font-semibold',
  'Upper Middle': 'text-tier-upper',
  Middle: 'text-tier-middle',
  'Lower Middle': 'text-tier-lower',
  Poor: 'text-tier-poor',
};

const STATUS_CHIP = {
  Imprisoned: 'bg-danger-weak text-danger px-2 py-0.5 rounded-md text-xs font-medium',
  Watchlist: 'bg-warn-weak text-warn px-2 py-0.5 rounded-md text-xs font-medium',
};

export const tierTextClass = (level) => TIER_TEXT[level] ?? '';

export const statusChipClass = (status) => STATUS_CHIP[status] ?? '';
