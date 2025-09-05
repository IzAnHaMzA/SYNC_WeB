import { useState } from "react";
import { Search, TrendingUp, Clock, X } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BottomNavigation from "@/components/bottom-navigation";

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "sarah_dances",
    "cooking",
    "#dancechallenge"
  ]);

  const trendingTopics = [
    { hashtag: "#dancechallenge", videos: "2.1M" },
    { hashtag: "#cooking", videos: "892K" },
    { hashtag: "#skateboarding", videos: "567K" },
    { hashtag: "#makeup", videos: "423K" },
    { hashtag: "#fitness", videos: "334K" },
  ];

  const removeRecentSearch = (searchToRemove: string) => {
    setRecentSearches(prev => prev.filter(search => search !== searchToRemove));
  };

  return (
    <div className="w-full h-screen bg-background overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Search Header */}
        <div className="flex items-center p-4 border-b border-border">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-4" data-testid="button-back">
              <X className="h-6 w-6" />
            </Button>
          </Link>
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search accounts and videos"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted text-foreground placeholder-muted-foreground rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-primary"
              data-testid="input-search"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          </div>
        </div>

        {/* Search Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-20">
          {/* Trending Searches */}
          <div className="mb-6">
            <h3 className="text-foreground font-semibold mb-3 flex items-center" data-testid="heading-trending">
              <TrendingUp className="w-5 h-5 mr-2" />
              Trending
            </h3>
            <div className="space-y-2">
              {trendingTopics.map((topic, index) => (
                <button
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg w-full hover:bg-muted/80 transition-colors"
                  data-testid={`trending-item-${index}`}
                >
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium">{topic.hashtag}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">{topic.videos} videos</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          <div>
            <h3 className="text-foreground font-semibold mb-3 flex items-center" data-testid="heading-recent">
              <Clock className="w-5 h-5 mr-2" />
              Recent
            </h3>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
                  data-testid={`recent-item-${index}`}
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{search}</span>
                  </div>
                  <button
                    onClick={() => removeRecentSearch(search)}
                    className="text-muted-foreground hover:text-foreground p-1"
                    data-testid={`button-remove-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Creators */}
          <div className="mt-6">
            <h3 className="text-foreground font-semibold mb-3" data-testid="heading-creators">
              Popular Creators
            </h3>
            <div className="space-y-3">
              {[
                {
                  username: "sarah_dances",
                  displayName: "Sarah Johnson",
                  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                  followers: "127.5K"
                },
                {
                  username: "chef_marcus",
                  displayName: "Marcus Rodriguez",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                  followers: "89.2K"
                },
                {
                  username: "skate_life_tony",
                  displayName: "Tony Martinez",
                  avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                  followers: "245.7K"
                }
              ].map((creator, index) => (
                <Link key={index} href={`/profile/${creator.username}`}>
                  <div className="flex items-center space-x-3 p-3 hover:bg-muted/50 rounded-lg transition-colors" data-testid={`creator-${index}`}>
                    <img
                      src={creator.avatar}
                      alt={creator.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{creator.displayName}</div>
                      <div className="text-sm text-muted-foreground">@{creator.username}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{creator.followers} followers</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <BottomNavigation activeTab="discover" />
    </div>
  );
}
