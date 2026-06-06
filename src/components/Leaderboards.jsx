/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { useState } from 'react';
import Card from './ui/Card';
import CoinIcon from './ui/CoinIcon';
import { statusChipClass, tierTextClass } from '../theme/classes';

const Row = ({ player, onSelect, children }) => (
  <button
    onClick={() => onSelect(player.id)}
    className="w-full text-left mb-2 pb-2 border-b last:border-0 last:mb-0 last:pb-0 hover:bg-surface-2 rounded-md px-1"
  >
    {children}
  </button>
);

const Leaderboards = ({ topRichest, offenders, onSelect }) => {
  const [showAll, setShowAll] = useState(false);
  const shownOffenders = showAll ? offenders : offenders.slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <h2 className="font-semibold text-lg mb-2">Top 5 Wealthiest</h2>
        <Card className="p-4">
          {topRichest.map((player) => (
            <Row key={player.id} player={player} onSelect={onSelect}>
              <div className="flex justify-between items-center">
                <span className="font-semibold">{player.name}</span>
                <span className={`${tierTextClass(player.level)} inline-flex items-center gap-1`}><CoinIcon className="w-3 h-3" />{player.capital.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-muted mt-0.5">
                <span>
                  {player.strategy}
                  {player.specialization ? ` · ${player.specialization}` : ''}
                </span>
                <span>Inventory {player.inventoryValue.toLocaleString()}</span>
              </div>
            </Row>
          ))}
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-lg">Offenders</h2>
          {offenders.length > 5 && (
            <button
              onClick={() => setShowAll((value) => !value)}
              className="px-3 py-1 rounded-md border border-line text-muted hover:text-fg text-xs font-semibold"
            >
              {showAll ? 'Show top 5' : 'Show all'}
            </button>
          )}
        </div>
        <Card className="p-4">
          {offenders.length ? (
            shownOffenders.map((player) => (
              <Row key={player.id} player={player} onSelect={onSelect}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{player.name}</span>
                  <div className="flex items-center gap-2">
                    {player.specialStatus && <span className={statusChipClass(player.specialStatus)}>{player.specialStatus}</span>}
                    {player.penaltyTime > 0 && (
                      <span className="bg-warn-weak text-warn px-2 py-0.5 rounded-md text-xs font-medium">
                        {player.penaltyTime} turns
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted mt-0.5">
                  <span>
                    Flags {player.manipulationPoints} · Offenses {player.imprisonmentRecord}
                  </span>
                  <span className={`${tierTextClass(player.level)} inline-flex items-center gap-1`}><CoinIcon className="w-3 h-3" />{player.capital.toLocaleString()}</span>
                </div>
              </Row>
            ))
          ) : (
            <p className="text-center text-muted italic">No offenders yet</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Leaderboards;
