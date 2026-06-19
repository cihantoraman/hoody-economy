/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TIERS } from '../../constants/economy';
import ChartPlaceholder from './ChartPlaceholder';

const ORDER = [...TIERS].reverse().map((tier) => tier.name); // Poor -> Elite (stack bottom to top)

const ClassDistributionChart = ({ data, tiers, chart }) => {
  if (data.length < 2) return <ChartPlaceholder message="Not enough data yet. Run a few turns." />;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
          <XAxis dataKey="turn" tick={{ fill: chart.axis, fontSize: 12 }} stroke={chart.grid} />
          <YAxis tick={{ fill: chart.axis, fontSize: 12 }} stroke={chart.grid} />
          <Tooltip {...chart.tooltip} />
          <Legend wrapperStyle={{ fontSize: 12, color: chart.axis }} />
          {ORDER.map((name) => (
            <Bar key={name} dataKey={name} stackId="classes" fill={tiers[name]} isAnimationActive={false} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClassDistributionChart;
