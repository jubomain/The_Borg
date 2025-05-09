-- Create a table for system settings including SMTP configuration
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the key column for faster lookups
CREATE INDEX IF NOT EXISTS system_settings_key_idx ON system_settings (key);

-- Insert default settings if needed
INSERT INTO system_settings (key, value)
VALUES 
  ('smtp_config', '{"host":"","port":"","username":"","password":"","fromEmail":"","fromName":"","secure":true}')
ON CONFLICT (key) DO NOTHING;
