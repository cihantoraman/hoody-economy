/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { useState } from 'react';
import Icon from './ui/Icon';
import { ICON } from './ui/icons';
import CapitalChart from './charts/CapitalChart';
import ClassDistributionChart from './charts/ClassDistributionChart';
import ClassPieChart from './charts/ClassPieChart';
import GiniChart from './charts/GiniChart';
import ProductPricesChart from './charts/ProductPricesChart';
import { TIERS } from '../constants/economy';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'classes', label: 'Classes' },
  { id: 'prices', label: 'Prices' },
  { id: 'player', label: 'Player' },
];

const TIER_NAMES = TIERS.map((tier) => tier.name);

const Analytics = ({
  open,
  onToggle,
  chart,
  tiers,
  series,
  historicalData,
  counts,
  players,
  selectedPlayer,
  onSelectPlayer,
}) => {
  const [tab, setTab] = useState('overview');
  const pieData = TIER_NAMES.map((name) => ({ name, value: counts[name], color: tiers[name] }));
  const capitals = players.map((player) => player.capital);
  const avgCapital = capitals.length ? Math.round(capitals.reduce((sum, value) => sum + value, 0) / capitals.length) : 0;
  const wealthRefs = capitals.length
    ? [
        { label: 'Richest', value: Math.max(...capitals), color: tiers.Rich },
        { label: 'Average', value: avgCapital, color: chart.axis },
        { label: 'Poorest', value: Math.min(...capitals), color: tiers.Poor },
      ]
    : [];

  return (
    <div className="mb-4 rounded-xl border border-line bg-surface shadow-card overflow-hidden" data-tour="analytics">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-2 ${
          open ? 'border-b border-line' : ''
        }`}
      >
        <span className="flex items-baseline gap-2 min-w-0">
          <span className="font-semibold text-lg">Analytics</span>
          {!open && (
            <span className="text-xs text-muted truncate hidden sm:inline">Overview · Classes · Prices · Player</span>
          )}
        </span>
        <span className="flex items-center gap-2 text-sm font-semibold text-muted shrink-0">
          {open ? 'Hide charts' : 'Show charts'}
          <Icon path={open ? ICON.arrowUp : ICON.arrowDown} className="w-4 h-4" />
        </span>
      </button>

      {open && (
        <div className="p-4">
          <div className="flex gap-1 border-b border-line mb-3">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`py-2 px-3 text-sm font-medium -mb-px ${
                  tab === id ? 'text-accent border-b-2 border-accent' : 'text-muted hover:text-fg'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm mb-1">Gini Coefficient Over Time</h3>
                <GiniChart data={historicalData.giniCoefficient} chart={chart} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Current Class Distribution</h3>
                <ClassPieChart data={pieData} chart={chart} />
              </div>
            </div>
          )}

          {tab === 'classes' && (
            <div>
              <h3 className="font-semibold text-sm mb-1">Social Class Evolution</h3>
              <ClassDistributionChart data={historicalData.classDistribution} tiers={tiers} chart={chart} />
            </div>
          )}

          {tab === 'prices' && (
            <div>
              <h3 className="font-semibold text-sm mb-1">Product Price Trends</h3>
              <ProductPricesChart productPrices={historicalData.productPrices} series={series} chart={chart} />
            </div>
          )}

          {tab === 'player' && (
            <div>
              <h3 className="font-semibold text-sm mb-2">Player Capital History</h3>
              <select
                value={selectedPlayer?.id ?? ''}
                onChange={(event) => onSelectPlayer(event.target.value ? Number(event.target.value) : null)}
                className="mb-3 h-9 px-2 rounded-md border border-line bg-surface text-sm outline-none focus:border-accent"
              >
                <option value="">Select a player…</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name} ({player.level})
                  </option>
                ))}
              </select>
              <CapitalChart
                history={selectedPlayer?.capitalHistory}
                chart={chart}
                height="h-64"
                refLines={selectedPlayer ? wealthRefs : undefined}
              />
              <p className="text-xs text-muted mt-2">
                Dashed lines mark the current Richest, Average and Poorest capital, so you can see where this player sits.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analytics;
