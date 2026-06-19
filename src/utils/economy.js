/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { TIERS } from '../constants/economy';

const TIER_ORDER = [...TIERS].map((tier) => tier.name).reverse(); // Poor -> Elite

// Class is relative to the average capital, so it tracks the live distribution.
export const levelFor = (capital, mean) => {
  const reference = mean > 0 ? mean : 1;
  return (TIERS.find((tier) => capital >= tier.mult * reference) ?? TIERS[TIERS.length - 1]).name;
};

export const isHigherLevel = (a, b) => TIER_ORDER.indexOf(a) > TIER_ORDER.indexOf(b);

// O(n log n) Gini via the sorted-rank formula (equivalent to the mean absolute
// difference, without the O(n^2) double loop).
export const giniCoefficient = (players) => {
  const values = players.map((player) => player.capital).sort((a, b) => a - b);
  const n = values.length;
  if (n === 0) return 0;

  const total = values.reduce((sum, value) => sum + value, 0);
  if (total === 0) return 0;

  let weighted = 0;
  for (let i = 0; i < n; i += 1) {
    weighted += (2 * (i + 1) - n - 1) * values[i];
  }

  return Math.round((weighted / (n * total)) * 100) / 100;
};

const countLevel = (players, level) => players.filter((player) => player.level === level).length;

export const summarize = (players) => {
  const totalCapital = players.reduce((sum, player) => sum + player.capital, 0);
  const offenders = players.filter(
    (player) =>
      player.penaltyTime > 0 ||
      player.specialStatus === 'Imprisoned' ||
      player.specialStatus === 'Watchlist',
  );

  return {
    totalCapital,
    avgCapital: Math.round(totalCapital / players.length),
    gini: giniCoefficient(players),
    counts: {
      Elite: countLevel(players, 'Elite'),
      Rich: countLevel(players, 'Rich'),
      'Upper Middle': countLevel(players, 'Upper Middle'),
      Middle: countLevel(players, 'Middle'),
      'Lower Middle': countLevel(players, 'Lower Middle'),
      Poor: countLevel(players, 'Poor'),
    },
    penalized: players.filter((player) => player.penaltyTime > 0).length,
    imprisoned: players.filter((player) => player.specialStatus === 'Imprisoned').length,
    watchlist: players.filter((player) => player.specialStatus === 'Watchlist').length,
    topRichest: [...players].sort((a, b) => b.capital - a.capital).slice(0, 5),
    offenders,
    player: players.find((player) => player.name === 'Player'),
  };
};

export const formatNumber = (value) => value.toLocaleString();
