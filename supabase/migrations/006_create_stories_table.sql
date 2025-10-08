-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX idx_stories_expires_at ON stories(expires_at);
CREATE INDEX idx_stories_user_created ON stories(user_id, created_at DESC);

-- Note: Partial index with NOW() removed as it's not IMMUTABLE
-- Filter for active stories will be done at query time using WHERE expires_at > NOW()

-- Add comments
COMMENT ON TABLE stories IS 'Stores user stories (24-hour temporary content)';
COMMENT ON COLUMN stories.user_id IS 'User who created the story';
COMMENT ON COLUMN stories.image IS 'URL to story image';
COMMENT ON COLUMN stories.expires_at IS 'When the story expires (24 hours from creation)';

-- Create story viewers table
CREATE TABLE IF NOT EXISTS story_viewers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can only view a story once (track first view)
  UNIQUE(story_id, user_id)
);

-- Create indexes for story viewers
CREATE INDEX idx_story_viewers_story_id ON story_viewers(story_id);
CREATE INDEX idx_story_viewers_user_id ON story_viewers(user_id);
CREATE INDEX idx_story_viewers_viewed_at ON story_viewers(viewed_at DESC);

COMMENT ON TABLE story_viewers IS 'Tracks who viewed each story';

-- Create function to clean up expired stories
CREATE OR REPLACE FUNCTION delete_expired_stories()
RETURNS void AS $$
BEGIN
  DELETE FROM stories WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired stories (requires pg_cron extension)
-- You can also run this manually or via a cron job
COMMENT ON FUNCTION delete_expired_stories() IS 'Deletes stories that have expired (older than 24 hours)';

