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
import { statusChipClass, tierTextClass } from '../theme/classes';

const Stat = ({ label, hint, children }) => (
  <div className="bg-surface px-3 py-2.5">
    <p className="text-muted text-xs mb-1" title={hint}>
      {label}
    </p>
    {children}
  </div>
);

const PlayerPanel = ({ player, strategies, onStrategy, showHistory, onToggleHistory, chart }) => {
  if (!player) return null;

  const history = player.capitalHistory ?? [];
  const capitalDelta = history.length >= 2 ? history[history.length - 1] - history[history.length - 2] : 0;

  return (
    <section data-tour="player" className="bg-surface rounded-xl border border-accent shadow-card p-4 md:p-5 mb-4">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-lg">Your Player</h2>
          <p className="text-sm text-muted">Your personal position in the economy.</p>
        </div>
        <div className="flex items-center gap-3">
          {player.specialStatus && <span className={statusChipClass(player.specialStatus)}>{player.specialStatus}</span>}
          <span className={`${tierTextClass(player.level)} text-lg font-semibold`}>{player.level}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px rounded-lg overflow-hidden bg-line border border-line">
        <Stat label="Capital" hint="This player's spendable wealth right now.">
          <p className="font-semibold text-lg h-7 flex items-center gap-1 tabular-nums">
            <CoinIcon className="w-4 h-4 text-accent" />
            <AnimatedNumber value={player.capital} />
            <Trend value={capitalDelta} className="w-3.5 h-3.5" />
          </p>
        </Stat>
        <Stat label="Inventory Value" hint="Market value of the goods this player is currently holding.">
          <p className="font-semibold text-lg h-7 flex items-center tabular-nums">
            <AnimatedNumber value={player.inventoryValue} />
          </p>
        </Stat>
        <Stat label="Robin Hood Effect" hint="Net units this player has gained from (or paid into) wealth redistribution.">
          <p
            className={`font-semibold text-lg h-7 flex items-center tabular-nums ${
              player.robinHoodPoints > 0 ? 'text-accent' : player.robinHoodPoints < 0 ? 'text-danger' : ''
            }`}
          >
            {player.robinHoodPoints > 0 ? '+' : ''}
            {player.robinHoodPoints.toLocaleString()}
          </p>
        </Stat>
        <Stat label="Strategy" hint="How aggressively this player trades and takes risks each turn.">
          <select
            value={player.strategy}
            onChange={(event) => onStrategy(player.id, event.target.value)}
            className="w-full h-7 rounded-md border border-line bg-surface text-sm font-semibold outline-none focus:border-accent"
          >
            {strategies.map((strategy) => (
              <option key={strategy} value={strategy}>
                {strategy}
              </option>
            ))}
          </select>
        </Stat>
        <Stat label="Cycle" hint="How many turns this player has been active.">
          <p className="font-semibold text-lg h-7 flex items-center tabular-nums">{player.cycle}</p>
        </Stat>
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
