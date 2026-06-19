# Hoody Economy

A gamified, cyclical-capital economy simulation. Wealth never piles up: agents keep
trading, the rich are taxed to lift the poor, market shocks move prices, and manipulation
is policed. The money supply is fixed, so capital only ever moves between players and a
shared treasury, never minted or destroyed.

**Live demo:** https://www.playgroundsofreality.com/playlab/hoody-economy

<!-- Add a screenshot here, e.g. ![Hoody Economy dashboard](docs/screenshot.png) -->

## The model

Wealth evolves through a kinetic wealth-exchange process from econophysics. Each week,
agents are paired at random; each keeps a saving fraction set by its strategy and the pair
randomly splits the rest of their pooled wealth, conserving the pair's total (Chakraborti
and Chakrabarti, 2000). Because that saving fraction differs between strategies, the
distribution develops the realistic heavy-tailed (Pareto) shape of real economies
(Chatterjee, Chakrabarti and Manna, 2004).

A progressive tax funds a flat transfer on top of the exchange, with a means-tested safety
net when poverty spikes. Inequality is tracked with the Gini coefficient. Classes are
relative (multiples of the live average), so they never collapse into one, and
`sum(capital) + treasury` equals the fixed money supply every week, enforced in the engine
and unit-tested.

**References**

- A. Chakraborti, B. K. Chakrabarti (2000). *Statistical mechanics of money.* Eur. Phys. J. B 17, 167-170.
- A. Chatterjee, B. K. Chakrabarti, S. S. Manna (2004). *Pareto law in a kinetic model of market with random saving propensity.* Physica A 335, 155-163.

## Features

- Pure, deterministic engine (`src/engine/economy.js`), unit-tested for conservation and a non-collapsing class distribution.
- Pre-game setup: population, market products, volatility, and policy toggles.
- Live dashboard: your standing, the class mix, the market, an event log, and analytics (Gini, class evolution, prices, capital history).
- Light and dark themes.

## Run locally

Requires Node 18 or newer.

```bash
npm install
npm start   # dev server at http://localhost:3000
npm test    # engine + app tests
npm run build
```

## License

MIT. Copyright (c) 2026 Cihan Toraman. See [LICENSE](LICENSE).
