'use client';

import { CommitDetail } from '@/lib/database';
import { GitCommit, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  commits: CommitDetail[];
  jiraUrl: string;
}

export default function CommitsList({ commits, jiraUrl }: Props) {
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

  const getCommitTypeColor = (type: string) => {
    switch (type) {
      case 'feat':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'fix':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'refactor':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  const handleCommitClick = (hash: string) => {
    // Copy hash to clipboard
    navigator.clipboard.writeText(hash);
    alert(`Hash copiado: ${hash.substring(0, 7)}`);
  };

  return (
    <div className="space-y-2">
      {commits.length === 0 ? (
        <p className="text-slate-500 text-center py-8 text-sm">
          Nenhum commit encontrado. Execute `npm run analyze` primeiro.
        </p>
      ) : (
        commits.map((commit) => (
          <div
            key={commit.hash}
            className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            onClick={() => handleCommitClick(commit.hash)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  <GitCommit className="w-3 h-3 text-slate-500 flex-shrink-0" />
                  <code className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                    {commit.hash.substring(0, 7)}
                  </code>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${getCommitTypeColor(commit.commit_type)}`}>
                    {commit.commit_type}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${getAIToolColor(commit.ai_tool)}`}>
                    {commit.ai_tool}
                  </span>
                  {commit.jira_id && (
                    <a
                      href={`${jiraUrl}/browse/${commit.jira_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 rounded text-xs font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                      {commit.jira_id}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                  {commit.time_spent_minutes && (
                    <span className="text-orange-600 dark:text-orange-400 font-semibold text-xs ml-auto">
                      ⏱️ {commit.time_spent_minutes}min
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 mb-1">
                  {commit.message}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="truncate">{commit.author_email}</span>
                  <span className="text-xs">{format(new Date(commit.timestamp), 'dd/MM HH:mm')}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
