-- Create view for user profiles with follower/following counts
CREATE OR REPLACE VIEW user_profiles AS
SELECT 
  u.id,
  u.username,
  u.email,
  u.full_name,
  u.bio,
  u.avatar,
  u.is_private,
  u.created_at,
  u.updated_at,
  (SELECT COUNT(*) FROM followers WHERE following_id = u.id) as followers_count,
  (SELECT COUNT(*) FROM followers WHERE follower_id = u.id) as following_count,
  (SELECT COUNT(*) FROM posts WHERE user_id = u.id) as posts_count
FROM users u;

COMMENT ON VIEW user_profiles IS 'User profiles with follower/following/post counts';

-- Create view for posts with like/comment counts
CREATE OR REPLACE VIEW posts_with_counts AS
SELECT 
  p.*,
  u.username,
  u.full_name,
  u.avatar as user_avatar,
  (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
  (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
FROM posts p
JOIN users u ON p.user_id = u.id;

COMMENT ON VIEW posts_with_counts IS 'Posts with like and comment counts';

-- Create view for comments with like counts
CREATE OR REPLACE VIEW comments_with_counts AS
SELECT 
  c.*,
  u.username,
  u.full_name,
  u.avatar as user_avatar,
  (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as likes_count
FROM comments c
JOIN users u ON c.user_id = u.id;

COMMENT ON VIEW comments_with_counts IS 'Comments with like counts and user info';

-- Create view for active stories (not expired) with viewer counts
CREATE OR REPLACE VIEW active_stories AS
SELECT 
  s.*,
  u.username,
  u.full_name,
  u.avatar as user_avatar,
  (SELECT COUNT(*) FROM story_viewers WHERE story_id = s.id) as viewers_count
FROM stories s
JOIN users u ON s.user_id = u.id
WHERE s.expires_at > NOW();

COMMENT ON VIEW active_stories IS 'Active (non-expired) stories with viewer counts';

-- Function to get user feed (posts from followed users)
CREATE OR REPLACE FUNCTION get_user_feed(p_user_id UUID, p_limit INT DEFAULT 20, p_offset INT DEFAULT 0)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  username VARCHAR,
  full_name VARCHAR,
  user_avatar TEXT,
  caption TEXT,
  location VARCHAR,
  type VARCHAR,
  images JSONB,
  videos JSONB,
  tags JSONB,
  mentions JSONB,
  filters JSONB,
  crop JSONB,
  sound JSONB,
  likes_count BIGINT,
  comments_count BIGINT,
  is_liked BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    u.username,
    u.full_name,
    u.avatar as user_avatar,
    p.caption,
    p.location,
    p.type,
    p.images,
    p.videos,
    p.tags,
    p.mentions,
    p.filters,
    p.crop,
    p.sound,
    (SELECT COUNT(*)::BIGINT FROM post_likes WHERE post_id = p.id) as likes_count,
    (SELECT COUNT(*)::BIGINT FROM comments WHERE post_id = p.id) as comments_count,
    EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = p_user_id) as is_liked,
    p.created_at,
    p.updated_at
  FROM posts p
  JOIN users u ON p.user_id = u.id
  WHERE p.user_id IN (
    SELECT following_id FROM followers WHERE follower_id = p_user_id
    UNION
    SELECT p_user_id
  )
  ORDER BY p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_user_feed IS 'Get feed posts for a user (from followed users)';

-- Function to get conversation list
CREATE OR REPLACE FUNCTION get_conversations(p_user_id UUID)
RETURNS TABLE (
  other_user_id UUID,
  other_username VARCHAR,
  other_full_name VARCHAR,
  other_avatar TEXT,
  last_message_id UUID,
  last_message_text TEXT,
  last_message_created_at TIMESTAMP WITH TIME ZONE,
  unread_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH user_messages AS (
    SELECT 
      CASE 
        WHEN sender_id = p_user_id THEN receiver_id
        ELSE sender_id
      END as other_user,
      id,
      text,
      created_at,
      ROW_NUMBER() OVER (
        PARTITION BY 
          CASE 
            WHEN sender_id = p_user_id THEN receiver_id
            ELSE sender_id
          END
        ORDER BY created_at DESC
      ) as rn
    FROM messages
    WHERE sender_id = p_user_id OR receiver_id = p_user_id
  )
  SELECT 
    u.id as other_user_id,
    u.username as other_username,
    u.full_name as other_full_name,
    u.avatar as other_avatar,
    um.id as last_message_id,
    um.text as last_message_text,
    um.created_at as last_message_created_at,
    (
      SELECT COUNT(*)::BIGINT 
      FROM messages 
      WHERE sender_id = u.id 
        AND receiver_id = p_user_id 
        AND is_read = FALSE
    ) as unread_count
  FROM user_messages um
  JOIN users u ON um.other_user = u.id
  WHERE um.rn = 1
  ORDER BY um.created_at DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_conversations IS 'Get list of conversations for a user with unread counts';

-- Function to search users
CREATE OR REPLACE FUNCTION search_users(p_query TEXT, p_limit INT DEFAULT 10)
RETURNS TABLE (
  id UUID,
  username VARCHAR,
  full_name VARCHAR,
  avatar TEXT,
  bio VARCHAR,
  followers_count BIGINT,
  following_count BIGINT,
  is_private BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.username,
    u.full_name,
    u.avatar,
    u.bio,
    (SELECT COUNT(*)::BIGINT FROM followers WHERE following_id = u.id) as followers_count,
    (SELECT COUNT(*)::BIGINT FROM followers WHERE follower_id = u.id) as following_count,
    u.is_private
  FROM users u
  WHERE 
    u.username ILIKE '%' || p_query || '%' OR
    u.full_name ILIKE '%' || p_query || '%'
  ORDER BY 
    -- Exact match first
    CASE 
      WHEN u.username = p_query THEN 0
      WHEN u.username ILIKE p_query || '%' THEN 1
      ELSE 2
    END,
    -- Then by follower count
    (SELECT COUNT(*) FROM followers WHERE following_id = u.id) DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION search_users IS 'Search users by username or full name';

