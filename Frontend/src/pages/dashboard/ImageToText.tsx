import { GlassCard } from "@/components/shared/GlassCard";
import { Eye } from "lucide-react";

export const ImageToText = () => {
    return (
        <div className="flex h-full pb-12 items-center justify-center">
             <GlassCard variant="featured" className="p-12 text-center max-w-lg flex flex-col items-center">
                 <Eye size={48} className="text-accent mb-6" />
                 <h2 className="text-3xl font-display font-medium mb-4">Semantic Vision</h2>
                 <p className="text-muted-foreground mb-8">Upload brand imagery mapping constraints directly to the vision model.</p>
                 <div className="w-full h-32 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center bg-white/[0.02] cursor-pointer hover:bg-white/5 hover:border-accent/40 transition-colors">
                    <span className="font-mono text-sm text-muted-foreground uppercase tracking-widest">+ Drop Asset Here</span>
                 </div>
             </GlassCard>
        </div>
    )
};
