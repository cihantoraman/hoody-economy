/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import CapitalChart from './charts/CapitalChart';
import AnimatedNumber from './ui/AnimatedNumber';
import CoinIcon from './ui/CoinIcon';
import Icon from './ui/Icon';
import Trend from './ui/Trend';
import { ICON } from './ui/icons';
import { STRATEGY_NOTES } from '../constants/economy';
import { statusChipClass, tierTextClass } from '../theme/classes';

const MoneyRow = ({ label, hint, children }) => (
  <div className="flex items-baseline gap-3 px-3 py-2.5">
    <span className="text-sm text-muted w-32 shrink-0" title={hint}>
      {label}
    </span>
    <span className="font-semibold tabular-nums">{children}</span>
  </div>
);

const PlayerPanel = ({ player, strategies, onStrategy, showHistory, onToggleHistory, chart }) => {
  if (!player) return null;

  const history = player.capitalHistory ?? [];
  const capitalDelta = history.length >= 2 ? history[history.length - 1] - history[history.length - 2] : 0;
  const robinHood = player.robinHoodPoints;

  return (
    <section data-tour="player" className="bg-surface rounded-xl border border-accent shadow-card p-4 md:p-5 mb-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Your standing</h2>
        <div className="flex items-center gap-2">
          {player.specialStatus && <span className={statusChipClass(player.specialStatus)}>{player.specialStatus}</span>}
          <span className={`${tierTextClass(player.level)} text-sm font-semibold`}>{player.level}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="rounded-lg border border-line divide-y divide-line md:shrink-0">
          <MoneyRow label="Capital" hint="Your spendable wealth right now.">
            <span className="inline-flex items-center gap-1">
              <CoinIcon className="w-4 h-4 text-accent" />
              <AnimatedNumber value={player.capital} />
              <Trend value={capitalDelta} className="w-3.5 h-3.5" />
            </span>
          </MoneyRow>
          <MoneyRow label="Inventory Value" hint="Market value of the goods you are holding.">
            <AnimatedNumber value={player.inventoryValue} />
          </MoneyRow>
          <MoneyRow label="Robin Hood Effect" hint="Net units you have gained from (or paid into) redistribution.">
            <span className={robinHood > 0 ? 'text-accent' : robinHood < 0 ? 'text-danger' : ''}>
              {robinHood > 0 ? '+' : ''}
              {robinHood.toLocaleString()}
            </span>
          </MoneyRow>
        </div>

        <div className="rounded-lg border border-line p-3 flex-1">
          <label htmlFor="player-strategy" className="text-sm text-muted">
            Strategy
          </label>
          <div className="flex items-center gap-3 mt-1">
            <select
              id="player-strategy"
              value={player.strategy}
              onChange={(event) => onStrategy(player.id, event.target.value)}
              className="w-48 h-9 px-2 rounded-md border border-line bg-surface text-sm font-semibold outline-none focus:border-accent"
            >
              {strategies.map((strategy) => (
                <option key={strategy} value={strategy}>
                  {strategy}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted">{STRATEGY_NOTES[player.strategy]}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onToggleHistory}
        className="mt-3 w-full h-9 rounded-md border border-line text-sm font-semibold text-muted hover:text-fg hover:border-accent flex items-center justify-center gap-1.5"
      >
        {showHistory ? 'Hide capital graph' : 'Show capital graph'}
        <Icon path={showHistory ? ICON.arrowUp : ICON.arrowDown} className="w-4 h-4" />
      </button>

      {showHistory && (
        <div className="mt-3">
          <CapitalChart history={player.capitalHistory} chart={chart} />
        </div>
      )}
    </section>
  );
};

export default PlayerPanel;
