import { Link } from "react-router-dom";
import { GradientText } from "@/components/shared/GradientText";
import { Twitter, Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative z-10 pt-24 pb-12 px-6 border-t border-white/[0.05] bg-surface/30 backdrop-blur-xl overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="flex flex-col gap-6">
          <Link to="/" className="text-2xl font-display font-black tracking-tight">
            <GradientText>GenMark</GradientText>
          </Link>
          <p className="text-muted-foreground max-w-xs leading-relaxed">
            The ultimate AI-powered content ecosystem for enterprise marketing teams. Strategic content, visual synthesis, and absolute brand consistency.
          </p>
          <div className="flex gap-4">
             {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                  <Icon size={18} />
                </a>
             ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold text-lg mb-6">Product</h4>
          <ul className="space-y-4 text-muted-foreground">
            <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            <li><Link to="/roadmap" className="hover:text-primary transition-colors">Roadmap</Link></li>
            <li><Link to="/enterprise" className="hover:text-primary transition-colors">Enterprise</Link></li>
          </ul>
        </div>

        <div>
           <h4 className="font-display font-bold text-lg mb-6">Resources</h4>
           <ul className="space-y-4 text-muted-foreground">
             <li><Link to="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
             <li><Link to="/api" className="hover:text-primary transition-colors">API Reference</Link></li>
             <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
             <li><Link to="/guides" className="hover:text-primary transition-colors">Strategic Guides</Link></li>
           </ul>
        </div>

        <div className="flex flex-col gap-6">
           <h4 className="font-display font-bold text-lg mb-6">Join the Revolution</h4>
           <div className="flex gap-2">
              <input type="text" placeholder="Email Address" className="bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm flex-1 outline-none focus:ring-1 focus:ring-primary/50" />
              <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                 <ArrowUpRight size={20} />
              </button>
           </div>
           <p className="text-xs text-muted-foreground/60 italic leading-snug">
              Subscribe to stay updated with our rapid neural evolution.
           </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] text-muted-foreground/60">
         <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-foreground">Cookie Strategy</Link>
         </div>
         <p>© {new Date().getFullYear()} GenMark AI. High-Velocity Architecture.</p>
      </div>
    </footer>
  );
};
