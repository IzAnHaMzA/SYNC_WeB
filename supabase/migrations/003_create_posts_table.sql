-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caption TEXT DEFAULT '',
  location VARCHAR(255) DEFAULT '',
  type VARCHAR(20) NOT NULL DEFAULT 'image' CHECK (type IN ('image', 'video')),
  
  -- Media URLs (stored as JSON arrays)
  images JSONB DEFAULT '[]'::jsonb,
  videos JSONB DEFAULT '[]'::jsonb,
  
  -- Tags and mentions (stored as JSON arrays)
  tags JSONB DEFAULT '[]'::jsonb,
  mentions JSONB DEFAULT '[]'::jsonb,
  
  -- Filters (stored as JSON object)
  filters JSONB DEFAULT '{
    "brightness": 100,
    "contrast": 100,
    "saturation": 100,
    "blur": 0,
    "sepia": 0
  }'::jsonb,
  
  -- Crop settings (stored as JSON object)
  crop JSONB DEFAULT '{
    "x": 0,
    "y": 0,
    "width": 100,
    "height": 100
  }'::jsonb,
  
  -- Sound settings (stored as JSON object)
  sound JSONB DEFAULT '{
    "enabled": false,
    "volume": 50,
    "track": null
  }'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);

-- Create GIN indexes for JSONB columns for efficient searching
CREATE INDEX idx_posts_tags ON posts USING GIN (tags);
CREATE INDEX idx_posts_mentions ON posts USING GIN (mentions);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add constraints
ALTER TABLE posts ADD CONSTRAINT caption_length CHECK (char_length(caption) <= 2200);

-- Add comments
COMMENT ON TABLE posts IS 'Stores user posts (images and videos)';
COMMENT ON COLUMN posts.user_id IS 'Reference to the user who created the post';
COMMENT ON COLUMN posts.caption IS 'Post caption, max 2200 characters';
COMMENT ON COLUMN posts.location IS 'Location tag for the post';
COMMENT ON COLUMN posts.type IS 'Type of post: image or video';
COMMENT ON COLUMN posts.images IS 'Array of image URLs';
COMMENT ON COLUMN posts.videos IS 'Array of video URLs';
COMMENT ON COLUMN posts.tags IS 'Array of hashtags';
COMMENT ON COLUMN posts.mentions IS 'Array of mentioned usernames';
COMMENT ON COLUMN posts.filters IS 'Image filter settings';
COMMENT ON COLUMN posts.crop IS 'Image crop settings';
COMMENT ON COLUMN posts.sound IS 'Video sound settings';

