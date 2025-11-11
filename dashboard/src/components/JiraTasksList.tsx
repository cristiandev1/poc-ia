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

  const getStatusIcon = (status: string, className: string = "w-4 h-4") => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('done') || statusLower.includes('conclu')) {
      return <CheckCircle className={className} />;
    }
    if (statusLower.includes('progress') || statusLower.includes('andamento')) {
      return <Clock className={className} />;
    }
    return <AlertCircle className={className} />;
  };

  const getVarianceColor = (estimate: number, logged: number) => {
    if (!estimate || !logged) return '';
    const variance = logged - estimate;
    if (variance > 0) return 'text-red-600 dark:text-red-400';
    if (variance < 0) return 'text-green-600 dark:text-green-400';
    return 'text-slate-600 dark:text-slate-400';
  };

  return (
    <div className="space-y-2">
      {tasks.length === 0 ? (
        <div className="text-slate-500 text-center py-8 text-sm">
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
              className="block bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-l-3 border-indigo-500"
            >
              <div className="flex items-start justify-between mb-1.5 gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                    {task.key}
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </div>
                <span className={`px-1.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1 ${getStatusColor(task.status)}`}>
                  {getStatusIcon(task.status, 'w-3 h-3')}
                  {task.status}
                </span>
              </div>

              <h3 className="text-xs font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                {task.title}
              </h3>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {task.assignee_email && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">Assignee:</span>
                    <span className="truncate text-xs">{task.assignee_email}</span>
                  </div>
                )}

                {(task.estimate_hours || task.time_logged_hours) && (
                  <div className="bg-white dark:bg-slate-800 rounded p-2">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                      <span className="text-slate-500">Estimado:</span>
                      <span className="font-semibold text-right">
                        {task.estimate_hours ? `${task.estimate_hours.toFixed(1)}h` : 'N/A'}
                      </span>
                      <span className="text-slate-500">Real:</span>
                      <span className="font-semibold text-right">
                        {task.time_logged_hours ? `${task.time_logged_hours.toFixed(1)}h` : 'N/A'}
                      </span>
                      {variance !== null && (
                        <>
                          <span className="text-slate-500">Variação:</span>
                          <span className={`font-bold text-right ${getVarianceColor(task.estimate_hours, task.time_logged_hours)}`}>
                            {variance > 0 ? '+' : ''}{variance.toFixed(1)}h
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {task.sprint && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">Sprint:</span>
                    <span className="text-xs truncate">{task.sprint}</span>
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
