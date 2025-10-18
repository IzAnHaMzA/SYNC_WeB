import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface Notification {
  type: 'like' | 'comment' | 'follow' | 'message';
  message: string;
  userId: string;
  username: string;
  postId?: string;
  comment?: string;
  timestamp: string;
}

interface UserPresence {
  userId: string;
  username: string;
  status: 'online' | 'away' | 'busy';
  timestamp: string;
}

interface TypingIndicator {
  userId: string;
  username: string;
  isTyping: boolean;
}

export const useWebSocket = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!user) return;

    const socketUrl = process.env.NODE_ENV === 'production' 
      ? process.env.REACT_APP_WS_URL || 'wss://your-domain.com'
      : 'http://localhost:5000';

    const newSocket = io(socketUrl, {
      auth: {
        userId: user._id
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('🔌 WebSocket connected');
      setIsConnected(true);
      setConnectionError(null);
      reconnectAttempts.current = 0;
    });

    newSocket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket disconnected:', reason);
      setIsConnected(false);
      
      // Attempt to reconnect if not a manual disconnect
      if (reason !== 'io client disconnect' && reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log(`🔄 Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})`);
          connect();
        }, delay);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    // Real-time events
    newSocket.on('post_liked', (data) => {
      console.log('👍 Post liked:', data);
      // Handle post like event
    });

    newSocket.on('post_commented', (data) => {
      console.log('💬 Post commented:', data);
      // Handle post comment event
    });

    newSocket.on('new_message', (data) => {
      console.log('📨 New message:', data);
      // Handle new message event
    });

    newSocket.on('notification', (notification: Notification) => {
      console.log('🔔 Notification received:', notification);
      setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep last 50 notifications
    });

    newSocket.on('user_presence_changed', (data) => {
      console.log('👤 User presence changed:', data);
      if (data.isOnline) {
        setOnlineUsers(prev => [...new Set([...prev, data.userId])]);
      } else {
        setOnlineUsers(prev => prev.filter(id => id !== data.userId));
      }
    });

    newSocket.on('user_typing', (data: TypingIndicator) => {
      console.log('⌨️ User typing:', data);
      setTypingUsers(prev => {
        if (data.isTyping) {
          return [...prev.filter(u => u.userId !== data.userId), data];
        } else {
          return prev.filter(u => u.userId !== data.userId);
        }
      });
    });

    newSocket.on('new_post', (data) => {
      console.log('📝 New post:', data);
      // Handle new post event
    });

    newSocket.on('post_updated', (data) => {
      console.log('📝 Post updated:', data);
      // Handle post update event
    });

    setSocket(newSocket);
  }, [user]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, [socket]);

  // Send events
  const likePost = useCallback((postId: string) => {
    if (socket && isConnected) {
      socket.emit('like_post', { postId });
    }
  }, [socket, isConnected]);

  const commentPost = useCallback((postId: string, comment: string) => {
    if (socket && isConnected) {
      socket.emit('comment_post', { postId, comment });
    }
  }, [socket, isConnected]);

  const sendMessage = useCallback((receiverId: string, message: string) => {
    if (socket && isConnected) {
      socket.emit('send_message', { receiverId, message });
    }
  }, [socket, isConnected]);

  const followUser = useCallback((targetUserId: string) => {
    if (socket && isConnected) {
      socket.emit('follow_user', { targetUserId });
    }
  }, [socket, isConnected]);

  const startTyping = useCallback((receiverId: string) => {
    if (socket && isConnected) {
      socket.emit('typing_start', { receiverId });
    }
  }, [socket, isConnected]);

  const stopTyping = useCallback((receiverId: string) => {
    if (socket && isConnected) {
      socket.emit('typing_stop', { receiverId });
    }
  }, [socket, isConnected]);

  const updatePresence = useCallback((status: 'online' | 'away' | 'busy') => {
    if (socket && isConnected) {
      socket.emit('update_presence', { status });
    }
  }, [socket, isConnected]);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Clear typing indicators
  const clearTypingIndicators = useCallback(() => {
    setTypingUsers([]);
  }, []);

  // Connect on mount and when user/token changes
  useEffect(() => {
    if (user) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [user, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    socket,
    isConnected,
    connectionError,
    notifications,
    onlineUsers,
    typingUsers,
    likePost,
    commentPost,
    sendMessage,
    followUser,
    startTyping,
    stopTyping,
    updatePresence,
    clearNotifications,
    clearTypingIndicators,
    reconnect: connect
  };
};

export default useWebSocket;
