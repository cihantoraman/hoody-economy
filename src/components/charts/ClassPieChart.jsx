/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const ClassPieChart = ({ data, chart }) => (
  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={80}
          stroke={chart.surface}
          strokeWidth={2}
          isAnimationActive={false}
          label={({ name, percent, x, y, textAnchor }) => (
            <text x={x} y={y} fill={chart.axis} textAnchor={textAnchor} dominantBaseline="central" fontSize={12}>
              {`${name}: ${(percent * 100).toFixed(0)}%`}
            </text>
          )}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip {...chart.tooltip} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default ClassPieChart;
