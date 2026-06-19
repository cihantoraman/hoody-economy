/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 *
 * Thin React wrapper around the pure engine. It holds the economy state and
 * the tunable parameters, runs the clock, and exposes actions to the UI.
 * Turn advances pass a freshly computed value to setState (not an updater),
 * so the simulation runs once per tick even under StrictMode.
 */

import { useEffect, useRef, useState } from 'react';
import { DEFAULT_PARAMETERS } from '../constants/economy';
import { seedState, simulateTurn } from '../engine/economy';

export const useHoodyEconomy = () => {
  const [params, setParams] = useState(DEFAULT_PARAMETERS);
  const [state, setState] = useState(() => seedState(DEFAULT_PARAMETERS.playerCount));
  const [started, setStarted] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Basic' });

  const stateRef = useRef(state);
  stateRef.current = state;
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const pushMessage = (text, category = 'system') =>
    setState((current) => ({ ...current, messages: [{ text, category }, ...current.messages].slice(0, 20) }));

  const step = () => {
    const times = Math.max(1, Math.round(paramsRef.current.speedMultiplier));
    let next = stateRef.current;
    for (let i = 0; i < times; i += 1) next = simulateTurn(next, paramsRef.current);
    setState(next);
  };

  useEffect(() => {
    if (!params.active) return undefined;
    const interval = setInterval(
      () => setState(simulateTurn(stateRef.current, paramsRef.current)),
      (params.cycleTime * 1000) / params.speedMultiplier,
    );
    return () => clearInterval(interval);
  }, [params.active, params.cycleTime, params.speedMultiplier]);

  const start = () => {
    setStarted(true);
    setParams((previous) => ({ ...previous, active: false }));
    pushMessage('Ready. Press Play to let the weeks flow.');
  };

  const resume = () => setParams((previous) => ({ ...previous, active: true }));

  const pause = () => setParams((previous) => ({ ...previous, active: false }));

  const restart = () => {
    setState(seedState(paramsRef.current.playerCount));
    setParams((previous) => ({ ...previous, active: false }));
    setStarted(false);
  };

  const applyPopulation = () => {
    setState(seedState(paramsRef.current.playerCount));
    setParams((previous) => ({ ...previous, active: false }));
  };

  const togglePause = () => {
    setParams((previous) => ({ ...previous, active: !previous.active }));
    pushMessage(params.active ? 'Simulation paused.' : 'Simulation resumed.');
  };

  const setSpeed = (speedMultiplier) => setParams((previous) => ({ ...previous, speedMultiplier }));
  const setVolatility = (marketVolatility) => setParams((previous) => ({ ...previous, marketVolatility }));

  const setPlayerCount = (value) => {
    const parsed = Number.parseInt(value, 10);
    const playerCount = Number.isNaN(parsed) ? 1 : Math.min(Math.max(parsed, 1), 1000);
    setParams((previous) => ({ ...previous, playerCount }));
  };

  const toggleRobinHood = () => {
    setParams((previous) => ({ ...previous, robinHoodModeActive: !previous.robinHoodModeActive }));
    pushMessage(params.robinHoodModeActive ? 'Robin Hood mode deactivated.' : 'Robin Hood mode activated.');
  };

  const toggleBailout = () => {
    setParams((previous) => ({ ...previous, autoBailout: !previous.autoBailout }));
    pushMessage(params.autoBailout ? 'System bailout deactivated.' : 'System bailout activated.');
  };

  const toggleEvents = () => {
    setParams((previous) => ({ ...previous, autoEvents: !previous.autoEvents }));
    pushMessage(params.autoEvents ? 'Automatic market events disabled.' : 'Automatic market events enabled.');
  };

  const toggleDetailedStats = () =>
    setParams((previous) => ({ ...previous, showDetailedStats: !previous.showDetailedStats }));

  const addProduct = () => {
    const name = newProduct.name.trim();
    const price = Number.parseInt(newProduct.price, 10);
    if (!name || Number.isNaN(price) || price <= 0) {
      pushMessage('Enter a product name and a price above 0 to add it to the market.', 'warning');
      return;
    }

    setState((current) => {
      const nextId = current.products.reduce((max, product) => Math.max(max, product.id), 0) + 1;
      const product = { id: nextId, name, basePrice: price, price, demand: 0.6, supply: 0.6, category: newProduct.category };
      return {
        ...current,
        products: [...current.products, product],
        messages: [
          { text: `New product added to the market: ${name} (${newProduct.category}, ${price}).`, category: 'market' },
          ...current.messages,
        ].slice(0, 20),
      };
    });
    setNewProduct({ name: '', price: '', category: 'Basic' });
  };

  const removeProduct = (id) =>
    setState((current) =>
      current.products.length > 1
        ? { ...current, products: current.products.filter((product) => product.id !== id) }
        : current,
    );

  const setPlayerStrategy = (id, strategy) =>
    setState((current) => ({
      ...current,
      players: current.players.map((player) => (player.id === id ? { ...player, strategy } : player)),
      messages: [{ text: `Player strategy set to ${strategy}.`, category: 'player' }, ...current.messages].slice(0, 20),
    }));

  return {
    products: state.products,
    players: state.players,
    parameters: params,
    turnCount: state.turn,
    messages: state.messages,
    activeEvents: state.activeEvents,
    historicalData: state.historical,
    treasury: state.treasury,
    mobility: state.mobility,
    started,
    newProduct,
    setNewProduct,
    addProduct,
    removeProduct,
    setPlayerStrategy,
    setPlayerCount,
    applyPopulation,
    start,
    resume,
    pause,
    restart,
    togglePause,
    step,
    setSpeed,
    toggleRobinHood,
    toggleBailout,
    toggleEvents,
    toggleDetailedStats,
    setVolatility,
  };
};
