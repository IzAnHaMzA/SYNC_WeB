-- Enable Row Level Security (RLS) on all tables
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

-- Users table policies
CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::uuid = id);

-- Followers table policies
CREATE POLICY "Anyone can view followers" ON followers
  FOR SELECT USING (true);

CREATE POLICY "Users can follow others" ON followers
  FOR INSERT WITH CHECK (auth.uid()::uuid = follower_id);

CREATE POLICY "Users can unfollow others" ON followers
  FOR DELETE USING (auth.uid()::uuid = follower_id);

-- Posts table policies
CREATE POLICY "Anyone can view posts" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can create own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid()::uuid = user_id);

-- Post likes table policies
CREATE POLICY "Anyone can view post likes" ON post_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like posts" ON post_likes
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Users can unlike posts" ON post_likes
  FOR DELETE USING (auth.uid()::uuid = user_id);

-- Comments table policies
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid()::uuid = user_id);

-- Comment likes table policies
CREATE POLICY "Anyone can view comment likes" ON comment_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like comments" ON comment_likes
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Users can unlike comments" ON comment_likes
  FOR DELETE USING (auth.uid()::uuid = user_id);

-- Stories table policies
CREATE POLICY "Anyone can view active stories" ON stories
  FOR SELECT USING (expires_at > NOW());

CREATE POLICY "Users can create own stories" ON stories
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Users can delete own stories" ON stories
  FOR DELETE USING (auth.uid()::uuid = user_id);

-- Story viewers table policies
CREATE POLICY "Users can view story viewers of own stories" ON story_viewers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stories WHERE id = story_id AND user_id = auth.uid()::uuid
    )
  );

CREATE POLICY "Users can mark stories as viewed" ON story_viewers
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

-- Messages table policies
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (
    auth.uid()::uuid = sender_id OR auth.uid()::uuid = receiver_id
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid()::uuid = sender_id);

CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE USING (
    auth.uid()::uuid = sender_id OR auth.uid()::uuid = receiver_id
  );

CREATE POLICY "Users can delete sent messages" ON messages
  FOR DELETE USING (auth.uid()::uuid = sender_id);

-- Notifications table policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (auth.uid()::uuid = user_id);

-- Note: For notifications creation, you'll typically use service role key
-- or implement via backend to ensure proper validation

