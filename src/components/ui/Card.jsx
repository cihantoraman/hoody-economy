/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

const Card = ({ as: Tag = 'div', className = '', children, ...rest }) => (
  <Tag className={`bg-surface rounded-xl border border-line shadow-card ${className}`} {...rest}>
    {children}
  </Tag>
);

export default Card;
