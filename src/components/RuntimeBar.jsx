/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import Card from './ui/Card';
import Icon from './ui/Icon';
import { ICON } from './ui/icons';

const SPEEDS = [0.5, 1, 2, 5, 10];

const Chip = ({ label, value }) => (
  <span className="px-2.5 py-1 rounded-md bg-surface-2 text-sm">
    {label} <span className="font-semibold">{value}</span>
  </span>
);

const RuntimeBar = ({
  started,
  active,
  turnCount,
  gini,
  avgCapital,
  speed,
  onStart,
  onTogglePause,
  onStep,
  onRestart,
  onSpeed,
}) => (
  <Card data-tour="controls" className="p-3 mb-4 flex flex-col lg:flex-row lg:items-center gap-3">
    <div className="flex items-center gap-2 flex-wrap">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          active ? 'bg-accent-weak text-accent' : 'bg-surface-2 text-muted'
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-accent' : 'bg-muted'}`} />
        {started ? (active ? 'Running' : 'Paused') : 'Setup'}
      </span>
      <Chip label="Turn" value={turnCount} />
      <Chip label="Gini" value={gini} />
      <Chip label="Avg" value={avgCapital.toLocaleString()} />
    </div>

    <div className="flex items-center gap-2 lg:ml-auto flex-wrap">
      {!started ? (
        <button
          onClick={onStart}
          className="h-9 px-5 rounded-md font-semibold text-sm flex items-center gap-1.5 bg-accent text-accent-fg"
        >
          <Icon path={ICON.play} className="w-4 h-4" />
          Start
        </button>
      ) : (
        <>
          <button
            onClick={onTogglePause}
            className={`h-9 px-4 rounded-md font-semibold text-sm flex items-center gap-1.5 ${
              active ? 'bg-danger text-white' : 'bg-accent text-accent-fg'
            }`}
          >
            <Icon path={active ? ICON.stop : ICON.play} className="w-4 h-4" />
            {active ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={onStep}
            disabled={active}
            title="Run one turn"
            className="h-9 px-4 rounded-md font-semibold text-sm flex items-center gap-1.5 bg-surface-2 text-fg border border-line disabled:opacity-40"
          >
            <Icon path={ICON.step} className="w-4 h-4" />
            Turn
          </button>
          <div className="flex items-center gap-1 pl-1">
            <span className="text-xs text-muted mr-1">Speed</span>
            {SPEEDS.map((value) => (
              <button
                key={value}
                onClick={() => onSpeed(value)}
                className={`h-7 px-2 rounded-md text-xs font-semibold ${
                  speed === value ? 'bg-accent text-accent-fg' : 'bg-surface-2 text-muted hover:text-fg'
                }`}
              >
                {value}x
              </button>
            ))}
          </div>
          <button
            onClick={onRestart}
            title="Back to setup"
            className="h-9 px-3 rounded-md font-semibold text-sm flex items-center gap-1.5 border border-line text-muted hover:text-fg"
          >
            <Icon path={ICON.restart} className="w-4 h-4" />
            Restart
          </button>
        </>
      )}
    </div>
  </Card>
);

export default RuntimeBar;
