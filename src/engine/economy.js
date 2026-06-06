/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 *
 * Pure simulation engine. Wealth follows a kinetic exchange model from
 * econophysics (Chakraborti-Chakrabarti): agents meet in pairs and split their
 * non-saved wealth, where each agent's saving propensity comes from its
 * strategy. A distribution of saving propensities yields a realistic, heavy
 * tailed wealth distribution. A progressive tax plus transfer redistributes on
 * top. Every operation moves money rather than creating it, so
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
const meanCapital = (players) => (players.length ? players.reduce((sum, p) => sum + p.capital, 0) / players.length : 1);

// Saving propensity per strategy: the share of wealth an agent keeps out of an
// exchange. Low saving means more is risked, so swings are larger.
const SAVING = {
  Conservative: 0.92,
  Balanced: 0.85,
  Technological: 0.8,
  Innovative: 0.75,
  Risky: 0.68,
  Aggressive: 0.6,
  Speculative: 0.5,
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
  const base = Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const capital = seedCapital(id, count);
    return {
      id,
      name: id === playerSlot ? 'Player' : `Player ${id}`,
      capital,
      level: 'Middle',
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
  const mean = meanCapital(base);
  return base.map((player) => ({ ...player, level: levelFor(player.capital, mean) }));
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
    mobility: 0,
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

    if (turn % 10 === 0) samples.push({ name: product.name, price });
    if (Math.abs(price - product.price) / product.price > 0.1) {
      log(`${product.name} price ${price > product.price ? 'increased' : 'decreased'} from ${product.price} to ${price}`, 'market');
    }
    return { ...product, price, lastChange: price - product.price };
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
  if (turn % 3 === 0) {
    next = players.map((player) => {
      if (isFrozen(player)) return player;

      const losingMoney =
        player.capitalHistory.length >= 3 &&
        player.capitalHistory[player.capitalHistory.length - 1] <
          player.capitalHistory[player.capitalHistory.length - 3];
      const baseChance =
        player.strategy === 'Aggressive' ? 0.05
          : player.strategy === 'Speculative' ? 0.04
            : player.strategy === 'Risky' ? 0.025 : 0.008;
      const desperation = losingMoney ? 0.03 : 0;
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
        // Undetected: the edge is realised in the next exchange, not minted.
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
        log(`${player.name} is a repeat offender and has been IMPRISONED for ${params.imprisonmentDuration} weeks with a 30% capital fine!`, 'warning');
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
      log(`${player.name} caught manipulating! Penalized for ${params.penaltyDuration} weeks and added to watchlist.`, 'warning');
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
    if (penaltyTime === 0 && player.specialStatus === 'Watchlist') {
      return { ...player, penaltyTime, specialStatus: null };
    }
    if (penaltyTime === 0 && player.specialStatus === 'Imprisoned') {
      log(`${player.name} released from imprisonment.`, 'system');
      return { ...player, penaltyTime, specialStatus: null };
    }
    return { ...player, penaltyTime };
  });

  return { players: next, fines, bonus };
};

const stepTrades = (players, products, activeEvents) => {
  let treasuryDelta = 0;
  const flow = new Map();
  const record = (id, key) => {
    const current = flow.get(id) ?? { buys: 0, sells: 0 };
    current[key] += 1;
    flow.set(id, current);
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
      record(product.id, 'buys');
      return { ...player, capital: player.capital - product.price, inventory };
    }

    const slot = player.inventory.findIndex((item) => item.productId === product.id && item.quantity > 0);
    if (slot === -1) return player;
    const inventory = player.inventory.map((item, index) =>
      index === slot ? { ...item, quantity: item.quantity - 1 } : item,
    );
    treasuryDelta -= product.price;
    record(product.id, 'sells');
    return { ...player, capital: player.capital + product.price, inventory };
  });

  // Demand and supply ease toward a neutral baseline each week, then respond to
  // how many players actually bought or sold this product. This keeps the meters
  // oscillating in a readable mid-range instead of pinning at 100%.
  const traders = Math.max(players.length, 1);
  const nextProducts = products.map((product) => {
    const f = flow.get(product.id) ?? { buys: 0, sells: 0 };
    const targetDemand = clamp(0.4 + (f.buys / traders) * 10, 0.1, 0.9);
    const targetSupply = clamp(0.4 + (f.sells / traders) * 10, 0.1, 0.9);
    return {
      ...product,
      demand: clamp(product.demand + 0.3 * (targetDemand - product.demand), 0.1, 0.9),
      supply: clamp(product.supply + 0.3 * (targetSupply - product.supply), 0.1, 0.9),
    };
  });

  return { players: next, products: nextProducts, treasuryDelta };
};

// Kinetic wealth exchange. Active agents are shuffled and paired; each pair
// keeps its saved wealth and randomly splits the rest. A pair always conserves
// its total, so wealth is reshuffled, never created. An undetected manipulator
// tilts the split in its favour.
const stepExchange = (players, bonus) => {
  const active = players.filter((player) => !isFrozen(player));
  if (active.length < 2) return players;

  const order = active.map((player) => player.id);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = randInt(i + 1);
    const swap = order[i];
    order[i] = order[j];
    order[j] = swap;
  }

  const wealth = new Map(active.map((player) => [player.id, player.capital]));
  const savingOf = new Map(active.map((player) => [player.id, SAVING[player.strategy] ?? 0.8]));

  for (let i = 0; i + 1 < order.length; i += 2) {
    const aId = order[i];
    const bId = order[i + 1];
    const wa = wealth.get(aId);
    const wb = wealth.get(bId);
    const total = wa + wb;
    const sharedPool = (1 - savingOf.get(aId)) * wa + (1 - savingOf.get(bId)) * wb;

    let share = Math.random();
    if (bonus.has(aId)) share = Math.min(1, share + 0.3);
    else if (bonus.has(bId)) share = Math.max(0, share - 0.3);

    const aNext = clamp(Math.round(savingOf.get(aId) * wa + share * sharedPool), 1, total - 1);
    wealth.set(aId, aNext);
    wealth.set(bId, total - aNext);
  }

  return players.map((player) => (wealth.has(player.id) ? { ...player, capital: wealth.get(player.id) } : player));
};

// Redistribution. The treasury (fines, trade flow) plus an optional progressive
// tax on above-average wealth is paid back out as a transfer: a flat basic
// income, or means-tested toward the poorest when the safety net is on. The
// treasury is cleared each turn, so trade flow never drains out of play.
const stepRedistribute = (players, treasury, params, log) => {
  const active = players.filter((player) => !isFrozen(player));
  if (!active.length) return { players, treasury };

  // Net selling can push the treasury negative; reclaim it with a flat levy first.
  if (treasury < 0) {
    const levy = Math.ceil(-treasury / active.length);
    const charge = new Map();
    let collected = 0;
    active.forEach((player) => {
      const amount = Math.min(levy, player.capital - 1);
      if (amount > 0) {
        charge.set(player.id, amount);
        collected += amount;
      }
    });
    const next = players.map((player) =>
      charge.has(player.id) ? { ...player, capital: player.capital - charge.get(player.id) } : player,
    );
    return { players: next, treasury: treasury + collected };
  }

  const average = meanCapital(active);
  const tax = new Map();
  let pool = treasury;
  if (params.robinHoodModeActive) {
    active.forEach((player) => {
      const due = Math.round(Math.max(0, player.capital - average) * params.robinHoodRate);
      if (due > 0) {
        tax.set(player.id, due);
        pool += due;
      }
    });
  }

  if (pool <= 0) return { players, treasury: pool };

  const grant = new Map();
  let distributed = 0;
  if (params.autoBailout) {
    const weights = active.map((player) => Math.max(0.1, average * 2 - player.capital));
    const weightSum = weights.reduce((sum, value) => sum + value, 0) || 1;
    active.forEach((player, index) => {
      const amount = Math.round((pool * weights[index]) / weightSum);
      grant.set(player.id, amount);
      distributed += amount;
    });
  } else {
    const flat = Math.floor(pool / active.length);
    active.forEach((player) => {
      grant.set(player.id, flat);
      distributed += flat;
    });
  }

  if (params.robinHoodModeActive && tax.size) {
    log(`Redistribution: ${pool} units shared out${params.autoBailout ? ' toward the poorest' : ' as basic income'}.`, 'system');
  }

  const next = players.map((player) => {
    const taxed = tax.get(player.id) ?? 0;
    const received = grant.get(player.id) ?? 0;
    if (!taxed && !received) return player;
    return {
      ...player,
      capital: player.capital - taxed + received,
      robinHoodPoints: player.robinHoodPoints - taxed + received,
    };
  });

  return { players: next, treasury: pool - distributed };
};

const finalizePlayers = (players, products, log) => {
  const mean = meanCapital(players);
  let changed = 0;
  const next = players.map((player) => {
    const level = levelFor(player.capital, mean);
    if (level !== player.level) {
      changed += 1;
      if (player.name === 'Player' || Math.random() > 0.9) {
        log(`${player.name} has ${isHigherLevel(level, player.level) ? 'risen' : 'fallen'} to ${level} level!`, 'status');
      }
    }
    return {
      ...player,
      level,
      cycle: player.cycle + 1,
      inventoryValue: inventoryValue(player, products),
      capitalHistory: cap([...player.capitalHistory, player.capital]),
    };
  });
  return { players: next, mobility: players.length ? changed / players.length : 0 };
};

const recordHistory = (historical, players, mobility, turn) => ({
  ...historical,
  giniCoefficient: cap([...historical.giniCoefficient, { turn, value: giniCoefficient(players) }]),
  averageCapital: cap([
    ...historical.averageCapital,
    { turn, value: Math.round(players.reduce((sum, p) => sum + p.capital, 0) / players.length) },
  ]),
  mobility: cap([...(historical.mobility ?? []), { turn, value: Math.round(mobility * 100) }]),
  classDistribution: cap([...historical.classDistribution, { turn, ...countByLevel(players) }]),
});

export const simulateTurn = (state, params) => {
  const { turn } = state;
  const pending = [];
  const log = (text, category = 'system') => pending.push({ text, category });

  const events = stepEvents(state, params, log);
  const priced = stepPrices(events.products, state.historical, params, turn, log);
  let products = priced.products;
  let historical = priced.historical;
  let treasury = state.treasury;

  const manipulation = stepManipulation(state.players, params, turn, log);
  let players = manipulation.players;
  treasury += manipulation.fines;

  const trades = stepTrades(players, products, events.activeEvents);
  players = trades.players;
  products = trades.products;
  treasury += trades.treasuryDelta;

  players = stepExchange(players, manipulation.bonus);

  const redistribution = stepRedistribute(players, treasury, params, log);
  players = redistribution.players;
  treasury = redistribution.treasury;

  const finalized = finalizePlayers(players, products, log);
  players = finalized.players;

  if (turn % 5 === 0) historical = recordHistory(historical, players, finalized.mobility, turn);
  if (turn % 100 === 0) log(`Economic milestone: ${turn} weeks completed.`, 'system');

  const messages = [...pending.reverse(), ...state.messages].slice(0, 20);

  return {
    ...state,
    turn: turn + 1,
    players,
    products,
    activeEvents: events.activeEvents,
    treasury,
    mobility: finalized.mobility,
    historical,
    messages,
  };
};
