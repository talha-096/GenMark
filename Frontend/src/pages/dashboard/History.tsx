import { GlassCard } from "@/components/shared/GlassCard";
import { Clock } from "lucide-react";

export const History = () => {
    return (
        <div className="flex flex-col h-full gap-6">
            <div className="mb-4">
               <h2 className="text-3xl font-display font-semibold mb-2">Generation History</h2>
               <p className="text-muted-foreground">Every model interaction is securely logged for your enterprise record.</p>
            </div>
            
            <GlassCard className="flex-1 p-8 flex items-center justify-center">
                 <div className="text-center opacity-50">
                    <Clock size={48} className="mx-auto mb-4" />
                    <p className="font-mono text-sm tracking-widest uppercase text-muted-foreground">No recent activity detected on this node.</p>
                 </div>
            </GlassCard>
        </div>
    )
};
