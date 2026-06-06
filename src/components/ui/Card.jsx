/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

const Card = ({ as: Tag = 'div', className = '', children }) => (
  <Tag className={`bg-surface rounded-xl border border-line shadow-card ${className}`}>{children}</Tag>
);

export default Card;
