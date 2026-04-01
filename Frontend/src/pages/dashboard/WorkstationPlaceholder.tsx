import { GlassCard } from "@/components/shared/GlassCard";
import { GradientText } from "@/components/shared/GradientText";
import { Sparkles, ChevronRight, Zap } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const WorkstationPlaceholder = ({ title, description }: { title: string, description: string }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-160px)] flex items-center justify-center">
      <GlassCard className="p-12 text-center max-w-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="w-32 h-32 rounded-[2rem] bg-black/40 border border-white/10 overflow-hidden relative shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop" 
                  alt="Neural Core" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
              <Sparkles className="absolute -top-4 -right-4 text-secondary animate-bounce" size={32} />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-display font-black tracking-tighter">
              <GradientText>{title}</GradientText>
            </h1>
            <p className="text-muted-foreground text-lg italic leading-relaxed">
              {description}
            </p>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => {
                toast.success("Synchronizing Workstation", { 
                  description: `Connecting ${title} nodes to neural engine...` 
                });
              }}
              className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold shadow-glow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <Zap size={20} />
              <span>Initialize Workstation</span>
            </button>
            <button 
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 font-bold transition-all flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <span>Return to Core</span>
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="pt-8">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em]">Engine v4.0.2-Beta</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
