-- Create table for GitHub trending repositories
CREATE TABLE IF NOT EXISTS github_trending (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL UNIQUE,
  language TEXT,
  stars INTEGER NOT NULL DEFAULT 0,
  forks INTEGER NOT NULL DEFAULT 0,
  today_stars INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE,
  topics JSONB,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for system health monitoring
CREATE TABLE IF NOT EXISTS system_health (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for repository analysis results
CREATE TABLE IF NOT EXISTS repository_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repo_url TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  compatible BOOLEAN NOT NULL,
  score INTEGER NOT NULL,
  reasoning TEXT,
  implementation_steps JSONB,
  potential_improvements JSONB,
  technical_requirements JSONB,
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create table for AI discussions
CREATE TABLE IF NOT EXISTS ai_discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic TEXT NOT NULL,
  messages JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create index for repository URL
CREATE INDEX IF NOT EXISTS idx_repository_analysis_repo_url ON repository_analysis(repo_url);

-- Create index for AI discussions topic
CREATE INDEX IF NOT EXISTS idx_ai_discussions_topic ON ai_discussions(topic);
