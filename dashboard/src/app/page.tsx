import {
  getMetricsSummary,
  getTimelineData,
  getDeveloperStats,
  getOverviewStats,
  getRecentCommits,
  getJiraTasks,
  getAllDevelopers,
} from '@/lib/database';
import DashboardClient from '@/components/DashboardClient';

export const dynamic = 'force-dynamic';

export default function Home() {
  const initialData = {
    overview: getOverviewStats(),
    summary: getMetricsSummary(),
    timeline: getTimelineData(30),
    devStats: getDeveloperStats(),
    recentCommits: getRecentCommits(15),
    jiraTasks: getJiraTasks(),
    developers: getAllDevelopers(),
  };

  return <DashboardClient initialData={initialData} />;
}
