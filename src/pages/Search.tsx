import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DesktopLayout from '../components/DesktopLayout';
import BottomNavigation from '../components/BottomNavigation';
import { 
  Search as SearchIcon, 
  X, 
  User, 
  Hash, 
  Clock,
  TrendingUp,
  MapPin,
  Music
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'user' | 'hashtag' | 'location' | 'music';
  title: string;
  subtitle?: string;
  avatar?: string;
  posts?: number;
  followers?: number;
}

const Search: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([
    {
      id: '1',
      type: 'user',
      title: 'raju.bandar_vlogs_m',
      subtitle: 'raju.bandar_vlogs',
      avatar: 'https://ui-avatars.com/api/?name=Raju+Bandar&background=ff6b35&color=fff'
    },
    {
      id: '2',
      type: 'hashtag',
      title: '#freeaitoolsforcontentcreation',
      posts: 16
    }
  ]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
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

  // Mock search results
  const mockSearchResults: SearchResult[] = [
    {
      id: '1',
      type: 'user',
      title: 'tech_creator',
      subtitle: 'Tech Creator',
      avatar: 'https://ui-avatars.com/api/?name=Tech+Creator&background=00d4ff&color=fff',
      followers: 12500
    },
    {
      id: '2',
      type: 'user',
      title: 'art_lover',
      subtitle: 'Art Lover',
      avatar: 'https://ui-avatars.com/api/?name=Art+Lover&background=f093fb&color=fff',
      followers: 8900
    },
    {
      id: '3',
      type: 'hashtag',
      title: '#futuristic',
      posts: 125000
    },
    {
      id: '4',
      type: 'hashtag',
      title: '#tech',
      posts: 2500000
    },
    {
      id: '5',
      type: 'location',
      title: 'Tokyo, Japan',
      posts: 45000
    },
    {
      id: '6',
      type: 'music',
      title: 'Original Audio',
      subtitle: 'by tech_creator',
      posts: 1200
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = mockSearchResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.subtitle?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeRecentSearch = (id: string) => {
    setRecentSearches(prev => prev.filter(item => item.id !== id));
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'user') {
      navigate(`/profile/${result.title}`);
    } else if (result.type === 'hashtag') {
      // Navigate to hashtag page
      console.log('Navigate to hashtag:', result.title);
    }
    
    // Add to recent searches
    if (!recentSearches.find(item => item.id === result.id)) {
      setRecentSearches(prev => [result, ...prev.slice(0, 4)]);
    }
  };

  const renderSearchContent = () => (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Header */}
      <div className="glass-dark border-b border-white/10 px-6 py-6">
        <h1 className="text-2xl font-bold text-white font-futuristic mb-6">Search</h1>
        
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-white/50" />
          </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-neon-blue smooth-transition"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
              <X className="w-5 h-5 text-white/50 hover:text-white smooth-transition" />
              </button>
            )}
        </div>
      </div>

      {/* Search Results */}
      <div className="px-6 py-4">
        {searchQuery ? (
          <div className="space-y-4">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/5 smooth-transition cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    {result.type === 'user' ? (
                      <img
                        src={result.avatar}
                        alt={result.title}
                        className="w-12 h-12 rounded-full border-2 border-white/20"
                      />
                    ) : result.type === 'hashtag' ? (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center">
                        <Hash className="w-6 h-6 text-white" />
                      </div>
                    ) : result.type === 'location' ? (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-pink to-neon-orange flex items-center justify-center">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                    )}
          </div>
                  
                <div className="flex-1">
                    <p className="text-white font-semibold text-lg">{result.title}</p>
                    {result.subtitle && (
                      <p className="text-white/60 text-sm">{result.subtitle}</p>
                    )}
                    {result.posts && (
                      <p className="text-white/50 text-sm">{result.posts.toLocaleString()} posts</p>
                    )}
                    {result.followers && (
                      <p className="text-white/50 text-sm">{result.followers.toLocaleString()} followers</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-10 h-10 text-white/50" />
                </div>
                <p className="text-white/70 text-lg">No results found</p>
                <p className="text-white/50 text-sm mt-2">Try searching for something else</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-semibold text-lg">Recent</h2>
                  <button
                    onClick={clearAllRecent}
                    className="text-neon-blue text-sm font-semibold hover:text-neon-purple smooth-transition"
                  >
                    Clear all
                  </button>
                </div>
                
                <div className="space-y-2">
                  {recentSearches.map((search) => (
                    <div
                      key={search.id}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 smooth-transition group"
                    >
                      <div
                        onClick={() => handleResultClick(search)}
                        className="flex items-center space-x-3 flex-1 cursor-pointer"
                      >
                        <div className="flex-shrink-0">
                          {search.type === 'user' ? (
                            <img
                              src={search.avatar}
                              alt={search.title}
                              className="w-10 h-10 rounded-full border-2 border-white/20"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center">
                              <Hash className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                        
                <div className="flex-1">
                          <p className="text-white font-medium">{search.title}</p>
                          {search.subtitle && (
                            <p className="text-white/60 text-sm">{search.subtitle}</p>
                          )}
                          {search.posts && (
                            <p className="text-white/50 text-sm">{search.posts} posts</p>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeRecentSearch(search.id)}
                        className="p-2 rounded-full hover:bg-white/10 smooth-transition opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4 text-white/50 hover:text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending */}
            <div>
              <h2 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-neon-blue" />
                <span>Trending</span>
              </h2>
              
              <div className="space-y-2">
                {[
                  { title: '#futuristic', posts: 125000 },
                  { title: '#tech', posts: 2500000 },
                  { title: '#ai', posts: 890000 },
                  { title: '#coding', posts: 450000 },
                  { title: '#design', posts: 320000 }
                ].map((trend, index) => (
                  <div
                    key={trend.title}
                    onClick={() => handleResultClick({ id: `trend-${index}`, type: 'hashtag', title: trend.title, posts: trend.posts })}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 smooth-transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center">
                        <Hash className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{trend.title}</p>
                        <p className="text-white/50 text-sm">{trend.posts.toLocaleString()} posts</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-neon-green text-sm font-semibold">#{index + 1}</p>
                    </div>
              </div>
            ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isDesktop) {
    return <DesktopLayout>{renderSearchContent()}</DesktopLayout>;
  }

  // Mobile layout
  return (
    <div className="min-h-screen bg-futuristic-dark particle-bg pb-20 overflow-y-auto">
      {renderSearchContent()}
      <BottomNavigation />
    </div>
  );
};

export default Search;