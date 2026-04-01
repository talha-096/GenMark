import { GlassCard } from "@/components/shared/GlassCard";
import { GradientText } from "@/components/shared/GradientText";
import { 
  Plus, 
  Users, 
  MessageSquare, 
  Zap, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Monitor,
  Phone,
  Tablet,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { apiClient } from "@/lib/api";

interface DashboardStats {
  total_generations: number;
  total_brand_kits: number;
  words_written: number;
  efficiency_score: number;
  performance_data: number[];
  device_desktop: number;
  device_mobile: number;
  device_tablet: number;
  conversion_multiplier: number;
  trends: {
    generations: string;
    words: string;
    efficiency: string;
    kits: string;
  };
}

interface ActivityItem {
  title: string;
  type: string;
  time: string;
  status: string;
}

export const Overview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState("1W");
  
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [activityData, setActivityData] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     const fetchData = async () => {
        try {
           setIsLoading(true);
           const [statsRes, activityRes] = await Promise.all([
              apiClient.get<DashboardStats>("/api/dashboard/stats"),
              apiClient.get<ActivityItem[]>("/api/dashboard/activity")
           ]);
           setStatsData(statsRes);
           setActivityData(activityRes);
        } catch (error) {
           console.error("Dashboard metric load error:", error);
        } finally {
           setIsLoading(false);
        }
     };
     
     if (user) {
         fetchData();
     }
  }, [user]);

  const stats = [
    { label: "Total Generations", value: isLoading ? "0" : (statsData?.total_generations || 0), trend: isLoading ? "0" : (statsData?.trends?.generations || "+0"), icon: Zap, color: "text-primary bg-primary/10" },
    { label: "Words Generated", value: isLoading ? "0" : (statsData?.words_written?.toLocaleString() || 0), trend: isLoading ? "0%" : (statsData?.trends?.words || "+0%"), icon: Users, color: "text-secondary bg-secondary/10" },
    { label: "Efficiency Score", value: isLoading ? "0%" : ((statsData?.efficiency_score || 0) + "%"), trend: isLoading ? "0%" : (statsData?.trends?.efficiency || "+0%"), icon: TrendingUp, color: "text-accent bg-accent/10" },
    { label: "Active Brand Kits", value: isLoading ? "0" : (statsData?.total_brand_kits || 0), trend: isLoading ? "0" : (statsData?.trends?.kits || "+0"), icon: Clock, color: "text-green-500 bg-green-500/10" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden p-10 rounded-3xl bg-surface/40 border border-white/5 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-4xl font-display font-black mb-2">Welcome back, <GradientText>{user?.name}</GradientText></h1>
            <p className="text-muted-foreground text-lg italic">Your neural engine is running at <span className="text-primary font-bold">98.4%</span> efficiency. </p>
          </div>
          <button 
            onClick={() => navigate("/dashboard/image")}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold shadow-glow-sm hover:scale-105 transition-all"
          >
            <Plus size={20} />
            <span>New Generation</span>
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="p-6 group hover:translate-y-[-5px]">
            <div className="flex justify-between items-start mb-4">
               <div className={`p-3 rounded-xl ${stat.color} transition-transform group-hover:scale-110`}>
                  <stat.icon size={22} />
               </div>
               <span className="text-xs font-mono text-green-500 font-bold">{stat.trend}</span>
            </div>
            <div className="text-2xl font-display font-bold mb-1">{stat.value}</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart Simulation */}
        <GlassCard className="lg:col-span-2 p-8">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-display font-bold">Engine Performance</h3>
               <div className="flex gap-2">
                  {["1D", "1W", "1M", "1Y"].map(t => (
                     <button 
                        key={t} 
                        onClick={() => {
                           setTimeFilter(t);
                           toast.info(`Timeframe: ${t}`, { description: "Recalibrating performance metrics..." });
                        }}
                        className={`px-3 py-1 rounded-md text-[10px] font-mono border transition-all ${timeFilter === t ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"}`}
                     >
                        {t}
                     </button>
                  ))}
               </div>
           </div>
           
           <div className="h-64 w-full relative flex items-end justify-between gap-2 px-2">
              {(statsData?.performance_data || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).map((h, i) => (
                 <div key={i} className="flex-1 bg-primary/20 rounded-t-lg group relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 w-full bg-primary transition-all duration-1000 group-hover:bg-secondary cursor-pointer" 
                      style={{ height: `${h}%` }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface border border-white/10 px-2 py-1 rounded text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                       {h}%
                    </div>
                 </div>
              ))}
           </div>
           <p className="mt-6 text-xs text-center text-muted-foreground/60 italic uppercase tracking-widest">Global conversion velocity across all neural nodes</p>
        </GlassCard>

        {/* Neural Distribution */}
        <GlassCard className="p-8">
           <h3 className="text-xl font-display font-bold mb-8">Neural Distribution</h3>
           <div className="space-y-6">
              <div className="space-y-3">
                 <div className="flex justify-between text-xs font-mono">
                    <span className="flex items-center gap-2"><Monitor size={14} className="text-primary" /> Desktop</span>
                    <span className="text-primary font-bold">{statsData?.device_desktop || 0}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${statsData?.device_desktop || 0}%` }} />
                 </div>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between text-xs font-mono">
                    <span className="flex items-center gap-2"><Phone size={14} className="text-secondary" /> Mobile</span>
                    <span className="text-secondary font-bold">{statsData?.device_mobile || 0}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${statsData?.device_mobile || 0}%` }} />
                 </div>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between text-xs font-mono">
                    <span className="flex items-center gap-2"><Tablet size={14} className="text-accent" /> Tablet</span>
                    <span className="text-accent font-bold">{statsData?.device_tablet || 0}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${statsData?.device_tablet || 0}%` }} />
                 </div>
              </div>
           </div>
           
           <div className="mt-12 p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-tighter">Current Conversion Multiplier</div>
              <div className="text-3xl font-display font-black text-primary">{statsData?.conversion_multiplier || '1.0'}<span className="text-xl">x</span></div>
           </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <GlassCard className="p-8">
           <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-display font-bold">Recent Evolution</h3>
               <button 
                  onClick={() => toast.info("Vault Access", { description: "Opening complete neural logs archive..." })}
                  className="text-primary flex items-center gap-1 text-xs font-bold hover:underline"
               >
                  <span>View all Logs</span>
                  <ExternalLink size={14} />
               </button>
           </div>
           <div className="space-y-4">
              {isLoading ? (
                  <div className="text-center py-6 text-sm text-muted-foreground animate-pulse">Syncing neural logs...</div>
              ) : activityData.length === 0 ? (
                  <div className="text-center py-6">
                     <div className="text-sm font-bold text-white mb-1">Start your first operation</div>
                     <div className="text-xs text-muted-foreground">Your activity logs will appear here once you generate content.</div>
                     <button onClick={() => navigate("/dashboard/editor")} className="mt-4 px-4 py-2 bg-primary/20 text-primary rounded-full text-xs font-bold hover:bg-primary hover:text-white transition-colors">
                        Initialize Engine
                     </button>
                  </div>
              ) : (
                  activityData.map((activity, i) => (
                     <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all cursor-default relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-4">
                           <div className={`p-2 rounded-lg bg-surface border border-white/10 ${activity.type.includes("Image") ? "text-secondary" : "text-primary"}`}>
                              <MessageSquare size={16} />
                           </div>
                           <div>
                              <div className="text-sm font-bold truncate max-w-[200px] md:max-w-full">{activity.title}</div>
                              <div className="text-[10px] font-mono text-muted-foreground uppercase">{activity.type} • {activity.time}</div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-muted-foreground uppercase hidden sm:inline-block">Core</span>
                           <div className={`w-2 h-2 rounded-full ${activity.status.toLowerCase() === "success" ? "bg-green-500" : "bg-amber-500 animate-pulse"}`} />
                        </div>
                     </div>
                  ))
              )}
           </div>
        </GlassCard>

         {/* Pro Quick Actions */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard 
               onClick={() => toast.success("Strategy Hub", { description: "AIGaming Strategy module loaded." })}
               className="p-8 flex flex-col justify-between group cursor-pointer hover:border-primary/30 transition-all"
            >
               <div>
                  <Sparkles className="text-primary mb-4 w-10 h-10 transition-transform group-hover:scale-110" />
                  <h4 className="text-xl font-display font-bold mb-2">Refine Strategy</h4>
                  <p className="text-sm text-muted-foreground">Adjust your neural parameters for higher semantic alignment.</p>
               </div>
               <ChevronRight size={20} className="ml-auto mt-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </GlassCard>
            
            <GlassCard 
               onClick={() => toast.info("Deployment Pipeline", { description: "Connecting to production CMS..." })}
               className="p-8 flex flex-col justify-between group cursor-pointer hover:border-secondary/30 transition-all"
            >
               <div>
                  <Plus className="text-secondary mb-4 w-10 h-10 transition-transform group-hover:scale-110" />
                  <h4 className="text-xl font-display font-bold mb-2">Deploy API</h4>
                  <h4 className="text-sm text-muted-foreground leading-snug">Connect your engine directly to your CMS pipeline.</h4>
               </div>
               <ChevronRight size={20} className="ml-auto mt-4 text-muted-foreground group-hover:text-secondary transition-colors" />
            </GlassCard>
         </div>
      </div>
    </div>
  );
};
