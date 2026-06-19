/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';

const AnimatedNumber = ({ value }) => {
  const display = useAnimatedNumber(value);
  return display.toLocaleString();
};

export default AnimatedNumber;
