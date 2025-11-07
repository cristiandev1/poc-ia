'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TimelineData } from '@/lib/database';
import { format } from 'date-fns';

interface Props {
  data: TimelineData[];
}

export default function TimelineChart({ data }: Props) {
  // Group by date and aggregate by AI tool
  const groupedData = data.reduce((acc, item) => {
    const date = format(new Date(item.date), 'dd/MM');
    const existing = acc.find((d) => d.date === date);

    if (existing) {
      existing[item.ai_tool] = item.commits_count;
    } else {
      acc.push({
        date,
        [item.ai_tool]: item.commits_count,
      });
    }

    return acc;
  }, [] as any[]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={groupedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="copilot" stroke="#3b82f6" name="Copilot" strokeWidth={2} />
        <Line type="monotone" dataKey="devin" stroke="#a855f7" name="Devin" strokeWidth={2} />
        <Line type="monotone" dataKey="no-ai" stroke="#6b7280" name="Sem IA" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
