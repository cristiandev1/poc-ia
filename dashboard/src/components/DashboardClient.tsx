'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Users, GitCommit, Activity, Filter } from 'lucide-react';
import MetricsChart from './MetricsChart';
import TimelineChart from './TimelineChart';
import ComparisonChart from './ComparisonChart';
import CommitsList from './CommitsList';
import ActivitiesList from './ActivitiesList';
import JiraTasksList from './JiraTasksList';

const JIRA_URL = process.env.NEXT_PUBLIC_JIRA_URL || 'https://cristiancastrodevs.atlassian.net';

interface DashboardData {
  overview: any;
  summary: any[];
  timeline: any[];
  devStats: any[];
  recentCommits: any[];
  recentActivities: any[];
  jiraTasks: any[];
  developers: Array<{ email: string; name: string; group_type: string }>;
}

export default function DashboardClient({ initialData }: { initialData: DashboardData }) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedDeveloper === 'all') {
        setData(initialData);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/metrics?developer=${selectedDeveloper}`);
        const newData = await response.json();
        setData(newData);
      } catch (error) {
        console.error('Error fetching filtered data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDeveloper, initialData]);

  const getAIToolColor = (tool: string) => {
    switch (tool) {
      case 'copilot':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'devin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'no-ai':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedDev = data.developers.find((d) => d.email === selectedDeveloper);

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
          <div className="flex gap-3">
            {/* Developer Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={selectedDeveloper}
                onChange={(e) => setSelectedDeveloper(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none min-w-[250px]"
                disabled={loading}
              >
                <option value="all">Todos os Desenvolvedores</option>
                {data.developers.map((dev) => (
                  <option key={dev.email} value={dev.email}>
                    {dev.name} ({dev.group_type})
                  </option>
                ))}
              </select>
            </div>
            <a
              href="/export"
              download
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Exportar Relatório JSON
            </a>
          </div>
        </header>

        {/* Filter Badge */}
        {selectedDeveloper !== 'all' && selectedDev && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-slate-600 dark:text-slate-400">Filtrando por:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getAIToolColor(selectedDev.group_type)}`}>
              {selectedDev.name} - {selectedDev.group_type.toUpperCase()}
            </span>
            <button
              onClick={() => setSelectedDeveloper('all')}
              className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
            >
              Limpar filtro
            </button>
          </div>
        )}

        {loading && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
            <span className="text-blue-700 dark:text-blue-400">Carregando dados filtrados...</span>
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<GitCommit className="w-6 h-6" />}
            title="Total de Commits"
            value={data.overview.total_commits}
            color="blue"
          />
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            title="Atividades Registradas"
            value={data.overview.total_activities}
            color="green"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Desenvolvedores"
            value={data.overview.total_developers}
            color="purple"
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Tempo Médio/Commit"
            value={`${Math.round(data.overview.avg_commit_time || 0)}min`}
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
            {data.summary.length > 0 ? (
              <ComparisonChart data={data.summary} />
            ) : (
              <p className="text-slate-500 text-center py-8">Nenhum dado disponível</p>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Timeline (Últimos 30 dias)
            </h2>
            {data.timeline.length > 0 ? (
              <TimelineChart data={data.timeline} />
            ) : (
              <p className="text-slate-500 text-center py-8">Nenhum dado disponível</p>
            )}
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Métricas por Ferramenta
          </h2>
          {data.summary.length > 0 ? (
            <MetricsChart data={data.summary} />
          ) : (
            <p className="text-slate-500 text-center py-8">Nenhum dado disponível</p>
          )}
        </div>

        {/* Lists Grid - 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Jira Tasks */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Tasks do Jira ({data.jiraTasks.length})
            </h2>
            <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
              <JiraTasksList tasks={data.jiraTasks} jiraUrl={JIRA_URL} />
            </div>
          </div>

          {/* Recent Commits */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Commits Recentes ({data.recentCommits.length})
              <span className="block text-xs font-normal text-slate-500 mt-1">
                Clique para copiar o hash
              </span>
            </h2>
            <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
              <CommitsList commits={data.recentCommits} jiraUrl={JIRA_URL} />
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Atividades Manuais ({data.recentActivities.length})
            </h2>
            <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
              <ActivitiesList activities={data.recentActivities} />
            </div>
          </div>
        </div>

        {/* Developer Stats Table */}
        {selectedDeveloper === 'all' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Estatísticas por Desenvolvedor ({data.devStats.length})
              <span className="block text-sm font-normal text-slate-500 mt-1">
                Clique em um desenvolvedor para filtrar
              </span>
            </h2>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-700 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Desenvolvedor</th>
                    <th className="px-4 py-3 text-center">Grupo</th>
                    <th className="px-4 py-3 text-center">Commits</th>
                    <th className="px-4 py-3 text-center">Atividades</th>
                    <th className="px-4 py-3 text-center">Tempo Médio</th>
                    <th className="px-4 py-3 text-center">Total de Horas</th>
                  </tr>
                </thead>
                <tbody>
                  {data.devStats.map((dev: any) => (
                    <tr
                      key={dev.email}
                      className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedDeveloper(dev.email)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">{dev.email}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            dev.group_type === 'copilot'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : dev.group_type === 'devin'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                          }`}
                        >
                          {dev.group_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">{dev.total_commits}</td>
                      <td className="px-4 py-3 text-center font-semibold">{dev.total_activities}</td>
                      <td className="px-4 py-3 text-center text-orange-600 dark:text-orange-400 font-semibold">
                        {Math.round(dev.avg_time_per_commit)}min
                      </td>
                      <td className="px-4 py-3 text-center text-green-600 dark:text-green-400 font-bold">
                        {dev.total_time_hours.toFixed(1)}h
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
