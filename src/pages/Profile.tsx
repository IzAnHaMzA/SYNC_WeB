import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { User, Post } from '../types';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Grid, 
  List, 
  UserPlus, 
  MessageCircle, 
  MoreHorizontal, 
  Wallet, 
  TrendingUp, 
  Gift, 
  Star, 
  Heart, 
  Eye, 
  DollarSign,
  Crown,
  Zap,
  Settings,
  Share,
  Bookmark,
  Calendar,
  BarChart3,
  Coins,
  Sparkles,
  User as UserIcon
} from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import DesktopLayout from '../components/DesktopLayout';

// Mock data functions
const getMockUserData = (username: string): User => {
  const mockUsers: Record<string, User> = {
    'tech_creator': {
      _id: '1',
      username: 'tech_creator',
      fullName: 'Tech Creator',
      email: 'tech@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Tech+Creator&background=00d4ff&color=fff',
      bio: 'Building the future with code! 🚀 Passionate about technology and innovation.',
      followers: ['2', '3', '4', '5'],
      following: ['2', '3'],
      posts: ['1', '2', '3'],
      isPrivate: false,
      isCreator: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'art_lover': {
      _id: '2',
      username: 'art_lover',
      fullName: 'Art Lover',
      email: 'art@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Art+Lover&background=f093fb&color=fff',
      bio: 'Digital artist creating amazing visuals ✨ #art #digital #creative',
      followers: ['1', '3', '4'],
      following: ['1', '3'],
      posts: ['4', '5'],
      isPrivate: false,
      isCreator: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'fitness_guru': {
      _id: '3',
      username: 'fitness_guru',
      fullName: 'Fitness Guru',
      email: 'fitness@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Fitness+Guru&background=764ba2&color=fff',
      bio: 'Fitness enthusiast helping others achieve their goals 💪 #fitness #health #motivation',
      followers: ['1', '2', '4', '5'],
      following: ['1', '2'],
      posts: ['6'],
      isPrivate: false,
      isCreator: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'music_producer': {
      _id: '4',
      username: 'music_producer',
      fullName: 'Music Producer',
      email: 'music@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Music+Producer&background=0099cc&color=fff',
      bio: 'Creating beats that move your soul 🎵 #music #producer #beats',
      followers: ['1', '2', '3'],
      following: ['1', '2'],
      posts: ['7'],
      isPrivate: false,
      isCreator: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'travel_blogger': {
      _id: '5',
      username: 'travel_blogger',
      fullName: 'Travel Blogger',
      email: 'travel@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Travel+Blogger&background=ff6b35&color=fff',
      bio: 'Exploring the world one destination at a time 🌍 #travel #adventure #wanderlust',
      followers: ['1', '2', '3', '4'],
      following: ['1', '2', '3'],
      posts: ['8'],
      isPrivate: false,
      isCreator: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };

  return mockUsers[username] || {
    _id: 'default',
    username: username || 'user',
    fullName: username ? username.charAt(0).toUpperCase() + username.slice(1) : 'User',
    email: `${username}@example.com`,
    avatar: `https://ui-avatars.com/api/?name=${username}&background=667eea&color=fff`,
    bio: 'Welcome to my profile!',
    followers: [],
    following: [],
    posts: [],
    isPrivate: false,
    isCreator: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

const getMockPostsData = (username: string): Post[] => {
  const mockPosts: Record<string, Post[]> = {
    'tech_creator': [
      {
        _id: '1',
        user: '1',
        caption: 'Building the future with code! 🚀 #tech #coding #future',
        images: ['https://picsum.photos/400/400?random=20'],
        tags: ['tech', 'coding', 'future'],
        mentions: [],
        type: 'image',
        likes: ['2', '3', '4'],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '2',
        user: '1',
        caption: 'New AI project in progress! 🤖 #ai #machinelearning',
        images: ['https://picsum.photos/400/400?random=21'],
        tags: ['ai', 'machinelearning'],
        mentions: [],
        type: 'image',
        likes: ['2', '3'],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '3',
        user: '1',
        caption: 'Code review session with the team 👥 #collaboration',
        images: ['https://picsum.photos/400/400?random=22'],
        tags: ['collaboration'],
        mentions: [],
        type: 'image',
        likes: ['2', '3', '4', '5'],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    'art_lover': [
      {
        _id: '4',
        user: '2',
        caption: 'Digital art in progress ✨ #art #digital #creative',
        images: ['https://picsum.photos/400/400?random=23'],
        tags: ['art', 'digital', 'creative'],
        mentions: [],
        type: 'image',
        likes: ['1', '3', '4'],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '5',
        user: '2',
        caption: 'New painting technique I learned 🎨 #painting #art',
        images: ['https://picsum.photos/400/400?random=24'],
        tags: ['painting', 'art'],
        mentions: [],
        type: 'image',
        likes: ['1', '3'],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    'fitness_guru': [
      {
        _id: '6',
        user: '3',
        caption: 'Morning workout complete! 💪 #fitness #health #motivation',
        images: ['https://picsum.photos/400/400?random=25'],
        tags: ['fitness', 'health', 'motivation'],
        mentions: [],
        type: 'image',
        likes: ['1', '2', '4'],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    'music_producer': [
      {
        _id: '7',
        user: '4',
        caption: 'New beat dropping soon! 🎵 #music #producer #beats',
        images: ['https://picsum.photos/400/400?random=26'],
        tags: ['music', 'producer', 'beats'],
        mentions: [],
        type: 'image',
        likes: ['1', '2', '3'],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    'travel_blogger': [
      {
        _id: '8',
        user: '5',
        caption: 'Exploring the hidden gems of Tokyo! 🗾 #travel #tokyo #adventure',
        images: ['https://picsum.photos/400/400?random=27'],
        tags: ['travel', 'tokyo', 'adventure'],
        mentions: [],
        type: 'image',
        likes: ['1', '2', '3', '4'],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  };

  return mockPosts[username] || [];
};

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'wallet' | 'analytics'>('posts');
  const [showWallet, setShowWallet] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showSuperchatModal, setShowSuperchatModal] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Use current user's username if no username in URL
  const targetUsername = username || currentUser?.username;

  // Check if we're on desktop
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Mock data for creator features
  const mockCreatorData = {
    totalEarnings: 12500,
    monthlyEarnings: 3200,
    totalViews: 1250000,
    uniqueViews: 890000,
    totalGifts: 156,
    superchatCount: 89,
    tier: 'Gold', // Bronze, Silver, Gold, Diamond
    nextTierProgress: 75,
    recentTransactions: [
      { id: 1, type: 'video_earnings', amount: 50, description: '100k views - Tech Tutorial', date: '2h ago' },
      { id: 2, type: 'superchat', amount: 25, description: 'Superchat from @john_doe', date: '4h ago' },
      { id: 3, type: 'gift', amount: 15, description: 'Gift from @jane_smith', date: '6h ago' },
      { id: 4, type: 'video_earnings', amount: 50, description: '100k views - Art Process', date: '1d ago' },
    ],
    analytics: {
      totalVideos: 45,
      avgViews: 28000,
      engagementRate: 8.5,
      topVideo: 'Amazing Tech Demo',
      topVideoViews: 125000
    }
  };

  const { data: profileUser, isLoading: userLoading } = useQuery<User>(
    ['user', targetUsername],
    async () => {
      try {
        const response = await api.get(`/users/${targetUsername}`);
        return response.data;
      } catch (error) {
        // If this is the current user's profile and API fails, use current user data
        if (currentUser && targetUsername === currentUser.username) {
          return {
            _id: currentUser._id,
            username: currentUser.username,
            fullName: currentUser.fullName,
            email: currentUser.email,
            avatar: currentUser.avatar,
            bio: currentUser.bio,
            followers: currentUser.followers || [],
            following: currentUser.following || [],
            posts: currentUser.posts || [],
            isPrivate: currentUser.isPrivate,
            isCreator: true, // Make current user a creator for demo
            createdAt: currentUser.createdAt,
            updatedAt: currentUser.updatedAt
          };
        }
        // Fallback to mock data if API fails
        return getMockUserData(targetUsername);
      }
    },
    { enabled: !!targetUsername }
  );

  const { data: posts = [], isLoading: postsLoading } = useQuery<Post[]>(
    ['user-posts', targetUsername],
    async () => {
      try {
        const response = await api.get(`/users/${targetUsername}/posts`);
        return response.data;
      } catch (error) {
        // Fallback to mock posts if API fails
        return getMockPostsData(targetUsername);
      }
    },
    { enabled: !!targetUsername }
  );

  const isOwnProfile = currentUser?.username === targetUsername;
  const isFollowing = currentUser?.following?.includes(profileUser?._id || '') || false;
  const isCreator = profileUser?.isCreator || isOwnProfile;

  const handleFollow = async () => {
    if (!profileUser) return;
    
    try {
      if (isFollowing) {
        await api.delete(`/users/${profileUser._id}/follow`);
      } else {
        await api.post(`/users/${profileUser._id}/follow`);
      }
      // Refetch user data
      window.location.reload();
    } catch (error) {
      console.error('Failed to follow/unfollow user');
    }
  };

  const handleSendGift = (giftType: string, amount: number) => {
    console.log(`Sending ${giftType} gift worth ₹${amount}`);
    setShowGiftModal(false);
  };

  const handleSuperchat = (amount: number, message: string) => {
    console.log(`Superchat: ₹${amount} - ${message}`);
    setShowSuperchatModal(false);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-futuristic-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
      </div>
    );
  }

  if (!profileUser) {
    const errorContent = (
      <div className="min-h-screen bg-futuristic-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-10 h-10 text-white/50" />
          </div>
          <p className="text-white/70 text-lg">User not found</p>
          <p className="text-white/50 text-sm mt-2">The user you're looking for doesn't exist</p>
        </div>
      </div>
    );

    if (isDesktop) {
      return <DesktopLayout>{errorContent}</DesktopLayout>;
    }
    return errorContent;
  }

  const renderProfileContent = () => (
    <div className="w-full">
      {/* Futuristic Header */}
      <div className="glass-dark border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 smooth-transition">
              <span className="text-white text-xl">←</span>
            </button>
            <div>
              <h1 className="text-lg font-bold text-white font-futuristic">
                {profileUser.username}
              </h1>
              {isCreator && (
                <div className="flex items-center space-x-1 mt-1">
                  <Crown className="w-4 h-4 text-neon-yellow" />
                  <span className="text-neon-yellow text-xs font-semibold">
                    {mockCreatorData.tier} Creator
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isCreator && (
              <button
                onClick={() => setShowWallet(true)}
                className="p-2 rounded-xl bg-gradient-to-r from-neon-green to-neon-blue hover:shadow-neon smooth-transition"
              >
                <Wallet className="w-5 h-5 text-white" />
              </button>
            )}
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 smooth-transition">
              <Share className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 smooth-transition">
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="glass-dark mx-4 mt-4 rounded-3xl p-6">
        <div className="flex items-start space-x-4 mb-6">
          <div className="relative">
            <img
              src={profileUser.avatar || `https://ui-avatars.com/api/?name=${profileUser.username}&background=667eea&color=fff`}
              alt={profileUser.username}
              className="w-24 h-24 rounded-full border-4 border-white/20 smooth-transition hover:border-neon-blue"
            />
            {isCreator && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-neon-yellow to-neon-orange rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-6 mb-4">
              <div className="text-center">
                <p className="font-bold text-xl text-white">{posts.length}</p>
                <p className="text-white/60 text-sm">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-xl text-white">{profileUser.followers?.length || 0}</p>
                <p className="text-white/60 text-sm">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-xl text-white">{profileUser.following?.length || 0}</p>
                <p className="text-white/60 text-sm">Following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h2 className="font-bold text-white text-lg mb-2">{profileUser.fullName}</h2>
          {profileUser.bio && (
            <p className="text-white/80 text-sm leading-relaxed">{profileUser.bio}</p>
          )}
          
          {isCreator && (
            <div className="mt-3 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-neon-blue" />
                <span className="text-white/70 text-sm">
                  {mockCreatorData.totalViews.toLocaleString()} views
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-neon-green" />
                <span className="text-white/70 text-sm">
                  ₹{mockCreatorData.totalEarnings.toLocaleString()} earned
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isOwnProfile ? (
          <div className="flex space-x-3">
            <button className="flex-1 bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-neon text-white py-3 rounded-xl font-semibold smooth-transition">
              Edit Profile
            </button>
            <button className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl smooth-transition">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleFollow}
              className={`flex-1 py-3 rounded-xl font-semibold smooth-transition ${
                isFollowing
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-neon text-white'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl smooth-transition">
              <MessageCircle className="w-5 h-5 text-white" />
            </button>
            {isCreator && (
              <button
                onClick={() => setShowGiftModal(true)}
                className="px-4 py-3 bg-gradient-to-r from-neon-pink to-neon-orange hover:shadow-neon rounded-xl smooth-transition"
              >
                <Gift className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Creator Stats (if creator) */}
      {isCreator && (
        <div className="mx-4 mt-4 glass-dark rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">Creator Stats</h3>
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-neon-yellow" />
              <span className="text-neon-yellow text-sm font-semibold">
                {mockCreatorData.tier} Tier
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-neon-green" />
                <span className="text-white/70 text-sm">Monthly Earnings</span>
              </div>
              <p className="text-white font-bold text-xl">₹{mockCreatorData.monthlyEarnings.toLocaleString()}</p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-5 h-5 text-neon-blue" />
                <span className="text-white/70 text-sm">Unique Views</span>
              </div>
              <p className="text-white font-bold text-xl">{mockCreatorData.uniqueViews.toLocaleString()}</p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Gift className="w-5 h-5 text-neon-pink" />
                <span className="text-white/70 text-sm">Total Gifts</span>
              </div>
              <p className="text-white font-bold text-xl">{mockCreatorData.totalGifts}</p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-neon-orange" />
                <span className="text-white/70 text-sm">Superchats</span>
              </div>
              <p className="text-white font-bold text-xl">{mockCreatorData.superchatCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mx-4 mt-4 glass-dark rounded-2xl p-1">
        <div className="flex">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 flex items-center justify-center py-3 rounded-xl smooth-transition ${
              activeTab === 'posts'
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple shadow-neon'
                : 'hover:bg-white/10'
            }`}
          >
            <Grid className={`w-5 h-5 ${activeTab === 'posts' ? 'text-white' : 'text-white/70'}`} />
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 flex items-center justify-center py-3 rounded-xl smooth-transition ${
              activeTab === 'saved'
                ? 'bg-gradient-to-r from-neon-pink to-neon-orange shadow-neon'
                : 'hover:bg-white/10'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${activeTab === 'saved' ? 'text-white' : 'text-white/70'}`} />
          </button>
          {isCreator && (
            <>
              <button
                onClick={() => setActiveTab('wallet')}
                className={`flex-1 flex items-center justify-center py-3 rounded-xl smooth-transition ${
                  activeTab === 'wallet'
                    ? 'bg-gradient-to-r from-neon-green to-neon-blue shadow-neon'
                    : 'hover:bg-white/10'
                }`}
              >
                <Wallet className={`w-5 h-5 ${activeTab === 'wallet' ? 'text-white' : 'text-white/70'}`} />
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 flex items-center justify-center py-3 rounded-xl smooth-transition ${
                  activeTab === 'analytics'
                    ? 'bg-gradient-to-r from-neon-orange to-neon-pink shadow-neon'
                    : 'hover:bg-white/10'
                }`}
              >
                <BarChart3 className={`w-5 h-5 ${activeTab === 'analytics' ? 'text-white' : 'text-white/70'}`} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="mx-4 mt-4">
        {activeTab === 'posts' && (
          <div className="grid grid-cols-3 gap-2">
            {postsLoading ? (
              [...Array(9)].map((_, i) => (
                <div key={i} className="aspect-square bg-white/10 rounded-2xl animate-pulse"></div>
              ))
            ) : posts.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Grid className="w-10 h-10 text-white/50" />
                </div>
                <p className="text-white/70">No posts yet</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="aspect-square glass-dark rounded-2xl overflow-hidden smooth-transition hover:scale-105">
                  <img
                    src={post.images?.[0] || 'https://picsum.photos/400/400?random=1'}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'wallet' && isCreator && (
          <div className="space-y-4">
            {/* Wallet Overview */}
            <div className="glass-dark rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">Wallet Balance</h3>
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-neon-yellow" />
                  <span className="text-neon-yellow text-sm">₹{mockCreatorData.totalEarnings.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-neon-green to-neon-blue rounded-2xl p-4 mb-4">
                <p className="text-white/80 text-sm mb-1">Available Balance</p>
                <p className="text-white font-bold text-3xl">₹{mockCreatorData.totalEarnings.toLocaleString()}</p>
              </div>
              
              <div className="flex space-x-3">
                <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold smooth-transition">
                  Withdraw
                </button>
                <button className="flex-1 bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-neon text-white py-3 rounded-xl font-semibold smooth-transition">
                  View Details
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="glass-dark rounded-3xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {mockCreatorData.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'video_earnings' ? 'bg-neon-blue/20' :
                        transaction.type === 'superchat' ? 'bg-neon-pink/20' :
                        'bg-neon-green/20'
                      }`}>
                        {transaction.type === 'video_earnings' ? (
                          <Eye className="w-5 h-5 text-neon-blue" />
                        ) : transaction.type === 'superchat' ? (
                          <Zap className="w-5 h-5 text-neon-pink" />
                        ) : (
                          <Gift className="w-5 h-5 text-neon-green" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{transaction.description}</p>
                        <p className="text-white/60 text-xs">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-neon-green font-bold">+₹{transaction.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && isCreator && (
          <div className="space-y-4">
            <div className="glass-dark rounded-3xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Performance Analytics</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-2xl p-4">
                  <p className="text-white/70 text-sm mb-1">Total Videos</p>
                  <p className="text-white font-bold text-2xl">{mockCreatorData.analytics.totalVideos}</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4">
                  <p className="text-white/70 text-sm mb-1">Avg Views</p>
                  <p className="text-white font-bold text-2xl">{mockCreatorData.analytics.avgViews.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4">
                  <p className="text-white/70 text-sm mb-1">Engagement Rate</p>
                  <p className="text-white font-bold text-2xl">{mockCreatorData.analytics.engagementRate}%</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4">
                  <p className="text-white/70 text-sm mb-1">Top Video Views</p>
                  <p className="text-white font-bold text-2xl">{mockCreatorData.analytics.topVideoViews.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl p-4">
                <p className="text-white/80 text-sm mb-1">Top Performing Video</p>
                <p className="text-white font-bold text-lg">{mockCreatorData.analytics.topVideo}</p>
                <p className="text-white/70 text-sm">{mockCreatorData.analytics.topVideoViews.toLocaleString()} views</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-dark rounded-3xl p-6 w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl">Send Gift</h3>
              <button
                onClick={() => setShowGiftModal(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 smooth-transition"
              >
                <span className="text-white text-xl">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Rose', price: 10, emoji: '🌹' },
                  { name: 'Heart', price: 25, emoji: '❤️' },
                  { name: 'Crown', price: 50, emoji: '👑' },
                  { name: 'Diamond', price: 100, emoji: '💎' },
                  { name: 'Rocket', price: 200, emoji: '🚀' },
                  { name: 'Star', price: 500, emoji: '⭐' }
                ].map((gift) => (
                  <button
                    key={gift.name}
                    onClick={() => handleSendGift(gift.name, gift.price)}
                    className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl smooth-transition hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{gift.emoji}</div>
                    <p className="text-white text-sm font-semibold">{gift.name}</p>
                    <p className="text-neon-green text-xs">₹{gift.price}</p>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setShowSuperchatModal(true)}
                className="w-full bg-gradient-to-r from-neon-pink to-neon-orange hover:shadow-neon text-white py-3 rounded-xl font-semibold smooth-transition"
              >
                Send Superchat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Superchat Modal */}
      {showSuperchatModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-dark rounded-3xl p-6 w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl">Superchat</h3>
              <button
                onClick={() => setShowSuperchatModal(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 smooth-transition"
              >
                <span className="text-white text-xl">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100, 200, 500, 1000, 2000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleSuperchat(amount, '')}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl smooth-transition hover:scale-105"
                  >
                    <p className="text-white font-semibold">₹{amount}</p>
                  </button>
                ))}
              </div>
              
              <div>
                <label className="text-white/70 text-sm mb-2 block">Message (Optional)</label>
                <textarea
                  placeholder="Type your message..."
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 resize-none"
                  rows={3}
                />
              </div>
              
              <button
                onClick={() => handleSuperchat(50, 'Amazing content!')}
                className="w-full bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-neon text-white py-3 rounded-xl font-semibold smooth-transition"
              >
                Send Superchat ₹50
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );

  if (isDesktop) {
    return <DesktopLayout>{renderProfileContent()}</DesktopLayout>;
  }

  return renderProfileContent();
};

export default Profile;
