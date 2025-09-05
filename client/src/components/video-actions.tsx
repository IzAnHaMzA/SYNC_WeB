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
      <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6 pointer-events-auto">
        {/* User Avatar */}
        <Link href={`/profile/${video.user?.username}`}>
          <div className="relative cursor-pointer" data-testid="avatar-link">
            <img
              src={video.user?.avatar}
              alt={`${video.user?.username} avatar`}
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
            />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white">
              <Plus className="w-3 h-3 text-white" />
            </div>
          </div>
        </Link>

        {/* Like Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleLike}
            disabled={likeMutation.isPending}
            className={`w-12 h-12 rounded-full floating-action flex items-center justify-center transition-all duration-200 hover:bg-white hover:bg-opacity-20 ${
              isLiked ? "heart-pulse" : ""
            }`}
            data-testid="button-like"
          >
            <Heart
              className={`w-7 h-7 ${
                isLiked ? "fill-primary text-primary" : "text-white"
              }`}
            />
          </button>
          <span className="text-white text-sm font-semibold mt-1" data-testid="text-like-count">
            {formatCount(video.likes)}
          </span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setShowComments(true)}
            className="w-12 h-12 rounded-full floating-action flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            data-testid="button-comment"
          >
            <MessageCircle className="w-7 h-7" />
          </button>
          <span className="text-white text-sm font-semibold mt-1" data-testid="text-comment-count">
            {formatCount(video.comments)}
          </span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleShare}
            className="w-12 h-12 rounded-full floating-action flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            data-testid="button-share"
          >
            <Share className="w-7 h-7" />
          </button>
          <span className="text-white text-sm font-semibold mt-1" data-testid="text-share-count">
            {formatCount(video.shares)}
          </span>
        </div>

        {/* Music Disc */}
        <div className="w-12 h-12 rounded-full bg-black border-2 border-white overflow-hidden music-disc" data-testid="music-disc">
          <img
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
            alt="Music disc"
            className="w-full h-full object-cover"
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
