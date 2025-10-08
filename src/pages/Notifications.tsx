import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DesktopLayout from '../components/DesktopLayout';
import BottomNavigation from '../components/BottomNavigation';
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  ThumbsUp, 
  Share, 
  MoreHorizontal,
  Check,
  X,
  Clock,
  Bell
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'follow_request';
  user: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  isRead: boolean;
  postImage?: string;
  followRequestId?: string;
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'all' | 'follow_requests'>('all');
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

  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'mention',
      user: {
        id: '2',
        username: 'algorithmswithpeter',
        fullName: 'Algorithms with Peter',
        avatar: 'https://ui-avatars.com/api/?name=Algorithms+Peter&background=00d4ff&color=fff'
      },
      content: 'mentioned you in a comment',
      timestamp: '52m',
      isRead: false,
      postImage: 'https://picsum.photos/400/400?random=40'
    },
    {
      id: '2',
      type: 'mention',
      user: {
        id: '3',
        username: 'algorithmswithpeter',
        fullName: 'Algorithms with Peter',
        avatar: 'https://ui-avatars.com/api/?name=Algorithms+Peter&background=00d4ff&color=fff'
      },
      content: 'mentioned you in a comment',
      timestamp: '6d',
      isRead: true,
      postImage: 'https://picsum.photos/400/400?random=41'
    },
    {
      id: '3',
      type: 'mention',
      user: {
        id: '4',
        username: 'y_hustle_ai',
        fullName: 'Y Hustle AI',
        avatar: 'https://ui-avatars.com/api/?name=Y+Hustle+AI&background=f093fb&color=fff'
      },
      content: 'mentioned you in a comment',
      timestamp: '1w',
      isRead: true,
      postImage: 'https://picsum.photos/400/400?random=42'
    },
    {
      id: '4',
      type: 'mention',
      user: {
        id: '5',
        username: 'itspragygurjar',
        fullName: 'Pragy Gurjar',
        avatar: 'https://ui-avatars.com/api/?name=Pragy+Gurjar&background=764ba2&color=fff'
      },
      content: 'mentioned you in a comment',
      timestamp: '1w',
      isRead: true,
      postImage: 'https://picsum.photos/400/400?random=43'
    },
    {
      id: '5',
      type: 'like',
      user: {
        id: '6',
        username: 'sanjaynuthraofficial',
        fullName: 'Sanjay Nuthra',
        avatar: 'https://ui-avatars.com/api/?name=Sanjay+Nuthra&background=0099cc&color=fff'
      },
      content: 'liked your post',
      timestamp: '1w',
      isRead: true,
      postImage: 'https://picsum.photos/400/400?random=44'
    }
  ];

  const followRequests = [
    {
      id: '1',
      user: {
        id: '7',
        username: '_momin.abdullah_',
        fullName: 'Momin Abdullah',
        avatar: 'https://ui-avatars.com/api/?name=Momin+Abdullah&background=ff6b35&color=fff'
      },
      timestamp: '2h',
      mutualFriends: 6
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'mention':
        return <MessageCircle className="w-5 h-5 text-purple-500" />;
      case 'follow_request':
        return <UserPlus className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-white/70" />;
    }
  };

  const handleFollowRequest = (requestId: string, action: 'accept' | 'decline') => {
    console.log(`${action} follow request:`, requestId);
    // Handle follow request logic here
  };

  const renderNotificationItem = (notification: Notification) => (
    <div
      key={notification.id}
      className={`p-4 border-b border-white/5 smooth-transition ${
        !notification.isRead ? 'bg-white/5' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <img
              src={notification.user.avatar}
              alt={notification.user.username}
              className="w-6 h-6 rounded-full border border-white/20"
            />
            <span className="text-white font-semibold text-sm">
              {notification.user.username}
            </span>
            <span className="text-white/70 text-sm">
              {notification.content}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-xs">{notification.timestamp}</span>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
            )}
          </div>
        </div>
        
        {notification.postImage && (
          <div className="flex-shrink-0">
            <img
              src={notification.postImage}
              alt="Post"
              className="w-12 h-12 rounded-lg object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderFollowRequestItem = (request: any) => (
    <div
      key={request.id}
      className="p-4 border-b border-white/5 smooth-transition"
    >
      <div className="flex items-center space-x-3">
        <img
          src={request.user.avatar}
          alt={request.user.username}
          className="w-12 h-12 rounded-full border-2 border-white/20"
        />
        
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">{request.user.username}</p>
          <p className="text-white/60 text-xs">
            {request.mutualFriends} mutual friends
          </p>
          <p className="text-white/50 text-xs">{request.timestamp}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleFollowRequest(request.id, 'accept')}
            className="px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-neon text-white rounded-xl font-semibold smooth-transition"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFollowRequest(request.id, 'decline')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold smooth-transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsContent = () => (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="glass-dark border-b border-white/10 px-6 py-6">
        <h1 className="text-2xl font-bold text-white font-futuristic mb-6">Notifications</h1>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-xl smooth-transition ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple shadow-neon'
                : 'hover:bg-white/10'
            }`}
          >
            <span className={`text-sm font-medium ${
              activeTab === 'all' ? 'text-white' : 'text-white/70'
            }`}>
              All
            </span>
          </button>
          <button
            onClick={() => setActiveTab('follow_requests')}
            className={`flex-1 py-2 px-4 rounded-xl smooth-transition ${
              activeTab === 'follow_requests'
                ? 'bg-gradient-to-r from-neon-pink to-neon-orange shadow-neon'
                : 'hover:bg-white/10'
            }`}
          >
            <span className={`text-sm font-medium ${
              activeTab === 'follow_requests' ? 'text-white' : 'text-white/70'
            }`}>
              Follow Requests
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {activeTab === 'all' ? (
          <div className="space-y-2">
            {/* New Section */}
            <div className="mb-4">
              <h2 className="text-white font-semibold text-lg mb-3">New</h2>
              {notifications.filter(n => !n.isRead).map(renderNotificationItem)}
            </div>

            {/* This Month Section */}
            <div>
              <h2 className="text-white font-semibold text-lg mb-3">This month</h2>
              {notifications.filter(n => n.isRead).map(renderNotificationItem)}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="text-white font-semibold text-lg mb-4">Follow Requests</h2>
            {followRequests.length > 0 ? (
              followRequests.map(renderFollowRequestItem)
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-10 h-10 text-white/50" />
                </div>
                <p className="text-white/70 text-lg">No follow requests</p>
                <p className="text-white/50 text-sm mt-2">When someone requests to follow you, it will appear here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (isDesktop) {
    return <DesktopLayout>{renderNotificationsContent()}</DesktopLayout>;
  }

  // Mobile layout
  return (
    <div className="min-h-screen bg-futuristic-dark particle-bg pb-20 overflow-y-auto">
      {renderNotificationsContent()}
      <BottomNavigation />
    </div>
  );
};

export default Notifications;

