import { 
  Zap, 
  Layout, 
  Image as ImageIcon, 
  Type, 
  ArrowUpRight,
  ArrowDownRight,
  MousePointer2,
  Smartphone,
  TrendingUp,
  Sparkles,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  total_generations: number;
  active_projects: number;
  brand_alignment: number;
  ai_efficiency: number;
  trends: {
    generations: string;
    projects: string;
    alignment: string;
    efficiency: string;
  }
}

interface ActivityResponse {
    _id: string;
    type: string;
    title: string;
    created_at: string;
    status: string;
}


export const Overview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState("1W");
  
  // Real-time Dashboard Stats
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: () => apiClient.get<DashboardStats>("/api/dashboard/stats"),
    enabled: !!user,
    refetchInterval: 10000,
    staleTime: 5000,
  });

  // Real-time Recent Activity
  const { data: activityData = [], isLoading: isActivityLoading } = useQuery({
    queryKey: ["dashboard-activity", user?.id],
    queryFn: async (): Promise<ActivityResponse[]> => {
       const res = await apiClient.get<ActivityResponse[]>("/api/dashboard/activity");
       return res;
    },
    enabled: !!user,
    refetchInterval: 10000,
    staleTime: 5000,
  });

  const isLoading = isStatsLoading || isActivityLoading;

  const stats = [
    { label: "Total Generations", value: isLoading ? "0" : (statsData?.total_generations || 0), trend: isLoading ? "0" : (statsData?.trends?.generations || "+0"), icon: Zap, color: "text-primary bg-primary/10" },
    { label: "Active Projects", value: isLoading ? "0" : (statsData?.active_projects || 0), trend: isLoading ? "0" : (statsData?.trends?.projects || "+0"), icon: Layout, color: "text-blue-400 bg-blue-400/10" },
    { label: "Brand Alignment", value: isLoading ? "0%" : `${statsData?.brand_alignment || 0}%`, trend: isLoading ? "0" : (statsData?.trends?.alignment || "+0%"), icon: Sparkles, color: "text-purple-400 bg-purple-400/10" },
    { label: "AI Efficiency", value: isLoading ? "0%" : `${statsData?.ai_efficiency || 0}%`, trend: isLoading ? "0" : (statsData?.trends?.efficiency || "+0%"), icon: TrendingUp, color: "text-green-400 bg-green-400/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">System Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time neural engine telemetry and creative output metrics.</p>
        </div>
        <div className="flex items-center gap-2 bg-surface/30 p-1 rounded-xl border border-white/5">
          {["1D", "1W", "1M", "ALL"].map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                timeFilter === f ? "bg-primary text-primary-foreground shadow-glow-sm" : "hover:bg-white/5 text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-surface/30 border border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative">
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`}>
               <stat.icon size={96} />
            </div>
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                stat.trend.startsWith('+') ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
              }`}>
                {stat.trend.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-display font-bold mt-1 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold">Generation Velocity</h2>
              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Images</div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-400" /> Text</div>
              </div>
           </div>
           <div className="h-[300px] w-full bg-surface/30 rounded-2xl border border-white/5 flex items-end justify-between p-6 gap-2">
              {[45, 60, 35, 78, 55, 90, 65, 82, 48, 70, 85, 60].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                   <div className="w-full relative flex flex-col justify-end gap-1 h-full">
                      <div className="bg-blue-400/20 w-full rounded-t-sm transition-all group-hover:bg-blue-400/40" style={{ height: `${h * 0.6}%` }} />
                      <div className="bg-primary/40 w-full rounded-t-sm transition-all group-hover:bg-primary/60" style={{ height: `${h * 0.4}%` }} />
                   </div>
                   <span className="text-[10px] text-muted-foreground font-mono">{i + 1}</span>
                </div>
              ))}
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Desktop", value: "62%", icon: Smartphone, color: "text-primary" },
                { label: "Mobile", value: "28%", icon: Smartphone, color: "text-blue-400" },
                { label: "API", value: "10%", icon: MousePointer2, color: "text-purple-400" },
              ].map((plat, i) => (
                <div key={i} className="p-4 rounded-xl bg-surface/30 border border-white/5 flex items-center gap-3">
                   <div className={`p-2 rounded-lg bg-white/5 ${plat.color}`}>
                      <plat.icon size={16} />
                   </div>
                   <div>
                      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{plat.label}</div>
                      <div className="text-sm font-bold">{plat.value}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold">Recent Activity</h2>
              <button 
                onClick={() => navigate('/dashboard/activity')}
                className="text-xs font-bold text-primary hover:underline transition-all"
              >
                View Audit Log
              </button>
           </div>
           <div className="space-y-4">
              {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-surface/20 rounded-2xl border border-dashed border-white/5">
                      <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                      <p className="text-muted-foreground animate-pulse">Synchronizing neural vault...</p>
                  </div>
              ) : activityData.length === 0 ? (
                  <div className="text-center py-6">
                     <div className="text-sm font-bold text-white mb-1">Start your first operation</div>
                     <p className="text-xs text-muted-foreground">Neural engine is on standby.</p>
                  </div>
              ) : (
                activityData.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                     <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        {item.type === 'image' ? <ImageIcon size={14} className="text-primary" /> : <Type size={14} className="text-primary" />}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(item.created_at).toLocaleDateString()} • {item.type}</p>
                     </div>
                  </div>
                ))
              )}
           </div>

           <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/10 border border-primary/20 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all" />
              <h3 className="font-display font-bold text-lg relative z-10">Alpha Access</h3>
              <p className="text-xs text-muted-foreground mt-2 relative z-10 leading-relaxed">Your neural quota resets on April 24th. Priority queuing is active for your account.</p>
              <button className="w-full mt-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-glow-sm hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10">
                Upgrade Engine
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
