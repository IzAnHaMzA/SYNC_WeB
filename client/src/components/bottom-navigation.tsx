import { Home, Compass, Plus, MessageSquare, User } from "lucide-react";
import { Link, useLocation } from "wouter";

interface BottomNavigationProps {
  activeTab: string;
}

export default function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const [location] = useLocation();

  const navItems = [
    {
      id: "home",
      icon: Home,
      label: "Home",
      path: "/",
      active: activeTab === "home" || location === "/",
    },
    {
      id: "discover", 
      icon: Compass,
      label: "Discover",
      path: "/discover",
      active: activeTab === "discover" || location === "/discover",
    },
    {
      id: "create",
      icon: Plus,
      label: "",
      path: "/create",
      active: false,
      isCreate: true,
    },
    {
      id: "inbox",
      icon: MessageSquare,
      label: "Inbox",
      path: "/inbox",
      active: activeTab === "inbox",
      hasNotification: true,
    },
    {
      id: "profile",
      icon: User,
      label: "Profile",
      path: "/profile/sarah_dances",
      active: activeTab === "profile" || location.startsWith("/profile"),
    },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-xl border-t border-border/50">
      <div className="flex items-center justify-around py-3 px-4">
        {navItems.map((item) => {
          const IconComponent = item.icon;

          if (item.isCreate) {
            return (
              <button
                key={item.id}
                className="flex flex-col items-center py-1 px-2"
                data-testid="button-create"
              >
                <div className="w-14 h-10 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center relative shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform">
                  <Plus className="text-background text-xl font-bold" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                </div>
              </button>
            );
          }

          return (
            <Link key={item.id} href={item.path}>
              <button
                className={`flex flex-col items-center py-2 px-3 transition-all duration-200 relative rounded-xl ${
                  item.active 
                    ? "text-primary bg-primary/10 shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
                data-testid={`nav-${item.id}`}
              >
                <div className={`p-1 rounded-lg transition-all ${
                  item.active ? "bg-primary/20" : ""
                }`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
                {item.hasNotification && (
                  <div className="absolute -top-1 right-2 w-3 h-3 bg-gradient-to-br from-accent to-primary rounded-full shadow-lg animate-pulse"></div>
                )}
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
