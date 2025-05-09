-- Create code_analysis table
CREATE TABLE IF NOT EXISTS code_analysis (
  id SERIAL PRIMARY KEY,
  code_quality INTEGER NOT NULL,
  suggestions JSONB NOT NULL,
  potential_improvements JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create code_stats table
CREATE TABLE IF NOT EXISTS code_stats (
  id SERIAL PRIMARY KEY,
  total_files INTEGER NOT NULL,
  total_lines INTEGER NOT NULL,
  component_count INTEGER NOT NULL,
  api_endpoints INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create evolution_tasks table
CREATE TABLE IF NOT EXISTS evolution_tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  code_changes TEXT
);

-- Create system_reports table
CREATE TABLE IF NOT EXISTS system_reports (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  performance_metrics JSONB NOT NULL,
  bot_metrics JSONB NOT NULL,
  workflow_metrics JSONB NOT NULL,
  improvement_suggestions JSONB NOT NULL,
  evolution_metrics JSONB NOT NULL
);

-- Create bot_strategies table
CREATE TABLE IF NOT EXISTS bot_strategies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  capabilities JSONB NOT NULL,
  integrations JSONB NOT NULL,
  specialization TEXT NOT NULL,
  learning_rate FLOAT NOT NULL,
  memory_capacity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create bots table
CREATE TABLE IF NOT EXISTS bots (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  strategy_id TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP WITH TIME ZONE,
  performance_score INTEGER NOT NULL,
  FOREIGN KEY (strategy_id) REFERENCES bot_strategies(id) ON DELETE CASCADE
);

-- Create bot_teams table
CREATE TABLE IF NOT EXISTS bot_teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  bots JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL
);

-- Create server_instances table
CREATE TABLE IF NOT EXISTS server_instances (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  specs JSONB NOT NULL,
  bots JSONB NOT NULL,
  metrics JSONB NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_evolution_tasks_status ON evolution_tasks(status);
CREATE INDEX IF NOT EXISTS idx_bots_strategy_id ON bots(strategy_id);
CREATE INDEX IF NOT EXISTS idx_bots_status ON bots(status);
CREATE INDEX IF NOT EXISTS idx_bot_teams_status ON bot_teams(status);
CREATE INDEX IF NOT EXISTS idx_server_instances_status ON server_instances(status);
