import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for story uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'story-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Create story
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    if (!imagePath) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const storyData = {
      user_id: req.user!.id,
      image: imagePath,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    };

    const { data: story, error } = await supabaseAdmin
      .from('stories')
      .insert([storyData])
      .select()
      .single();

    if (error) {
      console.error('Create story error:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(201).json(story);
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all stories (public access)
router.get('/', async (req, res) => {
  try {
    const { data: stories, error } = await supabaseAdmin
      .from('active_stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get stories error:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(stories || []);
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user stories
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data: stories, error } = await supabaseAdmin
      .from('active_stories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get user stories error:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(stories || []);
  } catch (error) {
    console.error('Get user stories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// View story
router.post('/:storyId/view', authenticateToken, async (req, res) => {
  try {
    const { storyId } = req.params;
    
    // Check if story exists
    const { data: story, error: storyError } = await supabaseAdmin
      .from('stories')
      .select('id')
      .eq('id', storyId)
      .single();

    if (storyError || !story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if already viewed
    const { data: existingView, error: checkError } = await supabaseAdmin
      .from('story_viewers')
      .select('id')
      .eq('user_id', req.user!.id)
      .eq('story_id', storyId)
      .single();

    if (checkError !== null || !existingView) {
      // Add view
      const { error: insertError } = await supabaseAdmin
        .from('story_viewers')
        .insert([{
          user_id: req.user!.id,
          story_id: storyId
        }]);

      if (insertError) {
        console.error('View story error:', insertError);
        return res.status(500).json({ message: 'Server error' });
      }
    }

    res.json({ message: 'Story viewed' });
  } catch (error) {
    console.error('View story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete story
router.delete('/:storyId', authenticateToken, async (req, res) => {
  try {
    const { storyId } = req.params;
    
    // Check if story exists and user owns it
    const { data: story, error: storyError } = await supabaseAdmin
      .from('stories')
      .select('id, user_id')
      .eq('id', storyId)
      .single();

    if (storyError || !story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if user owns the story
    if (story.user_id !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete story (this will cascade delete story_viewers due to foreign key)
    const { error: deleteError } = await supabaseAdmin
      .from('stories')
      .delete()
      .eq('id', storyId);

    if (deleteError) {
      console.error('Delete story error:', deleteError);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
