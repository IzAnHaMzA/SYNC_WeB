import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DesktopLayout from '../components/DesktopLayout';
import BottomNavigation from '../components/BottomNavigation';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreHorizontal,
  Search as SearchIcon,
  Edit,
  Check,
  CheckCheck,
  Circle,
  Send as SendIcon
} from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  receiver: string;
  text?: string;
  image?: string;
  timestamp: string;
  isRead: boolean;
  isDelivered: boolean;
}

interface Conversation {
  id: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
    isOnline: boolean;
    lastSeen?: string;
  };
  lastMessage: Message;
  unreadCount: number;
  isTyping?: boolean;
}

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
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

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: '1',
      user: {
        id: '2',
        username: 'theabubakransari',
        fullName: 'Abubakar Ansari',
        avatar: 'https://ui-avatars.com/api/?name=Abubakar+Ansari&background=00d4ff&color=fff',
        isOnline: true
      },
      lastMessage: {
        id: '1',
        sender: '2',
        receiver: '1',
        text: 'Hey! How are you doing?',
        timestamp: '48m',
        isRead: true,
        isDelivered: true
      },
      unreadCount: 0
    },
    {
      id: '2',
      user: {
        id: '3',
        username: 'peter_griffin_coding',
        fullName: 'Peter Griffin (Coding Expert)',
        avatar: 'https://ui-avatars.com/api/?name=Peter+Griffin&background=f093fb&color=fff',
        isOnline: false,
        lastSeen: '3h ago'
      },
      lastMessage: {
        id: '2',
        sender: '3',
        receiver: '1',
        text: 'Active 3h ago',
        timestamp: '3h',
        isRead: true,
        isDelivered: true
      },
      unreadCount: 0
    },
    {
      id: '3',
      user: {
        id: '4',
        username: 'kabir',
        fullName: 'Kabir',
        avatar: 'https://ui-avatars.com/api/?name=Kabir&background=764ba2&color=fff',
        isOnline: true
      },
      lastMessage: {
        id: '3',
        sender: '1',
        receiver: '4',
        text: 'You sent an attachment.',
        timestamp: '54m',
        isRead: true,
        isDelivered: true
      },
      unreadCount: 0
    },
    {
      id: '4',
      user: {
        id: '5',
        username: 'ajay_sadhwani',
        fullName: 'Ajay Sadhwani',
        avatar: 'https://ui-avatars.com/api/?name=Ajay+Sadhwani&background=0099cc&color=fff',
        isOnline: true
      },
      lastMessage: {
        id: '4',
        sender: '5',
        receiver: '1',
        text: '1 active today',
        timestamp: '1h',
        isRead: false,
        isDelivered: true
      },
      unreadCount: 2
    },
    {
      id: '5',
      user: {
        id: '6',
        username: 'unknown_user',
        fullName: 'Unknown User',
        avatar: 'https://ui-avatars.com/api/?name=Unknown+User&background=ff6b35&color=fff',
        isOnline: false,
        lastSeen: '2h ago'
      },
      lastMessage: {
        id: '5',
        sender: '6',
        receiver: '1',
        text: 'U there - 2h',
        timestamp: '2h',
        isRead: false,
        isDelivered: true
      },
      unreadCount: 1
    },
    {
      id: '6',
      user: {
        id: '7',
        username: 'active_user',
        fullName: 'Active User',
        avatar: 'https://ui-avatars.com/api/?name=Active+User&background=667eea&color=fff',
        isOnline: true
      },
      lastMessage: {
        id: '6',
        sender: '7',
        receiver: '1',
        text: 'Active 1h ago',
        timestamp: '1h',
        isRead: true,
        isDelivered: true
      },
      unreadCount: 0
    }
  ];

  const renderConversationList = () => (
    <div className="w-80 bg-futuristic-dark border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white font-futuristic">Messages</h1>
          <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 smooth-transition">
            <Edit className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="w-4 h-4 text-white/50" />
          </div>
          <input
            type="text"
            placeholder="Search messages"
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-neon-blue smooth-transition text-sm"
          />
        </div>
      </div>

      {/* Requests */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-sm">Requests</h2>
          <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => setSelectedConversation(conversation.id)}
            className={`p-4 border-b border-white/5 smooth-transition cursor-pointer ${
              selectedConversation === conversation.id ? 'bg-white/5' : 'hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={conversation.user.avatar}
                  alt={conversation.user.username}
                  className="w-12 h-12 rounded-full border-2 border-white/20"
                />
                {conversation.user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-green rounded-full border-2 border-futuristic-dark"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white font-semibold text-sm truncate">
                    {conversation.user.fullName}
                  </p>
                  <div className="flex items-center space-x-2">
                    {conversation.lastMessage.isRead ? (
                      <CheckCheck className="w-4 h-4 text-neon-blue" />
                    ) : conversation.lastMessage.isDelivered ? (
                      <CheckCheck className="w-4 h-4 text-white/50" />
                    ) : (
                      <Check className="w-4 h-4 text-white/50" />
                    )}
                    <span className="text-white/50 text-xs">{conversation.lastMessage.timestamp}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-white/70 text-sm truncate">
                    {conversation.lastMessage.text}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-neon-blue rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">{conversation.unreadCount}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMessageArea = () => (
    <div className="flex-1 flex flex-col">
      {selectedConversation ? (
        <>
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <img
                src={conversations.find(c => c.id === selectedConversation)?.user.avatar}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-white/20"
              />
              <div>
                <p className="text-white font-semibold">
                  {conversations.find(c => c.id === selectedConversation)?.user.fullName}
                </p>
                <p className="text-white/60 text-sm">
                  {conversations.find(c => c.id === selectedConversation)?.user.isOnline ? 'Active now' : 'Last seen recently'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <SendIcon className="w-10 h-10 text-white/50" />
              </div>
              <p className="text-white/70 text-lg">Your messages</p>
              <p className="text-white/50 text-sm mt-2">Send a message to start a chat.</p>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 smooth-transition">
                <Paperclip className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Message..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-neon-blue smooth-transition"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-xl hover:bg-white/10 smooth-transition">
                  <Smile className="w-5 h-5 text-white" />
                </button>
              </div>
              <button className="p-3 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-neon smooth-transition">
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <SendIcon className="w-10 h-10 text-white/50" />
            </div>
            <p className="text-white/70 text-lg">Your messages</p>
            <p className="text-white/50 text-sm mt-2">Send a message to start a chat.</p>
            <button className="mt-4 bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-neon text-white px-6 py-3 rounded-xl font-semibold smooth-transition">
              Send message
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderMessagesContent = () => (
    <div className="w-full h-full flex">
      {renderConversationList()}
      {renderMessageArea()}
    </div>
  );

  if (isDesktop) {
    return <DesktopLayout>{renderMessagesContent()}</DesktopLayout>;
  }

  // Mobile layout
  return (
    <div className="min-h-screen bg-futuristic-dark particle-bg pb-20 overflow-y-auto">
      {renderMessagesContent()}
      <BottomNavigation />
    </div>
  );
};

export default Messages;
