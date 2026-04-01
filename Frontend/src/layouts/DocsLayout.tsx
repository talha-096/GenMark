import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { GradientText } from "@/components/shared/GradientText";
import { 
  Search, 
  Menu, 
  X, 
  BookOpen, 
  Terminal, 
  Zap, 
  Cpu, 
  Globe,
  Star
} from "lucide-react";
import { toast } from "sonner";

export const DocsLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const sections = [
    {
      title: "Getting Started",
      items: [
        { name: "Introduction", path: "/docs", icon: BookOpen },
        { name: "Quickstart", path: "/docs/quickstart", icon: Zap },
        { name: "Core Architecture", path: "/docs/architecture", icon: Cpu },
      ]
    },
    {
      title: "The Engine",
      items: [
        { name: "Neural Copy", path: "/docs/copy", icon: Terminal },
        { name: "Visual Synthesis", path: "/docs/visual", icon: Globe },
        { name: "Semantic Analysis", path: "/docs/semantic", icon: Star },
      ]
    },
    {
      title: "Enterprise",
      items: [
        { name: "Brand Alignment", path: "/docs/brand", icon: Star },
        { name: "API Reference", path: "/docs/api", icon: Terminal },
        { name: "Security", path: "/docs/security", icon: Zap },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-foreground">
      {/* Mobile Nav Header */}
      <div className="lg:hidden h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
        <Link to="/" className="text-xl font-display font-black"><GradientText>GenMark</GradientText></Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="max-w-8xl mx-auto flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 lg:top-0 h-[calc(100vh-64px)] lg:h-screen w-full lg:w-80 border-r border-white/5 bg-[#050505] z-40 transition-all duration-300
          ${isMobileMenuOpen ? "left-0" : "-left-full lg:left-0"}
        `}>
          <div className="p-8 hidden lg:block">
            <Link to="/" className="text-2xl font-display font-black tracking-tighter">
              <GradientText>GenMark Docs</GradientText>
            </Link>
          </div>
          
          <div className="px-8 pb-10">
            <div className="relative mb-8">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
               <input 
                  type="text" 
                  placeholder="Search docs..." 
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      toast.success("Docs Search", { description: "Searching neural documentation for your query..." });
                    }
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs outline-none focus:ring-1 focus:ring-primary/50"
               />
            </div>

            <nav className="space-y-10">
              {sections.map((section, idx) => (
                <div key={idx}>
                  <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4 px-2">{section.title}</h4>
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <li key={item.name}>
                          <Link
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group ${
                              isActive 
                                ? "bg-primary/10 text-primary font-bold" 
                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            }`}
                          >
                            <item.icon size={16} className={isActive ? "text-primary" : "opacity-40 group-hover:opacity-100"} />
                            <span>{item.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 w-full lg:max-w-4xl px-6 lg:px-16 py-12 lg:py-24">
          <Outlet />
          
          {/* Footer inside content */}
          <footer className="mt-24 pt-12 border-t border-white/5 flex justify-between items-center text-xs text-muted-foreground">
             <div className="flex gap-4">
                <button onClick={() => toast.info("GitHub", { description: "Opening GenMark Open Source Repository..." })} className="hover:text-primary transition-colors">GitHub</button>
                <button onClick={() => toast.info("Discord", { description: "Joining the GenMark Neural Community..." })} className="hover:text-primary transition-colors">Discord</button>
                <button onClick={() => toast.info("X / Twitter", { description: "Following GenMark Neural Updates..." })} className="hover:text-primary transition-colors">X / Twitter</button>
             </div>
             <p>© {new Date().getFullYear()} GenMark AI</p>
          </footer>
        </main>
      </div>
    </div>
  );
};
