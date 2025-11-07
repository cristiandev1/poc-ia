import Database from 'better-sqlite3';
import { join } from 'path';

const DB_PATH = join(process.cwd(), '..', '.ai-metrics.db');

export interface MetricsSummary {
  ai_tool: string;
  total_commits: number;
  avg_time_minutes: number;
  total_activities: number;
  total_time_minutes: number;
}

export interface TimelineData {
  date: string;
  ai_tool: string;
  commits_count: number;
  total_time_minutes: number;
}

export interface DeveloperStats {
  email: string;
  group_type: string;
  total_commits: number;
  total_activities: number;
  avg_time_per_commit: number;
  total_time_hours: number;
}

export interface JiraComparison {
  key: string;
  title: string;
  estimate_hours: number;
  time_logged_hours: number;
  ai_tool: string;
  variance_hours: number;
}

export function getDatabase() {
  return new Database(DB_PATH, { readonly: true });
}

export function getMetricsSummary(): MetricsSummary[] {
  const db = getDatabase();

  const result = db
    .prepare(
      `
    SELECT
      COALESCE(c.ai_tool, a.ai_tool) as ai_tool,
      COALESCE(c.total_commits, 0) as total_commits,
      COALESCE(c.avg_time_minutes, 0) as avg_time_minutes,
      COALESCE(a.total_activities, 0) as total_activities,
      COALESCE(a.total_time_minutes, 0) as total_time_minutes
    FROM (
      SELECT
        ai_tool,
        COUNT(*) as total_commits,
        AVG(time_spent_minutes) as avg_time_minutes
      FROM commits
      WHERE ai_tool IS NOT NULL
      GROUP BY ai_tool
    ) c
    FULL OUTER JOIN (
      SELECT
        ai_tool,
        COUNT(*) as total_activities,
        SUM(duration_minutes) as total_time_minutes
      FROM activities
      WHERE ai_tool IS NOT NULL
      GROUP BY ai_tool
    ) a ON c.ai_tool = a.ai_tool
  `
    )
    .all() as MetricsSummary[];

  db.close();
  return result;
}

export function getTimelineData(days: number = 30): TimelineData[] {
  const db = getDatabase();

  const result = db
    .prepare(
      `
    SELECT
      DATE(timestamp) as date,
      ai_tool,
      COUNT(*) as commits_count,
      SUM(COALESCE(time_spent_minutes, 0)) as total_time_minutes
    FROM commits
    WHERE ai_tool IS NOT NULL
      AND timestamp >= datetime('now', '-${days} days')
    GROUP BY DATE(timestamp), ai_tool
    ORDER BY date ASC
  `
    )
    .all() as TimelineData[];

  db.close();
  return result;
}

export function getDeveloperStats(): DeveloperStats[] {
  const db = getDatabase();

  const result = db
    .prepare(
      `
    SELECT
      d.email,
      d.group_type,
      COUNT(DISTINCT c.id) as total_commits,
      COUNT(DISTINCT a.id) as total_activities,
      AVG(c.time_spent_minutes) as avg_time_per_commit,
      (SUM(COALESCE(c.time_spent_minutes, 0)) + SUM(COALESCE(a.duration_minutes, 0))) / 60.0 as total_time_hours
    FROM developers d
    LEFT JOIN commits c ON d.email = c.author_email
    LEFT JOIN activities a ON d.email = a.author_email
    GROUP BY d.email, d.group_type
    ORDER BY total_time_hours DESC
  `
    )
    .all() as DeveloperStats[];

  db.close();
  return result;
}

export function getJiraComparison(): JiraComparison[] {
  const db = getDatabase();

  const result = db
    .prepare(
      `
    SELECT
      j.key,
      j.title,
      j.estimate_hours,
      j.time_logged_hours,
      c.ai_tool,
      (j.time_logged_hours - j.estimate_hours) as variance_hours
    FROM jira_tasks j
    LEFT JOIN commits c ON j.key = c.jira_id
    WHERE j.estimate_hours IS NOT NULL
      AND j.time_logged_hours IS NOT NULL
    GROUP BY j.key
    ORDER BY variance_hours ASC
  `
    )
    .all() as JiraComparison[];

  db.close();
  return result;
}

export function getOverviewStats() {
  const db = getDatabase();

  const stats = db
    .prepare(
      `
    SELECT
      (SELECT COUNT(*) FROM commits) as total_commits,
      (SELECT COUNT(*) FROM activities) as total_activities,
      (SELECT COUNT(DISTINCT author_email) FROM commits) as total_developers,
      (SELECT COUNT(*) FROM jira_tasks) as total_jira_tasks,
      (SELECT AVG(time_spent_minutes) FROM commits WHERE time_spent_minutes IS NOT NULL) as avg_commit_time
  `
    )
    .get() as any;

  db.close();
  return stats;
}
