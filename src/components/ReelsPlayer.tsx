import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark, 
  MoreHorizontal, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Music,
  UserPlus
} from 'lucide-react';

interface Reel {
  id: number;
  username: string;
  avatar: string;
  videoUrl: string;
  thumbnail: string;
  title: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isFollowing: boolean;
  music: string;
  timestamp: string;
}

const ReelsPlayer: React.FC = () => {
  const [currentReel, setCurrentReel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock reels data
  const reels: Reel[] = [
    {
      id: 1,
      username: 'tech_creator',
      avatar: 'https://ui-avatars.com/api/?name=Tech+Creator&background=00d4ff&color=fff',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail: 'https://picsum.photos/400/600?random=10',
      title: 'Amazing Tech Demo',
      description: 'Check out this incredible technology! 🚀',
      likes: 12500,
      comments: 234,
      shares: 89,
      isLiked: false,
      isBookmarked: false,
      isFollowing: false,
      music: 'Original Sound - tech_creator',
      timestamp: '2h ago'
    },
    {
      id: 2,
      username: 'art_lover',
      avatar: 'https://ui-avatars.com/api/?name=Art+Lover&background=f093fb&color=fff',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      thumbnail: 'https://picsum.photos/400/600?random=11',
      title: 'Digital Art Process',
      description: 'Creating magic with digital brushes ✨',
      likes: 8900,
      comments: 156,
      shares: 67,
      isLiked: true,
      isBookmarked: true,
      isFollowing: true,
      music: 'Creative Vibes - art_lover',
      timestamp: '4h ago'
    },
    {
      id: 3,
      username: 'fitness_guru',
      avatar: 'https://ui-avatars.com/api/?name=Fitness+Guru&background=764ba2&color=fff',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
      thumbnail: 'https://picsum.photos/400/600?random=12',
      title: 'Morning Workout',
      description: 'Start your day with energy! 💪',
      likes: 15600,
      comments: 445,
      shares: 123,
      isLiked: false,
      isBookmarked: false,
      isFollowing: false,
      music: 'Workout Beat - fitness_guru',
      timestamp: '6h ago'
    }
  ];

  const currentReelData = reels[currentReel];

  // Handle video play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle like
  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  // Handle bookmark
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Handle follow
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  // Handle scroll to next/previous reel
  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentReel > 0) {
      setCurrentReel(currentReel - 1);
    } else if (direction === 'down' && currentReel < reels.length - 1) {
      setCurrentReel(currentReel + 1);
    }
  };

  // Auto-play when reel changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play();
      }
    }
  }, [currentReel]);

  // Handle wheel scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        handleScroll('down');
      } else {
        handleScroll('up');
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [currentReel]);

  // Format numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      {/* Video Player */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={currentReelData.thumbnail}
          loop
          muted={isMuted}
          onClick={togglePlayPause}
        >
          <source src={currentReelData.videoUrl} type="video/mp4" />
        </video>

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
            onClick={togglePlayPause}
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center smooth-transition hover:scale-110">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-neon-blue rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <span className="text-white font-semibold text-lg">Reels</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 smooth-transition"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
            
            <button className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 smooth-transition">
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
          {/* Profile */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={currentReelData.avatar}
                alt={currentReelData.username}
                className="w-12 h-12 rounded-full border-2 border-white/50 smooth-transition hover:border-neon-blue"
              />
              {!isFollowing && (
                <button
                  onClick={handleFollow}
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-neon-blue rounded-full flex items-center justify-center smooth-transition hover:scale-110"
                >
                  <UserPlus className="w-3 h-3 text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Like */}
          <button
            onClick={handleLike}
            className="flex flex-col items-center space-y-1 smooth-transition hover:scale-110"
          >
            <div className={`p-3 rounded-full smooth-transition ${
              isLiked 
                ? 'bg-red-500 shadow-neon' 
                : 'bg-black/30 backdrop-blur-sm hover:bg-black/50'
            }`}>
              <Heart 
                className={`w-6 h-6 smooth-transition ${
                  isLiked ? 'text-white fill-white' : 'text-white'
                }`} 
              />
            </div>
            <span className="text-white text-xs font-semibold">
              {formatNumber(currentReelData.likes + (isLiked ? 1 : 0))}
            </span>
          </button>

          {/* Comments */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center space-y-1 smooth-transition hover:scale-110"
          >
            <div className="p-3 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 smooth-transition">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-semibold">
              {formatNumber(currentReelData.comments)}
            </span>
          </button>

          {/* Share */}
          <button className="flex flex-col items-center space-y-1 smooth-transition hover:scale-110">
            <div className="p-3 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 smooth-transition">
              <Share className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-semibold">
              {formatNumber(currentReelData.shares)}
            </span>
          </button>

          {/* Bookmark */}
          <button
            onClick={handleBookmark}
            className="smooth-transition hover:scale-110"
          >
            <div className={`p-3 rounded-full smooth-transition ${
              isBookmarked 
                ? 'bg-neon-blue shadow-neon' 
                : 'bg-black/30 backdrop-blur-sm hover:bg-black/50'
            }`}>
              <Bookmark 
                className={`w-6 h-6 smooth-transition ${
                  isBookmarked ? 'text-white fill-white' : 'text-white'
                }`} 
              />
            </div>
          </button>

          {/* Music Disc */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-neon-blue to-neon-pink p-0.5 animate-spin">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-4 left-4 right-20">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-white font-semibold text-sm">
              @{currentReelData.username}
            </span>
            {isFollowing && (
              <span className="text-white/70 text-xs bg-white/20 px-2 py-1 rounded-full">
                Following
              </span>
            )}
          </div>
          
          <p className="text-white text-sm mb-2 leading-relaxed">
            {currentReelData.description}
          </p>
          
          <div className="flex items-center space-x-2">
            <Music className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-xs">
              {currentReelData.music}
            </span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-gradient-to-r from-neon-blue to-neon-pink smooth-transition"
            style={{ width: `${((currentReel + 1) / reels.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-20 animate-slide-up">
          <div className="absolute bottom-0 left-0 right-0 h-96 bg-futuristic-dark/95 backdrop-blur-xl rounded-t-3xl border-t border-white/10">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">
                  {formatNumber(currentReelData.comments)} Comments
                </h3>
                <button
                  onClick={() => setShowComments(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 smooth-transition"
                >
                  <span className="text-white text-xl">×</span>
                </button>
              </div>
              
              {/* Mock comments */}
              <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-hide">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=User${i}&background=667eea&color=fff`}
                      alt={`User ${i}`}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="bg-white/10 rounded-2xl px-3 py-2">
                        <p className="text-white text-sm">
                          <span className="font-semibold">user{i}</span> This is amazing! 🔥
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 ml-3">
                        <span className="text-white/50 text-xs">2h</span>
                        <button className="text-white/50 text-xs hover:text-white smooth-transition">
                          Reply
                        </button>
                        <button className="text-white/50 text-xs hover:text-white smooth-transition">
                          Like
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReelsPlayer;
