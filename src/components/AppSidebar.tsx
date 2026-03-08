import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  Target,
  CalendarDays,
  BarChart3,
  Search,
  Clock,
  Star,
  Settings,
  Plus,
  LogOut,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Main Journal", url: "/journal", icon: BookOpen },
  { title: "Buckets", url: "/buckets", icon: Target },
  { title: "Calendar", url: "/calendar", icon: CalendarDays },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Search Memories", url: "/search", icon: Search },
  { title: "Timeline", url: "/timeline", icon: Clock },
  { title: "Year Review", url: "/year-review", icon: Star },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface AppSidebarProps {
  onNewEntry: () => void;
}

export function AppSidebar({ onNewEntry }: AppSidebarProps) {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col z-50">
      <div className="px-6 py-6 flex items-center gap-3">
        <img src="/favicon.png" alt="Life Dashboard" className="w-8 h-8" />
        <span className="text-sidebar-foreground font-display text-lg">Life Dashboard</span>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-4 space-y-2">
        <button
          onClick={onNewEntry}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full py-3 text-sm font-semibold hover:opacity-90 transition-opacity shadow-elevated"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 text-sidebar-foreground/50 hover:text-sidebar-foreground rounded-full py-2 text-xs transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
