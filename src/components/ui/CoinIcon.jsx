/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 *
 * An invented coin mark (a token stamped with an H) used next to amounts.
 * It only suggests "currency" and is deliberately not a real money symbol.
 */

const CoinIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 8.5v7M14.5 8.5v7M9.5 12h5" strokeLinecap="round" />
  </svg>
);

export default CoinIcon;
