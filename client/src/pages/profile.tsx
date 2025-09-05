import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MoreVertical, Play } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import BottomNavigation from "@/components/bottom-navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Profile() {
  const { username } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("videos");

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/users", username],
    enabled: !!username,
  });

  const { data: followStatus } = useQuery({
    queryKey: ["/api/users", username, "following"],
    enabled: !!username,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/users/${username}/follow`, {});
    },
    onSuccess: (response: any) => {
      const data = response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/users", username] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", username, "following"] });
      toast({
        title: data.following ? "Following user" : "Unfollowed user",
        description: data.following ? `You are now following ${username}` : `You unfollowed ${username}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">User not found</h1>
        <Link href="/">
          <Button variant="outline" data-testid="button-back-home">Go back home</Button>
        </Link>
      </div>
    );
  }

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="w-full h-screen bg-background overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-foreground" data-testid="text-username">
            {user.username}
          </h1>
          <Button variant="ghost" size="icon" data-testid="button-menu">
            <MoreVertical className="h-6 w-6" />
          </Button>
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto pb-20">
          {/* Profile Info */}
          <div className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 p-1 mx-auto">
                <img
                  src={user.avatar}
                  alt={`${user.displayName} profile picture`}
                  className="w-full h-full rounded-3xl object-cover"
                  data-testid="img-avatar"
                />
              </div>
              {user.verified && (
                <div className="absolute -bottom-1 right-2 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-background font-bold text-xs">✓</span>
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent" data-testid="text-display-name">
              {user.displayName}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto" data-testid="text-bio">
              {user.bio}
            </p>
            
            {/* Stats */}
            <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-2 mx-auto border border-primary/30">
                  <div className="text-xl font-bold text-foreground" data-testid="text-following">
                    {formatCount(user.following)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-medium">Following</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-2 mx-auto border border-accent/30">
                  <div className="text-xl font-bold text-foreground" data-testid="text-followers">
                    {formatCount(user.followers)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-medium">Followers</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 flex items-center justify-center mb-2 mx-auto border border-primary/30">
                  <div className="text-xl font-bold text-foreground" data-testid="text-likes">
                    {formatCount(user.totalLikes)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-medium">Likes</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-3">
              <Button
                onClick={() => followMutation.mutate()}
                disabled={followMutation.isPending}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 rounded-2xl px-8 py-3 font-semibold shadow-lg shadow-primary/30 transform hover:scale-105 transition-all"
                data-testid="button-follow"
              >
                {followMutation.isPending ? "Loading..." : followStatus?.following ? "Following" : "Follow"}
              </Button>
              <Button 
                variant="secondary" 
                className="rounded-2xl px-8 py-3 font-semibold border border-border hover:bg-muted/50 transform hover:scale-105 transition-all" 
                data-testid="button-message"
              >
                Message
              </Button>
            </div>
          </div>

          {/* Video Grid */}
          <div className="px-4">
            <div className="flex border-b border-border mb-4">
              <button
                onClick={() => setActiveTab("videos")}
                className={`flex-1 py-3 text-center font-semibold transition-colors ${
                  activeTab === "videos"
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
                data-testid="tab-videos"
              >
                Videos
              </button>
              <button
                onClick={() => setActiveTab("liked")}
                className={`flex-1 py-3 text-center font-semibold transition-colors ${
                  activeTab === "liked"
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
                data-testid="tab-liked"
              >
                Liked
              </button>
            </div>

            {user.videos && user.videos.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {user.videos.map((video: any) => (
                  <div
                    key={video.id}
                    className="aspect-[9/16] bg-muted rounded-lg overflow-hidden relative cursor-pointer hover:opacity-80 transition-opacity"
                    data-testid={`video-thumbnail-${video.id}`}
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 flex items-center text-white text-xs">
                      <Play className="w-3 h-3 mr-1" />
                      <span>{formatCount(video.views)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground" data-testid="text-no-videos">
                  No videos yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <BottomNavigation activeTab="profile" />
    </div>
  );
}
