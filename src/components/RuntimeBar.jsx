/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import Card from './ui/Card';
import Icon from './ui/Icon';
import { ICON } from './ui/icons';

const SPEEDS = [0.5, 1, 2, 5, 10];

const RuntimeBar = ({ active, turnCount, speed, onTogglePause, onStep, onSpeed }) => {
  const stepSize = Math.max(1, Math.round(speed));

  return (
    <Card data-tour="controls" className="p-3 mb-4 flex flex-wrap items-center gap-2 sticky top-2 z-30">
      <button
        onClick={onTogglePause}
        className={`h-9 px-4 rounded-md font-semibold text-sm flex items-center gap-1.5 ${
          active ? 'bg-danger text-white' : 'bg-accent text-accent-fg'
        }`}
      >
        <Icon path={active ? ICON.stop : ICON.play} className="w-4 h-4" />
        {active ? 'Pause' : 'Play'}
      </button>

      <button
        onClick={onStep}
        disabled={active}
        title={`Advance ${stepSize} week${stepSize === 1 ? '' : 's'}`}
        className="h-9 px-4 rounded-md font-semibold text-sm flex items-center gap-1.5 bg-surface-2 text-fg border border-line disabled:opacity-40"
      >
        <Icon path={ICON.step} className="w-4 h-4" />
        Step{stepSize > 1 ? ` +${stepSize}` : ''}
      </button>

      <div className="flex items-baseline gap-1.5 pl-2 pr-1">
        <span className="text-[10px] uppercase tracking-wide text-muted">Week</span>
        <span className="text-xl font-bold tabular-nums leading-none">{turnCount}</span>
      </div>

      <div className="flex items-center gap-1 ml-auto">
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
    </Card>
  );
};

export default RuntimeBar;
