import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Search, 
  Compass, 
  Play, 
  MessageCircle, 
  Heart, 
  PlusSquare, 
  User, 
  MoreHorizontal,
  Settings,
  Bookmark,
  LogOut,
  Sparkles
} from 'lucide-react';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/reels', icon: Play, label: 'Reels' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/activity', icon: Heart, label: 'Notifications' },
    { path: '/create', icon: PlusSquare, label: 'Create' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-futuristic-dark flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-futuristic-dark border-r border-white/10 flex flex-col">
        {/* Enhanced Logo */}
        <div className="p-6 border-b border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 shimmer"></div>
          <div className="relative flex items-center space-x-3">
            <div className="w-10 h-10 aurora-gradient rounded-2xl flex items-center justify-center float-animation">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white font-futuristic bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              FutureSocial
            </h1>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item, index) => {
              const isItemActive = isActive(item.path);
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-2xl smooth-transition relative overflow-hidden ${
                      isItemActive
                        ? 'bg-gradient-to-r from-neon-blue to-neon-purple shadow-neon hover-glow'
                        : 'hover:bg-white/10 hover-lift'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {isItemActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 shimmer"></div>
                    )}
                    <div className="relative flex items-center space-x-3">
                      <item.icon className={`w-6 h-6 smooth-transition ${
                        isItemActive 
                          ? 'text-white scale-110' 
                          : 'text-white/70 group-hover:text-white group-hover:scale-110'
                      }`} />
                      <span className={`font-medium smooth-transition ${
                        isItemActive 
                          ? 'text-white font-semibold' 
                          : 'text-white/70 group-hover:text-white'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Enhanced User Profile */}
        {user && (
          <div className="p-4 border-t border-white/10">
            <div className="group flex items-center space-x-3 p-3 rounded-2xl hover:bg-white/10 smooth-transition hover-lift relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 smooth-transition"></div>
              <div className="relative flex items-center space-x-3 w-full">
                <div className="relative">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=667eea&color=fff`}
                    alt={user.username}
                    className="w-10 h-10 rounded-full border-2 border-white/20 group-hover:border-neon-blue smooth-transition"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-green rounded-full border-2 border-futuristic-dark"></div>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm group-hover:text-neon-blue smooth-transition">
                    {user.username}
                  </p>
                  <p className="text-white/60 text-xs">{user.fullName}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl hover:bg-white/10 smooth-transition hover-rotate"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 text-white/70 group-hover:text-red-400 smooth-transition" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Center Content */}
        <div className="flex-1 max-w-2xl mx-auto">
          {children}
        </div>

        {/* Enhanced Right Sidebar */}
        <div className="w-80 bg-futuristic-dark border-l border-white/10 p-6 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-neon-purple rounded-full blur-2xl"></div>
          </div>
          
          {/* Enhanced User Account */}
          {user && (
            <div className="relative mb-8">
              <div className="flex items-center space-x-4 p-4 rounded-2xl glass-gradient hover-lift smooth-transition">
                <div className="relative">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=667eea&color=fff`}
                    alt={user.username}
                    className="w-14 h-14 rounded-full border-3 border-white/20 hover:border-neon-blue smooth-transition"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-neon-green rounded-full border-2 border-futuristic-dark pulse-glow-animation"></div>
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg">{user.username}</p>
                  <p className="text-white/70 text-sm">{user.fullName}</p>
                </div>
                <button className="text-neon-blue text-sm font-semibold hover:text-neon-purple smooth-transition hover-glow px-3 py-1 rounded-lg hover:bg-white/10">
                  Switch
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Suggestions */}
          <div className="relative mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg">Suggested for you</h3>
              <button className="text-neon-blue text-sm font-semibold hover:text-neon-purple smooth-transition hover-glow">
                See All
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { username: 'tech_creator', name: 'Tech Creator', mutual: 'Followed by john_doe + 3 more', color: 'from-neon-blue to-neon-purple' },
                { username: 'art_lover', name: 'Art Lover', mutual: 'Followed by jane_smith + 2 more', color: 'from-neon-pink to-neon-orange' },
                { username: 'fitness_guru', name: 'Fitness Guru', mutual: 'Followed by mike_wilson + 5 more', color: 'from-neon-green to-neon-blue' },
                { username: 'music_producer', name: 'Music Producer', mutual: 'Followed by sarah_jones + 1 more', color: 'from-neon-orange to-neon-pink' },
                { username: 'travel_blogger', name: 'Travel Blogger', mutual: 'Followed by alex_chen + 4 more', color: 'from-neon-purple to-neon-blue' }
              ].map((suggestion, index) => (
                <div 
                  key={suggestion.username} 
                  className="group flex items-center space-x-4 p-3 rounded-2xl hover:bg-white/5 smooth-transition hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <img
                      src={`https://ui-avatars.com/api/?name=${suggestion.name}&background=667eea&color=fff`}
                      alt={suggestion.username}
                      className="w-12 h-12 rounded-full border-2 border-white/20 group-hover:border-neon-blue smooth-transition"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r ${suggestion.color} rounded-full border-2 border-futuristic-dark pulse-glow-animation`}></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm group-hover:text-neon-blue smooth-transition">
                      {suggestion.username}
                    </p>
                    <p className="text-white/60 text-xs">{suggestion.mutual}</p>
                  </div>
                  <button className="text-neon-blue text-sm font-semibold hover:text-neon-purple smooth-transition hover-glow px-3 py-1 rounded-lg hover:bg-white/10">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Footer Links */}
          <div className="relative space-y-4">
            <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs">
              {[
                'About', 'Help', 'Press', 'API', 'Jobs', 'Privacy', 'Terms', 
                'Locations', 'Language', 'Meta Verified'
              ].map((link) => (
                <button
                  key={link}
                  className="text-white/60 hover:text-neon-blue smooth-transition hover-glow px-2 py-1 rounded-lg hover:bg-white/5"
                >
                  {link}
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-white/10">
              <p className="text-white/60 text-xs text-center">
                © 2025 <span className="text-neon-blue font-semibold">FUTURESOCIAL</span> FROM META
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout;
