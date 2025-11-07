import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), '.ai-metrics.db');

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL'); // Better performance
    initializeSchema();
  }
  return db;
}

function initializeSchema() {
  if (!db) return;

  const schemaPath = join(__dirname, 'schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');

  db.exec(schema);
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

// Types
export interface Developer {
  id?: number;
  name: string;
  email: string;
  group_type: 'copilot' | 'devin' | 'no-ai';
  created_at?: string;
}

export interface Commit {
  id?: number;
  hash: string;
  author_email: string;
  message: string;
  timestamp: string;
  commit_type?: string;
  jira_id?: string;
  ai_tool?: 'copilot' | 'devin' | 'no-ai';
  time_spent_minutes?: number;
  created_at?: string;
}

export interface Activity {
  id?: number;
  author_email: string;
  description: string;
  research_links?: string; // JSON string
  timestamp: string;
  ai_tool?: 'copilot' | 'devin' | 'no-ai';
  duration_minutes: number;
  activity_type?: string;
  created_at?: string;
}

export interface JiraTask {
  id?: number;
  key: string;
  title: string;
  estimate_hours?: number;
  time_logged_hours?: number;
  status?: string;
  sprint?: string;
  assignee_email?: string;
  created_date?: string;
  completed_date?: string;
  synced_at?: string;
}
