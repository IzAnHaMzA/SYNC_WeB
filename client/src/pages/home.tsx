import VideoFeed from "@/components/video-feed";
import BottomNavigation from "@/components/bottom-navigation";

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-background">
      <VideoFeed />
      <BottomNavigation activeTab="home" />
    </div>
  );
}
