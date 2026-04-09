import { GlassCard } from "@/components/shared/GlassCard";
import { useAuth } from "@/providers/AuthProvider";

export const Profile = () => {
    const { user, logout } = useAuth();
    
    return (
        <div className="flex flex-col h-full gap-6 max-w-4xl mx-auto w-full">
            <div className="mb-4 text-center">
               <h2 className="text-3xl font-display font-semibold mb-2">Neural Profile</h2>
            </div>
            
            <GlassCard variant="featured" className="p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-4xl font-semibold text-primary">
                    {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="text-center md:text-left">
                   <h3 className="text-2xl font-display font-bold">{user?.name}</h3>
                   <p className="text-muted-foreground">{user?.email}</p>
                   <div className="flex gap-2 flex-wrap justify-center md:justify-start mt-3">
                       <span className="text-muted-foreground px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono uppercase">
                           {user?.subscription_plan || user?.plan || 'Free'} License
                       </span>
                       <span className="text-muted-foreground px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono uppercase">
                           Role: {user?.role || 'Member'}
                       </span>
                   </div>
                </div>
                <div className="ml-auto flex gap-3">
                    <button 
                        className="bg-white/5 border border-white/10 px-6 py-2 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => window.open('https://billing.genmark.ai', '_blank')}
                    >
                        Manage Billing
                    </button>
                    <button 
                        className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-2 rounded-lg hover:bg-red-500/20 transition-colors font-medium"
                        onClick={logout}
                    >
                        Sign Out
                    </button>
                </div>
            </GlassCard>
        </div>
    )
};
