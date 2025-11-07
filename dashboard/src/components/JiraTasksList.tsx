'use client';

import { JiraTaskDetail } from '@/lib/database';
import { ExternalLink, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  tasks: JiraTaskDetail[];
  jiraUrl: string;
}

export default function JiraTasksList({ tasks, jiraUrl }: Props) {
  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('done') || statusLower.includes('conclu')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
    if (statusLower.includes('progress') || statusLower.includes('andamento')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('done') || statusLower.includes('conclu')) {
      return <CheckCircle className="w-4 h-4" />;
    }
    if (statusLower.includes('progress') || statusLower.includes('andamento')) {
      return <Clock className="w-4 h-4" />;
    }
    return <AlertCircle className="w-4 h-4" />;
  };

  const getVarianceColor = (estimate: number, logged: number) => {
    if (!estimate || !logged) return '';
    const variance = logged - estimate;
    if (variance > 0) return 'text-red-600 dark:text-red-400';
    if (variance < 0) return 'text-green-600 dark:text-green-400';
    return 'text-slate-600 dark:text-slate-400';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.length === 0 ? (
        <div className="col-span-full text-slate-500 text-center py-8">
          Nenhuma task encontrada. Execute `npm run sync-jira` primeiro.
        </div>
      ) : (
        tasks.map((task) => {
          const variance = task.estimate_hours && task.time_logged_hours
            ? task.time_logged_hours - task.estimate_hours
            : null;

          return (
            <a
              key={task.key}
              href={`${jiraUrl}/browse/${task.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white dark:bg-slate-800 rounded-lg shadow-md p-5 hover:shadow-lg transition-all border-l-4 border-indigo-500 hover:border-indigo-600"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {task.key}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${getStatusColor(task.status)}`}>
                  {getStatusIcon(task.status)}
                  {task.status}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 line-clamp-2">
                {task.title}
              </h3>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                {task.assignee_email && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Assignee:</span>
                    <span className="truncate">{task.assignee_email}</span>
                  </div>
                )}

                {(task.estimate_hours || task.time_logged_hours) && (
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded p-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-500">Estimado:</span>
                      <span className="font-semibold">
                        {task.estimate_hours ? `${task.estimate_hours.toFixed(1)}h` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-500">Real:</span>
                      <span className="font-semibold">
                        {task.time_logged_hours ? `${task.time_logged_hours.toFixed(1)}h` : 'N/A'}
                      </span>
                    </div>
                    {variance !== null && (
                      <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-600 pt-1 mt-1">
                        <span className="text-slate-500">Variação:</span>
                        <span className={`font-bold ${getVarianceColor(task.estimate_hours, task.time_logged_hours)}`}>
                          {variance > 0 ? '+' : ''}{variance.toFixed(1)}h
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {task.sprint && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Sprint:</span>
                    <span>{task.sprint}</span>
                  </div>
                )}
              </div>
            </a>
          );
        })
      )}
    </div>
  );
}
