-- Create likes table for posts
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can only like a post once
  UNIQUE(user_id, post_id)
);

-- Create indexes for better performance
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_created_at ON post_likes(created_at DESC);

-- Create composite index for quick lookups
CREATE INDEX idx_post_likes_relationship ON post_likes(post_id, user_id);

-- Add comments
COMMENT ON TABLE post_likes IS 'Stores likes on posts';
COMMENT ON COLUMN post_likes.user_id IS 'User who liked the post';
COMMENT ON COLUMN post_likes.post_id IS 'Post that was liked';

