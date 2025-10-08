-- ========================================
-- INSTOK - Complete Supabase Database Setup
-- Run this entire file in Supabase SQL Editor
-- ========================================

-- ========================================
-- 1. CREATE USERS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(50) NOT NULL,
  bio VARCHAR(150) DEFAULT '',
  avatar TEXT DEFAULT '',
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE users ADD CONSTRAINT username_length CHECK (char_length(username) >= 3);
ALTER TABLE users ADD CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- ========================================
-- 2. CREATE FOLLOWERS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_followers_follower_id ON followers(follower_id);
CREATE INDEX idx_followers_following_id ON followers(following_id);
CREATE INDEX idx_followers_created_at ON followers(created_at DESC);
CREATE INDEX idx_followers_relationship ON followers(follower_id, following_id);

-- ========================================
-- 3. CREATE POSTS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caption TEXT DEFAULT '',
  location VARCHAR(255) DEFAULT '',
  type VARCHAR(20) NOT NULL DEFAULT 'image' CHECK (type IN ('image', 'video')),
  images JSONB DEFAULT '[]'::jsonb,
  videos JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  mentions JSONB DEFAULT '[]'::jsonb,
  filters JSONB DEFAULT '{"brightness": 100, "contrast": 100, "saturation": 100, "blur": 0, "sepia": 0}'::jsonb,
  crop JSONB DEFAULT '{"x": 0, "y": 0, "width": 100, "height": 100}'::jsonb,
  sound JSONB DEFAULT '{"enabled": false, "volume": 50, "track": null}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN (tags);
CREATE INDEX idx_posts_mentions ON posts USING GIN (mentions);

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE posts ADD CONSTRAINT caption_length CHECK (char_length(caption) <= 2200);

-- ========================================
-- 4. CREATE POST LIKES TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_created_at ON post_likes(created_at DESC);
CREATE INDEX idx_post_likes_relationship ON post_likes(post_id, user_id);

-- ========================================
-- 5. CREATE COMMENTS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_comments_post_created ON comments(post_id, created_at DESC);

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE comments ADD CONSTRAINT comment_text_length CHECK (char_length(text) > 0 AND char_length(text) <= 1000);

CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, comment_id)
);

CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);
CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_relationship ON comment_likes(comment_id, user_id);

-- ========================================
-- 6. CREATE STORIES TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX idx_stories_expires_at ON stories(expires_at);
CREATE INDEX idx_stories_user_created ON stories(user_id, created_at DESC);
-- Note: Removed partial index with NOW() as it's not IMMUTABLE
-- Filter for active stories will be done at query time

CREATE TABLE IF NOT EXISTS story_viewers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(story_id, user_id)
);

CREATE INDEX idx_story_viewers_story_id ON story_viewers(story_id);
CREATE INDEX idx_story_viewers_user_id ON story_viewers(user_id);
CREATE INDEX idx_story_viewers_viewed_at ON story_viewers(viewed_at DESC);

CREATE OR REPLACE FUNCTION delete_expired_stories()
RETURNS void AS $$
BEGIN
  DELETE FROM stories WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 7. CREATE MESSAGES TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  image TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (sender_id != receiver_id)
);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_is_read ON messages(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id, created_at DESC);
CREATE INDEX idx_messages_conversation_reverse ON messages(receiver_id, sender_id, created_at DESC);
CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read) WHERE is_read = FALSE;

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE messages ADD CONSTRAINT message_text_length CHECK (char_length(text) > 0 AND char_length(text) <= 2000);

-- ========================================
-- 8. CREATE NOTIFICATIONS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'mention')),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_sender_id ON notifications(sender_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- ========================================
-- 9. CREATE VIEWS AND FUNCTIONS
-- ========================================

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

CREATE OR REPLACE VIEW comments_with_counts AS
SELECT 
  c.*,
  u.username,
  u.full_name,
  u.avatar as user_avatar,
  (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as likes_count
FROM comments c
JOIN users u ON c.user_id = u.id;

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

CREATE OR REPLACE FUNCTION get_user_feed(p_user_id UUID, p_limit INT DEFAULT 20, p_offset INT DEFAULT 0)
RETURNS TABLE (
  id UUID, user_id UUID, username VARCHAR, full_name VARCHAR, user_avatar TEXT,
  caption TEXT, location VARCHAR, type VARCHAR, images JSONB, videos JSONB,
  tags JSONB, mentions JSONB, filters JSONB, crop JSONB, sound JSONB,
  likes_count BIGINT, comments_count BIGINT, is_liked BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE, updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id, p.user_id, u.username, u.full_name, u.avatar as user_avatar,
    p.caption, p.location, p.type, p.images, p.videos, p.tags, p.mentions,
    p.filters, p.crop, p.sound,
    (SELECT COUNT(*)::BIGINT FROM post_likes WHERE post_id = p.id) as likes_count,
    (SELECT COUNT(*)::BIGINT FROM comments WHERE post_id = p.id) as comments_count,
    EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = p_user_id) as is_liked,
    p.created_at, p.updated_at
  FROM posts p
  JOIN users u ON p.user_id = u.id
  WHERE p.user_id IN (
    SELECT following_id FROM followers WHERE follower_id = p_user_id
    UNION SELECT p_user_id
  )
  ORDER BY p.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_conversations(p_user_id UUID)
RETURNS TABLE (
  other_user_id UUID, other_username VARCHAR, other_full_name VARCHAR, other_avatar TEXT,
  last_message_id UUID, last_message_text TEXT,
  last_message_created_at TIMESTAMP WITH TIME ZONE, unread_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH user_messages AS (
    SELECT 
      CASE WHEN sender_id = p_user_id THEN receiver_id ELSE sender_id END as other_user,
      id, text, created_at,
      ROW_NUMBER() OVER (
        PARTITION BY CASE WHEN sender_id = p_user_id THEN receiver_id ELSE sender_id END
        ORDER BY created_at DESC
      ) as rn
    FROM messages
    WHERE sender_id = p_user_id OR receiver_id = p_user_id
  )
  SELECT 
    u.id, u.username, u.full_name, u.avatar,
    um.id, um.text, um.created_at,
    (SELECT COUNT(*)::BIGINT FROM messages 
     WHERE sender_id = u.id AND receiver_id = p_user_id AND is_read = FALSE) as unread_count
  FROM user_messages um
  JOIN users u ON um.other_user = u.id
  WHERE um.rn = 1
  ORDER BY um.created_at DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_users(p_query TEXT, p_limit INT DEFAULT 10)
RETURNS TABLE (
  id UUID, username VARCHAR, full_name VARCHAR, avatar TEXT, bio VARCHAR,
  followers_count BIGINT, following_count BIGINT, is_private BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id, u.username, u.full_name, u.avatar, u.bio,
    (SELECT COUNT(*)::BIGINT FROM followers WHERE following_id = u.id) as followers_count,
    (SELECT COUNT(*)::BIGINT FROM followers WHERE follower_id = u.id) as following_count,
    u.is_private
  FROM users u
  WHERE u.username ILIKE '%' || p_query || '%' OR u.full_name ILIKE '%' || p_query || '%'
  ORDER BY 
    CASE WHEN u.username = p_query THEN 0 WHEN u.username ILIKE p_query || '%' THEN 1 ELSE 2 END,
    (SELECT COUNT(*) FROM followers WHERE following_id = u.id) DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 10. ENABLE ROW LEVEL SECURITY
-- ========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::uuid = id);

CREATE POLICY "Anyone can view followers" ON followers FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON followers FOR INSERT WITH CHECK (auth.uid()::uuid = follower_id);
CREATE POLICY "Users can unfollow others" ON followers FOR DELETE USING (auth.uid()::uuid = follower_id);

CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create own posts" ON posts FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid()::uuid = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid()::uuid = user_id);

CREATE POLICY "Anyone can view post likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Users can like posts" ON post_likes FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);
CREATE POLICY "Users can unlike posts" ON post_likes FOR DELETE USING (auth.uid()::uuid = user_id);

CREATE POLICY "Anyone can view comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid()::uuid = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid()::uuid = user_id);

CREATE POLICY "Anyone can view comment likes" ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can like comments" ON comment_likes FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);
CREATE POLICY "Users can unlike comments" ON comment_likes FOR DELETE USING (auth.uid()::uuid = user_id);

CREATE POLICY "Anyone can view active stories" ON stories FOR SELECT USING (expires_at > NOW());
CREATE POLICY "Users can create own stories" ON stories FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);
CREATE POLICY "Users can delete own stories" ON stories FOR DELETE USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can view story viewers of own stories" ON story_viewers 
  FOR SELECT USING (EXISTS (SELECT 1 FROM stories WHERE id = story_id AND user_id = auth.uid()::uuid));
CREATE POLICY "Users can mark stories as viewed" ON story_viewers FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Users can view own messages" ON messages 
  FOR SELECT USING (auth.uid()::uuid = sender_id OR auth.uid()::uuid = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid()::uuid = sender_id);
CREATE POLICY "Users can update own messages" ON messages 
  FOR UPDATE USING (auth.uid()::uuid = sender_id OR auth.uid()::uuid = receiver_id);
CREATE POLICY "Users can delete sent messages" ON messages FOR DELETE USING (auth.uid()::uuid = sender_id);

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid()::uuid = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid()::uuid = user_id);
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (auth.uid()::uuid = user_id);

-- ========================================
-- 11. ENABLE REALTIME SUBSCRIPTIONS
-- ========================================

ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE post_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE stories;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE followers;

-- ========================================
-- SETUP COMPLETE!
-- ========================================
-- 
-- Your database is now ready with:
-- ✅ 10 Tables (users, followers, posts, post_likes, comments, 
--    comment_likes, stories, story_viewers, messages, notifications)
-- ✅ 4 Views (user_profiles, posts_with_counts, comments_with_counts, active_stories)
-- ✅ 4 Functions (get_user_feed, get_conversations, search_users, delete_expired_stories)
-- ✅ Row Level Security enabled on all tables
-- ✅ Realtime subscriptions enabled
-- ✅ All indexes and constraints in place
--
-- Next steps:
-- 1. Update your .env file with Supabase credentials
-- 2. Install @supabase/supabase-js
-- 3. Update backend code to use Supabase
-- ========================================

