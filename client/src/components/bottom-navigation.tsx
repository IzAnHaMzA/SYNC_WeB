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
    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-90 backdrop-blur-lg border-t border-gray-800">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;

          if (item.isCreate) {
            return (
              <button
                key={item.id}
                className="flex flex-col items-center py-2 px-2"
                data-testid="button-create"
              >
                <div className="w-12 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center relative">
                  <Plus className="text-black text-xl font-bold" />
                  <div className="absolute -left-2 top-0 w-8 h-8 bg-accent rounded-lg opacity-80"></div>
                  <div className="absolute -right-2 top-0 w-8 h-8 bg-primary rounded-lg opacity-80"></div>
                </div>
              </button>
            );
          }

          return (
            <Link key={item.id} href={item.path}>
              <button
                className={`flex flex-col items-center py-2 px-4 transition-colors relative ${
                  item.active ? "text-white" : "text-gray-400 hover:text-white"
                }`}
                data-testid={`nav-${item.id}`}
              >
                <IconComponent className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
                {item.hasNotification && (
                  <div className="absolute top-1 right-3 w-2 h-2 bg-primary rounded-full"></div>
                )}
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
