// Mock database for local testing when Supabase is blocked by network
interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  password: string;
  bio?: string;
  avatar?: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

interface Post {
  id: string;
  user_id: string;
  caption: string;
  images: string[];
  likes: string[];
  comments: string[];
  created_at: string;
  updated_at: string;
}

// In-memory storage
const users: User[] = [];
const posts: Post[] = [];
const followers: { follower_id: string; following_id: string }[] = [];

// Mock functions
export const mockDb = {
  // User operations
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...userData
    };
    users.push(user);
    return { data: user, error: null };
  },

  async getUserByEmail(email: string) {
    const user = users.find(u => u.email === email);
    return { data: user || null, error: null };
  },

  async getUserByUsername(username: string) {
    const user = users.find(u => u.username === username);
    return { data: user || null, error: null };
  },

  async getUserById(id: string) {
    const user = users.find(u => u.id === id);
    return { data: user || null, error: null };
  },

  // Post operations
  async createPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>) {
    const post: Post = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...postData
    };
    posts.push(post);
    return { data: post, error: null };
  },

  async getPostsByUser(userId: string) {
    const userPosts = posts.filter(p => p.user_id === userId);
    return { data: userPosts, error: null };
  },

  async getAllPosts() {
    return { data: posts, error: null };
  },

  // Follow operations
  async followUser(followerId: string, followingId: string) {
    const exists = followers.some(f => f.follower_id === followerId && f.following_id === followingId);
    if (!exists) {
      followers.push({ follower_id: followerId, following_id: followingId });
    }
    return { data: null, error: null };
  },

  async unfollowUser(followerId: string, followingId: string) {
    const index = followers.findIndex(f => f.follower_id === followerId && f.following_id === followingId);
    if (index !== -1) {
      followers.splice(index, 1);
    }
    return { data: null, error: null };
  },

  async getFollowers(userId: string) {
    const userFollowers = followers.filter(f => f.following_id === userId);
    return { data: userFollowers, error: null };
  },

  async getFollowing(userId: string) {
    const userFollowing = followers.filter(f => f.follower_id === userId);
    return { data: userFollowing, error: null };
  },

  // Search
  async searchUsers(query: string) {
    const matchingUsers = users.filter(u => 
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.full_name.toLowerCase().includes(query.toLowerCase())
    );
    return { data: matchingUsers, error: null };
  },

  // Get stats
  getStats() {
    return {
      totalUsers: users.length,
      totalPosts: posts.length,
      totalFollows: followers.length
    };
  }
};

console.log('🗄️  Using MOCK DATABASE for local testing');
