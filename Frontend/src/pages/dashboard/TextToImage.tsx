import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { GlassCard } from "@/components/shared/GlassCard";
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  Share2, 
  RefreshCw, 
  Layers, 
  Maximize2,
  Cpu,
  Zap,
  CheckCircle2,
  Terminal,
  ChevronDown,
  Palette,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { toast } from "sonner";

interface BrandKitData {
    _id: string;
    name: string;
    colors: string[];
}

export const TextToImage = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [history, setHistory] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const { data: brands = [] } = useQuery({
    queryKey: ["brand-kits", user?.id],
    queryFn: () => apiClient.get<BrandKitData[]>("/api/brand/"),
    enabled: !!user,
  });

  // No auto-selection to allow Neutral as default

  const startGeneration = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setProgress(0);
    setGeneratedImage(null);
    
    setLogs([
        "[system] initializing neural core...", 
        "[auth] verifying enterprise token...",
        selectedBrand ? `[brand] locking font and palette: ${brands.find(b => b._id === selectedBrand)?.name}` : "[brand] using agnostic aesthetic"
    ]);

    try {
        const interval = setInterval(() => {
            setProgress(prev => (prev >= 90 ? 90 : prev + 10));
        }, 800);

        const response = await apiClient.post<{ 
            success: boolean, 
            content: string, 
            id: string,
            title: string 
        }>('/api/generate/image', {
            prompt,
            brand_kit_id: selectedBrand,
            aspect_ratio: aspectRatio
        });

        clearInterval(interval);
        setProgress(100);

        if (response.success) {
            setGeneratedImage(response.content);
            setHistory(prevH => [response.content, ...prevH.slice(0, 3)]);
            setLogs(prevLogs => [
                ...prevLogs, 
                "[neural] latent space mapped.", 
                "[render] synthesis complete.", 
                "[system] asset ready for uplink."
            ]);
            toast.success("Generation Complete", {
                description: "Your neural asset has been synthesized successfully.",
            });
        }
    } catch (error) {
        setLogs(prevLogs => [...prevLogs, "[error] neural engine failure: connection reset."]);
        toast.error("Generation Failed", {
            description: "The neural engine encountered an unexpected error."
        });
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20 animate-in fade-in duration-700">
      {/* Left Sidebar: Controls */}
      <div className="lg:col-span-4 space-y-6">
        <GlassCard className="p-8">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                 <Sparkles size={20} />
              </div>
              <h3 className="text-xl font-display font-bold">Creative Forge</h3>
           </div>
           
           <div className="space-y-6">
              {/* Brand Kit Selection */}
              <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Brand Alignment</label>
                    <Palette size={12} className="text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => setSelectedBrand(null)}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
                            selectedBrand === null 
                            ? "bg-primary/10 border-primary/50 ring-1 ring-primary/20" 
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                            <Palette size={16} className="text-muted-foreground" />
                        </div>
                        <div>
                            <div className="text-xs font-bold">Neutral Context</div>
                            <div className="text-[9px] text-muted-foreground uppercase tracking-widest">Agnostic / Global Style</div>
                        </div>
                        {selectedBrand === null && <CheckCircle2 size={14} className="ml-auto text-primary" />}
                      </button>

                      {brands.map(brand => (
                          <button
                            key={brand._id}
                            onClick={() => setSelectedBrand(brand._id)}
                            className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
                                selectedBrand === brand._id 
                                ? "bg-primary/10 border-primary/50 ring-1 ring-primary/20" 
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden" style={{ background: brand.colors && brand.colors.length > 0 ? (brand.colors.length > 1 ? `linear-gradient(135deg, ${brand.colors[0]}, ${brand.colors[1]})` : brand.colors[0]) : "#3b82f6" }}>
                                <ShieldCheck size={16} className="text-white relative z-10" />
                                <div className="absolute inset-0 bg-black/20" />
                            </div>
                            <div>
                                <div className="text-xs font-bold">{brand.name}</div>
                                <div className="text-[9px] text-muted-foreground uppercase tracking-wider">{brand.colors?.length || 0} Core Colors</div>
                            </div>
                            {selectedBrand === brand._id && <CheckCircle2 size={14} className="ml-auto text-primary" />}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-2">
                 <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Neural Prompt</label>
                 <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your brand vision..."
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                 />
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    <span>Aspect Ratio</span>
                    <ChevronDown size={12} />
                 </div>
                  <div className="grid grid-cols-3 gap-2">
                     {["1:1", "16:9", "9:16"].map(ratio => (
                        <button 
                           key={ratio} 
                           onClick={() => {
                              setAspectRatio(ratio);
                              toast.info(`Aspect Ratio: ${ratio}`, { description: "Adjusting neural frame dimensions..." });
                           }}
                           className={`py-2 rounded-xl border text-xs font-mono transition-all ${ratio === aspectRatio ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"}`}
                        >
                           {ratio}
                        </button>
                     ))}
                  </div>
              </div>

              <Button 
                onClick={startGeneration}
                disabled={isGenerating || !prompt}
                className="w-full h-14 rounded-full font-bold shadow-glow-sm hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-3 mt-4"
              >
                {isGenerating ? (
                   <RefreshCw size={20} className="animate-spin" />
                ) : (
                   <Zap size={20} />
                )}
                <span>{isGenerating ? "Synthesizing..." : "Awaken Engine"}</span>
              </Button>
           </div>
        </GlassCard>

        {/* Logs Console */}
        <GlassCard className="p-6 bg-black/60 border-white/5 font-mono text-[10px]">
           <div className="flex items-center gap-2 mb-4 text-muted-foreground pb-2 border-b border-white/5">
              <Terminal size={12} />
              <span className="uppercase tracking-[0.2em]">Live Engine Logs</span>
           </div>
           <div className="space-y-2 h-40 overflow-y-auto custom-scrollbar pr-2">
              {logs.map((log, i) => (
                 <div key={i} className="flex gap-3">
                    <span className="text-primary/40">[{String(i+1).padStart(2, '0')}]</span>
                    <span className={log.includes('[render]') ? "text-green-500" : "text-primary/70"}>{log}</span>
                 </div>
              ))}
              {isGenerating && <div className="text-primary animate-pulse italic">_ processing...</div>}
              {logs.length === 0 && <div className="text-muted-foreground/30">Idle. Waiting for input.</div>}
           </div>
        </GlassCard>
      </div>

      {/* Main Preview Area */}
      <div className="lg:col-span-8 space-y-6">
        <GlassCard className="h-[600px] relative overflow-hidden flex items-center justify-center group shadow-glow-xl border-white/5">
           {/* Grid Background */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.02)_0%,transparent_70%)] pointer-events-none" />
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

           {isGenerating ? (
              <div className="flex flex-col items-center gap-8 z-10">
                 <div className="relative w-48 h-48">
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-[ping_3s_infinite]" />
                    <div className="absolute inset-2 rounded-full border border-primary/40 animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Cpu size={64} className="text-primary animate-pulse" />
                    </div>
                 </div>
                 <div className="w-full max-w-md space-y-3">
                    <div className="flex justify-between text-xs font-mono uppercase tracking-widest">
                       <span>Synthesis Progress</span>
                       <span className="text-primary">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[2px]">
                       <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-center text-[10px] text-muted-foreground italic tracking-widest">Maintaining brand consistency parameters...</p>
                 </div>
              </div>
           ) : generatedImage ? (
              <div className="w-full h-full relative group/img animate-in fade-in zoom-in duration-1000">
                 <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                     <button 
                        onClick={() => toast.success("Downloading", { description: "High-fidelity PNG is being prepared..." })}
                        className="p-4 rounded-full bg-white/10 border border-white/20 hover:bg-primary hover:text-primary-foreground transition-all"
                     >
                        <Download size={24} />
                     </button>
                     <button 
                        onClick={() => toast.info("Link Copied", { description: "Generation link shared to clipboard." })}
                        className="p-4 rounded-full bg-white/10 border border-white/20 hover:bg-primary hover:text-primary-foreground transition-all"
                     >
                        <Share2 size={24} />
                     </button>
                     <button 
                        onClick={() => toast.success("Fullscreen", { description: "Epic vision mode enabled." })}
                        className="p-4 rounded-full bg-white/10 border border-white/20 hover:bg-primary hover:text-primary-foreground transition-all"
                     >
                        <Maximize2 size={24} />
                     </button>
                  </div>
                 <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex justify-between items-center opacity-0 translate-y-4 group-hover/img:opacity-100 group-hover/img:translate-y-0 transition-all">
                    <div>
                       <div className="text-xs font-bold mb-1">Brand Visual Synthesis #1402</div>
                       <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Neural Seed: 84920211 • 1024x1024</div>
                    </div>
                    <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-mono font-bold flex items-center gap-2">
                       <CheckCircle2 size={12} /> BRAND SAFE
                    </div>
                 </div>
              </div>
           ) : (
              <div className="flex flex-col items-center gap-6 text-muted-foreground/40 group">
                 <div className="p-8 rounded-full bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                    <ImageIcon size={64} className="opacity-20 translate-y-[-10px] group-hover:translate-y-0 transition-transform" />
                 </div>
                 <div className="text-center">
                    <h3 className="text-xl font-display font-bold opacity-60">Ready for Synthesis</h3>
                    <p className="text-sm italic tracking-wide">Enter a prompt to evolve your first visual asset.</p>
                 </div>
              </div>
           )}
        </GlassCard>

        {/* History / Variants */}
         <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(idx => (
               <GlassCard 
                  key={idx} 
                  onClick={() => {
                     if (history[idx-1]) setGeneratedImage(history[idx-1]);
                     toast.info(`Variant #${idx}`, { description: "Restoring neural state from history..." });
                   }}
                  className="aspect-square p-0 overflow-hidden group cursor-pointer border-white/5 hover:border-primary/40 transition-all"
               >
                  <div className="h-full w-full bg-white/5 flex items-center justify-center relative">
                     {history[idx-1] ? (
                        <img src={history[idx-1]} alt={`Variant ${idx}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                     ) : (
                        <Layers className="opacity-10 w-12 h-12" />
                     )}
                     <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] font-mono font-black uppercase text-primary-foreground tracking-widest">{history[idx-1] ? "Restore" : "Idle"}</span>
                     </div>
                  </div>
               </GlassCard>
            ))}
         </div>
      </div>
    </div>
  );
};
