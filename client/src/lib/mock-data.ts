export const mockVideos = [
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
    user: {
      id: "user1",
      username: "sarah_dances",
      displayName: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      verified: false,
    }
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
    user: {
      id: "user2",
      username: "chef_marcus",
      displayName: "Marcus Rodriguez", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      verified: true,
    }
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
    user: {
      id: "user3",
      username: "skate_life_tony",
      displayName: "Tony Martinez",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      verified: false,
    }
  }
];

export const mockUsers = [
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
  }
];

export const mockComments = [
  {
    id: "comment1",
    videoId: "video1",
    userId: "user2",
    content: "This is so amazing! 🔥 How long did it take you to learn this?",
    likes: 23,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: mockUsers[1],
  },
  {
    id: "comment2",
    videoId: "video1",
    userId: "user3", 
    content: "Tutorial please! 😍✨",
    likes: 156,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    user: mockUsers[2],
  }
];
