import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DesktopLayout from '../components/DesktopLayout';
import BottomNavigation from '../components/BottomNavigation';
import ReelsPlayer from '../components/ReelsPlayer';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  ArrowLeft,
  Search
} from 'lucide-react';

const Reels: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if we're on desktop
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const renderReelsContent = () => (
    <div className="w-full h-full">
      <ReelsPlayer />
    </div>
  );

  if (isDesktop) {
    return <DesktopLayout>{renderReelsContent()}</DesktopLayout>;
  }

  // Mobile layout
  return (
    <div className="min-h-screen bg-futuristic-dark">
      {renderReelsContent()}
      <BottomNavigation />
    </div>
  );
};

export default Reels;
