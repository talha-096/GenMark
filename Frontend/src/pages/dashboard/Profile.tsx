import { GlassCard } from "@/components/shared/GlassCard";
import { useAuth } from "@/providers/AuthProvider";

export const Profile = () => {
    const { user } = useAuth();
    
    return (
        <div className="flex flex-col h-full gap-6 max-w-4xl mx-auto w-full">
            <div className="mb-4 text-center">
               <h2 className="text-3xl font-display font-semibold mb-2">Neural Profile</h2>
            </div>
            
            <GlassCard variant="featured" className="p-8 flex items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-4xl font-semibold text-primary">
                    {user?.name.charAt(0) || 'U'}
                </div>
                <div>
                   <h3 className="text-2xl font-display font-bold">{user?.name}</h3>
                   <span className="text-muted-foreground px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono uppercase mt-2 inline-block">
                       {user?.plan} License
                   </span>
                </div>
                <button className="ml-auto bg-white/5 border border-white/10 px-6 py-2 rounded-lg hover:bg-white/10 transition-colors">
                    Manage Billing
                </button>
            </GlassCard>
        </div>
    )
};
