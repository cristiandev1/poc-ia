import { NextResponse } from 'next/server';
import {
  getMetricsSummary,
  getTimelineData,
  getDeveloperStats,
  getOverviewStats,
} from '@/lib/database';

export async function GET() {
  try {
    const overview = getOverviewStats();
    const summary = getMetricsSummary();
    const timeline = getTimelineData(30);
    const devStats = getDeveloperStats();

    const report = {
      generated_at: new Date().toISOString(),
      overview,
      summary_by_tool: summary,
      timeline_30_days: timeline,
      developer_stats: devStats,
    };

    // Return as JSON for now (can be enhanced to PDF later)
    return NextResponse.json(report, {
      headers: {
        'Content-Disposition': `attachment; filename="ai-metrics-report-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
