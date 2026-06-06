/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { CartesianGrid, Line, LineChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartPlaceholder from './ChartPlaceholder';

const toSeries = (productPrices) => {
  const names = Object.keys(productPrices);
  const length = names.reduce((max, name) => Math.max(max, productPrices[name].length), 0);

  const rows = [];
  for (let i = 0; i < length; i += 1) {
    const row = { turn: i * 10 };
    names.forEach((name) => {
      const point = productPrices[name][i];
      if (point) row[name] = point.price;
    });
    rows.push(row);
  }
  return { names, rows };
};

const ProductPricesChart = ({ productPrices, series, chart }) => {
  const { names, rows } = toSeries(productPrices);
  if (!names.length) return <ChartPlaceholder message="Prices are sampled every 10 turns. Keep running." />;

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
