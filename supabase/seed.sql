-- Seed data for testing (optional)
-- This creates sample users, posts, and interactions for development/testing

-- Insert test users (passwords are 'password123' hashed with bcrypt)
INSERT INTO users (id, username, email, password, full_name, bio, avatar) VALUES
  ('11111111-1111-1111-1111-111111111111', 'johndoe', 'john@example.com', '$2a$10$YourHashedPasswordHere', 'John Doe', 'Software Developer 💻', 'https://i.pravatar.cc/150?img=1'),
  ('22222222-2222-2222-2222-222222222222', 'janedoe', 'jane@example.com', '$2a$10$YourHashedPasswordHere', 'Jane Doe', 'Designer & Artist 🎨', 'https://i.pravatar.cc/150?img=2'),
  ('33333333-3333-3333-3333-333333333333', 'bobsmith', 'bob@example.com', '$2a$10$YourHashedPasswordHere', 'Bob Smith', 'Photographer 📷', 'https://i.pravatar.cc/150?img=3'),
  ('44444444-4444-4444-4444-444444444444', 'alice', 'alice@example.com', '$2a$10$YourHashedPasswordHere', 'Alice Wonder', 'Travel Blogger ✈️', 'https://i.pravatar.cc/150?img=4')
ON CONFLICT (id) DO NOTHING;

-- Insert follower relationships
INSERT INTO followers (follower_id, following_id) VALUES
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333'),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (follower_id, following_id) DO NOTHING;

-- Insert sample posts
INSERT INTO posts (id, user_id, caption, location, type, images, tags) VALUES
  (
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Beautiful sunset at the beach! 🌅',
    'California, USA',
    'image',
    '["https://images.unsplash.com/photo-1507525428034-b723cf961d3e"]'::jsonb,
    '["sunset", "beach", "nature"]'::jsonb
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    '22222222-2222-2222-2222-222222222222',
    'My latest artwork 🎨',
    'New York, USA',
    'image',
    '["https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b"]'::jsonb,
    '["art", "design", "creative"]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample likes
INSERT INTO post_likes (user_id, post_id) VALUES
  ('22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555'),
  ('33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555'),
  ('11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666')
ON CONFLICT (user_id, post_id) DO NOTHING;

-- Insert sample comments
INSERT INTO comments (user_id, post_id, text) VALUES
  ('22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'Amazing photo! 😍'),
  ('33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'Love the colors!'),
  ('11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'Incredible work! 🎨')
ON CONFLICT DO NOTHING;

-- Note: In production, you should:
-- 1. Hash passwords properly using bcrypt
-- 2. Use actual uploaded image URLs
-- 3. Not use fixed UUIDs

