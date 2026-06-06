/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import AnimatedNumber from './ui/AnimatedNumber';
import Card from './ui/Card';
import CoinIcon from './ui/CoinIcon';
import { TIERS } from '../constants/economy';

const TIER_NAMES = TIERS.map((tier) => tier.name);

const StatsPanel = ({ stats, tiers, treasury, mobility }) => {
  const population = TIER_NAMES.reduce((sum, name) => sum + stats.counts[name], 0) || 1;

  return (
    <Card className="p-4" data-tour="society">
      <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-line">
        <h2 className="font-semibold text-lg">Society</h2>
        <div className="flex items-end gap-5">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-muted mb-1">Gini</p>
            <p className="text-base font-semibold tabular-nums">{stats.gini}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-muted mb-1">Avg</p>
            <p className="text-base font-semibold tabular-nums inline-flex items-center gap-0.5">
              <CoinIcon className="w-3.5 h-3.5 text-muted" />
              {stats.avgCapital.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-muted mb-1" title="Cash currently held by all players.">Total capital</p>
        <p className="font-semibold text-2xl tabular-nums inline-flex items-baseline gap-1.5 leading-none">
          <CoinIcon className="w-5 h-5 text-muted self-center" />
          <AnimatedNumber value={Math.round(stats.totalCapital)} />
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted mt-2">
          <span title="The market and redistribution buffer, recycled each week.">
            Treasury <span className="inline-flex items-center gap-0.5"><CoinIcon className="w-3 h-3" />{Math.round(treasury).toLocaleString()}</span>
          </span>
          <span title="Total money in the system (capital + treasury). This never changes.">
            Fixed supply <span className="inline-flex items-center gap-0.5"><CoinIcon className="w-3 h-3" />{Math.round(stats.totalCapital + treasury).toLocaleString()}</span>
          </span>
          <span title="Share of players who changed class this week.">
            Mobility {Math.round((mobility ?? 0) * 100)}%
          </span>
        </div>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Classes</p>
      <div className="space-y-2">
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
    </Card>
  );
};

export default StatsPanel;
