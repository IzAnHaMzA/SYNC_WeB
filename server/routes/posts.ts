import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for videos
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

// Create post
router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { 
      caption, 
      location, 
      tags, 
      mentions, 
      filters, 
      crop, 
      sound, 
      type 
    } = req.body;
    
    const filePath = req.file ? `/uploads/${req.file.filename}` : '';

    if (!filePath) {
      return res.status(400).json({ message: 'File is required' });
    }

    // Parse JSON fields
    let parsedTags = [];
    let parsedMentions = [];
    let parsedFilters = {};
    let parsedCrop = {};
    let parsedSound = {};

    try {
      parsedTags = tags ? JSON.parse(tags) : [];
      parsedMentions = mentions ? JSON.parse(mentions) : [];
      parsedFilters = filters ? JSON.parse(filters) : {};
      parsedCrop = crop ? JSON.parse(crop) : {};
      parsedSound = sound ? JSON.parse(sound) : {};
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
    }

    const postData: any = {
      user_id: req.user!.id,
      caption: caption || '',
      location: location || '',
      tags: parsedTags,
      mentions: parsedMentions,
      type: type || 'image',
      filters: parsedFilters,
      crop: parsedCrop,
      sound: parsedSound
    };

    // Add file to appropriate array based on type
    if (type === 'video') {
      postData.videos = [filePath];
      postData.images = []; // Keep images array for compatibility
    } else {
      postData.images = [filePath];
      postData.videos = [];
    }

    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .insert([postData])
      .select()
      .single();

    if (error) {
      console.error('Create post error:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    // Get post with user data using the view
    const { data: postWithUser, error: viewError } = await supabaseAdmin
      .from('posts_with_counts')
      .select('*')
      .eq('id', post.id)
      .single();

    if (viewError) {
      console.error('Get post with user error:', viewError);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(201).json(postWithUser);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get feed posts (authenticated)
router.get('/feed', authenticateToken, async (req, res) => {
  try {
    // Use the get_user_feed function we created
    const { data: posts, error } = await supabaseAdmin.rpc('get_user_feed', {
      p_user_id: req.user!.id,
      p_limit: 20,
      p_offset: 0
    });

    if (error) {
      console.error('Get feed error:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(posts || []);
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public posts (no authentication required)
router.get('/public', async (req, res) => {
  try {
    const { data: posts, error } = await supabaseAdmin
      .from('posts_with_counts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Get public posts error:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(posts || []);
  } catch (error) {
    console.error('Get public posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user posts
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data: posts, error } = await supabaseAdmin
      .from('posts_with_counts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get user posts error:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(posts || []);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike post
router.post('/:postId/like', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Check if post exists
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select('id')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if already liked
    const { data: existingLike, error: checkError } = await supabaseAdmin
      .from('post_likes')
      .select('id')
      .eq('user_id', req.user!.id)
      .eq('post_id', postId)
      .single();

    let isLiked = false;

    if (checkError === null && existingLike) {
      // Unlike - remove the like
      const { error: deleteError } = await supabaseAdmin
        .from('post_likes')
        .delete()
        .eq('user_id', req.user!.id)
        .eq('post_id', postId);

      if (deleteError) {
        console.error('Unlike error:', deleteError);
        return res.status(500).json({ message: 'Server error' });
      }
      isLiked = false;
    } else {
      // Like - add the like
      const { error: insertError } = await supabaseAdmin
        .from('post_likes')
        .insert([{
          user_id: req.user!.id,
          post_id: postId
        }]);

      if (insertError) {
        console.error('Like error:', insertError);
        return res.status(500).json({ message: 'Server error' });
      }
      isLiked = true;
    }

    // Get updated likes count
    const { count: likesCount } = await supabaseAdmin
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    res.json({ isLiked, likesCount: likesCount || 0 });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete like
router.delete('/:postId/like', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;

    const { error: deleteError } = await supabaseAdmin
      .from('post_likes')
      .delete()
      .eq('user_id', req.user!.id)
      .eq('post_id', postId);

    if (deleteError) {
      console.error('Delete like error:', deleteError);
      return res.status(500).json({ message: 'Server error' });
    }

    // Get updated likes count
    const { count: likesCount } = await supabaseAdmin
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    res.json({ isLiked: false, likesCount: likesCount || 0 });
  } catch (error) {
    console.error('Unlike post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
