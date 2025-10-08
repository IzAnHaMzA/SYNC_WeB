import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for message images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'message-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get conversations (list of users you've chatted with)
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    // Use the get_conversations function from Supabase
    const { data: conversations, error } = await supabaseAdmin.rpc('get_conversations', {
      p_user_id: req.user!.id
    });

    if (error) {
      console.error('Get conversations error:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(conversations || []);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages with a specific user
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all messages between the two users
    const { data: messages, error } = await supabaseAdmin
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey (
          id, username, full_name, avatar
        ),
        receiver:users!messages_receiver_id_fkey (
          id, username, full_name, avatar
        )
      `)
      .or(`and(sender_id.eq.${req.user!.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${req.user!.id})`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Get messages error:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    // Mark messages as read
    await supabaseAdmin
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', userId)
      .eq('receiver_id', req.user!.id)
      .eq('is_read', false);

    res.json(messages || []);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    
    if (!receiverId || !text) {
      return res.status(400).json({ message: 'Receiver and text are required' });
    }

    // Check if receiver exists
    const { data: receiver, error: receiverError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', receiverId)
      .single();

    if (receiverError || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const { data: message, error: messageError } = await supabaseAdmin
      .from('messages')
      .insert([{
        sender_id: req.user!.id,
        receiver_id: receiverId,
        text,
        image: imagePath
      }])
      .select(`
        *,
        sender:users!messages_sender_id_fkey (
          id, username, full_name, avatar
        ),
        receiver:users!messages_receiver_id_fkey (
          id, username, full_name, avatar
        )
      `)
      .single();

    if (messageError) {
      console.error('Send message error:', messageError);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark message as read
router.put('/:messageId/read', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    
    // Check if message exists and user is the receiver
    const { data: message, error: messageError } = await supabaseAdmin
      .from('messages')
      .select('id, receiver_id')
      .eq('id', messageId)
      .single();

    if (messageError || !message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only receiver can mark as read
    if (message.receiver_id !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update message
    const { data: updatedMessage, error: updateError } = await supabaseAdmin
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)
      .select()
      .single();

    if (updateError) {
      console.error('Mark message as read error:', updateError);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(updatedMessage);
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete message
router.delete('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    
    // Check if message exists and user is the sender
    const { data: message, error: messageError } = await supabaseAdmin
      .from('messages')
      .select('id, sender_id')
      .eq('id', messageId)
      .single();

    if (messageError || !message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender can delete
    if (message.sender_id !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { error: deleteError } = await supabaseAdmin
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (deleteError) {
      console.error('Delete message error:', deleteError);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

