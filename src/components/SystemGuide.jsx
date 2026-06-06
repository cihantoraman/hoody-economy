/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { STRATEGIES, STRATEGY_NOTES, TIERS } from '../constants/economy';
import { tierTextClass } from '../theme/classes';
import Icon from './ui/Icon';
import { ICON } from './ui/icons';

const SystemGuide = ({ parameters, open, onToggle }) => (
  <div className="bg-surface rounded-xl border border-line shadow-card">
    <button onClick={onToggle} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left">
      <span className="font-semibold text-lg">How it works</span>
      <Icon path={open ? ICON.arrowUp : ICON.arrowDown} className="w-4 h-4 text-muted shrink-0" />
    </button>

    {open && (
      <div className="px-4 pb-4">
        <p className="text-muted">
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
                  <span className="font-semibold">{strategy}:</span>{' '}
                  <span className="text-muted">{STRATEGY_NOTES[strategy]}</span>
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
                  <span className="text-muted">{tier.mult > 0 ? `≥ ${tier.mult}× the average` : 'below average'}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Robin Hood</h3>
            <p className="text-muted">
              Every few weeks the richest are taxed (Elite {parameters.eliteRobinHoodRate * 100}%, Rich{' '}
              {parameters.robinHoodRate * 100}%) and the money goes to the poorest.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Justice</h3>
            <p className="text-muted">
              Risk-taking strategies sometimes try to rig the market. Each time one is caught it earns a flag; at{' '}
              {parameters.manipulationThreshold} flags the player is fined and watchlisted, and a repeat offender with{' '}
              {parameters.imprisonmentThreshold}+ convictions is imprisoned for {parameters.imprisonmentDuration} weeks
              with a heavy fine.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Market events</h3>
            <p className="text-muted">Recessions, booms and disasters shift prices for a few weeks and hit some classes harder.</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Safety net</h3>
            <p className="text-muted">If more than {parameters.bailoutThreshold}% fall into poverty, emergency support kicks in.</p>
          </div>
        </div>

        <p className="text-xs text-muted mt-4 pt-4 border-t border-line">
          Model: wealth moves through a kinetic exchange (Chakraborti and Chakrabarti, 2000), where paired agents keep a
          saving fraction set by their strategy and randomly split the rest. This yields the realistic heavy-tailed
          (Pareto) wealth distribution seen in real economies. Inequality is tracked with the Gini coefficient and
          tempered by a progressive tax and flat transfer. Money is conserved every week.
        </p>
      </div>
    )}
  </div>
);

export default SystemGuide;
