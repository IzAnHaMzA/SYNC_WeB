import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: notifications, error } = await supabaseAdmin
      .from('notifications')
      .select(`
        *,
        sender:users!notifications_sender_id_fkey (
          id, username, full_name, avatar
        )
      `)
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Get notifications error:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(notifications || []);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread notifications count
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const { count, error } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user!.id)
      .eq('is_read', false);

    if (error) {
      console.error('Get unread count error:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json({ count: count || 0 });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/:notificationId/read', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    // Check if notification exists and belongs to user
    const { data: notification, error: notificationError } = await supabaseAdmin
      .from('notifications')
      .select('id, user_id')
      .eq('id', notificationId)
      .single();

    if (notificationError || !notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if notification belongs to user
    if (notification.user_id !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update notification
    const { data: updatedNotification, error: updateError } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (updateError) {
      console.error('Mark notification as read error:', updateError);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(updatedNotification);
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', req.user!.id)
      .eq('is_read', false);

    if (error) {
      console.error('Mark all as read error:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notification (helper for other routes)
export const createNotification = async (
  userId: string,
  senderId: string,
  type: 'like' | 'comment' | 'follow' | 'mention',
  text: string,
  postId?: string,
  commentId?: string
) => {
  try {
    const { data: notification, error } = await supabaseAdmin
      .from('notifications')
      .insert([{
        user_id: userId,
        sender_id: senderId,
        type,
        text,
        post_id: postId,
        comment_id: commentId
      }])
      .select()
      .single();

    if (error) {
      console.error('Create notification error:', error);
      return null;
    }

    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    return null;
  }
};

// Delete notification
router.delete('/:notificationId', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    // Check if notification exists and belongs to user
    const { data: notification, error: notificationError } = await supabaseAdmin
      .from('notifications')
      .select('id, user_id')
      .eq('id', notificationId)
      .single();

    if (notificationError || !notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if notification belongs to user
    if (notification.user_id !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { error: deleteError } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (deleteError) {
      console.error('Delete notification error:', deleteError);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

