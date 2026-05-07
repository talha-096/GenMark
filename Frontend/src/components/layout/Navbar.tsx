import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { GradientText } from "@/components/shared/GradientText";
import { Menu, X, Activity, ChevronRight, ChevronDown } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home",       path: "/" },
  { name: "Features",   path: "/features" },
  { name: "Engine",     path: "/engine" },
  { name: "Enterprise", path: "/enterprise" },
  { name: "Docs",       path: "/docs" },
];

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled]           = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Sticky scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMobileMenuOpen]);

  const isDashboard = location.pathname.startsWith("/dashboard");
  if (isDashboard) return null;

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      {/* ── Navbar ── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={cn(
          "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ease-in-out",
          isScrolled
            ? "py-3 bg-[hsl(220_22%_4%/0.75)] backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_1px_0_rgba(255,255,255,0.04),0_4px_32px_rgba(0,0,0,0.5)]"
            : "py-5 bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">

            {/* Logo */}
            <Link
              to="/"
              aria-label="GenMark Home"
              className="flex items-center gap-2.5 group flex-shrink-0"
            >
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-glow-sm">
                <Activity size={16} className="text-primary" />
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-xl border border-primary/20 animate-ping opacity-40" />
              </div>
              <span className="text-xl font-black tracking-tighter" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <GradientText>GenMark</GradientText>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  aria-current={isActive(link.path) ? "page" : undefined}
                  className={cn(
                    "relative px-4 py-2 text-[13px] font-medium tracking-wide rounded-lg transition-all duration-200",
                    "group overflow-hidden",
                    isActive(link.path)
                      ? "text-white"
                      : "text-white/50 hover:text-white"
                  )}
                >
                  {/* Active background */}
                  {isActive(link.path) && (
                    <span className="absolute inset-0 bg-white/[0.06] rounded-lg" />
                  )}
                  {/* Hover background */}
                  <span className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.04] rounded-lg transition-colors duration-200" />
                  <span className="relative">{link.name}</span>
                  {/* Active underline dot */}
                  {isActive(link.path) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-glow-sm" />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Engine status badge */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/[0.08] border border-green-500/20 cursor-default"
                title="System Status"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-[10px] font-mono text-green-400/80 uppercase tracking-widest whitespace-nowrap">
                  Engine Online
                </span>
              </div>

              {user ? (
                <div className="relative group">
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 text-white text-sm font-semibold hover:bg-white/[0.10] hover:border-white/20 transition-all duration-200"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                      {user.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <span>{user.name}</span>
                    <ChevronDown size={12} className="opacity-60" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-52 py-1.5 bg-[hsl(220_20%_7%/0.95)] border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <Link to="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors rounded-lg mx-1.5">
                      Dashboard
                    </Link>
                    <Link to="/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors rounded-lg mx-1.5">
                      Settings
                    </Link>
                    <div className="my-1.5 h-px bg-white/[0.06] mx-3" />
                    <button
                      onClick={() => logout()}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] transition-colors rounded-lg mx-1.5"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full overflow-hidden text-sm font-bold text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(217 91% 45%))",
                    boxShadow: "0 0 20px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                  }}
                >
                  {/* Hover shimmer */}
                  <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                  <span className="relative">Access Hub</span>
                  <ChevronRight size={14} className="relative opacity-80" />
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              ref={hamburgerRef}
              className="lg:hidden relative flex items-center justify-center w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <span className={cn("absolute transition-all duration-300", isMobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90")}>
                <X size={20} />
              </span>
              <span className={cn("absolute transition-all duration-300", isMobileMenuOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0")}>
                <Menu size={20} />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "lg:hidden fixed inset-0 z-40 transition-all duration-300",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[hsl(220_22%_4%/0.92)] backdrop-blur-2xl"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Menu content */}
        <div
          className={cn(
            "relative flex flex-col items-center justify-center h-full gap-2 px-8 pt-24 pb-12 transition-all duration-300",
            isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}
        >
          {/* Nav links */}
          <nav aria-label="Mobile navigation" className="flex flex-col items-center gap-1 w-full mb-6">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isActive(link.path) ? "page" : undefined}
                className={cn(
                  "w-full max-w-xs text-center py-4 text-2xl font-black tracking-tight rounded-2xl transition-all duration-200",
                  "animate-fade-in-up",
                  isActive(link.path)
                    ? "text-primary bg-primary/10 border border-primary/20"
                    : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
                )}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="w-full max-w-xs h-px bg-white/[0.07] mb-6" />

          {/* Auth section */}
          {user ? (
            <div className="w-full max-w-xs flex flex-col items-center gap-3 animate-fade-in-up delay-300">
              <p className="text-sm font-mono text-white/40">
                Signed in as <span className="text-white font-bold">{user.name}</span>
              </p>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3.5 text-base font-bold text-white bg-white/[0.06] border border-white/10 rounded-2xl hover:bg-white/[0.10] transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="w-full text-center py-3 text-sm font-semibold text-red-400 hover:text-red-300 bg-red-500/[0.05] rounded-2xl hover:bg-red-500/[0.10] transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="w-full max-w-xs flex flex-col gap-3 animate-fade-in-up delay-300">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-black text-white hover:scale-[1.02] active:scale-[0.98] transition-all"
                style={{
                  background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(217 91% 45%))",
                  boxShadow: "0 0 24px rgba(59,130,246,0.4)",
                }}
              >
                Access Hub <ChevronRight size={18} />
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 text-base font-medium text-white/40 hover:text-white/70 transition-colors"
              >
                Create Account →
              </Link>
            </div>
          )}

          {/* Engine status */}
          <div className="mt-8 flex items-center gap-2 animate-fade-in-up delay-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[11px] font-mono text-green-400/60 uppercase tracking-widest">
              Engine Online
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
