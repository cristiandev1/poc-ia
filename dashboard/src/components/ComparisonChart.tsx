'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { MetricsSummary } from '@/lib/database';

interface Props {
  data: MetricsSummary[];
}

const COLORS = {
  copilot: '#3b82f6',
  devin: '#a855f7',
  'no-ai': '#6b7280',
};

export default function ComparisonChart({ data }: Props) {
  const chartData = data.map((item) => ({
    name: item.ai_tool.toUpperCase(),
    value: item.total_commits + item.total_activities,
    color: COLORS[item.ai_tool as keyof typeof COLORS],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
