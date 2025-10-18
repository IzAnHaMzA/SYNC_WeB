import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, MapPin, Hash, Play } from 'lucide-react';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';
import { api } from '../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// Mock user data for posts
const getMockUserData = (userId: string) => {
  const mockUsers: Record<string, any> = {
    '1': {
      username: 'tech_creator',
      fullName: 'Tech Creator',
      avatar: 'https://ui-avatars.com/api/?name=Tech+Creator&background=00d4ff&color=fff'
    },
    '2': {
      username: 'art_lover',
      fullName: 'Art Lover',
      avatar: 'https://ui-avatars.com/api/?name=Art+Lover&background=f093fb&color=fff'
    },
    '3': {
      username: 'fitness_guru',
      fullName: 'Fitness Guru',
      avatar: 'https://ui-avatars.com/api/?name=Fitness+Guru&background=764ba2&color=fff'
    }
  };
  
  return mockUsers[userId] || {
    username: 'user',
    fullName: 'User',
    avatar: 'https://ui-avatars.com/api/?name=User&background=667eea&color=fff'
  };
};

interface PostCardProps {
  post: Post;
  onLike?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const { user } = useAuth();
  const { likePost, commentPost } = useWebSocket();
  const postUser = getMockUserData(post.user);
  const [isLiked, setIsLiked] = useState(post.likes.includes(user?._id || ''));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const getFilterStyle = () => {
    if (!post.filters) return {};
    const { brightness, contrast, saturation, blur, sepia } = post.filters;
    return {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) sepia(${sepia}%)`,
    };
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please log in to like posts');
      return;
    }
    
    if (isLiking) return; // Prevent double-clicking
    
    setIsLiking(true);
    
    try {
      if (isLiked) {
        await api.delete(`/posts/${post._id}/like`);
        setLikesCount(prev => prev - 1);
      } else {
        await api.post(`/posts/${post._id}/like`);
        setLikesCount(prev => prev + 1);
        // Send real-time like event
        likePost(post._id);
      }
      setIsLiked(!isLiked);
      onLike?.();
    } catch (error) {
      toast.error('Failed to update like');
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Please log in to save posts');
      return;
    }
    
    try {
      await api.post(`/posts/${post._id}/save`);
      toast.success('Post saved');
    } catch (error) {
      toast.error('Failed to save post');
    }
  };

  const nextImage = () => {
    if (currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
          <img
            src={postUser.avatar || `https://ui-avatars.com/api/?name=${postUser.username}`}
            alt={postUser.username}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="font-semibold text-sm">{postUser.username}</p>
            <p className="text-xs text-gray-500">{postUser.fullName}</p>
          </div>
        </div>
        <button className="p-1">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Media */}
      <div className="relative">
        {post.type === 'video' && post.videos && post.videos.length > 0 ? (
          <div className="relative">
            <video
              src={post.videos[currentImageIndex]}
              className="w-full aspect-square object-cover"
              style={getFilterStyle()}
              controls
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            />
            {!isVideoPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <img
            src={post.images[currentImageIndex]}
            alt="Post"
            className="w-full aspect-square object-cover"
            style={getFilterStyle()}
          />
        )}
        
        {/* Media Navigation */}
        {(post.images.length > 1 || (post.videos && post.videos.length > 1)) && (
          <>
            {currentImageIndex > 0 && (
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center"
              >
                ←
              </button>
            )}
            {currentImageIndex < (post.images.length - 1) && (
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center"
              >
                →
              </button>
            )}
            
            {/* Media Indicators */}
            <div className="absolute top-2 right-2 flex space-x-1">
              {post.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={handleLike}
              disabled={isLiking}
              className={`transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-700'
              } ${isLiking ? 'opacity-50' : ''}`}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </motion.button>
            <button className="text-gray-700">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="text-gray-700">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button onClick={handleSave} className="text-gray-700">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm mb-1">
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </p>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold mr-2">{postUser.username}</span>
          <span>{post.caption}</span>
        </div>

        {/* Location */}
        {post.location && (
          <div className="flex items-center space-x-1 mt-1">
            <MapPin className="w-3 h-3 text-gray-500" />
            <span className="text-gray-500 text-xs">{post.location}</span>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="text-blue-500 text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments */}
        {post.comments.length > 0 && (
          <button className="text-gray-500 text-sm mt-1">
            View all {post.comments.length} comments
          </button>
        )}

        {/* Time */}
        <p className="text-gray-500 text-xs mt-2">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PostCard;
