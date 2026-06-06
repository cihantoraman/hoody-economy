/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import Card from './ui/Card';
import Icon from './ui/Icon';
import { ICON } from './ui/icons';

const Header = ({ theme, onToggleTheme }) => (
  <Card className="px-5 py-3 mb-4">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-baseline gap-x-3 gap-y-0.5 flex-wrap min-w-0">
        <h1 className="text-xl font-semibold tracking-tight shrink-0">Hoody Economy</h1>
        <p className="text-sm text-muted">
          A cyclical-capital economy where wealth keeps moving, so no one accumulates power for long.
        </p>
      </div>
      <button
        onClick={onToggleTheme}
        aria-label="Toggle color theme"
        title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        className="shrink-0 h-9 w-9 rounded-md border border-line text-muted hover:text-fg hover:bg-surface-2 flex items-center justify-center"
      >
        <Icon path={theme === 'dark' ? ICON.sun : ICON.moon} className="w-4 h-4" />
      </button>
    </div>
  </Card>
);

export default Header;
