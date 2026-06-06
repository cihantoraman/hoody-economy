/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import Card from './ui/Card';
import Icon from './ui/Icon';
import Trend from './ui/Trend';
import { ICON } from './ui/icons';

const Meter = ({ label, value }) => (
  <div className="flex items-center gap-1.5 flex-1 min-w-0">
    <span className="text-[11px] text-muted w-12 shrink-0">{label}</span>
    <div className="flex-1 h-1 rounded-full bg-line overflow-hidden">
      <div className="h-full bg-accent rounded-full" style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  </div>
);

const priceColor = (product) => {
  if (product.price > product.basePrice) return 'text-accent';
  if (product.price < product.basePrice) return 'text-danger';
  return 'text-fg';
};

const MarketPanel = ({ products, canEdit, onRemove }) => (
  <Card className="p-4">
    <h2 className="font-semibold text-lg mb-3">Market</h2>
    <div className="max-h-72 overflow-y-auto pr-1 space-y-1">
      {products.map((product) => (
        <div key={product.id} className="rounded-lg bg-surface-2 px-3 py-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-sm truncate">{product.name}</span>
              <span className="text-[10px] uppercase tracking-wide text-muted border border-line rounded px-1.5 py-0.5 shrink-0">
                {product.category}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`font-semibold tabular-nums inline-flex items-center gap-0.5 ${priceColor(product)}`}>
                {product.price}
                <Trend value={product.lastChange} />
              </span>
              {canEdit && (
                <button onClick={() => onRemove(product.id)} title="Remove product" className="text-muted hover:text-danger">
                  <Icon path={ICON.close} className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <Meter label="Demand" value={product.demand} />
            <Meter label="Supply" value={product.supply} />
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export default MarketPanel;
