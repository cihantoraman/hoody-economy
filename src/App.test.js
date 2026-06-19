/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Hoody Economy app', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Hoody Economy' })).toBeInTheDocument();
});
