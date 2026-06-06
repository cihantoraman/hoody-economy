/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import Card from './ui/Card';
import Icon from './ui/Icon';
import { ICON } from './ui/icons';

const Header = ({ theme, onToggleTheme }) => (
  <Card className="p-5 mb-4">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hoody Economy</h1>
        <p className="text-sm text-muted mt-1 max-w-2xl">
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
