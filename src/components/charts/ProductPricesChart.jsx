/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { CartesianGrid, Line, LineChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartPlaceholder from './ChartPlaceholder';

const toSeries = (productPrices) => {
  const names = Object.keys(productPrices);
  const byTurn = new Map();
  names.forEach((name) => {
    productPrices[name].forEach((point) => {
      const row = byTurn.get(point.turn) ?? { turn: point.turn };
      row[name] = point.price;
      byTurn.set(point.turn, row);
    });
  });
  const rows = [...byTurn.values()].sort((a, b) => a.turn - b.turn);
  return { names, rows };
};

const ProductPricesChart = ({ productPrices, series, chart }) => {
  const { names, rows } = toSeries(productPrices);
  if (!rows.length) return <ChartPlaceholder message="No price history yet. Run a few weeks." />;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
          <XAxis dataKey="turn" tick={{ fill: chart.axis, fontSize: 12 }} stroke={chart.grid} />
          <YAxis tick={{ fill: chart.axis, fontSize: 12 }} stroke={chart.grid} />
          <Tooltip {...chart.tooltip} />
          <Legend wrapperStyle={{ fontSize: 12, color: chart.axis }} />
          {names.map((name, index) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={series[index % series.length]}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductPricesChart;
