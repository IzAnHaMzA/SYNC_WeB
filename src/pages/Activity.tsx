
import React, { useState } from 'react';
import { Heart, UserPlus, MessageCircle } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';

const Activity: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'following' | 'you'>('following');

  // Mock activity data
  const activities = [
    {
      id: 1,
      type: 'like',
      user: {
        username: 'john_doe',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe'
      },
      post: {
        image: 'https://picsum.photos/400/400?random=1'
      },
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'follow',
      user: {
        username: 'jane_smith',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Smith'
      },
      time: '5 hours ago'
    },
    {
      id: 3,
      type: 'comment',
      user: {
        username: 'mike_wilson',
        avatar: 'https://ui-avatars.com/api/?name=Mike+Wilson'
      },
      post: {
        image: 'https://picsum.photos/400/400?random=2'
      },
      comment: 'Amazing photo!',
      time: '1 day ago'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'like':
        return `liked your photo`;
      case 'follow':
        return `started following you`;
      case 'comment':
        return `commented: "${activity.comment}"`;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-semibold">Activity</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 ${
              activeTab === 'following'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500'
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setActiveTab('you')}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 ${
              activeTab === 'you'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500'
            }`}
          >
            You
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white">
        {activities.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
            <p className="text-gray-500 text-sm">
              When someone likes or comments on your posts, you'll see it here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <img
                        src={activity.user.avatar}
                        alt={activity.user.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-semibold">{activity.user.username}</span>{' '}
                          {getActivityText(activity)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>

                  {activity.post && (
                    <div className="flex-shrink-0">
                      <img
                        src={activity.post.image}
                        alt="Post"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Activity;
