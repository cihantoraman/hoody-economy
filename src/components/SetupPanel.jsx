/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import Card from './ui/Card';
import Icon from './ui/Icon';
import { ICON } from './ui/icons';
import MarketPanel from './MarketPanel';
import { PRODUCT_CATEGORIES } from '../constants/economy';

const INPUT = 'h-9 px-2 rounded-md border border-line bg-surface text-sm outline-none focus:border-accent';

const Field = ({ label, hint, children }) => (
  <div className="bg-surface-2 rounded-lg p-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">{label}</p>
    {children}
    {hint && <p className="text-[11px] text-muted mt-2">{hint}</p>}
  </div>
);

const PolicyButton = ({ active, icon, label, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`h-9 rounded-md font-semibold text-[11px] flex items-center justify-center gap-1 ${
      active ? 'bg-accent text-accent-fg' : 'border border-line text-muted hover:text-fg'
    }`}
  >
    <Icon path={icon} className="w-3.5 h-3.5" />
    {label}
  </button>
);

const SetupPanel = ({
  parameters,
  products,
  newProduct,
  onPlayerCount,
  onApplyPopulation,
  onNewProduct,
  onAddProduct,
  onRemoveProduct,
  onToggleRobinHood,
  onToggleBailout,
  onToggleEvents,
  onVolatility,
  onResetTutorial,
  onStart,
  tutorialSeen,
}) => (
  <div className="max-w-5xl mx-auto px-2">
    <Card className="p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Setup</h2>
        <span className="text-xs text-muted">Tune the economy, then press Ready</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start gap-3">
        <div className="flex flex-col gap-3 md:w-60 md:shrink-0">
          <Field label="Population" hint="Re-seeds the population.">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="1000"
                value={parameters.playerCount}
                onChange={(event) => onPlayerCount(event.target.value)}
                className={`w-full ${INPUT}`}
              />
              <button
                onClick={onApplyPopulation}
                title="Apply & reset"
                className="h-9 px-3 shrink-0 rounded-md border border-line text-xs font-semibold text-muted hover:text-fg flex items-center gap-1.5"
              >
                <Icon path={ICON.check} className="w-3.5 h-3.5" />
                Apply
              </button>
            </div>
          </Field>

          <Field label="Policies">
            <div className="grid grid-cols-3 gap-1.5">
              <PolicyButton active={parameters.robinHoodModeActive} icon={ICON.robin} label="Robin" onClick={onToggleRobinHood} title="Robin Hood redistribution" />
              <PolicyButton active={parameters.autoBailout} icon={ICON.bailout} label="Bailout" onClick={onToggleBailout} title="Poverty safety net" />
              <PolicyButton active={parameters.autoEvents} icon={ICON.bolt} label="Events" onClick={onToggleEvents} title="Random market events" />
            </div>
          </Field>
        </div>

        <div className="flex-1 min-w-0 md:h-[27rem]">
          <MarketPanel products={products} canEdit onRemove={onRemoveProduct} />
        </div>

        <div className="flex flex-col gap-3 md:w-60 md:shrink-0">
          <Field label="Add product" hint="Goes straight into the live market.">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Name"
                value={newProduct.name}
                onChange={(event) => onNewProduct({ ...newProduct, name: event.target.value })}
                className={INPUT}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(event) => onNewProduct({ ...newProduct, price: event.target.value })}
                  className={`w-20 ${INPUT}`}
                />
                <select
                  value={newProduct.category}
                  onChange={(event) => onNewProduct({ ...newProduct, category: event.target.value })}
                  className={`flex-1 min-w-0 ${INPUT}`}
                >
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={onAddProduct} className="h-9 w-full rounded-md bg-accent text-accent-fg text-xs font-semibold">
                Add product
              </button>
            </div>
          </Field>

          <Field label="Market volatility" hint="How sharply prices swing each week.">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={parameters.marketVolatility}
                onChange={(event) => onVolatility(parseFloat(event.target.value))}
                className="flex-grow"
              />
              <span className="text-sm font-semibold w-8 text-right">{parameters.marketVolatility}</span>
            </div>
          </Field>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-line">
        <button
          onClick={onResetTutorial}
          disabled={!tutorialSeen}
          className="text-xs font-semibold text-muted hover:text-fg disabled:opacity-50 disabled:hover:text-muted"
        >
          {tutorialSeen ? 'Reset tutorial' : 'Tutorial shows on first Ready'}
        </button>
        <button
          onClick={onStart}
          className="h-10 px-6 rounded-md font-semibold text-sm flex items-center gap-1.5 bg-accent text-accent-fg"
        >
          <Icon path={ICON.check} className="w-4 h-4" />
          Ready
        </button>
      </div>
    </Card>
  </div>
);

export default SetupPanel;
