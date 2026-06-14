import { Link } from "react-router-dom";
import { GlassCard } from "@/components/shared/GlassCard";
import { AlertCircle } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-md mx-auto min-h-screen flex items-center justify-center">
      <GlassCard className="p-8 text-center space-y-6 w-full">
        <div className="flex justify-center">
          <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20 text-red-400">
            <AlertCircle size={48} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-display font-black text-primary tracking-tight">404</h1>
          <h2 className="text-2xl font-display font-bold text-foreground">Page Not Found</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The coordinates you requested do not exist in our generative ecosystem. Let's get you back on course.
          </p>
        </div>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-xs font-semibold shadow-glow transition-all active:scale-98"
          >
            Go Home
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};
