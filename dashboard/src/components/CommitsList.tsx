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
    <div className="space-y-3">
      {commits.length === 0 ? (
        <p className="text-slate-500 text-center py-8">
          Nenhum commit encontrado. Execute `npm run analyze` primeiro.
        </p>
      ) : (
        commits.map((commit) => (
          <div
            key={commit.hash}
            className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            onClick={() => handleCommitClick(commit.hash)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <GitCommit className="w-4 h-4 text-slate-500" />
                  <code className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                    {commit.hash.substring(0, 7)}
                  </code>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getCommitTypeColor(commit.commit_type)}`}>
                    {commit.commit_type}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getAIToolColor(commit.ai_tool)}`}>
                    {commit.ai_tool}
                  </span>
                  {commit.jira_id && (
                    <a
                      href={`${jiraUrl}/browse/${commit.jira_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 rounded text-xs font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                      {commit.jira_id}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {commit.message}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span>{commit.author_email}</span>
                  <span>{format(new Date(commit.timestamp), 'dd/MM/yyyy HH:mm')}</span>
                  {commit.time_spent_minutes && (
                    <span className="text-orange-600 dark:text-orange-400 font-semibold">
                      ⏱️ {commit.time_spent_minutes}min
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
