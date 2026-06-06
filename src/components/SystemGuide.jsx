/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { STRATEGIES, TIERS } from '../constants/economy';
import { tierTextClass } from '../theme/classes';

const STRATEGY_NOTES = {
  Balanced: 'Medium risk, steady returns.',
  Risky: 'Big swings with strong upside.',
  Conservative: 'Low risk, slow growth.',
  Aggressive: 'Maximum volatility and upside.',
  Innovative: 'Gains from tech advances.',
  Technological: 'Focused on tech markets.',
  Speculative: 'Profits from bubbles and crashes.',
};

const SystemGuide = ({ parameters }) => (
  <details className="bg-surface rounded-xl border border-line shadow-card p-4">
    <summary className="font-semibold text-lg cursor-pointer list-none">How it works</summary>

    <p className="mt-3 text-muted">
      A model of an economy that never lets wealth pile up: people keep moving between classes, the rich are taxed
      to lift the poor, market events shake prices, and cheating is policed. The money supply is fixed, so capital
      only moves between players and a shared treasury, never minted or destroyed.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Strategies</h3>
        <ul className="space-y-1">
          {STRATEGIES.map((strategy) => (
            <li key={strategy}>
              <span className="font-semibold">{strategy}:</span> <span className="text-muted">{STRATEGY_NOTES[strategy]}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Social classes</h3>
        <ul className="space-y-1">
          {TIERS.map((tier) => (
            <li key={tier.name}>
              <span className={`font-semibold ${tierTextClass(tier.name)}`}>{tier.name}:</span>{' '}
              <span className="text-muted">capital ≥ {tier.min.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Robin Hood</h3>
        <p className="text-muted">
          Every few turns the richest are taxed (Elite {parameters.eliteRobinHoodRate * 100}%, Rich{' '}
          {parameters.robinHoodRate * 100}%) and the money goes to the poorest.
        </p>
      </div>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Justice</h3>
        <p className="text-muted">
          Cheaters are warned, watchlisted after {parameters.manipulationThreshold} flags, then jailed with heavy fines
          on repeat ({parameters.imprisonmentThreshold}+).
        </p>
      </div>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Market events</h3>
        <p className="text-muted">Recessions, booms and disasters shift prices for a few turns and hit some classes harder.</p>
      </div>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Safety net</h3>
        <p className="text-muted">If more than {parameters.bailoutThreshold}% fall into poverty, emergency support kicks in.</p>
      </div>
    </div>
  </details>
);

export default SystemGuide;
