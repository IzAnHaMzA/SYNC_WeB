import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user by username
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    // Get user with follower/following counts using the view
    const { data: user, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get followers list
    const { data: followers } = await supabaseAdmin
      .from('followers')
      .select(`
        follower_id,
        users!followers_follower_id_fkey (
          id, username, full_name, avatar
        )
      `)
      .eq('following_id', user.id);

    // Get following list
    const { data: following } = await supabaseAdmin
      .from('followers')
      .select(`
        following_id,
        users!followers_following_id_fkey (
          id, username, full_name, avatar
        )
      `)
      .eq('follower_id', user.id);

    const userResponse = {
      ...user,
      followers: followers?.map(f => f.users) || [],
      following: following?.map(f => f.users) || []
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user posts
router.get('/:username/posts', async (req, res) => {
  try {
    const { username } = req.params;
    
    // Get user first
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (userError || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get posts with counts using the view
    const { data: posts, error: postsError } = await supabaseAdmin
      .from('posts_with_counts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error('Get posts error:', postsError);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(posts || []);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow user
router.post('/:userId/follow', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (userId === req.user!.id) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    // Check if user exists
    const { data: userToFollow, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError || !userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    const { data: existingFollow, error: checkError } = await supabaseAdmin
      .from('followers')
      .select('id')
      .eq('follower_id', req.user!.id)
      .eq('following_id', userId)
      .single();

    if (checkError === null && existingFollow) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Add follow relationship
    const { error: insertError } = await supabaseAdmin
      .from('followers')
      .insert([{
        follower_id: req.user!.id,
        following_id: userId
      }]);

    if (insertError) {
      console.error('Follow insert error:', insertError);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unfollow user
router.delete('/:userId/follow', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const { data: userToUnfollow, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError || !userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove follow relationship
    const { error: deleteError } = await supabaseAdmin
      .from('followers')
      .delete()
      .eq('follower_id', req.user!.id)
      .eq('following_id', userId);

    if (deleteError) {
      console.error('Unfollow delete error:', deleteError);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    // Use the search_users function we created
    const { data: users, error } = await supabaseAdmin.rpc('search_users', {
      p_query: query,
      p_limit: 10
    });

    if (error) {
      console.error('Search users error:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(users || []);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
