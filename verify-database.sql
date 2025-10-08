-- ========================================
-- INSTOK Database Verification Queries
-- Run these in Supabase SQL Editor to verify setup
-- ========================================

-- 1. Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Check all views exist
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 3. Check all functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- 4. Test the search_users function
SELECT * FROM search_users('test', 5);

-- 5. Check Row Level Security is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 6. Check if realtime is enabled
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;

-- 7. Test user_profiles view
SELECT * FROM user_profiles LIMIT 1;

-- 8. Test posts_with_counts view  
SELECT * FROM posts_with_counts LIMIT 1;

-- ========================================
-- Expected Results:
-- ========================================
-- Tables: 10 (users, followers, posts, post_likes, comments, comment_likes, stories, story_viewers, messages, notifications)
-- Views: 4 (user_profiles, posts_with_counts, comments_with_counts, active_stories)  
-- Functions: 4 (search_users, get_user_feed, get_conversations, delete_expired_stories)
-- RLS: All tables should show 't' (true) for rowsecurity
-- Realtime: 7 tables should be listed
-- ========================================
