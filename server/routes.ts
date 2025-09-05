import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCommentSchema, insertFollowSchema, insertVideoLikeSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get video feed
  app.get("/api/videos", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const videos = await storage.getVideos(limit, offset);
      
      // Get user info for each video
      const videosWithUsers = await Promise.all(
        videos.map(async (video) => {
          const user = await storage.getUser(video.userId);
          return {
            ...video,
            user
          };
        })
      );
      
      res.json(videosWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  // Get single video
  app.get("/api/videos/:id", async (req, res) => {
    try {
      const video = await storage.getVideo(req.params.id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      const user = await storage.getUser(video.userId);
      res.json({ ...video, user });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  // Get user profile
  app.get("/api/users/:username", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const videos = await storage.getVideosByUser(user.id);
      res.json({ ...user, videos });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get video comments
  app.get("/api/videos/:id/comments", async (req, res) => {
    try {
      const comments = await storage.getCommentsByVideo(req.params.id);
      
      // Get user info for each comment
      const commentsWithUsers = await Promise.all(
        comments.map(async (comment) => {
          const user = await storage.getUser(comment.userId);
          return {
            ...comment,
            user
          };
        })
      );
      
      res.json(commentsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Create comment
  app.post("/api/videos/:id/comments", async (req, res) => {
    try {
      // For now, use a mock user ID since we don't have auth
      const mockUserId = "user1";
      
      const commentData = insertCommentSchema.parse({
        ...req.body,
        videoId: req.params.id,
        userId: mockUserId
      });
      
      const comment = await storage.createComment(commentData);
      const user = await storage.getUser(comment.userId);
      
      res.json({ ...comment, user });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Toggle video like
  app.post("/api/videos/:id/like", async (req, res) => {
    try {
      // For now, use a mock user ID since we don't have auth
      const mockUserId = "user1";
      const videoId = req.params.id;
      
      const existingLike = await storage.getUserVideoLike(mockUserId, videoId);
      
      if (existingLike) {
        // Unlike the video
        await storage.deleteVideoLike(mockUserId, videoId);
        const video = await storage.getVideo(videoId);
        res.json({ liked: false, likes: video?.likes || 0 });
      } else {
        // Like the video
        await storage.createVideoLike({ userId: mockUserId, videoId });
        const video = await storage.getVideo(videoId);
        res.json({ liked: true, likes: video?.likes || 0 });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Follow/unfollow user
  app.post("/api/users/:username/follow", async (req, res) => {
    try {
      // For now, use a mock user ID since we don't have auth
      const mockUserId = "user1";
      
      const userToFollow = await storage.getUserByUsername(req.params.username);
      if (!userToFollow) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const isFollowing = await storage.isFollowing(mockUserId, userToFollow.id);
      
      if (isFollowing) {
        // Unfollow
        await storage.deleteFollow(mockUserId, userToFollow.id);
        const updatedUser = await storage.getUser(userToFollow.id);
        res.json({ following: false, followers: updatedUser?.followers || 0 });
      } else {
        // Follow
        await storage.createFollow({ followerId: mockUserId, followingId: userToFollow.id });
        const updatedUser = await storage.getUser(userToFollow.id);
        res.json({ following: true, followers: updatedUser?.followers || 0 });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle follow" });
    }
  });

  // Check if following user
  app.get("/api/users/:username/following", async (req, res) => {
    try {
      // For now, use a mock user ID since we don't have auth
      const mockUserId = "user1";
      
      const userToCheck = await storage.getUserByUsername(req.params.username);
      if (!userToCheck) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const isFollowing = await storage.isFollowing(mockUserId, userToCheck.id);
      res.json({ following: isFollowing });
    } catch (error) {
      res.status(500).json({ message: "Failed to check follow status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
