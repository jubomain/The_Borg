-- Create workflows table
CREATE TABLE IF NOT EXISTS workflows (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  nodes JSONB,
  edges JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create agent_states table
CREATE TABLE IF NOT EXISTS agent_states (
  id SERIAL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  workflow_id TEXT NOT NULL,
  state JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
);

-- Create workflow_executions table
CREATE TABLE IF NOT EXISTS workflow_executions (
  id SERIAL PRIMARY KEY,
  workflow_id TEXT NOT NULL,
  status TEXT NOT NULL,
  logs JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
);

-- Create workflow_triggers table
CREATE TABLE IF NOT EXISTS workflow_triggers (
  id SERIAL PRIMARY KEY,
  workflow_id TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  config JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_agent_states_workflow_id ON agent_states(workflow_id);
CREATE INDEX IF NOT EXISTS idx_agent_states_agent_id ON agent_states(agent_id);
CREATE INDEX IF NOT EXISTS idx_workflow_triggers_workflow_id ON workflow_triggers(workflow_id);
