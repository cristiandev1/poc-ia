'use client';

import { ActivityDetail } from '@/lib/database';
import { Activity, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  activities: ActivityDetail[];
}

export default function ActivitiesList({ activities }: Props) {
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

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'research':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400';
      case 'meeting':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'code-review':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'documentation':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'planning':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400';
    }
  };

  const getActivityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      research: 'Pesquisa/Debug',
      meeting: 'Reunião',
      'code-review': 'Code Review',
      documentation: 'Documentação',
      planning: 'Planejamento',
      other: 'Outro',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-2">
      {activities.length === 0 ? (
        <p className="text-slate-500 text-center py-8 text-sm">
          Nenhuma atividade registrada. Use `ai-metrics track` para registrar atividades manuais.
        </p>
      ) : (
        activities.map((activity) => {
          const links = activity.research_links ? JSON.parse(activity.research_links) : [];

          return (
            <div
              key={activity.id}
              className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <Activity className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${getActivityTypeColor(activity.activity_type)}`}>
                      {getActivityTypeLabel(activity.activity_type)}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${getAIToolColor(activity.ai_tool)}`}>
                      {activity.ai_tool}
                    </span>
                    <span className="text-orange-600 dark:text-orange-400 font-semibold text-xs ml-auto">
                      ⏱️ {activity.duration_minutes}min
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mb-1.5 line-clamp-2">
                    {activity.description}
                  </p>
                  {links.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {links.map((link: string, idx: number) => (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded text-xs hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          Link {idx + 1}
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="truncate">{activity.author_email}</span>
                    <span>{format(new Date(activity.timestamp), 'dd/MM HH:mm')}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
