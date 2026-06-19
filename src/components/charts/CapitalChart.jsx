/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartPlaceholder from './ChartPlaceholder';

const CapitalChart = ({ history, chart, height = 'h-36', refLines }) => {
  if (!history || history.length < 2) {
    return <ChartPlaceholder height={height} message="No data for this player yet." />;
  }

  const data = history.map((capital, turn) => ({ turn, capital }));

  return (
    <div className={height}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
          <XAxis dataKey="turn" tick={{ fill: chart.axis, fontSize: 12 }} stroke={chart.grid} />
          <YAxis tick={{ fill: chart.axis, fontSize: 12 }} stroke={chart.grid} />
          <Tooltip {...chart.tooltip} />
          {refLines?.map((ref) => (
            <ReferenceLine key={ref.label} y={ref.value} stroke={ref.color} strokeDasharray="4 4" strokeWidth={1.5} />
          ))}
          <Line type="monotone" dataKey="capital" stroke={chart.accent} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CapitalChart;
