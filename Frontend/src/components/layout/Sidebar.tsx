import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Type,
  Image as ImageIcon,
  Palette,
  Clock,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Video
} from "lucide-react";
import { GradientText } from "../shared/GradientText";

const DASHBOARD_LINKS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Type, label: "Text to Text", href: "/dashboard/text-to-text" },
  { icon: ImageIcon, label: "Text to Image", href: "/dashboard/text-to-image" },
  { icon: Video, label: "Text to Video (Soon)", href: "#" },
  { icon: Video, label: "Image to Video (Soon)", href: "#" },
  { icon: Palette, label: "Brand Kit", href: "/dashboard/brand-kit" },
  { icon: Clock, label: "History", href: "/dashboard/history" },
  { icon: UserCircle, label: "Profile", href: "/dashboard/profile" },
];

export const Sidebar = React.memo(() => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-screen bg-surface-raised border-r border-white/[0.05] flex flex-col transition-all duration-300 relative z-20 shrink-0",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      <div className={cn("h-20 flex items-center shrink-0 border-b border-white/[0.05]", collapsed ? "justify-center" : "px-6 justify-between")}>
        {!collapsed && (
          <Link to="/" className="font-display font-black text-xl tracking-tight leading-none group">
            <GradientText>GenMark</GradientText>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 rounded-md hover:bg-white/[0.05] text-muted-foreground hover:text-foreground transition-colors",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-2 overflow-y-auto px-3">
        {DASHBOARD_LINKS.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.label}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium",
                isActive 
                  ? "bg-primary/10 text-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-primary/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03] border border-transparent",
                collapsed && "justify-center"
              )}
              title={collapsed ? link.label : undefined}
            >
              <link.icon className={cn("shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} size={20} strokeWidth={isActive ? 2.5 : 2} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
});
Sidebar.displayName = "Sidebar";
