import {
  getMetricsSummary,
  getTimelineData,
  getDeveloperStats,
  getOverviewStats,
} from '@/lib/database';
import { BarChart3, Users, GitCommit, Activity } from 'lucide-react';
import MetricsChart from '@/components/MetricsChart';
import TimelineChart from '@/components/TimelineChart';
import ComparisonChart from '@/components/ComparisonChart';

export const dynamic = 'force-dynamic';

export default function Home() {
  const overview = getOverviewStats();
  const summary = getMetricsSummary();
  const timeline = getTimelineData(30);
  const devStats = getDeveloperStats();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              AI Impact Metrics Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Análise de produtividade com IA - POC Banco Mobile
            </p>
          </div>
          <a
            href="/export"
            download
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Exportar Relatório JSON
          </a>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<GitCommit className="w-6 h-6" />}
            title="Total de Commits"
            value={overview.total_commits}
            color="blue"
          />
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            title="Atividades Registradas"
            value={overview.total_activities}
            color="green"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Desenvolvedores"
            value={overview.total_developers}
            color="purple"
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Tempo Médio/Commit"
            value={`${Math.round(overview.avg_commit_time)}min`}
            color="orange"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* AI Tools Comparison */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Comparativo por Ferramenta de IA
            </h2>
            <ComparisonChart data={summary} />
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Timeline (Últimos 30 dias)
            </h2>
            <TimelineChart data={timeline} />
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Métricas por Ferramenta
          </h2>
          <MetricsChart data={summary} />
        </div>

        {/* Developer Stats Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Estatísticas por Desenvolvedor
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3">Desenvolvedor</th>
                  <th className="px-6 py-3">Grupo</th>
                  <th className="px-6 py-3">Commits</th>
                  <th className="px-6 py-3">Atividades</th>
                  <th className="px-6 py-3">Tempo Médio</th>
                  <th className="px-6 py-3">Total de Horas</th>
                </tr>
              </thead>
              <tbody>
                {devStats.map((dev) => (
                  <tr
                    key={dev.email}
                    className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-6 py-4">{dev.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          dev.group_type === 'copilot'
                            ? 'bg-blue-100 text-blue-800'
                            : dev.group_type === 'devin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {dev.group_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{dev.total_commits}</td>
                    <td className="px-6 py-4">{dev.total_activities}</td>
                    <td className="px-6 py-4">
                      {Math.round(dev.avg_time_per_commit)}min
                    </td>
                    <td className="px-6 py-4">{dev.total_time_hours.toFixed(1)}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple:
      'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange:
      'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <div className={`inline-flex p-3 rounded-lg mb-4 ${colorClasses[color]}`}>
        {icon}
      </div>
      <h3 className="text-sm text-slate-600 dark:text-slate-400 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
