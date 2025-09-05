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
      <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">🎬</div>
          <div className="text-lg font-semibold">Video: {video.description?.slice(0, 30)}...</div>
          <div className="text-sm opacity-75 mt-2">by @{video.user?.username}</div>
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
