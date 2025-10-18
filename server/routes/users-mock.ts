import express from 'express';
import { mockDb } from '../mock-db.js';

const router = express.Router();

// Get user profile
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { data: user } = await mockDb.getUserByUsername(username);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get followers and following counts
    const { data: followers } = await mockDb.getFollowers(user.id);
    const { data: following } = await mockDb.getFollowing(user.id);
    
    // Get user posts
    const { data: posts } = await mockDb.getPostsByUser(user.id);

    // Create profile response with proper structure
    const profile = {
      _id: user.id,
      username: user.username,
      fullName: user.full_name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      followers: followers.map(f => f.follower_id),
      following: following.map(f => f.following_id),
      posts: posts.map(p => p.id),
      isPrivate: user.is_private,
      isCreator: false, // Default to false for now
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      followers_count: followers.length,
      following_count: following.length,
      posts_count: posts.length
    };
    
    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user posts
router.get('/:username/posts', async (req, res) => {
  try {
    const { username } = req.params;
    const { data: user } = await mockDb.getUserByUsername(username);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { data: posts } = await mockDb.getPostsByUser(user.id);
    
    // Format posts for frontend
    const formattedPosts = posts.map(post => ({
      _id: post.id,
      user: post.user_id,
      caption: post.caption,
      images: post.images,
      tags: [], // Add empty tags for now
      mentions: [], // Add empty mentions for now
      type: 'image',
      likes: post.likes,
      comments: post.comments,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    }));
    
    res.json(formattedPosts);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow user
router.post('/:userId/follow', async (req, res) => {
  try {
    const { userId } = req.params;
    // For now, we'll use a dummy follower ID since we don't have proper JWT middleware
    // In a real app, this would come from the JWT token
    const followerId = 'current_user_id'; // TODO: Get from JWT token
    
    if (followerId === userId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    await mockDb.followUser(followerId, userId);
    res.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unfollow user
router.post('/:userId/unfollow', async (req, res) => {
  try {
    const { userId } = req.params;
    // For now, we'll use a dummy follower ID since we don't have proper JWT middleware
    // In a real app, this would come from the JWT token
    const followerId = 'current_user_id'; // TODO: Get from JWT token
    
    await mockDb.unfollowUser(followerId, userId);
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
    const { data: users } = await mockDb.searchUsers(query);
    
    // Remove passwords from response
    const safeUsers = users.map(({ password, ...user }) => user);
    
    res.json(safeUsers);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
