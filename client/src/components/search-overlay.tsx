import { useState } from "react";
import { Search, TrendingUp, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
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
  ];

  const removeRecentSearch = (searchToRemove: string) => {
    setRecentSearches(prev => prev.filter(search => search !== searchToRemove));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background z-50" data-testid="search-overlay">
      <div className="flex flex-col h-full">
        {/* Search Header */}
        <div className="flex items-center p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="mr-4"
            data-testid="button-close-search"
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search accounts and videos"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted text-foreground placeholder-muted-foreground rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-primary"
              autoFocus
              data-testid="input-search"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          </div>
        </div>

        {/* Search Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Trending Searches */}
          <div className="mb-6">
            <h3 className="text-foreground font-semibold mb-3" data-testid="heading-trending">
              Trending
            </h3>
            <div className="space-y-2">
              {trendingTopics.map((topic, index) => (
                <button
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg w-full hover:bg-muted/80 transition-colors"
                  data-testid={`trending-${index}`}
                >
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{topic.hashtag}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">{topic.videos} videos</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          <div>
            <h3 className="text-foreground font-semibold mb-3" data-testid="heading-recent">
              Recent
            </h3>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3"
                  data-testid={`recent-${index}`}
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{search}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRecentSearch(search)}
                    data-testid={`button-remove-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
