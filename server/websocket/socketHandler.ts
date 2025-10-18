import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { mockDb } from '../mock-db.js';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

interface SocketData {
  userId: string;
  username: string;
}

export class SocketHandler {
  private io: SocketIOServer;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
        const { data: user } = await mockDb.getUserById(decoded.userId);
        
        if (!user) {
          return next(new Error('Authentication error: User not found'));
        }

        socket.userId = user.id;
        socket.username = user.username;
        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`🔌 User connected: ${socket.username} (${socket.userId})`);
      
      // Store user connection
      if (socket.userId) {
        this.connectedUsers.set(socket.userId, socket.id);
        this.updateUserPresence(socket.userId, true);
      }

      // Join user to their personal room
      if (socket.userId) {
        socket.join(`user:${socket.userId}`);
      }

      // Handle real-time post interactions
      socket.on('like_post', async (data: { postId: string }) => {
        try {
          const { postId } = data;
          console.log(`👍 Like post: ${postId} by ${socket.username}`);
          
          // Broadcast like to all connected users
          this.io.emit('post_liked', {
            postId,
            userId: socket.userId,
            username: socket.username,
            timestamp: new Date().toISOString()
          });

          // Send notification to post owner (if different from liker)
          const { data: posts } = await mockDb.getAllPosts();
          const post = posts.find(p => p.id === postId);
          if (post && post.user_id !== socket.userId) {
            this.io.to(`user:${post.user_id}`).emit('notification', {
              type: 'like',
              message: `${socket.username} liked your post`,
              userId: socket.userId,
              username: socket.username,
              postId,
              timestamp: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error handling like_post:', error);
        }
      });

      // Handle real-time comments
      socket.on('comment_post', async (data: { postId: string, comment: string }) => {
        try {
          const { postId, comment } = data;
          console.log(`💬 Comment on post: ${postId} by ${socket.username}`);
          
          // Broadcast comment to all connected users
          this.io.emit('post_commented', {
            postId,
            userId: socket.userId,
            username: socket.username,
            comment,
            timestamp: new Date().toISOString()
          });

          // Send notification to post owner (if different from commenter)
          const { data: posts } = await mockDb.getAllPosts();
          const post = posts.find(p => p.id === postId);
          if (post && post.user_id !== socket.userId) {
            this.io.to(`user:${post.user_id}`).emit('notification', {
              type: 'comment',
              message: `${socket.username} commented on your post`,
              userId: socket.userId,
              username: socket.username,
              postId,
              comment,
              timestamp: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error handling comment_post:', error);
        }
      });

      // Handle real-time messaging
      socket.on('send_message', async (data: { receiverId: string, message: string }) => {
        try {
          const { receiverId, message } = data;
          console.log(`📨 Message from ${socket.username} to ${receiverId}`);
          
          // Send message to receiver
          this.io.to(`user:${receiverId}`).emit('new_message', {
            senderId: socket.userId,
            senderUsername: socket.username,
            message,
            timestamp: new Date().toISOString()
          });

          // Send notification to receiver
          this.io.to(`user:${receiverId}`).emit('notification', {
            type: 'message',
            message: `New message from ${socket.username}`,
            userId: socket.userId,
            username: socket.username,
            message,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error('Error handling send_message:', error);
        }
      });

      // Handle follow notifications
      socket.on('follow_user', async (data: { targetUserId: string }) => {
        try {
          const { targetUserId } = data;
          console.log(`👥 Follow: ${socket.username} followed ${targetUserId}`);
          
          // Send notification to followed user
          this.io.to(`user:${targetUserId}`).emit('notification', {
            type: 'follow',
            message: `${socket.username} started following you`,
            userId: socket.userId,
            username: socket.username,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error('Error handling follow_user:', error);
        }
      });

      // Handle typing indicators
      socket.on('typing_start', (data: { receiverId: string }) => {
        socket.to(`user:${data.receiverId}`).emit('user_typing', {
          userId: socket.userId,
          username: socket.username,
          isTyping: true
        });
      });

      socket.on('typing_stop', (data: { receiverId: string }) => {
        socket.to(`user:${data.receiverId}`).emit('user_typing', {
          userId: socket.userId,
          username: socket.username,
          isTyping: false
        });
      });

      // Handle user presence
      socket.on('update_presence', (data: { status: 'online' | 'away' | 'busy' }) => {
        if (socket.userId) {
          this.io.emit('user_presence_updated', {
            userId: socket.userId,
            username: socket.username,
            status: data.status,
            timestamp: new Date().toISOString()
          });
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`🔌 User disconnected: ${socket.username} (${socket.userId})`);
        
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
          this.updateUserPresence(socket.userId, false);
        }
      });
    });
  }

  private updateUserPresence(userId: string, isOnline: boolean) {
    this.io.emit('user_presence_changed', {
      userId,
      isOnline,
      timestamp: new Date().toISOString()
    });
  }

  // Public methods for server-side events
  public notifyNewPost(post: any) {
    this.io.emit('new_post', {
      post,
      timestamp: new Date().toISOString()
    });
  }

  public notifyPostUpdate(postId: string, updates: any) {
    this.io.emit('post_updated', {
      postId,
      updates,
      timestamp: new Date().toISOString()
    });
  }

  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  public getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  public isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }
}

export default SocketHandler;
