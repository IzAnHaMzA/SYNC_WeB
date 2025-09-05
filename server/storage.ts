import { type User, type Video, type Comment, type Follow, type VideoLike, type InsertUser, type InsertVideo, type InsertComment, type InsertFollow, type InsertVideoLike } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Video methods
  getVideo(id: string): Promise<Video | undefined>;
  getVideos(limit?: number, offset?: number): Promise<Video[]>;
  getVideosByUser(userId: string): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideoStats(id: string, stats: { likes?: number; comments?: number; shares?: number; views?: number }): Promise<Video | undefined>;
  
  // Comment methods
  getCommentsByVideo(videoId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Follow methods
  createFollow(follow: InsertFollow): Promise<Follow>;
  deleteFollow(followerId: string, followingId: string): Promise<boolean>;
  getFollowing(userId: string): Promise<Follow[]>;
  getFollowers(userId: string): Promise<Follow[]>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  
  // Video like methods
  createVideoLike(like: InsertVideoLike): Promise<VideoLike>;
  deleteVideoLike(userId: string, videoId: string): Promise<boolean>;
  getUserVideoLike(userId: string, videoId: string): Promise<VideoLike | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private videos: Map<string, Video>;
  private comments: Map<string, Comment>;
  private follows: Map<string, Follow>;
  private videoLikes: Map<string, VideoLike>;

  constructor() {
    this.users = new Map();
    this.videos = new Map();
    this.comments = new Map();
    this.follows = new Map();
    this.videoLikes = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create mock users
    const mockUsers = [
      {
        id: "user1",
        username: "sarah_dances",
        displayName: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        bio: "Dance enthusiast ✨ Spreading good vibes through movement 💃",
        followers: 127500,
        following: 847,
        totalLikes: 2100000,
        verified: false,
        createdAt: new Date()
      },
      {
        id: "user2", 
        username: "chef_marcus",
        displayName: "Marcus Rodriguez",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        bio: "Professional chef 👨‍🍳 Quick recipes that'll blow your mind!",
        followers: 89200,
        following: 234,
        totalLikes: 1500000,
        verified: true,
        createdAt: new Date()
      },
      {
        id: "user3",
        username: "skate_life_tony", 
        displayName: "Tony Martinez",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        bio: "Skateboard tricks & street culture 🛹 Never give up!",
        followers: 245700,
        following: 1200,
        totalLikes: 3200000,
        verified: false,
        createdAt: new Date()
      }
    ];

    mockUsers.forEach(user => this.users.set(user.id, user));

    // Create mock videos
    const mockVideos = [
      {
        id: "video1",
        userId: "user1",
        description: "When the beat drops and you can't help but move 🔥 #dance #vibes #trending",
        videoUrl: "/mock-video-1.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=500",
        musicTitle: "original sound",
        musicArtist: "sarah_dances",
        likes: 127500,
        comments: 8431,
        shares: 2847,
        views: 890000,
        duration: 15,
        createdAt: new Date()
      },
      {
        id: "video2",
        userId: "user2", 
        description: "30-second pasta that'll change your life! 🍝✨ #cooking #pasta #recipe #fyp",
        videoUrl: "/mock-video-2.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=500",
        musicTitle: "Cooking Vibes",
        musicArtist: "DJ Kitchen",
        likes: 89200,
        comments: 3247,
        shares: 1432,
        views: 450000,
        duration: 30,
        createdAt: new Date()
      },
      {
        id: "video3",
        userId: "user3",
        description: "Finally landed this trick after 100 attempts! 🛹🔥 #skateboarding #tricks #nevergiveup #viral",
        videoUrl: "/mock-video-3.mp4", 
        thumbnailUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=500",
        musicTitle: "Street Beats",
        musicArtist: "Urban Vibes",
        likes: 245700,
        comments: 12100,
        shares: 8765,
        views: 1200000,
        duration: 22,
        createdAt: new Date()
      }
    ];

    mockVideos.forEach(video => this.videos.set(video.id, video));

    // Create mock comments
    const mockComments = [
      {
        id: "comment1",
        videoId: "video1",
        userId: "user2",
        content: "This is so amazing! 🔥 How long did it take you to learn this?",
        likes: 23,
        parentId: null,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: "comment2",
        videoId: "video1", 
        userId: "user3",
        content: "Tutorial please! 😍✨",
        likes: 156,
        parentId: null,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
      }
    ];

    mockComments.forEach(comment => this.comments.set(comment.id, comment));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      followers: 0,
      following: 0,
      totalLikes: 0,
      verified: false,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getVideo(id: string): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getVideos(limit = 10, offset = 0): Promise<Video[]> {
    const allVideos = Array.from(this.videos.values());
    return allVideos.slice(offset, offset + limit);
  }

  async getVideosByUser(userId: string): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(video => video.userId === userId);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = randomUUID();
    const video: Video = {
      ...insertVideo,
      id,
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      createdAt: new Date()
    };
    this.videos.set(id, video);
    return video;
  }

  async updateVideoStats(id: string, stats: { likes?: number; comments?: number; shares?: number; views?: number }): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;
    const updatedVideo = { ...video, ...stats };
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }

  async getCommentsByVideo(videoId: string): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(comment => comment.videoId === videoId);
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...insertComment,
      id,
      likes: 0,
      createdAt: new Date()
    };
    this.comments.set(id, comment);
    
    // Update video comment count
    const video = this.videos.get(insertComment.videoId);
    if (video) {
      await this.updateVideoStats(insertComment.videoId, { comments: video.comments + 1 });
    }
    
    return comment;
  }

  async createFollow(insertFollow: InsertFollow): Promise<Follow> {
    const id = randomUUID();
    const follow: Follow = {
      ...insertFollow,
      id,
      createdAt: new Date()
    };
    this.follows.set(id, follow);
    
    // Update user stats
    const follower = this.users.get(insertFollow.followerId);
    const following = this.users.get(insertFollow.followingId);
    if (follower && following) {
      await this.updateUser(insertFollow.followerId, { following: follower.following + 1 });
      await this.updateUser(insertFollow.followingId, { followers: following.followers + 1 });
    }
    
    return follow;
  }

  async deleteFollow(followerId: string, followingId: string): Promise<boolean> {
    const followToDelete = Array.from(this.follows.values()).find(
      follow => follow.followerId === followerId && follow.followingId === followingId
    );
    
    if (!followToDelete) return false;
    
    this.follows.delete(followToDelete.id);
    
    // Update user stats
    const follower = this.users.get(followerId);
    const following = this.users.get(followingId);
    if (follower && following) {
      await this.updateUser(followerId, { following: Math.max(0, follower.following - 1) });
      await this.updateUser(followingId, { followers: Math.max(0, following.followers - 1) });
    }
    
    return true;
  }

  async getFollowing(userId: string): Promise<Follow[]> {
    return Array.from(this.follows.values()).filter(follow => follow.followerId === userId);
  }

  async getFollowers(userId: string): Promise<Follow[]> {
    return Array.from(this.follows.values()).filter(follow => follow.followingId === userId);
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    return Array.from(this.follows.values()).some(
      follow => follow.followerId === followerId && follow.followingId === followingId
    );
  }

  async createVideoLike(insertLike: InsertVideoLike): Promise<VideoLike> {
    const id = randomUUID();
    const like: VideoLike = {
      ...insertLike,
      id,
      createdAt: new Date()
    };
    this.videoLikes.set(id, like);
    
    // Update video like count
    const video = this.videos.get(insertLike.videoId);
    if (video) {
      await this.updateVideoStats(insertLike.videoId, { likes: video.likes + 1 });
    }
    
    return like;
  }

  async deleteVideoLike(userId: string, videoId: string): Promise<boolean> {
    const likeToDelete = Array.from(this.videoLikes.values()).find(
      like => like.userId === userId && like.videoId === videoId
    );
    
    if (!likeToDelete) return false;
    
    this.videoLikes.delete(likeToDelete.id);
    
    // Update video like count
    const video = this.videos.get(videoId);
    if (video) {
      await this.updateVideoStats(videoId, { likes: Math.max(0, video.likes - 1) });
    }
    
    return true;
  }

  async getUserVideoLike(userId: string, videoId: string): Promise<VideoLike | undefined> {
    return Array.from(this.videoLikes.values()).find(
      like => like.userId === userId && like.videoId === videoId
    );
  }
}

export const storage = new MemStorage();
