-- Create chats table for storing user conversations
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  messages JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS chats_user_id_idx ON chats(user_id);

-- Create RLS policies for the chats table
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Policy for users to select only their own chats
CREATE POLICY select_own_chats ON chats
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to insert their own chats
CREATE POLICY insert_own_chats ON chats
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update only their own chats
CREATE POLICY update_own_chats ON chats
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy for users to delete only their own chats
CREATE POLICY delete_own_chats ON chats
  FOR DELETE
  USING (auth.uid() = user_id);
