import { NextRequest, NextResponse } from 'next/server';
import {
  getMetricsSummary,
  getTimelineData,
  getDeveloperStats,
  getOverviewStats,
  getRecentCommits,
  getJiraTasks,
  getAllDevelopers,
} from '@/lib/database';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const developerEmail = searchParams.get('developer') || undefined;

  try {
    const data = {
      overview: getOverviewStats(developerEmail),
      summary: getMetricsSummary(developerEmail),
      timeline: getTimelineData(30, developerEmail),
      devStats: getDeveloperStats(),
      recentCommits: getRecentCommits(15, developerEmail),
      jiraTasks: getJiraTasks(developerEmail),
      developers: getAllDevelopers(),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
