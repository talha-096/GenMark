import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { GradientText } from "@/components/shared/GradientText";
import { Menu, X, Activity, ChevronRight, ChevronDown } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Show navbar only at the very top, or transition it out
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Engine", path: "/engine" },
    { name: "Enterprise", path: "/enterprise" },
  ];

  const isDashboard = location.pathname.startsWith("/dashboard");
  if (isDashboard) return null;

  // The user wants navbar shown at top and hidden as they scroll down
  const isHidden = window.scrollY > 100;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out ${
      isHidden ? "translate-y-[-100%] opacity-0" : "translate-y-0 opacity-100"
    } ${isScrolled ? "py-4" : "py-8"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`relative flex items-center justify-between rounded-full border px-8 py-3 transition-all duration-500 ${
          isScrolled 
            ? "bg-black/40 border-white/10 backdrop-blur-xl shadow-glow-sm" 
            : "bg-transparent border-transparent"
        }`}>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center transition-transform group-hover:scale-110">
               <Activity size={18} className="text-primary" />
            </div>
            <span className="text-xl font-display font-black tracking-tighter">
              <GradientText>GenMark</GradientText>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path} 
                className="text-[13px] font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
            <Link to="/docs" className="text-[13px] font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors relative group">
              Docs
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6 border-l border-white/10 pl-10">
            <div className="flex items-center gap-2 group cursor-help">
               <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
               </div>
               <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest group-hover:text-green-500 transition-colors">Engine Online</span>
            </div>
            
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-bold shadow-glow-sm hover:translate-y-[-2px] hover:shadow-glow-md transition-all">
                  <span>{user.name}</span>
                  <ChevronDown size={14} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-black/90 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">Dashboard</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">Settings</Link>
                  <button onClick={() => logout()} className="block w-full text-left px-4 py-2 text-sm font-medium text-red-400 hover:bg-white/10 transition-colors">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-glow-sm hover:translate-y-[-2px] hover:shadow-glow-md active:translate-y-0 transition-all">
                 <span>Access Hub</span>
                 <ChevronRight size={14} />
              </Link>
            )}
          </div>

          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl transition-all duration-500 ${
        isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      }`}>
         <div className="h-full flex flex-col items-center justify-center gap-8 py-20 px-6">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-4xl font-display font-black tracking-tight"
              >
                {link.name}
              </a>
            ))}
            {user ? (
              <div className="mt-8 w-full flex flex-col items-center gap-6 border-t border-white/10 pt-8">
                <div className="text-sm font-mono text-muted-foreground mb-2">Signed in as <span className="text-white font-bold">{user.name}</span></div>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-display font-medium text-white hover:text-primary transition-colors">Dashboard</Link>
                <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-display font-medium text-white hover:text-primary transition-colors">Settings</Link>
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-2xl font-display font-medium text-red-500 hover:text-red-400 transition-colors">Logout</button>
              </div>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-8 flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground text-xl font-bold hover:scale-105 transition-transform"
              >
                 <span>Access Hub</span>
                 <ChevronRight size={20} />
              </Link>
            )}
         </div>
      </div>
    </nav>
  );
};
