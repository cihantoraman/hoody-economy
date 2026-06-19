/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import CoinIcon from './ui/CoinIcon';
import Icon from './ui/Icon';
import { ICON } from './ui/icons';

const Stat = ({ label, from, to, betterWhen = 'higher', money = false, suffix = '' }) => {
  const same = to === from;
  const improved = betterWhen === 'higher' ? to > from : to < from;
  const color = same ? 'text-muted' : improved ? 'text-accent' : 'text-danger';
  const arrow = same ? '' : to > from ? '↑' : '↓';
  const fmt = (value) => (money ? Math.round(value).toLocaleString() : value);

  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm tabular-nums inline-flex items-center gap-1.5">
        <span className="text-muted inline-flex items-center gap-0.5">
          {money && <CoinIcon className="w-3 h-3" />}
          {fmt(from)}
          {suffix}
        </span>
        <span className="text-muted">→</span>
        <span className={`font-semibold inline-flex items-center gap-0.5 ${color}`}>
          {money && <CoinIcon className="w-3 h-3" />}
          {fmt(to)}
          {suffix}
          {arrow}
        </span>
      </span>
    </div>
  );
};

const YearReport = ({ report, onClose }) => {
  if (!report) return null;

  const { year, prev, now } = report;
  const poorPrev = prev.counts.Poor ?? 0;
  const poorNow = now.counts.Poor ?? 0;

  const headline =
    now.gini > prev.gini + 0.01
      ? 'The gap widened this year.'
      : now.gini < prev.gini - 0.01
        ? 'The gap narrowed this year.'
        : 'Inequality held steady this year.';

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" />
      <div className="tutorial-pop fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(420px,calc(100vw-2rem))] bg-surface border border-line shadow-card rounded-xl p-5">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1">Year {year} in review</p>
            <h3 className="font-semibold text-lg">{headline}</h3>
          </div>
          <button
            onClick={onClose}
            title="Continue"
            className="shrink-0 h-8 w-8 rounded-md border border-line text-muted hover:text-fg flex items-center justify-center"
          >
            <Icon path={ICON.close} className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-muted mb-3">
          Weeks {(year - 1) * 52 + 1} to {year * 52}. How the economy moved over the past year:
        </p>

        <div className="rounded-lg border border-line divide-y divide-line">
          <Stat label="Inequality (Gini)" from={prev.gini} to={now.gini} betterWhen="lower" />
          <Stat label="Average wealth" from={prev.avg} to={now.avg} betterWhen="higher" money />
          <Stat label="Your capital" from={prev.player} to={now.player} betterWhen="higher" money />
          <Stat label="People in poverty" from={poorPrev} to={poorNow} betterWhen="lower" />
        </div>

        <button onClick={onClose} className="mt-4 w-full h-10 rounded-md bg-accent text-accent-fg font-semibold text-sm">
          Continue into year {year + 1}
        </button>
      </div>
    </>
  );
};

export default YearReport;
