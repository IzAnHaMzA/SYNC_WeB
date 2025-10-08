import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    
    const { data: comments, error } = await supabaseAdmin
      .from('comments_with_counts')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get comments error:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(comments || []);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create comment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { postId, text } = req.body;

    if (!text || !postId) {
      return res.status(400).json({ message: 'Post ID and text are required' });
    }

    // Check if post exists
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select('id')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create comment
    const { data: comment, error: commentError } = await supabaseAdmin
      .from('comments')
      .insert([{
        user_id: req.user!.id,
        post_id: postId,
        text
      }])
      .select()
      .single();

    if (commentError) {
      console.error('Create comment error:', commentError);
      return res.status(500).json({ message: 'Server error' });
    }

    // Get comment with user data
    const { data: commentWithUser, error: viewError } = await supabaseAdmin
      .from('comments_with_counts')
      .select('*')
      .eq('id', comment.id)
      .single();

    if (viewError) {
      console.error('Get comment error:', viewError);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like comment
router.post('/:commentId/like', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    
    // Check if comment exists
    const { data: comment, error: commentError } = await supabaseAdmin
      .from('comments')
      .select('id')
      .eq('id', commentId)
      .single();

    if (commentError || !comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if already liked
    const { data: existingLike, error: checkError } = await supabaseAdmin
      .from('comment_likes')
      .select('id')
      .eq('user_id', req.user!.id)
      .eq('comment_id', commentId)
      .single();

    let isLiked = false;

    if (checkError === null && existingLike) {
      // Unlike - remove the like
      const { error: deleteError } = await supabaseAdmin
        .from('comment_likes')
        .delete()
        .eq('user_id', req.user!.id)
        .eq('comment_id', commentId);

      if (deleteError) {
        console.error('Unlike error:', deleteError);
        return res.status(500).json({ message: 'Server error' });
      }
      isLiked = false;
    } else {
      // Like - add the like
      const { error: insertError } = await supabaseAdmin
        .from('comment_likes')
        .insert([{
          user_id: req.user!.id,
          comment_id: commentId
        }]);

      if (insertError) {
        console.error('Like error:', insertError);
        return res.status(500).json({ message: 'Server error' });
      }
      isLiked = true;
    }

    // Get updated likes count
    const { count: likesCount } = await supabaseAdmin
      .from('comment_likes')
      .select('*', { count: 'exact', head: true })
      .eq('comment_id', commentId);

    res.json({ isLiked, likesCount: likesCount || 0 });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment
router.delete('/:commentId', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    
    // Check if comment exists and user owns it
    const { data: comment, error: commentError } = await supabaseAdmin
      .from('comments')
      .select('id, user_id')
      .eq('id', commentId)
      .single();

    if (commentError || !comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.user_id !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete comment (this will cascade delete comment_likes due to foreign key)
    const { error: deleteError } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (deleteError) {
      console.error('Delete comment error:', deleteError);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

