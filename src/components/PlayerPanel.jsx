/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import CapitalChart from './charts/CapitalChart';
import CoinIcon from './ui/CoinIcon';
import Icon from './ui/Icon';
import { ICON } from './ui/icons';
import { statusChipClass, tierTextClass } from '../theme/classes';

const Stat = ({ label, children }) => (
  <div>
    <p className="text-muted text-sm mb-1">{label}</p>
    {children}
  </div>
);

const PlayerPanel = ({ player, strategies, onStrategy, showHistory, onToggleHistory, chart }) => {
  if (!player) return null;

  return (
    <section className="bg-surface rounded-xl border border-accent shadow-card p-4 md:p-5 mb-4">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-lg">Your Player</h2>
          <p className="text-sm text-muted">Your personal position in the economy.</p>
        </div>
        <div className="flex items-center gap-3">
          {player.specialStatus && <span className={statusChipClass(player.specialStatus)}>{player.specialStatus}</span>}
          <span className={`${tierTextClass(player.level)} text-lg inline-flex items-center gap-1`}>
            {player.level}: <CoinIcon className="w-4 h-4" />
            {player.capital.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Stat label="Strategy">
          <select
            value={player.strategy}
            onChange={(event) => onStrategy(player.id, event.target.value)}
            className="w-full h-9 px-2 rounded-md border border-line bg-surface text-sm font-semibold outline-none focus:border-accent"
          >
            {strategies.map((strategy) => (
              <option key={strategy} value={strategy}>
                {strategy}
              </option>
            ))}
          </select>
        </Stat>
        <Stat label="Inventory Value">
          <p className="font-semibold h-9 flex items-center">{player.inventoryValue.toLocaleString()}</p>
        </Stat>
        <Stat label="Robin Hood Effect">
          <p
            className={`font-semibold h-9 flex items-center ${
              player.robinHoodPoints > 0 ? 'text-accent' : player.robinHoodPoints < 0 ? 'text-danger' : ''
            }`}
          >
            {player.robinHoodPoints > 0 ? '+' : ''}
            {player.robinHoodPoints.toLocaleString()}
          </p>
        </Stat>
        <Stat label="Cycle">
          <p className="font-semibold h-9 flex items-center">{player.cycle}</p>
        </Stat>
        <Stat label="Capital graph">
          <button
            onClick={onToggleHistory}
            className="h-9 w-full px-3 bg-surface-2 text-fg border border-line rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 hover:border-accent"
          >
            <Icon path={showHistory ? ICON.eyeOff : ICON.chart} className="w-3.5 h-3.5" />
            {showHistory ? 'Hide' : 'Show'}
          </button>
        </Stat>
      </div>

      {showHistory && (
        <div className="mt-4 border-t pt-4">
          <p className="text-muted text-sm mb-2">Capital History</p>
          <CapitalChart history={player.capitalHistory} chart={chart} />
        </div>
      )}
    </section>
  );
};

export default PlayerPanel;
