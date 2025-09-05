import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Share, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CommentsModal from "./comments-modal";
import { Link } from "wouter";

interface VideoActionsProps {
  video: any;
}

export default function VideoActions({ video }: VideoActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/videos/${video.id}/like`, {});
    },
    onSuccess: (response: any) => {
      response.json().then((data: any) => {
        setIsLiked(data.liked);
        queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    },
  });

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleLike = () => {
    likeMutation.mutate();
    // Immediate UI feedback
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Video by @${video.user?.username}`,
        text: video.description,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Video link copied to clipboard",
      });
    }
  };

  return (
    <>
      <div className="absolute right-4 bottom-28 flex flex-col items-center space-y-4 pointer-events-auto">
        {/* User Avatar */}
        <Link href={`/profile/${video.user?.username}`}>
          <div className="relative cursor-pointer group" data-testid="avatar-link">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 p-0.5 transform group-hover:scale-105 transition-transform">
              <img
                src={video.user?.avatar}
                alt={`${video.user?.username} avatar`}
                className="w-full h-full rounded-2xl object-cover"
              />
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
              <Plus className="w-4 h-4 text-background font-bold" />
            </div>
          </div>
        </Link>

        {/* Like Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleLike}
            disabled={likeMutation.isPending}
            className={`w-14 h-14 rounded-2xl bg-background/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 hover:bg-primary/20 hover:border-primary/50 hover:scale-105 ${
              isLiked ? "heart-pulse bg-primary/30 border-primary/70" : ""
            }`}
            data-testid="button-like"
          >
            <Heart
              className={`w-7 h-7 ${
                isLiked ? "fill-primary text-primary" : "text-white"
              }`}
            />
          </button>
          <span className="text-white text-sm font-semibold mt-2 drop-shadow-lg" data-testid="text-like-count">
            {formatCount(video.likes)}
          </span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setShowComments(true)}
            className="w-14 h-14 rounded-2xl bg-background/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-accent/20 hover:border-accent/50 hover:scale-105 transition-all duration-200"
            data-testid="button-comment"
          >
            <MessageCircle className="w-7 h-7" />
          </button>
          <span className="text-white text-sm font-semibold mt-2 drop-shadow-lg" data-testid="text-comment-count">
            {formatCount(video.comments)}
          </span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleShare}
            className="w-14 h-14 rounded-2xl bg-background/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 hover:scale-105 transition-all duration-200"
            data-testid="button-share"
          >
            <Share className="w-7 h-7" />
          </button>
          <span className="text-white text-sm font-semibold mt-2 drop-shadow-lg" data-testid="text-share-count">
            {formatCount(video.shares)}
          </span>
        </div>

        {/* Music Disc */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent p-0.5 music-disc shadow-lg" data-testid="music-disc">
          <img
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
            alt="Music disc"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>

      <CommentsModal
        video={video}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
    </>
  );
}
