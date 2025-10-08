import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  PlusSquare, 
  Heart, 
  User,
  Play,
  Compass,
  MessageCircle,
  Bookmark,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Home',
      id: 'home',
      color: 'from-neon-blue to-neon-purple'
    },
    {
      path: '/search',
      icon: Search,
      label: 'Search',
      id: 'search',
      color: 'from-neon-pink to-neon-orange'
    },
    {
      path: '/reels',
      icon: Play,
      label: 'Reels',
      id: 'reels',
      color: 'from-neon-green to-neon-blue'
    },
    ...(user ? [
      {
        path: '/activity',
        icon: Heart,
        label: 'Activity',
        id: 'activity',
        color: 'from-neon-pink to-neon-purple'
      },
      {
        path: '/profile',
        icon: User,
        label: 'Profile',
        id: 'profile',
        color: 'from-neon-orange to-neon-pink'
      }
    ] : [
      {
        path: '/login',
        icon: User,
        label: 'Login',
        id: 'login',
        color: 'from-neon-blue to-neon-purple'
      }
    ])
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (item: any) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glassmorphism Background */}
      <div className="glass-dark border-t border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-around py-3 px-4 max-w-md mx-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="flex flex-col items-center justify-center p-2 rounded-2xl smooth-transition hover:scale-110 relative group"
              >
                {/* Active Background Glow */}
                {active && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl opacity-20 blur-sm animate-pulse-glow`}></div>
                )}
                
                {/* Icon Container */}
                <div className={`relative p-3 rounded-2xl smooth-transition ${
                  active 
                    ? `bg-gradient-to-r ${item.color} shadow-neon` 
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  <item.icon 
                    className={`w-5 h-5 smooth-transition ${
                      active ? 'text-white' : 'text-white/70 group-hover:text-white'
                    }`} 
                  />
                  
                  {/* Active Indicator */}
                  {active && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full animate-pulse-glow">
                      <div className="w-full h-full bg-neon-green rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>
                
                {/* Label */}
                <span className={`text-xs mt-1 font-inter smooth-transition ${
                  active 
                    ? 'text-white font-semibold' 
                    : 'text-white/60 group-hover:text-white/80'
                }`}>
                  {item.label}
                </span>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 smooth-transition"></div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Bottom Safe Area */}
      <div className="h-safe-area-bottom bg-futuristic-dark"></div>
    </div>
  );
};

export default BottomNavigation;
