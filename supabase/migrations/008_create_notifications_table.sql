-- Create notifications table
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

-- Create indexes for better performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_sender_id ON notifications(sender_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON notifications(is_read) WHERE is_read = FALSE;

-- Create composite index for user notifications
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);

-- Create index for unread notifications count
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- Add comments
COMMENT ON TABLE notifications IS 'Stores user notifications';
COMMENT ON COLUMN notifications.user_id IS 'User who receives the notification';
COMMENT ON COLUMN notifications.sender_id IS 'User who triggered the notification';
COMMENT ON COLUMN notifications.type IS 'Type of notification: like, comment, follow, mention';
COMMENT ON COLUMN notifications.post_id IS 'Related post (if applicable)';
COMMENT ON COLUMN notifications.comment_id IS 'Related comment (if applicable)';
COMMENT ON COLUMN notifications.text IS 'Notification message text';
COMMENT ON COLUMN notifications.is_read IS 'Whether the notification has been read';

