import { useState } from "react";
import { GlassCard } from "@/components/shared/GlassCard";
import { 
  Sparkles, 
  Type, 
  Copy, 
  Terminal, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  Palette, 
  ShieldCheck,
  SendHorizontal,
  FileText,
  Clock
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { HistorySidebar, HistoryItem } from "@/components/shared/HistorySidebar";

interface BrandKitData {
    _id: string;
    name: string;
    colors: string[];
}

export const TextToText = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("social");
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [appliedBrandKit, setAppliedBrandKit] = useState<{ id: string; name: string; colors: string[] } | null>(null);
  const { data: brands = [] } = useQuery({
    queryKey: ["brand-kits", user?.id],
    queryFn: () => apiClient.get<BrandKitData[]>("/api/brand/"),
    enabled: !!user,
  });

  // Derive the active brand object for UI display
  const activeBrand = brands.find(b => b._id === selectedBrand) ?? null;

  // No auto-selection to allow Neutral as default

  const types = [
    { id: "social", name: "Social Post", icon: SendHorizontal },
    { id: "email", name: "Email Copy", icon: SendHorizontal },
    { id: "blog", name: "Blog Section", icon: FileText },
    { id: "ad", name: "Ad Creative", icon: Zap }
  ];

  const startGeneration = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setGeneratedContent(null);
    
    setLogs([
        "[system] initializing copy engine...", 
        "[auth] verifying scope...",
        selectedBrand ? `[brand] loading voice parameters: ${brands.find(b => b._id === selectedBrand)?.name}` : "[brand] using neutral voice"
    ]);

    try {
        const response = await apiClient.post<{ 
            success: boolean, 
            content: string, 
            id: string,
            brand_kit?: { id: string; name: string; colors: string[] } | null
        }>('/api/generate/text-to-text', {
            prompt,
            brand_kit_id: selectedBrand,
            content_type: contentType
        });

        if (response.content) {
            setGeneratedContent(response.content);
            setAppliedBrandKit(response.brand_kit ?? null);
            setLogs(prevLogs => [
                ...prevLogs, 
                "[generative] semantic mapping complete.", 
                response.brand_kit 
                  ? `[brand] content locked to: ${response.brand_kit.name}`
                  : "[brand] neutral voice applied.",
                "[engine] copy synthesized successfully."
            ]);
            queryClient.invalidateQueries({ queryKey: ["generation-history", "text"] });
            toast.success("Copy Generated", {
                description: response.brand_kit 
                  ? `Brand-aligned copy for "${response.brand_kit.name}" is ready.`
                  : "Your copy is ready.",
            });
        }
    } catch (error) {
        setLogs(prevLogs => [...prevLogs, "[error] engine timeout."]);
        toast.error("Generation Failed");
    } finally {
        setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 pb-20 animate-in fade-in duration-700">
      <HistorySidebar
        type="text"
        selectedId={selectedHistoryId}
        onSelectItem={(item: HistoryItem) => {
          setSelectedHistoryId(item.id);
          setPrompt(item.prompt || "");
          setSelectedBrand(item.brand_kit_id || null);
          setGeneratedContent(item.content);
          setLogs(prev => [
            ...prev,
            `[system] restored text generation from archive: ID ${item.id}`,
            `[system] restored prompt: "${item.prompt}"`,
            `[system] brand alignment context restored.`
          ]);
          toast.info("Generation Restored", {
            description: "Loaded previous generation parameters."
          });
        }}
      />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <GlassCard className="p-8">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                 <Type size={20} />
              </div>
              <h3 className="text-xl font-display font-bold">Generative Copy</h3>
           </div>
           
           <div className="space-y-6">
              <div className="space-y-3">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Voice Alignment</label>
                  <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => setSelectedBrand(null)}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
                            selectedBrand === null 
                            ? "bg-primary/10 border-primary/50" 
                            : "bg-glass/5 border-glass/10 hover:bg-glass/10"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-glass/5 border border-glass/10 flex items-center justify-center">
                            <Palette size={16} className="text-muted-foreground" />
                        </div>
                        <div>
                            <div className="text-xs font-bold">Neutral Voice</div>
                            <div className="text-[9px] text-muted-foreground uppercase tracking-widest">Global Context / No Brand</div>
                        </div>
                        {selectedBrand === null && <CheckCircle2 size={14} className="ml-auto text-primary" />}
                      </button>

                      {brands.map(brand => (
                          <button
                            key={brand._id}
                            onClick={() => setSelectedBrand(brand._id)}
                            className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
                                selectedBrand === brand._id 
                                ? "bg-primary/10 border-primary/50" 
                                : "bg-glass/5 border-glass/10 hover:bg-glass/10"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden" style={{ background: brand.colors && brand.colors.length > 0 ? (brand.colors.length > 1 ? `linear-gradient(135deg, ${brand.colors[0]}, ${brand.colors[1]})` : brand.colors[0]) : "#3b82f6" }}>
                                <ShieldCheck size={16} className="text-foreground relative z-10" />
                                <div className="absolute inset-0 bg-glass-inverse/20" />
                            </div>
                            <div>
                                <div className="text-xs font-bold">{brand.name}</div>
                                <div className="text-[9px] text-muted-foreground uppercase tracking-widest">{brand.colors?.length || 0} Core Colors</div>
                            </div>
                            {selectedBrand === brand._id && <CheckCircle2 size={14} className="ml-auto text-primary" />}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="space-y-4">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Content Format</label>
                  <div className="grid grid-cols-2 gap-2">
                     {types.map(t => (
                        <button 
                           key={t.id} 
                           onClick={() => setContentType(t.id)}
                           className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${t.id === contentType ? "bg-primary/20 border-primary text-primary" : "bg-glass/5 border-glass/10 text-muted-foreground hover:bg-glass/10"}`}
                        >
                           <t.icon size={14} />
                           <span className="text-[11px] font-medium">{t.name}</span>
                        </button>
                     ))}
                  </div>
              </div>

              {/* Active Brand Context Banner */}
              {activeBrand && (
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex-shrink-0"
                    style={{ background: activeBrand.colors?.length > 1
                      ? `linear-gradient(135deg, ${activeBrand.colors[0]}, ${activeBrand.colors[1]})`
                      : activeBrand.colors?.[0] ?? "#3b82f6" }}
                  />
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-primary uppercase tracking-widest">Active Brand Context</div>
                    <div className="text-xs font-bold truncate">{activeBrand.name}</div>
                    <div className="flex gap-1 mt-1">
                      {activeBrand.colors?.slice(0, 5).map((c, i) => (
                        <div key={i} className="w-3 h-3 rounded-full border border-glass/20" style={{ background: c }} title={c} />
                      ))}
                    </div>
                  </div>
                  <ShieldCheck size={14} className="ml-auto text-primary flex-shrink-0" />
                </div>
              )}

              <div className="space-y-2">
                 <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Brief / Prompt</label>
                 <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={activeBrand ? `Write in ${activeBrand.name}'s voice...` : "Describe the promotion or message..."}
                    className="w-full h-32 bg-glass/5 border border-glass/10 rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                 />
              </div>

              <Button 
                onClick={startGeneration}
                disabled={isGenerating || !prompt}
                className="w-full h-14 rounded-full font-bold shadow-glow-sm transition-all flex items-center justify-center gap-3 mt-4"
              >
                {isGenerating ? <RefreshCw size={20} className="animate-spin" /> : <Sparkles size={20} />}
                <span>{isGenerating ? "Synthesizing..." : "Generate Copy"}</span>
              </Button>
           </div>
        </GlassCard>

        <GlassCard className="p-6 bg-glass-inverse/60 border-glass/5 font-mono text-[10px]">
           <div className="flex items-center gap-2 mb-4 text-muted-foreground pb-2 border-b border-glass/5">
              <Terminal size={12} />
              <span className="uppercase tracking-[0.2em]">Live Engine Logs</span>
           </div>
           <div className="space-y-2 h-40 overflow-y-auto custom-scrollbar pr-2">
              {logs.map((log, i) => (
                 <div key={i} className="flex gap-3">
                    <span className="text-primary/40">[{String(i+1).padStart(2, '0')}]</span>
                    <span className="text-primary/70">{log}</span>
                 </div>
              ))}
              {isGenerating && <div className="text-primary animate-pulse italic">_ processing...</div>}
           </div>
        </GlassCard>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <GlassCard className="min-h-[600px] relative overflow-hidden flex flex-col p-8 border-glass/5">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <FileText size={20} />
                 </div>
                 <h4 className="font-display font-bold text-xl">Output Feed</h4>
              </div>
              {generatedContent && (
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2">
                       <Copy size={16} /> Copy
                    </Button>
                 </div>
              )}
           </div>

           {generatedContent ? (
              <div className="flex-1 whitespace-pre-wrap font-sans text-lg leading-relaxed text-foreground/90 animate-in fade-in slide-in-from-bottom-2 duration-700">
                 {generatedContent}
                  <div className="mt-12 pt-8 border-t border-glass/5 flex items-center justify-between">
                     <div className="flex items-center gap-4 text-xs font-mono opacity-60">
                        <div className="flex items-center gap-1.5"><Clock size={12} /> Just now</div>
                     </div>
                     {appliedBrandKit ? (
                       <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                         <div
                           className="w-3 h-3 rounded-full"
                           style={{ background: appliedBrandKit.colors?.[0] ?? "#3b82f6" }}
                         />
                         <ShieldCheck size={11} className="text-primary" />
                         <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider">
                           {appliedBrandKit.name}
                         </span>
                       </div>
                     ) : (
                       <div className="flex items-center gap-1.5 text-xs font-mono opacity-40">
                         <ShieldCheck size={12} /> Neutral Voice
                       </div>
                     )}
                  </div>
              </div>
           ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-6 text-muted-foreground/40 italic">
                 <div className="w-16 h-16 rounded-full bg-glass/5 flex items-center justify-center">
                    <Type size={32} className="opacity-20" />
                 </div>
                 <p>Generative context required to initialize copy flow.</p>
              </div>
           )}
         </GlassCard>
      </div>
      </div>
    </div>
  );
};

