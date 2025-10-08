import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import StoriesBar from '../components/StoriesBar';
import ReelsPlayer from '../components/ReelsPlayer';
import BottomNavigation from '../components/BottomNavigation';
import DesktopLayout from '../components/DesktopLayout';
import { LogIn, UserPlus, Sparkles, Zap, Sun, Moon, Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'reels'>('feed');
  const [showStoryUpload, setShowStoryUpload] = useState(false);
  const { user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  // Mock posts data for feed
  const mockPosts = [
    {
      id: 1,
      username: 'tech_creator',
      avatar: 'https://ui-avatars.com/api/?name=Tech+Creator&background=00d4ff&color=fff',
      image: 'https://picsum.photos/400/400?random=20',
      caption: 'Building the future with code! 🚀 #tech #coding #future',
      likes: 1250,
      comments: 45,
      timestamp: '2h ago',
      isLiked: false
    },
    {
      id: 2,
      username: 'art_lover',
      avatar: 'https://ui-avatars.com/api/?name=Art+Lover&background=f093fb&color=fff',
      image: 'https://picsum.photos/400/400?random=21',
      caption: 'Digital art in progress ✨ #art #digital #creative',
      likes: 890,
      comments: 23,
      timestamp: '4h ago',
      isLiked: true
    },
    {
      id: 3,
      username: 'fitness_guru',
      avatar: 'https://ui-avatars.com/api/?name=Fitness+Guru&background=764ba2&color=fff',
      image: 'https://picsum.photos/400/400?random=22',
      caption: 'Morning workout complete! 💪 #fitness #health #motivation',
      likes: 1560,
      comments: 67,
      timestamp: '6h ago',
      isLiked: false
    },
    {
      id: 4,
      username: 'music_producer',
      avatar: 'https://ui-avatars.com/api/?name=Music+Producer&background=0099cc&color=fff',
      image: 'https://picsum.photos/400/400?random=23',
      caption: 'New beat dropping soon! 🎵 #music #producer #beats',
      likes: 2100,
      comments: 89,
      timestamp: '8h ago',
      isLiked: false
    },
    {
      id: 5,
      username: 'travel_blogger',
      avatar: 'https://ui-avatars.com/api/?name=Travel+Blogger&background=ff6b35&color=fff',
      image: 'https://picsum.photos/400/400?random=24',
      caption: 'Exploring the hidden gems of Tokyo! 🗾 #travel #tokyo #adventure',
      likes: 3400,
      comments: 156,
      timestamp: '12h ago',
      isLiked: true
    },
    {
      id: 6,
      username: 'food_critic',
      avatar: 'https://ui-avatars.com/api/?name=Food+Critic&background=667eea&color=fff',
      image: 'https://picsum.photos/400/400?random=25',
      caption: 'This ramen is absolutely incredible! 🍜 #food #ramen #delicious',
      likes: 1800,
      comments: 78,
      timestamp: '1d ago',
      isLiked: false
    },
    {
      id: 7,
      username: 'gaming_streamer',
      avatar: 'https://ui-avatars.com/api/?name=Gaming+Streamer&background=f093fb&color=fff',
      image: 'https://picsum.photos/400/400?random=26',
      caption: 'Just hit a new high score! 🎮 #gaming #streaming #achievement',
      likes: 4200,
      comments: 234,
      timestamp: '1d ago',
      isLiked: true
    },
    {
      id: 8,
      username: 'fashion_designer',
      avatar: 'https://ui-avatars.com/api/?name=Fashion+Designer&background=764ba2&color=fff',
      image: 'https://picsum.photos/400/400?random=27',
      caption: 'New collection coming soon! 👗 #fashion #design #style',
      likes: 2900,
      comments: 145,
      timestamp: '2d ago',
      isLiked: false
    }
  ];

  const handleTabChange = (tab: 'feed' | 'reels') => {
    setActiveTab(tab);
  };

  // Check if we're on desktop (screen width > 768px)
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const renderContent = () => (
    <div className="w-full">
      {activeTab === 'feed' ? (
        <div className="animate-fade-in">
      {/* Stories */}
          <StoriesBar />
      
      {/* Posts Feed */}
          <div className="px-4 pb-4">
            {mockPosts.length === 0 ? (
          <div className="text-center py-12">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-10 h-10 text-white/50" />
                </div>
                <p className="text-white/70 mb-4">No posts to show</p>
            {!user && (
                  <div className="space-y-4">
                    <p className="text-white/50 text-sm">Sign up to see more posts and create your own!</p>
                <button
                  onClick={() => navigate('/register')}
                      className="bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-neon text-white px-6 py-3 rounded-xl font-semibold smooth-transition"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        ) : (
              <div className="space-y-6">
                {mockPosts.map((post) => (
                  <div key={post.id} className="glass-dark rounded-3xl overflow-hidden smooth-transition hover:scale-[1.01]">
                    {/* Post Header */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.avatar}
                          alt={post.username}
                          className="w-10 h-10 rounded-full border-2 border-white/20 cursor-pointer hover:border-neon-blue smooth-transition"
                          onClick={() => navigate(`/profile/${post.username}`)}
                        />
                        <div>
                          <button 
                            onClick={() => navigate(`/profile/${post.username}`)}
                            className="text-white font-semibold text-sm hover:text-neon-blue smooth-transition"
                          >
                            @{post.username}
                          </button>
                          <p className="text-white/60 text-xs">{post.timestamp}</p>
                        </div>
                      </div>
                      <button className="p-2 rounded-full hover:bg-white/10 smooth-transition">
                        <MoreHorizontal className="w-5 h-5 text-white" />
                      </button>
                    </div>

                    {/* Post Image */}
                    <div className="relative">
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full h-96 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Post Actions */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <button className="smooth-transition hover:scale-110">
                            <Heart className={`w-6 h-6 ${post.isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                          </button>
                          <button className="smooth-transition hover:scale-110">
                            <MessageCircle className="w-6 h-6 text-white" />
                          </button>
                          <button className="smooth-transition hover:scale-110">
                            <Share className="w-6 h-6 text-white" />
                          </button>
                        </div>
                        <button className="smooth-transition hover:scale-110">
                          <Bookmark className="w-6 h-6 text-white" />
                        </button>
                      </div>

                      {/* Post Stats */}
                      <div className="mb-3">
                        <p className="text-white font-semibold text-sm">
                          {post.likes.toLocaleString()} likes
                        </p>
                      </div>

                      {/* Post Caption */}
                      <div className="space-y-1">
                        <p className="text-white text-sm">
                          <span className="font-semibold">@{post.username}</span> {post.caption}
                        </p>
                        <button className="text-white/60 text-sm hover:text-white smooth-transition">
                          View all {post.comments} comments
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <ReelsPlayer />
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <DesktopLayout>
        {renderContent()}
      </DesktopLayout>
    );
  }

  // Mobile layout
  return (
    <div className="min-h-screen bg-futuristic-dark particle-bg pb-20 overflow-y-auto">
      {/* Mobile Header */}
      <div className="glass-dark border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-futuristic">
                FutureSocial
              </h1>
              <p className="text-white/60 text-xs">Next-gen social media</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 smooth-transition"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-white" />
              )}
            </button>
            
            {!user && (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl smooth-transition"
                >
                  <LogIn className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Log In</span>
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-neon rounded-xl smooth-transition"
                >
                  <UserPlus className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Sign Up</span>
                </button>
              </>
        )}
      </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mt-4 space-x-1 bg-white/5 rounded-2xl p-1">
          <button
            onClick={() => handleTabChange('feed')}
            className={`flex-1 py-2 px-4 rounded-xl smooth-transition ${
              activeTab === 'feed'
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple shadow-neon'
                : 'hover:bg-white/10'
            }`}
          >
            <span className={`text-sm font-medium ${
              activeTab === 'feed' ? 'text-white' : 'text-white/70'
            }`}>
              Feed
            </span>
          </button>
          <button
            onClick={() => handleTabChange('reels')}
            className={`flex-1 py-2 px-4 rounded-xl smooth-transition ${
              activeTab === 'reels'
                ? 'bg-gradient-to-r from-neon-pink to-neon-orange shadow-neon'
                : 'hover:bg-white/10'
            }`}
          >
            <span className={`text-sm font-medium ${
              activeTab === 'reels' ? 'text-white' : 'text-white/70'
            }`}>
              Reels
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Content */}
      {renderContent()}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Home;
