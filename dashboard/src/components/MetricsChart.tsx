'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MetricsSummary } from '@/lib/database';

interface Props {
  data: MetricsSummary[];
}

export default function MetricsChart({ data }: Props) {
  const chartData = data.map((item) => ({
    name: item.ai_tool.toUpperCase(),
    commits: item.total_commits,
    atividades: item.total_activities,
    tempoMedio: Math.round(item.avg_time_minutes),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="commits" fill="#3b82f6" name="Commits" />
        <Bar dataKey="atividades" fill="#10b981" name="Atividades" />
        <Bar dataKey="tempoMedio" fill="#f59e0b" name="Tempo Médio (min)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
