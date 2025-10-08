import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Pause, Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';

interface Story {
  id: number;
  username: string;
  avatar: string;
  isOwn: boolean;
  hasStory: boolean;
  storyImage?: string;
  duration?: number;
  likes?: number;
  comments?: number;
  timestamp?: string;
}

const StoriesBar: React.FC = () => {
  const navigate = useNavigate();
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock stories data with enhanced features
  const stories: Story[] = [
    {
      id: 1,
      username: 'your_story',
      avatar: 'https://ui-avatars.com/api/?name=You&background=667eea&color=fff',
      isOwn: true,
      hasStory: false
    },
    {
      id: 2,
      username: 'john_doe',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=00d4ff&color=fff',
      isOwn: false,
      hasStory: true,
      storyImage: 'https://picsum.photos/400/600?random=1',
      duration: 5000,
      likes: 24,
      comments: 8,
      timestamp: '2h ago'
    },
    {
      id: 3,
      username: 'jane_smith',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=f093fb&color=fff',
      isOwn: false,
      hasStory: true,
      storyImage: 'https://picsum.photos/400/600?random=2',
      duration: 5000,
      likes: 156,
      comments: 23,
      timestamp: '4h ago'
    },
    {
      id: 4,
      username: 'mike_wilson',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Wilson&background=764ba2&color=fff',
      isOwn: false,
      hasStory: true,
      storyImage: 'https://picsum.photos/400/600?random=3',
      duration: 5000,
      likes: 89,
      comments: 12,
      timestamp: '6h ago'
    },
    {
      id: 5,
      username: 'sarah_jones',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Jones&background=0099cc&color=fff',
      isOwn: false,
      hasStory: true,
      storyImage: 'https://picsum.photos/400/600?random=4',
      duration: 5000,
      likes: 67,
      comments: 15,
      timestamp: '8h ago'
    },
    {
      id: 6,
      username: 'alex_chen',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=ff6b35&color=fff',
      isOwn: false,
      hasStory: true,
      storyImage: 'https://picsum.photos/400/600?random=5',
      duration: 5000,
      likes: 203,
      comments: 31,
      timestamp: '12h ago'
    }
  ];

  const handleStoryClick = (story: Story) => {
    if (story.isOwn) {
      // Handle create story
      console.log('Create new story');
      return;
    }

    if (story.hasStory) {
      setActiveStory(story.id);
      setIsPlaying(true);
      setCurrentTime(0);
    } else {
      // Navigate to profile if no story
      navigate(`/profile/${story.username}`);
    }
  };

  const closeStory = () => {
    setActiveStory(null);
    setIsPlaying(false);
    setCurrentTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Progress animation
  useEffect(() => {
    if (isPlaying && activeStory) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 50;
          if (newTime >= 5000) {
            closeStory();
            return 0;
          }
          return newTime;
        });
      }, 50);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, activeStory]);

  const currentStory = stories.find(story => story.id === activeStory);
  const progressPercentage = currentStory ? (currentTime / currentStory.duration!) * 100 : 0;

  return (
    <>
      {/* Stories Bar */}
      <div className="glass-dark border-b border-white/10 px-4 py-4 particle-bg">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {stories.map((story) => (
            <div key={story.id} className="flex-shrink-0 text-center group">
              <div 
                className="relative cursor-pointer smooth-transition group-hover:scale-105"
                onClick={() => handleStoryClick(story)}
              >
                <div className={`w-16 h-16 rounded-full p-0.5 smooth-transition ${
                  story.hasStory 
                    ? 'bg-gradient-to-tr from-neon-blue via-neon-pink to-neon-purple hover:shadow-neon' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}>
                  <div className="w-full h-full rounded-full bg-futuristic-dark p-0.5">
                    <img
                      src={story.avatar}
                      alt={story.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                  </div>
              </div>
                
                {story.isOwn && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-neon-blue rounded-full flex items-center justify-center smooth-transition hover:scale-110 hover:shadow-neon">
                    <Plus className="w-4 h-4 text-white" />
          </div>
        )}

                {/* Story indicator */}
                {story.hasStory && !story.isOwn && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-neon-green rounded-full animate-pulse-glow">
                    <div className="w-full h-full bg-neon-green rounded-full animate-ping"></div>
              </div>
                )}
            </div>
              <p className="text-xs text-white/70 mt-2 truncate w-16 font-inter">
                {story.isOwn ? 'Your story' : story.username}
              </p>
          </div>
        ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {activeStory && currentStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full h-full max-w-md mx-auto">
            {/* Story Image */}
            <div className="relative w-full h-full">
              <img
                src={currentStory.storyImage}
                alt={currentStory.username}
                className="w-full h-full object-cover"
              />

              {/* Progress Bar */}
              <div className="absolute top-4 left-4 right-4 z-10">
                <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-neon-blue to-neon-pink rounded-full smooth-transition"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Header */}
              <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
                <div className="flex items-center space-x-3">
                  <img
                    src={currentStory.avatar}
                    alt={currentStory.username}
                    className="w-8 h-8 rounded-full border-2 border-white/50 smooth-transition hover:border-neon-blue"
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">{currentStory.username}</p>
                    <p className="text-white/70 text-xs">{currentStory.timestamp}</p>
                </div>
              </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={togglePlayPause}
                    className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 smooth-transition hover:scale-110"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                  </button>
                  
                  <button
                    onClick={closeStory}
                    className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 smooth-transition hover:scale-110"
                  >
                    <span className="text-white text-xl">×</span>
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 smooth-transition">
                      <Heart className="w-5 h-5 text-white" />
                      <span className="text-white text-sm">{currentStory.likes}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 smooth-transition">
                      <MessageCircle className="w-5 h-5 text-white" />
                      <span className="text-white text-sm">{currentStory.comments}</span>
                    </button>
                    
                    <button className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 smooth-transition">
                      <Share className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  
                  <button className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 smooth-transition">
                    <MoreHorizontal className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Interactive Areas */}
              <div className="absolute inset-0 flex">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => {/* Previous story */}}
                ></div>
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => {/* Next story */}}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoriesBar;
