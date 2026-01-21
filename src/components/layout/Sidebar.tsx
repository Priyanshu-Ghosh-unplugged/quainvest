import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  ArrowLeftRight, 
  BarChart3, 
  Shield, 
  BookOpen, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Wallet, label: "Portfolio", path: "/portfolio" },
  { icon: TrendingUp, label: "Markets", path: "/markets" },
  { icon: ArrowLeftRight, label: "Trade", path: "/trade", badge: "Live" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Shield, label: "Risk", path: "/risk" },
  { icon: BookOpen, label: "Learn", path: "/learn" },
  { icon: Users, label: "Community", path: "/community" },
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <motion.div className="flex items-center gap-3" animate={{ opacity: isCollapsed ? 0 : 1 }}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-effect">
            <span className="text-primary-foreground font-bold text-lg">Q</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg text-foreground">QuaiInvest</h1>
              <p className="text-xs text-muted-foreground">Invest Smart</p>
            </div>
          )}
        </motion.div>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
          {isCollapsed ? <ChevronRight className="w-4 h-4 text-muted-foreground" /> : <ChevronLeft className="w-4 h-4 text-muted-foreground" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
                {!isCollapsed && (
                  <>
                    <span className="font-medium">{item.label}</span>
                    {item.badge && <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">{item.badge}</span>}
                  </>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-sidebar-border">
        <Link to="/settings">
          <div className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
            location.pathname === "/settings" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          )}>
            <Settings className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </div>
        </Link>
      </div>
    </motion.aside>
  );
};
