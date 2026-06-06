/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import Card from './ui/Card';
import CoinIcon from './ui/CoinIcon';
import { statusChipClass, tierTextClass } from '../theme/classes';

const JUSTICE = [
  { key: 'penalized', label: 'Penalized', className: 'text-warn' },
  { key: 'imprisoned', label: 'Imprisoned', className: 'text-danger' },
  { key: 'watchlist', label: 'Watchlist', className: 'text-warn' },
];

const Row = ({ player, onSelect, children }) => (
  <button
    onClick={() => onSelect(player.id)}
    className="w-full text-left mb-2 pb-2 border-b last:border-0 last:mb-0 last:pb-0 hover:bg-surface-2 rounded-md px-1"
  >
    {children}
  </button>
);

const Leaderboards = ({ topRichest, offenders, stats, onSelect }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 md:h-[24rem]">
    <div className="flex flex-col min-h-0">
      <h2 className="font-semibold text-lg mb-2">Top 5 Wealthiest</h2>
      <Card className="p-4 flex-1 min-h-0 overflow-y-auto">
        {topRichest.map((player) => (
          <Row key={player.id} player={player} onSelect={onSelect}>
            <div className="flex justify-between items-center">
              <span className="font-semibold">{player.name}</span>
              <span className={`${tierTextClass(player.level)} inline-flex items-center gap-0.5`}>
                <CoinIcon className="w-3 h-3" />
                {player.capital.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted mt-0.5">
              <span>
                {player.strategy}
                {player.specialization ? ` · ${player.specialization}` : ''}
              </span>
              <span className="inline-flex items-center gap-0.5">
                Inventory <CoinIcon className="w-3 h-3" />
                {player.inventoryValue.toLocaleString()}
              </span>
            </div>
          </Row>
        ))}
      </Card>
    </div>

    <div className="flex flex-col min-h-0">
      <h2 className="font-semibold text-lg mb-2">Justice</h2>
      <Card className="p-3 mb-3">
        <div className="grid grid-cols-3 gap-2">
          {JUSTICE.map((item) => (
            <div key={item.key} className="bg-surface-2 rounded-lg px-3 py-2">
              <p className="text-muted text-xs">{item.label}</p>
              <p className={`font-semibold tabular-nums ${item.className}`}>{stats[item.key]}</p>
            </div>
          ))}
        </div>
      </Card>

      <h2 className="font-semibold text-lg mb-2">Offenders</h2>
      <Card className="p-4 flex-1 min-h-0 overflow-y-auto">
        {offenders.length ? (
          offenders.map((player) => (
            <Row key={player.id} player={player} onSelect={onSelect}>
              <div className="flex justify-between items-center">
                <span className="font-semibold">{player.name}</span>
                <div className="flex items-center gap-2">
                  {player.specialStatus && <span className={statusChipClass(player.specialStatus)}>{player.specialStatus}</span>}
                  {player.penaltyTime > 0 && (
                    <span className="bg-warn-weak text-warn px-2 py-0.5 rounded-md text-xs font-medium">
                      {player.penaltyTime} weeks
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted mt-0.5">
                <span>
                  Flags {player.manipulationPoints} · Offenses {player.imprisonmentRecord}
                </span>
                <span className={`${tierTextClass(player.level)} inline-flex items-center gap-0.5`}>
                  <CoinIcon className="w-3 h-3" />
                  {player.capital.toLocaleString()}
                </span>
              </div>
            </Row>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-muted italic">No offenders yet</div>
        )}
      </Card>
    </div>
  </div>
);

export default Leaderboards;
