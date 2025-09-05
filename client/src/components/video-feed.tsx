import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import VideoPlayer from "./video-player";

export default function VideoFeed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["/api/videos"],
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !videos.length) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const videoHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / videoHeight);
      
      if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
        setCurrentVideoIndex(newIndex);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [videos.length, currentVideoIndex]);

  // Header tabs
  const [activeTab, setActiveTab] = useState("foryou");

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 flex flex-col items-center p-4 z-20 bg-gradient-to-b from-background/80 via-background/40 to-transparent backdrop-blur-lg">
        <div className="flex items-center space-x-1 bg-muted/30 rounded-full p-1 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("following")}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
              activeTab === "following" 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid="tab-following"
          >
            Following
          </button>
          <button
            onClick={() => setActiveTab("foryou")}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
              activeTab === "foryou" 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid="tab-foryou"
          >
            For You
          </button>
        </div>
        <div className="text-center mt-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            VidFlow
          </h1>
        </div>
      </div>

      {/* Video Container */}
      <div
        ref={containerRef}
        className="video-scroll w-full h-full"
        data-testid="video-feed-container"
      >
        {videos.map((video: any, index: number) => (
          <VideoPlayer
            key={video.id}
            video={video}
            isActive={index === currentVideoIndex}
            data-testid={`video-player-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
