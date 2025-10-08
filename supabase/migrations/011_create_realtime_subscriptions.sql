-- Enable realtime for tables that need live updates

-- Enable realtime for posts (for live feed updates)
ALTER PUBLICATION supabase_realtime ADD TABLE posts;

-- Enable realtime for post_likes (for live like updates)
ALTER PUBLICATION supabase_realtime ADD TABLE post_likes;

-- Enable realtime for comments (for live comment updates)
ALTER PUBLICATION supabase_realtime ADD TABLE comments;

-- Enable realtime for stories (for live story updates)
ALTER PUBLICATION supabase_realtime ADD TABLE stories;

-- Enable realtime for messages (for live chat)
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable realtime for notifications (for live notifications)
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Enable realtime for followers (for live follow updates)
ALTER PUBLICATION supabase_realtime ADD TABLE followers;

-- Note: Realtime is now enabled for these tables.
-- Clients can subscribe to changes using Supabase client:
-- 
-- const subscription = supabase
--   .from('messages')
--   .on('INSERT', payload => {
--     console.log('New message:', payload.new)
--   })
--   .subscribe()

