import { useRef, useEffect } from "react";
import VideoActions from "./video-actions";

interface VideoPlayerProps {
  video: any;
  isActive: boolean;
}

export default function VideoPlayer({ video, isActive }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isActive) {
      videoElement.play().catch(console.error);
    } else {
      videoElement.pause();
    }
  }, [isActive]);

  return (
    <div className="video-container w-full relative bg-black">
      {/* Mock video placeholder - in real app this would be actual video */}
      <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/30 to-primary/40 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/10 to-background/30"></div>
        <div className="text-white text-center z-10">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl">
            <div className="text-4xl">🎬</div>
          </div>
          <div className="text-lg font-semibold mb-2 drop-shadow-lg">Video: {video.description?.slice(0, 30)}...</div>
          <div className="text-sm opacity-90 bg-background/20 rounded-full px-4 py-1 backdrop-blur-sm">by @{video.user?.username}</div>
        </div>
        <div className="absolute top-4 right-4 text-xs text-white/70 bg-background/20 rounded-full px-3 py-1 backdrop-blur-sm">
          VidFlow
        </div>
      </div>
      
      {/* Video overlay */}
      <div className="absolute inset-0 video-overlay pointer-events-none">
        {/* Right Side Actions */}
        <VideoActions video={video} />

        {/* Bottom Content */}
        <div className="absolute bottom-24 left-4 right-20 pointer-events-auto">
          <div className="text-white">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-lg" data-testid="text-username">
                @{video.user?.username}
              </span>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <button className="text-primary font-semibold hover:underline" data-testid="button-follow-inline">
                Follow
              </button>
            </div>
            <div className="text-white mb-3" data-testid="text-description">
              {video.description}
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <i className="fas fa-music"></i>
              <span data-testid="text-music">
                {video.musicTitle} - {video.musicArtist}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
