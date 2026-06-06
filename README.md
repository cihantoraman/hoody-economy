# Hoody Economy

A gamified, cyclical-capital economy simulation. Wealth never piles up: agents keep
trading, the rich are taxed to lift the poor, market shocks move prices, and market
manipulation is policed. The money supply is fixed, so capital only ever moves between
players and a shared treasury, never minted or destroyed.

It runs on a real econophysics model rather than ad-hoc rules, so the inequality it
produces is the kind seen in actual economies.

<!-- Add a screenshot here, e.g. ![Hoody Economy dashboard](docs/screenshot.png) -->

## The model

Wealth evolves through a **kinetic wealth-exchange** process from econophysics:

- Each week, active agents are shuffled and paired. Every agent keeps a **saving
  fraction** (its saving propensity, set by its strategy) and the pair randomly splits
  the rest of their pooled wealth. A pair always conserves its total, so wealth is
  reshuffled, never created (Chakraborti and Chakrabarti, 2000).
- Because the saving fraction differs between strategies, the distribution develops the
  realistic **heavy-tailed (Pareto)** shape of real economies (Chatterjee, Chakrabarti
  and Manna, 2004).
- On top of the exchange, a **progressive tax** on above-average wealth funds a **flat
  transfer** (a basic income), with a **means-tested safety net** when poverty spikes.
  Inequality is tracked with the **Gini coefficient** and class mobility with a
  Shorrocks-style share-of-movers metric.
- **Conservation invariant:** `sum(player.capital) + treasury` equals the fixed money
  supply every week. This is enforced in the engine and covered by unit tests.

Social classes are relative (multiples of the live average capital), so they scale with
any population or money supply and never collapse into a single class.

### References

- A. Chakraborti, B. K. Chakrabarti (2000). *Statistical mechanics of money: how saving
  propensity affects its distribution.* Eur. Phys. J. B 17, 167-170.
- A. Chatterjee, B. K. Chakrabarti, S. S. Manna (2004). *Pareto law in a kinetic model of
  market with random saving propensity.* Physica A 335, 155-163.
- C. Gini (1912). *Variabilita e mutabilita* (the Gini coefficient).

## Features

- Pure, deterministic simulation engine (`src/engine/economy.js`), unit-tested for money
  conservation, bounded history, a non-collapsing class distribution, calm default-player
  volatility, and a self-limiting justice system.
- Pre-game setup: population size, market products (add or remove your own), market
  volatility, and policy toggles (redistribution, safety net, random market events).
- Live dashboard: your player's standing, the social-class mix, the market with
  demand/supply, an event and message log, and analytics (Gini over time, class
  evolution, product prices, and any player's capital history against the richest,
  average and poorest).
- Light and dark themes driven by a single swappable accent token.

## Run locally

Requires Node 18 or newer.

```bash
npm install
npm start      # dev server at http://localhost:3000
npm test       # engine + app tests
npm run build  # optimized production build into ./build
```

## Deploy

This is a static single-page app, so any static host works. Vercel is the simplest:

1. Push the repo to GitHub.
2. On [vercel.com](https://vercel.com): **New Project -> Import** this repo. Vercel
   auto-detects Create React App (build command `npm run build`, output directory
   `build`); no configuration is needed. Click **Deploy**.
3. You get a URL such as `hoody-economy.vercel.app`.

### Surfacing it on a Wix site

Add a button or a dedicated page on Wix that links out to the Vercel URL (best for a
wide, full-screen dashboard), or embed it inline with **Add -> Embed -> Embed a Site**
and paste the URL into a tall frame.

## License

MIT. Copyright (c) 2026 Cihan Toraman. See [LICENSE](LICENSE).
