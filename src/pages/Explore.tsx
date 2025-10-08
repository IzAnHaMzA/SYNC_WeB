import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DesktopLayout from '../components/DesktopLayout';
import BottomNavigation from '../components/BottomNavigation';
import { 
  Play, 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Grid,
  List,
  Filter
} from 'lucide-react';

interface ExplorePost {
  id: string;
  username: string;
  avatar: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  isVideo: boolean;
  duration?: string;
}

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if we're on desktop
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Mock explore posts data
  const explorePosts: ExplorePost[] = [
    {
      id: '1',
      username: 'muslim_content',
      avatar: 'https://ui-avatars.com/api/?name=Muslim+Content&background=00d4ff&color=fff',
      image: 'https://picsum.photos/400/400?random=30',
      caption: 'WE ARE MUSLIMS 🇵🇸',
      likes: 12500,
      comments: 890,
      isVideo: true,
      duration: '0:15'
    },
    {
      id: '2',
      username: 'islamic_teacher',
      avatar: 'https://ui-avatars.com/api/?name=Islamic+Teacher&background=f093fb&color=fff',
      image: 'https://picsum.photos/400/400?random=31',
      caption: 'BE A MUSLIM!',
      likes: 8900,
      comments: 456,
      isVideo: true,
      duration: '0:22'
    },
    {
      id: '3',
      username: 'quran_study',
      avatar: 'https://ui-avatars.com/api/?name=Quran+Study&background=764ba2&color=fff',
      image: 'https://picsum.photos/400/400?random=32',
      caption: 'الرَّحْمَنُ (1) - The Most Merciful',
      likes: 15600,
      comments: 234,
      isVideo: true,
      duration: '0:18'
    },
    {
      id: '4',
      username: 'spiritual_guide',
      avatar: 'https://ui-avatars.com/api/?name=Spiritual+Guide&background=0099cc&color=fff',
      image: 'https://picsum.photos/400/400?random=33',
      caption: 'Reflection and contemplation',
      likes: 7800,
      comments: 123,
      isVideo: true,
      duration: '0:25'
    },
    {
      id: '5',
      username: 'prayer_community',
      avatar: 'https://ui-avatars.com/api/?name=Prayer+Community&background=ff6b35&color=fff',
      image: 'https://picsum.photos/400/400?random=34',
      caption: 'Community prayer gathering',
      likes: 11200,
      comments: 567,
      isVideo: true,
      duration: '0:30'
    },
    {
      id: '6',
      username: 'tech_creator',
      avatar: 'https://ui-avatars.com/api/?name=Tech+Creator&background=667eea&color=fff',
      image: 'https://picsum.photos/400/400?random=35',
      caption: 'Building the future with AI',
      likes: 18900,
      comments: 890,
      isVideo: true,
      duration: '0:45'
    },
    {
      id: '7',
      username: 'art_lover',
      avatar: 'https://ui-avatars.com/api/?name=Art+Lover&background=f093fb&color=fff',
      image: 'https://picsum.photos/400/400?random=36',
      caption: 'Digital art showcase',
      likes: 14500,
      comments: 678,
      isVideo: false
    },
    {
      id: '8',
      username: 'fitness_guru',
      avatar: 'https://ui-avatars.com/api/?name=Fitness+Guru&background=764ba2&color=fff',
      image: 'https://picsum.photos/400/400?random=37',
      caption: 'Morning workout routine',
      likes: 9800,
      comments: 234,
      isVideo: true,
      duration: '1:20'
    },
    {
      id: '9',
      username: 'music_producer',
      avatar: 'https://ui-avatars.com/api/?name=Music+Producer&background=0099cc&color=fff',
      image: 'https://picsum.photos/400/400?random=38',
      caption: 'New beat in the studio',
      likes: 16700,
      comments: 456,
      isVideo: true,
      duration: '0:35'
    }
  ];

  const handlePostClick = (post: ExplorePost) => {
    if (post.isVideo) {
      navigate('/reels');
    } else {
      // Navigate to post detail
      console.log('Navigate to post:', post.id);
    }
  };

  const renderPost = (post: ExplorePost) => (
    <div
      key={post.id}
      onClick={() => handlePostClick(post)}
      className="relative group cursor-pointer smooth-transition hover:scale-105"
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={post.image}
          alt={post.caption}
          className="w-full h-full object-cover"
        />
        
        {/* Video overlay */}
        {post.isVideo && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </div>
        )}
        
        {/* Duration for videos */}
        {post.isVideo && post.duration && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
            {post.duration}
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 smooth-transition flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-white">
              <Heart className="w-5 h-5" />
              <span className="text-sm font-semibold">{post.likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1 text-white">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">{post.comments.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExploreContent = () => (
    <div className="w-full">
      {/* Header */}
      <div className="glass-dark border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white font-futuristic">Explore</h1>
          
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex bg-white/10 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg smooth-transition ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-neon-blue to-neon-purple shadow-neon' 
                    : 'hover:bg-white/10'
                }`}
              >
                <Grid className={`w-5 h-5 ${viewMode === 'grid' ? 'text-white' : 'text-white/70'}`} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg smooth-transition ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-neon-blue to-neon-purple shadow-neon' 
                    : 'hover:bg-white/10'
                }`}
              >
                <List className={`w-5 h-5 ${viewMode === 'list' ? 'text-white' : 'text-white/70'}`} />
              </button>
            </div>
            
            {/* Filter Button */}
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 smooth-transition">
              <Filter className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {explorePosts.map(renderPost)}
          </div>
        ) : (
          <div className="space-y-4">
            {explorePosts.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post)}
                className="glass-dark rounded-2xl overflow-hidden smooth-transition hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                    {post.isVideo && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-4 h-4 text-white ml-0.5" />
                        </div>
                      </div>
                    )}
                    {post.isVideo && post.duration && (
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                        {post.duration}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <img
                        src={post.avatar}
                        alt={post.username}
                        className="w-8 h-8 rounded-full border-2 border-white/20"
                      />
                      <span className="text-white font-semibold text-sm">@{post.username}</span>
                    </div>
                    
                    <p className="text-white text-sm mb-3 line-clamp-2">{post.caption}</p>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-white/70" />
                        <span className="text-white/70 text-sm">{post.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4 text-white/70" />
                        <span className="text-white/70 text-sm">{post.comments.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isDesktop) {
    return <DesktopLayout>{renderExploreContent()}</DesktopLayout>;
  }

  // Mobile layout
  return (
    <div className="min-h-screen bg-futuristic-dark particle-bg pb-20 overflow-y-auto">
      {renderExploreContent()}
      <BottomNavigation />
    </div>
  );
};

export default Explore;
