import { Link } from "react-router-dom";
import { GradientText } from "@/components/shared/GradientText";
import { Activity, Twitter, Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

const PRODUCT_LINKS = [
  { label: "Features",   path: "/features" },
  { label: "Pricing",    path: "/pricing" },
  { label: "Roadmap",    path: "/roadmap" },
  { label: "Enterprise", path: "/enterprise" },
  { label: "Engine",     path: "/engine" },
];

const RESOURCE_LINKS = [
  { label: "Documentation",    path: "/docs" },
  { label: "API Reference",    path: "/api" },
  { label: "Blog",             path: "/blog" },
  { label: "Strategic Guides", path: "/guides" },
  { label: "Status",           path: "/status" },
];

const SOCIAL_LINKS = [
  { Icon: Twitter,  href: "#", label: "Twitter" },
  { Icon: Github,   href: "#", label: "GitHub" },
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
  { Icon: Mail,     href: "#", label: "Email" },
];

export const Footer = () => {
  return (
    <footer className="relative z-10 pt-20 pb-10 px-6 overflow-hidden">
      {/* Top separator with glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand column */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 w-fit group">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                <Activity size={16} className="text-primary" />
              </div>
              <span className="text-xl font-black tracking-tighter" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <GradientText>GenMark</GradientText>
              </span>
            </Link>

            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              The ultimate AI-powered content ecosystem for enterprise marketing teams.
              Strategic content, visual synthesis, absolute brand consistency.
            </p>

            {/* Social links */}
            <div className="flex gap-2 mt-1">
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-primary hover:bg-primary/[0.08] hover:border-primary/20 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-mono font-bold text-primary/80 uppercase tracking-widest mb-5">Product</h4>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-sm text-white/45 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 opacity-0 group-hover:opacity-100 text-primary text-xs">›</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resource links */}
          <div>
            <h4 className="text-xs font-mono font-bold text-primary/80 uppercase tracking-widest mb-5">Resources</h4>
            <ul className="space-y-3">
              {RESOURCE_LINKS.map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-sm text-white/45 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 opacity-0 group-hover:opacity-100 text-primary text-xs">›</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-mono font-bold text-primary/80 uppercase tracking-widest">Stay Updated</h4>
            <p className="text-sm text-white/40 leading-snug">
              Subscribe for product updates and early access announcements.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="bg-white/[0.04] border border-white/[0.07] focus:border-primary/30 focus:bg-white/[0.06] rounded-xl px-4 py-2.5 text-sm flex-1 outline-none text-white placeholder:text-white/25 transition-all duration-200"
              />
              <button
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(217 91% 45%))",
                  boxShadow: "0 0 16px rgba(59,130,246,0.3)",
                }}
              >
                <ArrowUpRight size={16} />
              </button>
            </div>
            <p className="text-[11px] text-white/20 italic leading-snug">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/25">
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link to="/terms"   className="hover:text-white/60 transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white/60 transition-colors">Cookie Strategy</Link>
          </div>
          <p className="font-mono">© {new Date().getFullYear()} GenMark AI — High-Velocity Architecture</p>
        </div>
      </div>
    </footer>
  );
};
