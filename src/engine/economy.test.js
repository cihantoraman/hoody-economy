/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { DEFAULT_PARAMETERS } from '../constants/economy';
import { giniCoefficient } from '../utils/economy';
import { seedState, simulateTurn } from './economy';

const totalMoney = (state) => state.players.reduce((sum, p) => sum + p.capital, 0) + state.treasury;

const runConserved = (turns, overrides = {}) => {
  let state = seedState(100);
  const supply = state.money;
  const params = { ...DEFAULT_PARAMETERS, ...overrides };
  for (let i = 0; i < turns; i += 1) {
    state = simulateTurn(state, params);
    expect(totalMoney(state)).toBe(supply);
  }
  return state;
};

test('money supply is conserved over 800 turns with every policy on', () => {
  runConserved(800, { robinHoodModeActive: true, autoBailout: true, autoEvents: true });
});

test('money supply is conserved with all policies off', () => {
  runConserved(300, { robinHoodModeActive: false, autoBailout: false, autoEvents: false });
});

test('no player capital ever goes negative', () => {
  let state = seedState(120);
  for (let i = 0; i < 400; i += 1) {
    state = simulateTurn(state, DEFAULT_PARAMETERS);
    state.players.forEach((player) => expect(player.capital).toBeGreaterThanOrEqual(0));
  }
});

test('history and capitalHistory stay bounded on long runs', () => {
  let state = seedState(40);
  for (let i = 0; i < 2500; i += 1) state = simulateTurn(state, DEFAULT_PARAMETERS);
  expect(state.historical.giniCoefficient.length).toBeLessThanOrEqual(200);
  expect(state.historical.classDistribution.length).toBeLessThanOrEqual(200);
  state.players.forEach((player) => expect(player.capitalHistory.length).toBeLessThanOrEqual(200));
});

test('the class distribution never collapses and inequality stays realistic over 1000 turns', () => {
  let state = seedState(100);
  for (let i = 0; i < 1000; i += 1) state = simulateTurn(state, DEFAULT_PARAMETERS);
  const counts = {};
  state.players.forEach((player) => {
    counts[player.level] = (counts[player.level] ?? 0) + 1;
  });
  expect(counts.Poor ?? 0).toBeLessThan(state.players.length);
  expect(Object.keys(counts).length).toBeGreaterThanOrEqual(3);
  const gini = giniCoefficient(state.players);
  expect(gini).toBeGreaterThan(0.05);
  expect(gini).toBeLessThan(0.8);
});

test('a turn advances state immutably and keeps the population', () => {
  const before = seedState(10);
  const after = simulateTurn(before, DEFAULT_PARAMETERS);
  expect(after.turn).toBe(2);
  expect(after.players).toHaveLength(10);
  expect(after.players.find((p) => p.name === 'Player')).toBeTruthy();
  expect(before.turn).toBe(1); // original state untouched
});
