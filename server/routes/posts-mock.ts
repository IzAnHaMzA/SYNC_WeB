import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { mockDb } from '../mock-db.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for videos
  }
});

// Error handling middleware for multer
const handleMulterError = (err: any, req: any, res: any, next: any) => {
  console.log('🔍 Multer error:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 50MB.' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  next(err);
};

// Create post
router.post('/', upload.single('file'), handleMulterError, async (req, res) => {
  try {
    console.log('🔍 Post creation request received:');
    console.log('- File:', req.file ? 'Present' : 'Not present');
    console.log('- Body keys:', Object.keys(req.body));
    console.log('- Caption:', req.body.caption);
    
    // Check for multer errors first
    if (req.file === undefined && !req.body.caption) {
      console.log('❌ No file or caption provided');
      return res.status(400).json({ message: 'No file or caption provided' });
    }

    // Extract user ID from JWT token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    
    // Handle FormData (from file upload) or JSON
    let caption = '';
    let images: string[] = [];
    
    if (req.file) {
      // FormData from file upload
      caption = req.body.caption || '';
      // Generate a unique filename and create a data URL for the uploaded file
      const fileExtension = req.file.originalname.split('.').pop() || 'jpg';
      const base64Data = req.file.buffer.toString('base64');
      const dataUrl = `data:${req.file.mimetype};base64,${base64Data}`;
      images = [dataUrl];
    } else if (req.body.images) {
      // JSON data
      caption = req.body.caption || '';
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    } else {
      // Default placeholder
      images = ['https://via.placeholder.com/400x400/6366f1/ffffff?text=No+Media'];
    }
    
    console.log('📝 Creating post:', {
      userId: decoded.userId,
      caption,
      imagesCount: images.length
    });
    
    const { data: post } = await mockDb.createPost({
      user_id: decoded.userId,
      caption,
      images,
      likes: [],
      comments: []
    });

    console.log('✅ Post created successfully:', post.id);
    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get feed posts
router.get('/feed', async (req, res) => {
  try {
    const { data: posts } = await mockDb.getAllPosts();
    
    // Sort by created_at descending (newest first)
    const sortedPosts = posts.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    res.json(sortedPosts);
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all posts (public)
router.get('/', async (req, res) => {
  try {
    const { data: posts } = await mockDb.getAllPosts();
    
    // Sort by created_at descending (newest first)
    const sortedPosts = posts.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    res.json(sortedPosts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like post
router.post('/:postId/like', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    
    // Get all posts to find the one to like
    const { data: posts } = await mockDb.getAllPosts();
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Add like if not already liked
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
    }
    
    res.json({ message: 'Post liked successfully', likes_count: post.likes.length });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unlike post
router.post('/:postId/unlike', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    
    // Get all posts to find the one to unlike
    const { data: posts } = await mockDb.getAllPosts();
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Remove like if exists
    post.likes = post.likes.filter(id => id !== userId);
    
    res.json({ message: 'Post unliked successfully', likes_count: post.likes.length });
  } catch (error) {
    console.error('Unlike post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
