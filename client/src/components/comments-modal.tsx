import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CommentsModalProps {
  video: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function CommentsModal({ video, isOpen, onClose }: CommentsModalProps) {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["/api/videos", video.id, "comments"],
    enabled: isOpen,
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", `/api/videos/${video.id}/comments`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos", video.id, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      setNewComment("");
      toast({
        title: "Comment posted!",
        description: "Your comment has been added to the video",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    commentMutation.mutate(newComment);
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "now";
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}d`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end" data-testid="comments-modal">
      <div className="w-full bg-background rounded-t-3xl max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Comments Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-foreground font-semibold text-lg" data-testid="text-comment-count">
            {video.comments} comments
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-comments"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground" data-testid="text-no-comments">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            comments.map((comment: any) => (
              <div key={comment.id} className="flex space-x-3" data-testid={`comment-${comment.id}`}>
                <img
                  src={comment.user?.avatar}
                  alt={comment.user?.username}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-foreground font-semibold text-sm" data-testid="text-commenter-username">
                      {comment.user?.username}
                    </span>
                    <span className="text-muted-foreground text-xs" data-testid="text-comment-time">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-foreground text-sm" data-testid="text-comment-content">
                    {comment.content}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <button className="text-muted-foreground text-xs hover:text-foreground" data-testid="button-reply">
                      Reply
                    </button>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground text-xs" data-testid="text-comment-likes">
                        {comment.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-border">
          <form onSubmit={handleSubmitComment} className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
              alt="Your avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Add comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-muted text-foreground placeholder-muted-foreground rounded-full px-4 py-2 pr-12 border-0 focus:ring-2 focus:ring-primary"
                disabled={commentMutation.isPending}
                data-testid="input-comment"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!newComment.trim() || commentMutation.isPending}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary/90"
                data-testid="button-post-comment"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
