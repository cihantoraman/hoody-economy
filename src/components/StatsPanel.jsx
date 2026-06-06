/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import AnimatedNumber from './ui/AnimatedNumber';
import Card from './ui/Card';
import CoinIcon from './ui/CoinIcon';
import { TIERS } from '../constants/economy';

const TIER_NAMES = TIERS.map((tier) => tier.name);

const JUSTICE = [
  { key: 'penalized', label: 'Penalized', className: 'text-warn' },
  { key: 'imprisoned', label: 'Imprisoned', className: 'text-danger' },
  { key: 'watchlist', label: 'Watchlist', className: 'text-warn' },
];

const StatsPanel = ({ stats, tiers, treasury, mobility }) => {
  const population = TIER_NAMES.reduce((sum, name) => sum + stats.counts[name], 0) || 1;

  return (
    <Card className="p-4" data-tour="society">
      <h2 className="font-semibold text-lg mb-3">Society</h2>

      <div className="flex justify-between items-baseline mb-1">
        <span className="text-muted text-sm" title="Cash currently held by all players. It shifts as money moves to and from the treasury.">
          Total capital
        </span>
        <span className="font-semibold text-lg tabular-nums inline-flex items-center gap-1">
          <CoinIcon className="w-4 h-4 text-muted" />
          <AnimatedNumber value={Math.round(stats.totalCapital)} />
        </span>
      </div>
      <div className="flex justify-between text-xs text-muted mb-1">
        <span title="The market and redistribution buffer. It is recycled back to players every turn, so it stays small.">
          Treasury {Math.round(treasury).toLocaleString()}
        </span>
        <span title="Total money in the system (capital + treasury). This never changes.">
          Fixed supply {Math.round(stats.totalCapital + treasury).toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between text-xs text-muted mb-4">
        <span title="Share of players who changed class this turn — how fluid the society is.">
          Mobility {Math.round((mobility ?? 0) * 100)}%
        </span>
        <span title="Inequality, from 0 (everyone equal) to 1 (one person owns everything).">
          Gini {stats.gini}
        </span>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Classes</p>
      <div className="space-y-2 mb-4">
        {TIER_NAMES.map((name) => {
          const count = stats.counts[name];
          const pct = Math.round((count / population) * 100);
          return (
            <div key={name} className="flex items-center gap-2.5 text-sm">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: tiers[name] }} />
              <span className="text-muted w-24 shrink-0">{name}</span>
              <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: tiers[name] }} />
              </div>
              <span className="font-semibold w-7 text-right tabular-nums">{count}</span>
            </div>
          );
        })}
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Justice</p>
      <div className="grid grid-cols-3 gap-2">
        {JUSTICE.map((item) => (
          <div key={item.key} className="bg-surface-2 rounded-lg px-3 py-2">
            <p className="text-muted text-xs">{item.label}</p>
            <p className={`font-semibold tabular-nums ${item.className}`}>{stats[item.key]}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StatsPanel;
