/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 *
 * Pure simulation engine. The money supply is fixed: every unit of capital
 * either sits with a player or in the shared treasury, and operations only
 * move money between them. No turn ever mints or destroys capital, so
 * sum(player.capital) + treasury stays equal to `money` for the whole run.
 */

import {
  MARKET_EVENTS,
  STRATEGIES,
  createInitialHistoricalData,
  createInitialMessages,
  createInitialProducts,
} from '../constants/economy';
import { giniCoefficient, isHigherLevel, levelFor } from '../utils/economy';

const HISTORY_LIMIT = 200;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const randInt = (max) => Math.floor(Math.random() * max);
const pick = (list) => list[randInt(list.length)];
const cap = (list) => (list.length > HISTORY_LIMIT ? list.slice(list.length - HISTORY_LIMIT) : list);
const isFrozen = (player) => player.penaltyTime > 0 || player.specialStatus === 'Imprisoned';

const STRATEGY_SPREAD = {
  Speculative: 1.2,
  Aggressive: 1.0,
  Risky: 0.8,
  Innovative: 0.6,
  Technological: 0.5,
  Balanced: 0.35,
  Conservative: 0.2,
};

const TRADE_PROBABILITY = {
  Speculative: 0.8,
  Aggressive: 0.7,
  Risky: 0.6,
  Innovative: 0.5,
  Technological: 0.4,
  Balanced: 0.4,
  Conservative: 0.3,
};

const BALANCE_MULTIPLIER = {
  Elite: -1.5,
  Rich: -1.2,
  'Upper Middle': -0.5,
  Middle: 0,
  'Lower Middle': 0.5,
  Poor: 1.5,
};

const seedCapital = (rank, total) => {
  const share = rank / total;
  if (share <= 0.05) return 3000 + randInt(2000);
  if (share <= 0.15) return 2000 + randInt(1000);
  if (share <= 0.35) return 1200 + randInt(800);
  if (share <= 0.65) return 800 + randInt(400);
  if (share <= 0.85) return 400 + randInt(400);
  return 100 + randInt(300);
};

const inventoryValue = (player, products) =>
  player.inventory.reduce((total, item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return product ? total + item.quantity * product.price : total;
  }, 0);

const countByLevel = (players) => ({
  Elite: players.filter((p) => p.level === 'Elite').length,
  Rich: players.filter((p) => p.level === 'Rich').length,
  'Upper Middle': players.filter((p) => p.level === 'Upper Middle').length,
  Middle: players.filter((p) => p.level === 'Middle').length,
  'Lower Middle': players.filter((p) => p.level === 'Lower Middle').length,
  Poor: players.filter((p) => p.level === 'Poor').length,
});

const createPlayers = (count, products) => {
  const playerSlot = Math.max(1, Math.ceil(count / 2));
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const capital = seedCapital(id, count);
    return {
      id,
      name: id === playerSlot ? 'Player' : `Player ${id}`,
      capital,
      level: levelFor(capital),
      cycle: 1,
      strategy: STRATEGIES[randInt(STRATEGIES.length)],
      inventory: products.map((product) => ({ productId: product.id, quantity: randInt(5) })),
      inventoryValue: 0,
      manipulationPoints: 0,
      penaltyTime: 0,
      imprisonmentRecord: 0,
      robinHoodPoints: 0,
      specialStatus: null,
      specialization: Math.random() > 0.7 ? pick(products).category : null,
      capitalHistory: [capital],
    };
  });
};

export const seedState = (playerCount) => {
  const products = createInitialProducts();
  const players = createPlayers(playerCount, products).map((player) => ({
    ...player,
    inventoryValue: inventoryValue(player, products),
  }));
  return {
    turn: 1,
    players,
    products,
    activeEvents: [],
    treasury: 0,
    money: players.reduce((sum, player) => sum + player.capital, 0),
    historical: createInitialHistoricalData(),
    messages: createInitialMessages(playerCount),
  };
};

const targetsPlayer = (event, player) =>
  event.target === 'Everyone' ||
  (typeof event.target === 'string' && event.target === player.level) ||
  (Array.isArray(event.target) &&
    (event.target.includes(player.level) || event.target.includes(player.strategy)));

// --- individual steps (each returns plain data, never mutates its input) ---

const stepEvents = (state, params, log) => {
  let activeEvents = state.activeEvents.filter((event) => state.turn - event.startTurn < event.duration);
  let products = state.products;

  if (params.autoEvents && Math.random() < params.eventChance) {
    const event = {
      ...MARKET_EVENTS[randInt(MARKET_EVENTS.length)],
      startTurn: state.turn,
      id: `${state.turn}-${randInt(1e9)}`,
    };
    activeEvents = [...activeEvents, event];
    log(`Market Event: ${event.event}. ${event.description}`, 'event');

    if (event.effectProduct.categories?.length) {
      products = products.map((product) => {
        if (!event.effectProduct.categories.includes(product.category)) return product;
        const price = clamp(
          Math.round(product.price * (1 + event.effectProduct.priceChange)),
          Math.round(product.basePrice * 0.4),
          Math.round(product.basePrice * 2.5),
        );
        return { ...product, price };
      });
    }
  }

  return { activeEvents, products };
};

const stepPrices = (products, historical, params, turn, log) => {
  const samples = [];
  const next = products.map((product) => {
    const supplyDemand = (product.demand - product.supply) * (0.1 * params.marketVolatility);
    const fluctuation = (Math.random() - 0.5) * 0.05 * params.marketVolatility;
    const maxChange = 0.1 + 0.1 * params.marketVolatility;
    const change = clamp(supplyDemand + fluctuation, -maxChange, maxChange);

    const price = clamp(
      Math.round(product.price * (1 + change)),
      Math.round(product.basePrice * 0.4),
      Math.round(product.basePrice * 2.5),
    );

    let demand = product.demand;
    let supply = product.supply;
    if (price > product.basePrice * 1.5) {
      demand = Math.max(demand - Math.random() * 0.05, 0.1);
      supply = Math.min(supply + Math.random() * 0.05, 1);
    } else if (price < product.basePrice * 0.7) {
      demand = Math.min(demand + Math.random() * 0.05, 1);
      supply = Math.max(supply - Math.random() * 0.05, 0.1);
    } else {
      demand = clamp(demand + (Math.random() - 0.5) * 0.03, 0.1, 1);
      supply = clamp(supply + (Math.random() - 0.5) * 0.03, 0.1, 1);
    }

    if (turn % 10 === 0) samples.push({ name: product.name, price });
    if (Math.abs(price - product.price) / product.price > 0.1) {
      log(`${product.name} price ${price > product.price ? 'increased' : 'decreased'} from ${product.price} to ${price}`, 'market');
    }
    return { ...product, price, demand, supply };
  });

  let nextHistorical = historical;
  if (samples.length) {
    const productPrices = { ...historical.productPrices };
    samples.forEach((sample) => {
      productPrices[sample.name] = cap([...(productPrices[sample.name] ?? []), { turn, price: sample.price }]);
    });
    nextHistorical = { ...historical, productPrices };
  }

  return { products: next, historical: nextHistorical };
};

const stepManipulation = (players, params, turn, log) => {
  let fines = 0;
  const bonus = new Map();

  let next = players;
  if (turn % 2 === 0) {
    next = players.map((player) => {
      if (isFrozen(player)) return player;

      const losingMoney =
        player.capitalHistory.length >= 3 &&
        player.capitalHistory[player.capitalHistory.length - 1] <
          player.capitalHistory[player.capitalHistory.length - 3];
      const baseChance =
        player.strategy === 'Aggressive' ? 0.15
          : player.strategy === 'Speculative' ? 0.12
            : player.strategy === 'Risky' ? 0.08 : 0.03;
      const desperation = losingMoney ? 0.1 : 0;
      const watchlistModifier = player.specialStatus === 'Watchlist' ? -0.05 : 0;
      if (Math.random() >= baseChance + desperation + watchlistModifier) return player;

      const baseSeverity =
        player.strategy === 'Aggressive' ? 0.35
          : player.strategy === 'Speculative' ? 0.3
            : player.strategy === 'Risky' ? 0.25 : 0.15;
      const levelModifier = player.level === 'Elite' ? 0.15 : player.level === 'Rich' ? 0.1 : 0;
      const severity = baseSeverity + levelModifier + Math.random() * 0.2;
      const detectionChance = severity * 0.6 + player.manipulationPoints * 0.1;

      if (Math.random() >= detectionChance) {
        // Undetected: the gain is realised through the redistribution pot, not minted.
        bonus.set(player.id, severity);
        return player;
      }

      const points = player.manipulationPoints + 1;
      if (points < params.manipulationThreshold) {
        log(`${player.name} showing suspicious activity. System monitoring...`, 'warning');
        return { ...player, manipulationPoints: points };
      }

      if (player.imprisonmentRecord >= params.imprisonmentThreshold) {
        const fine = Math.round(player.capital * 0.3);
        fines += fine;
        log(`${player.name} is a repeat offender and has been IMPRISONED for ${params.imprisonmentDuration} turns with a 30% capital fine!`, 'warning');
        return {
          ...player,
          capital: player.capital - fine,
          specialStatus: 'Imprisoned',
          penaltyTime: params.imprisonmentDuration,
          imprisonmentRecord: player.imprisonmentRecord + 1,
          manipulationPoints: 0,
        };
      }

      const fine = Math.round(player.capital * 0.2);
      fines += fine;
      log(`${player.name} caught manipulating! Penalized for ${params.penaltyDuration} turns and added to watchlist.`, 'warning');
      return {
        ...player,
        capital: player.capital - fine,
        specialStatus: 'Watchlist',
        penaltyTime: params.penaltyDuration,
        imprisonmentRecord: player.imprisonmentRecord + 1,
        manipulationPoints: 0,
      };
    });
  }

  next = next.map((player) => {
    if (player.penaltyTime <= 0) return player;
    const penaltyTime = player.penaltyTime - 1;
    if (penaltyTime === 0 && player.specialStatus === 'Watchlist' && Math.random() > 0.5) {
      return { ...player, penaltyTime, specialStatus: null };
    }
    if (penaltyTime === 0 && player.specialStatus === 'Imprisoned') {
      log(`${player.name} released from imprisonment but remains on watchlist.`, 'system');
      return { ...player, penaltyTime, specialStatus: 'Watchlist' };
    }
    return { ...player, penaltyTime };
  });

  return { players: next, fines, bonus };
};

const stepTrades = (players, products, activeEvents, log) => {
  let treasuryDelta = 0;
  const adjustments = new Map();
  const bump = (id, key) => {
    const current = adjustments.get(id) ?? { demand: 0, supply: 0 };
    current[key] += 0.02;
    adjustments.set(id, current);
  };

  const next = players.map((player) => {
    if (isFrozen(player)) return player;

    let probability = TRADE_PROBABILITY[player.strategy] ?? 0.4;
    activeEvents.forEach((event) => {
      if (event.event === 'Economic Recession') probability *= 0.7;
      else if (event.event === 'Market Speculation') probability *= 1.5;
    });
    if (Math.random() >= clamp(probability, 0.1, 0.9)) return player;

    let poolList = products;
    if (player.specialization && Math.random() < 0.7) {
      const specialised = products.filter((product) => product.category === player.specialization);
      if (specialised.length) poolList = specialised;
    }
    const product = pick(poolList);

    const priceRising = product.price > product.basePrice;
    const buyProbability =
      player.strategy === 'Aggressive' ? (priceRising ? 0.8 : 0.3)
        : player.strategy === 'Conservative' ? (priceRising ? 0.2 : 0.7)
          : player.strategy === 'Speculative' ? 0.6 : 0.5;
    const buying = Math.random() < buyProbability;

    if (buying) {
      if (player.capital < product.price) return player;
      const slot = player.inventory.findIndex((item) => item.productId === product.id);
      const inventory =
        slot !== -1
          ? player.inventory.map((item, index) => (index === slot ? { ...item, quantity: item.quantity + 1 } : item))
          : [...player.inventory, { productId: product.id, quantity: 1 }];
      treasuryDelta += product.price;
      bump(product.id, 'demand');
      return { ...player, capital: player.capital - product.price, inventory };
    }

    const slot = player.inventory.findIndex((item) => item.productId === product.id && item.quantity > 0);
    if (slot === -1) return player;
    const inventory = player.inventory.map((item, index) =>
      index === slot ? { ...item, quantity: item.quantity - 1 } : item,
    );
    treasuryDelta -= product.price;
    bump(product.id, 'supply');
    return { ...player, capital: player.capital + product.price, inventory };
  });

  let nextProducts = products;
  if (adjustments.size) {
    nextProducts = products.map((product) => {
      const adjustment = adjustments.get(product.id);
      if (!adjustment) return product;
      return {
        ...product,
        demand: Math.min(product.demand + adjustment.demand, 1),
        supply: Math.min(product.supply + adjustment.supply, 1),
      };
    });
  }

  return { players: next, products: nextProducts, treasuryDelta };
};

// Cyclical-capital core: every active player drops a slice of capital into a
// shared pot, then the pot is paid back weighted by luck, strategy, the
// anti-accumulation bias, events and (undetected) manipulation. Sum of the
// slices equals the sum paid out, so player capital is reshuffled, not changed.
const stepTransform = (players, params, activeEvents, bonus) => {
  const active = players.filter((player) => !isFrozen(player));
  if (!active.length) return { players, treasuryDelta: 0 };

  const rate = params.transformationRate * 0.5;
  const contribution = new Map();
  let pot = 0;
  active.forEach((player) => {
    const slice = Math.round(player.capital * rate);
    contribution.set(player.id, slice);
    pot += slice;
  });

  const weight = new Map();
  let weightSum = 0;
  active.forEach((player) => {
    const spread = STRATEGY_SPREAD[player.strategy] ?? 0.35;
    const luck = 1 + (Math.random() - 0.5) * spread;
    const balance = 1 + params.balancingFactor * (BALANCE_MULTIPLIER[player.level] ?? 0);
    const experience = 1 + Math.min(player.cycle / 10000, 0.05);

    let eventFactor = 1;
    activeEvents.forEach((event) => {
      if (targetsPlayer(event, player)) eventFactor *= 1 + event.effectCapital;
      if (event.effectSpecialization?.target === player.specialization) {
        eventFactor *= 1 + event.effectSpecialization.modifier;
      }
    });

    const manipulation = 1 + (bonus.get(player.id) ?? 0);
    const value = Math.max(0.05, luck * balance * experience * eventFactor * manipulation);
    weight.set(player.id, value);
    weightSum += value;
  });

  let paid = 0;
  const payout = new Map();
  active.forEach((player) => {
    const amount = Math.round((pot * weight.get(player.id)) / weightSum);
    payout.set(player.id, amount);
    paid += amount;
  });

  const next = players.map((player) => {
    if (!contribution.has(player.id)) return player;
    return { ...player, capital: player.capital - contribution.get(player.id) + payout.get(player.id) };
  });

  // Any rounding difference between pot and paid is parked in the treasury,
  // which keeps the money supply exact and never pushes a player negative.
  return { players: next, treasuryDelta: pot - paid };
};

const finalizePlayers = (players, products, log) =>
  players.map((player) => {
    const level = levelFor(player.capital);
    if (level !== player.level && (player.name === 'Player' || Math.random() > 0.9)) {
      log(`${player.name} has ${isHigherLevel(level, player.level) ? 'risen' : 'fallen'} to ${level} level!`, 'status');
    }
    return {
      ...player,
      level,
      cycle: player.cycle + 1,
      inventoryValue: inventoryValue(player, products),
      capitalHistory: cap([...player.capitalHistory, player.capital]),
    };
  });

const stepRobinHood = (players, params, log) => {
  const taxable = (level) => players.filter((p) => p.level === level && !isFrozen(p));
  const elite = taxable('Elite');
  const rich = taxable('Rich');
  const poor = players.filter((p) => p.level === 'Poor' && p.penaltyTime === 0);
  const lowerMiddle = players.filter((p) => p.level === 'Lower Middle' && p.penaltyTime === 0);

  if ((!elite.length && !rich.length) || (!poor.length && !lowerMiddle.length)) {
    return { players, treasuryDelta: 0 };
  }

  const tax = new Map();
  let pool = 0;
  elite.forEach((p) => { const t = Math.round(p.capital * params.eliteRobinHoodRate); tax.set(p.id, t); pool += t; });
  rich.forEach((p) => { const t = Math.round(p.capital * params.robinHoodRate); tax.set(p.id, t); pool += t; });

  const recipients = poor.length + lowerMiddle.length * 0.5;
  if (!recipients || !pool) return { players, treasuryDelta: 0 };

  const perPoor = Math.floor(pool / recipients);
  const perLowerMiddle = Math.floor(perPoor * 0.5);
  const payout = new Map();
  let paid = 0;
  poor.forEach((p) => { payout.set(p.id, perPoor); paid += perPoor; });
  lowerMiddle.forEach((p) => { payout.set(p.id, perLowerMiddle); paid += perLowerMiddle; });

  const next = players.map((player) => {
    const taxed = tax.get(player.id) ?? 0;
    const received = payout.get(player.id) ?? 0;
    if (!taxed && !received) return player;
    return {
      ...player,
      capital: player.capital - taxed + received,
      robinHoodPoints: player.robinHoodPoints - taxed + received,
    };
  });

  log(`Robin Hood redistribution: ${pool} units taxed from ${elite.length} elite and ${rich.length} rich, paid to ${poor.length} poor and ${lowerMiddle.length} lower-middle players.`, 'system');
  // Whatever was taxed but not paid out (rounding) stays in the treasury.
  return { players: next, treasuryDelta: pool - paid };
};

const stepBailout = (players, treasury, params, log) => {
  const poor = players.filter((p) => p.level === 'Poor');
  if (poor.length / players.length < params.bailoutThreshold / 100) {
    return { players, treasury, spent: 0 };
  }

  let remaining = treasury;
  let spent = 0;
  const grants = new Map();
  poor.forEach((player) => {
    if (remaining <= 0) return;
    const need = Math.floor(Math.max(params.middleLimit - player.capital, 0) / 2);
    const grant = Math.min(need, remaining);
    if (grant > 0) {
      grants.set(player.id, grant);
      remaining -= grant;
      spent += grant;
    }
  });

  if (!spent) return { players, treasury, spent: 0 };

  const next = players.map((player) =>
    grants.has(player.id) ? { ...player, capital: player.capital + grants.get(player.id) } : player,
  );
  log(`System bailout: ${spent} units paid from the treasury to ${grants.size} players in poverty.`, 'system');
  return { players: next, treasury: treasury - spent, spent };
};

const recordHistory = (historical, players, turn) => ({
  ...historical,
  giniCoefficient: cap([...historical.giniCoefficient, { turn, value: giniCoefficient(players) }]),
  averageCapital: cap([
    ...historical.averageCapital,
    { turn, value: Math.round(players.reduce((sum, p) => sum + p.capital, 0) / players.length) },
  ]),
  classDistribution: cap([...historical.classDistribution, { turn, ...countByLevel(players) }]),
});

export const simulateTurn = (state, params) => {
  const { turn } = state;
  const pending = [];
  const log = (text, category = 'system') => pending.push({ text, category });

  const events = stepEvents(state, params, log);
  let { activeEvents } = events;

  const priced = stepPrices(events.products, state.historical, params, turn, log);
  let products = priced.products;
  let historical = priced.historical;

  let treasury = state.treasury;

  const manipulation = stepManipulation(state.players, params, turn, log);
  let players = manipulation.players;
  treasury += manipulation.fines;

  const trades = stepTrades(players, products, activeEvents, log);
  players = trades.players;
  products = trades.products;
  treasury += trades.treasuryDelta;

  const transform = stepTransform(players, params, activeEvents, manipulation.bonus);
  players = transform.players;
  treasury += transform.treasuryDelta;

  players = finalizePlayers(players, products, log);

  if (turn % 5 === 0 && params.robinHoodModeActive) {
    const robinHood = stepRobinHood(players, params, log);
    players = robinHood.players;
    treasury += robinHood.treasuryDelta;
  }

  if (turn % 10 === 0 && params.autoBailout) {
    const bailout = stepBailout(players, treasury, params, log);
    players = bailout.players;
    treasury = bailout.treasury;
  }

  if (turn % 5 === 0) historical = recordHistory(historical, players, turn);
  if (turn % 100 === 0) log(`Economic milestone: ${turn} turns completed.`, 'system');

  const messages = [...pending.reverse(), ...state.messages].slice(0, 20);

  return { ...state, turn: turn + 1, players, products, activeEvents, treasury, historical, messages };
};
