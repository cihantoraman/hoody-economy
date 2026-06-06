/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import CapitalChart from './charts/CapitalChart';
import AnimatedNumber from './ui/AnimatedNumber';
import CoinIcon from './ui/CoinIcon';
import Trend from './ui/Trend';
import { STRATEGY_NOTES } from '../constants/economy';
import { statusChipClass, tierTextClass } from '../theme/classes';

const Row = ({ label, hint, children }) => (
  <div className="flex items-center justify-between gap-2 px-3 py-2">
    <span className="text-sm text-muted" title={hint}>
      {label}
    </span>
    <span className="font-semibold tabular-nums">{children}</span>
  </div>
);

const PlayerPanel = ({ player, strategies, onStrategy, chart }) => {
  if (!player) return null;

  const history = player.capitalHistory ?? [];
  const capitalDelta = history.length >= 2 ? history[history.length - 1] - history[history.length - 2] : 0;
  const robinHood = player.robinHoodPoints;

  return (
    <section data-tour="player" className="bg-surface rounded-xl border border-accent shadow-card p-4 md:p-5 mb-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Your standing</h2>
        {player.specialStatus ? (
          <span className={statusChipClass(player.specialStatus)}>
            {player.specialStatus}
            {player.penaltyTime > 0 ? ` · ${player.penaltyTime}w left` : ''}
          </span>
        ) : (
          <span className="text-xs text-muted">Clean record</span>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-stretch">
        <div className="md:w-64 md:shrink-0 flex flex-col gap-3">
          <div className="rounded-lg border border-line divide-y divide-line">
            <Row label="Class">
              <span className={tierTextClass(player.level)}>{player.level}</span>
            </Row>
            <Row label="Capital" hint="Your spendable wealth right now.">
              <span className="inline-flex items-center gap-0.5">
                <CoinIcon className="w-4 h-4 text-accent" />
                <AnimatedNumber value={player.capital} />
                <Trend value={capitalDelta} className="w-3.5 h-3.5" />
              </span>
            </Row>
            <Row label="Inventory Value" hint="Market value of the goods you are holding.">
              <span className="inline-flex items-center gap-0.5">
                <CoinIcon className="w-4 h-4 text-muted" />
                <AnimatedNumber value={player.inventoryValue} />
              </span>
            </Row>
            <Row label="Robin Hood Effect" hint="Net units you have gained from (or paid into) redistribution.">
              <span className={`inline-flex items-center gap-0.5 ${robinHood > 0 ? 'text-accent' : robinHood < 0 ? 'text-danger' : ''}`}>
                <CoinIcon className="w-4 h-4" />
                {robinHood > 0 ? '+' : ''}
                {robinHood.toLocaleString()}
              </span>
            </Row>
          </div>

          <div className="rounded-lg border border-accent/50 bg-accent-weak p-3">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="player-strategy" className="text-xs font-semibold uppercase tracking-wide text-accent">
                Strategy
              </label>
              <span className="text-[10px] text-accent/80">click to change</span>
            </div>
            <select
              id="player-strategy"
              value={player.strategy}
              onChange={(event) => onStrategy(player.id, event.target.value)}
              className="w-full h-9 px-2 rounded-md border border-accent bg-surface text-sm font-semibold outline-none cursor-pointer focus:ring-2 focus:ring-accent/30"
            >
              {strategies.map((strategy) => (
                <option key={strategy} value={strategy}>
                  {strategy}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted mt-1.5">{STRATEGY_NOTES[player.strategy]}</p>
          </div>
        </div>

        <div className="flex-1 min-w-0 rounded-lg border border-line p-3 flex flex-col min-h-[15rem]">
          <p className="text-xs text-muted mb-2">Your capital over time</p>
          <div className="flex-1 min-h-0">
            <CapitalChart history={player.capitalHistory} chart={chart} height="h-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlayerPanel;
