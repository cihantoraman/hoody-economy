/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import Icon from './Icon';
import { ICON } from './icons';

// Blue up / red down arrow showing whether a value just rose or fell.
const Trend = ({ value, className = 'w-3 h-3' }) => {
  if (!value) return null;
  const up = value > 0;
  return (
    <Icon
      path={up ? ICON.arrowUp : ICON.arrowDown}
      className={`${className} ${up ? 'text-info' : 'text-danger'}`}
    />
  );
};

export default Trend;
