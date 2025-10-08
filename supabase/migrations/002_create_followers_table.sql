-- Create followers/following relationship table
CREATE TABLE IF NOT EXISTS followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can't follow the same user twice
  UNIQUE(follower_id, following_id),
  
  -- Ensure a user can't follow themselves
  CHECK (follower_id != following_id)
);

-- Create indexes for better performance
CREATE INDEX idx_followers_follower_id ON followers(follower_id);
CREATE INDEX idx_followers_following_id ON followers(following_id);
CREATE INDEX idx_followers_created_at ON followers(created_at DESC);

-- Create composite index for quick lookups
CREATE INDEX idx_followers_relationship ON followers(follower_id, following_id);

-- Add comments
COMMENT ON TABLE followers IS 'Stores follower/following relationships between users';
COMMENT ON COLUMN followers.follower_id IS 'User who is following';
COMMENT ON COLUMN followers.following_id IS 'User being followed';

