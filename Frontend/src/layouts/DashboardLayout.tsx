import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Sparkles, 
  Image as ImageIcon, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Menu, 
  X,
  Activity,
  Bell,
  Search,
  ChevronRight,
  Video,
  FileSearch,
  Briefcase,
  Palette
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out");
    navigate("/");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const navItems = [
    { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { label: "Projects", path: "/dashboard/projects", icon: Briefcase },
    { label: "Brand Kit", path: "/dashboard/brand", icon: Palette },
    { label: "Text to Copy", path: "/dashboard/text", icon: Sparkles },
    { label: "Text to Image", path: "/dashboard/image", icon: ImageIcon },
    { label: "Text to Video", path: "/dashboard/video", icon: Video, soon: true },
    { label: "Image to Video", path: "/dashboard/vision", icon: Video, soon: true },
    { label: "Image to Text", path: "/dashboard/campaigns", icon: FileSearch },
    { label: "Activity", path: "/dashboard/activity", icon: Activity },
  ];

  const bottomItems = [
    { label: "Settings", path: "/dashboard/settings", icon: Settings },
    { label: "Support", path: "/dashboard/support", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-surface/40 backdrop-blur-xl border-r border-white/[0.05] transition-all duration-300 ease-in-out flex flex-col",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        <Link to="/" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <div className="w-8 h-8 rounded-lg bg-primary shadow-glow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <span className="text-primary-foreground font-black">G</span>
          </div>
          {isSidebarOpen && (
            <span className="font-display font-bold text-xl tracking-tight">GenMark</span>
          )}
        </Link>

        <nav className="flex-1 px-3 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <item.icon size={20} className={cn(isActive ? "text-primary" : "group-hover:text-primary transition-colors")} />
                {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                {item.soon && isSidebarOpen && (
                  <span className="ml-auto text-[8px] font-mono font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase tracking-tighter">Soon</span>
                )}
                {isActive && isSidebarOpen && !item.soon && <ChevronRight size={14} className="ml-auto opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.05] space-y-2">
          {bottomItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all group"
            >
              <item.icon size={20} className="group-hover:text-primary transition-colors" />
              {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all group"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out bg-background relative",
          isSidebarOpen ? "pl-72" : "pl-20"
        )}
      >
        {/* Header */}
        <header className="h-20 border-b border-white/[0.05] flex items-center justify-between px-8 bg-background/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 gap-3 w-64 lg:w-96">
              <Search size={16} className="text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search resources, templates..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/50"
                onClick={() => toast.info("Search focused")}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              className="p-2 hover:bg-white/5 rounded-full transition-colors relative text-muted-foreground hover:text-foreground"
              onClick={() => toast.info("No new notifications")}
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
            </button>
            <div className="relative">
              <div 
                className="flex items-center gap-3 pl-4 border-l border-white/10 hover:opacity-80 cursor-pointer transition-opacity"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold leading-tight">{user?.name || "User"}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {user?.subscription_plan === "pro" || user?.subscription_plan === "enterprise" ? user.subscription_plan + " Plan" : "Free Plan"}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent p-[2px]">
                  <div className="w-full h-full rounded-full bg-surface flex items-center justify-center font-bold">
                    {getInitials(user?.name)}
                  </div>
                </div>
              </div>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-[#0a0f1c]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => { navigate("/dashboard/settings"); setIsProfileDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    <button 
                      onClick={() => { navigate("/dashboard/support"); setIsProfileDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <HelpCircle size={16} />
                      Support
                    </button>
                    <div className="h-px bg-white/10 my-1" />
                    <button 
                      onClick={() => { setIsProfileDropdownOpen(false); handleLogout(); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 pb-20">
          {children}
        </div>
      </main>
    </div>
  );
};
