import { GlassCard } from "@/components/shared/GlassCard";
import { Copy, Image as ImageIcon, Zap, Activity, BrainCircuit } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const metrics = [
    { title: "Generations Today", value: "1,245", change: "+14%", icon: Zap },
    { title: "Active Brand Kits", value: "3", change: "Stable", icon: Activity },
    { title: "Copy Variations", value: "8,932", change: "+2%", icon: Copy },
    { title: "Synthesized Images", value: "431", change: "+42%", icon: ImageIcon },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-display font-semibold mb-2">Welcome back, {user?.name.split(' ')[0]}</h2>
          <p className="text-muted-foreground">Your neural engine is running at optimal efficiency.</p>
        </div>
        <button 
          onClick={() => navigate("/dashboard/image-to-text")}
          className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-full shadow-glow-sm hover:shadow-glow-md transition-shadow"
        >
           New Image to Text
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map(metric => (
          <GlassCard key={metric.title} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-lg text-primary">
                <metric.icon size={24} />
              </div>
              <span className={metric.change.startsWith('+') ? "text-green-500 font-mono text-sm" : "text-muted-foreground font-mono text-sm"}>
                {metric.change}
              </span>
            </div>
            <div className="text-3xl font-display font-bold mb-1">{metric.value}</div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{metric.title}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <GlassCard className="col-span-1 lg:col-span-2 p-8 min-h-[400px] flex flex-col justify-between" variant="featured">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-display font-medium">Activity Overview</h3>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none text-foreground/80 focus:border-primary/50 transition-colors">
                  <option className="bg-background text-foreground">Last 7 Days</option>
                  <option className="bg-background text-foreground">Last 30 Days</option>
              </select>
           </div>
           
           {/* Placeholder for a chart area */}
           <div className="flex-1 w-full border border-dashed border-white/10 rounded-xl flex items-center justify-center bg-white/[0.02]">
               <div className="text-center">
                  <Activity size={48} className="text-muted-foreground opacity-20 mx-auto mb-4" />
                  <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">[ Neural Chart Canvas ]</p>
               </div>
           </div>
        </GlassCard>

        <GlassCard className="p-8 min-h-[400px] flex flex-col gap-6" variant="orange">
           <h3 className="text-xl font-display font-medium border-b border-white/10 pb-4">Recent Generations</h3>
           
           <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
              {[
                { type: 'Text', title: 'Q3 Product Launch Email', time: '10m ago' },
                { type: 'Image', title: 'Social Banner Hero', time: '1h ago' },
                { type: 'Text', title: 'LinkedIn Post Drafts', time: '3h ago' },
                { type: 'Image', title: 'Ad Creative Variant B', time: '5h ago' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-center group cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                    <div className="w-10 h-10 rounded-md bg-secondary/10 flex items-center justify-center shrink-0">
                      {item.type === 'Text' ? <Copy size={18} className="text-secondary" /> : <ImageIcon size={18} className="text-secondary" />}
                    </div>
                    <div className="min-w-0 pr-4">
                        <h4 className="font-medium text-sm truncate">{item.title}</h4>
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                </div>
              ))}
           </div>
        </GlassCard>
      </div>
      
      {/* Empty space filler block */}
      <GlassCard className="p-8 mt-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="p-4 bg-primary/10 rounded-full">
                <BrainCircuit size={32} className="text-primary" />
             </div>
             <div>
                <h3 className="text-lg font-display font-medium">Model Tuning Available</h3>
                <p className="text-sm text-muted-foreground">The neural engine has processed enough data to update your brand parameters.</p>
             </div>
          </div>
          <button className="font-semibold text-primary hover:text-white transition-colors bg-primary/10 hover:bg-primary px-6 py-2 rounded-full text-sm">
             Review Parameters
          </button>
      </GlassCard>
    </div>
  );
};
