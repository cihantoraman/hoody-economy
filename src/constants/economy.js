/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

export const STRATEGIES = [
  'Balanced',
  'Risky',
  'Conservative',
  'Aggressive',
  'Innovative',
  'Technological',
  'Speculative',
];

export const PRODUCT_CATEGORIES = ['Basic', 'Luxury', 'Technology', 'Service', 'Utility'];

// Wealth tiers, richest first, as multiples of the average capital. Classes are
// relative to the live economy, not fixed amounts, so they scale with any
// population or money supply and never collapse to a single class.
export const TIERS = [
  { name: 'Elite', mult: 2.5 },
  { name: 'Rich', mult: 1.75 },
  { name: 'Upper Middle', mult: 1.25 },
  { name: 'Middle', mult: 0.8 },
  { name: 'Lower Middle', mult: 0.45 },
  { name: 'Poor', mult: 0 },
];

export const DEFAULT_PARAMETERS = {
  transformationRate: 0.2,
  balancingFactor: 0.15,
  eliteLimit: 3000,
  wealthLimit: 2000,
  upperMiddleLimit: 1200,
  middleLimit: 800,
  lowerMiddleLimit: 400,
  cycleTime: 1,
  speedMultiplier: 1,
  active: false,
  robinHoodModeActive: true,
  robinHoodRate: 0.1,
  eliteRobinHoodRate: 0.15,
  manipulationThreshold: 3,
  imprisonmentThreshold: 2,
  penaltyDuration: 5,
  imprisonmentDuration: 15,
  autoBailout: false,
  bailoutThreshold: 5,
  marketVolatility: 0.5,
  showDetailedStats: false,
  autoEvents: true,
  eventChance: 0.12,
  playerCount: 100,
};

export const createInitialProducts = () => [
  { id: 1, name: 'Bread', basePrice: 10, price: 10, demand: 0.8, supply: 0.7, category: 'Basic' },
  { id: 2, name: 'Water', basePrice: 5, price: 5, demand: 0.9, supply: 0.9, category: 'Basic' },
  { id: 3, name: 'Housing', basePrice: 500, price: 500, demand: 0.6, supply: 0.5, category: 'Luxury' },
  { id: 4, name: 'Electronics', basePrice: 200, price: 200, demand: 0.5, supply: 0.6, category: 'Technology' },
  { id: 5, name: 'Healthcare', basePrice: 150, price: 150, demand: 0.7, supply: 0.6, category: 'Service' },
  { id: 6, name: 'Education', basePrice: 300, price: 300, demand: 0.6, supply: 0.5, category: 'Service' },
  { id: 7, name: 'Transportation', basePrice: 100, price: 100, demand: 0.7, supply: 0.7, category: 'Service' },
  { id: 8, name: 'Energy', basePrice: 80, price: 80, demand: 0.8, supply: 0.6, category: 'Utility' },
  { id: 9, name: 'Software', basePrice: 250, price: 250, demand: 0.5, supply: 0.7, category: 'Technology' },
  { id: 10, name: 'Agricultural Products', basePrice: 50, price: 50, demand: 0.6, supply: 0.8, category: 'Basic' },
];

export const MARKET_EVENTS = [
  {
    event: 'Economic Recession',
    effectCapital: -0.15,
    effectProduct: { categories: ['Luxury', 'Technology'], priceChange: -0.2 },
    effectSpecialization: { target: 'Technology', modifier: -0.1 },
    target: 'Everyone',
    duration: 3,
    description: 'An economic downturn reduces spending on luxury and technology goods.',
  },
  {
    event: 'Tech Boom',
    effectCapital: 0.1,
    effectProduct: { categories: ['Technology'], priceChange: 0.3 },
    effectSpecialization: { target: 'Technology', modifier: 0.25 },
    target: ['Innovative', 'Technological'],
    duration: 2,
    description: 'Technological advancements benefit tech-focused players and products.',
  },
  {
    event: 'Agricultural Crisis',
    effectCapital: -0.05,
    effectProduct: { categories: ['Basic'], priceChange: 0.4 },
    effectSpecialization: { target: 'Basic', modifier: -0.15 },
    target: 'Everyone',
    duration: 4,
    description: 'Food shortages cause basic goods prices to rise significantly.',
  },
  {
    event: 'Healthcare Reform',
    effectCapital: 0.05,
    effectProduct: { categories: ['Service'], priceChange: -0.15 },
    effectSpecialization: { target: 'Service', modifier: 0.1 },
    target: 'Poor',
    duration: 3,
    description: 'New healthcare policies make medical services more affordable.',
  },
  {
    event: 'Energy Crisis',
    effectCapital: -0.1,
    effectProduct: { categories: ['Utility', 'Transportation'], priceChange: 0.25 },
    effectSpecialization: { target: 'Utility', modifier: 0.2 },
    target: 'Everyone',
    duration: 3,
    description: 'Energy shortages affect transportation and utility prices.',
  },
  {
    event: 'Housing Bubble',
    effectCapital: -0.2,
    effectProduct: { categories: ['Luxury'], priceChange: -0.3 },
    effectSpecialization: { target: 'Luxury', modifier: -0.25 },
    target: 'Rich',
    duration: 4,
    description: 'A collapse in luxury housing values affects wealthy investors.',
  },
  {
    event: 'Educational Subsidy',
    effectCapital: 0.1,
    effectProduct: { categories: ['Service'], priceChange: -0.1 },
    effectSpecialization: { target: 'Service', modifier: 0.05 },
    target: ['Poor', 'Lower Middle'],
    duration: 3,
    description: 'Government subsidies make education more accessible to lower classes.',
  },
  {
    event: 'Natural Disaster',
    effectCapital: -0.15,
    effectProduct: { categories: ['Basic', 'Housing'], priceChange: 0.35 },
    effectSpecialization: { target: null, modifier: 0 },
    target: 'Everyone',
    duration: 5,
    description: 'A major disaster disrupts supply chains and damages infrastructure.',
  },
  {
    event: 'Market Speculation',
    effectCapital: 0.3,
    effectProduct: { categories: ['Technology', 'Luxury'], priceChange: 0.4 },
    effectSpecialization: { target: 'Luxury', modifier: 0.3 },
    target: ['Speculative', 'Aggressive', 'Risky'],
    duration: 1,
    description: 'Market speculation creates a short-lived bubble beneficial to risk-takers.',
  },
  {
    event: 'War',
    effectCapital: -0.25,
    effectProduct: { categories: ['Basic', 'Utility'], priceChange: 0.5 },
    effectSpecialization: { target: null, modifier: 0 },
    target: 'Everyone',
    duration: 6,
    description: 'Armed conflict disrupts the economy and causes severe shortages.',
  },
];

export const createInitialHistoricalData = () => ({
  giniCoefficient: [],
  classDistribution: [],
  productPrices: {},
  averageCapital: [],
  manipulationEvents: [],
});

export const createInitialMessages = (playerCount) => [
  { text: 'Economy initialized.', category: 'system' },
  { text: `${playerCount} players seeded with a realistic wealth distribution.`, category: 'system' },
  { text: 'Press Start to let the cycle run.', category: 'system' },
];
