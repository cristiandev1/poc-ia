-- Developers and their AI tool assignment
CREATE TABLE IF NOT EXISTS developers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  group_type TEXT CHECK(group_type IN ('copilot', 'devin', 'no-ai')) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Git commits analysis
CREATE TABLE IF NOT EXISTS commits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hash TEXT UNIQUE NOT NULL,
  author_email TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp DATETIME NOT NULL,
  commit_type TEXT, -- feat, fix, refactor, etc
  jira_id TEXT,
  ai_tool TEXT CHECK(ai_tool IN ('copilot', 'devin', 'no-ai')),
  time_spent_minutes INTEGER, -- calculated from time between commits
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_email) REFERENCES developers(email)
);

-- Manual activity tracking (non-code work)
CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_email TEXT NOT NULL,
  description TEXT NOT NULL,
  research_links TEXT, -- JSON array of links
  timestamp DATETIME NOT NULL,
  ai_tool TEXT CHECK(ai_tool IN ('copilot', 'devin', 'no-ai')),
  duration_minutes INTEGER NOT NULL,
  activity_type TEXT DEFAULT 'research', -- research, debug, meeting, etc
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_email) REFERENCES developers(email)
);

-- Jira tasks integration
CREATE TABLE IF NOT EXISTS jira_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  estimate_hours REAL,
  time_logged_hours REAL,
  status TEXT,
  sprint TEXT,
  assignee_email TEXT,
  created_date DATETIME,
  completed_date DATETIME,
  synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignee_email) REFERENCES developers(email)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_commits_author ON commits(author_email);
CREATE INDEX IF NOT EXISTS idx_commits_timestamp ON commits(timestamp);
CREATE INDEX IF NOT EXISTS idx_commits_jira ON commits(jira_id);
CREATE INDEX IF NOT EXISTS idx_activities_author ON activities(author_email);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp);
CREATE INDEX IF NOT EXISTS idx_jira_assignee ON jira_tasks(assignee_email);
