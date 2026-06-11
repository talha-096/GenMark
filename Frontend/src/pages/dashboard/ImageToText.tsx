import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { HistorySidebar, HistoryItem } from "@/components/shared/HistorySidebar";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/shared/Button";
import { toast } from "sonner";
import { 
  Sparkles, 
  Upload, 
  Link as LinkIcon, 
  Trash2,
  RefreshCw, 
  Layers, 
  Cpu, 
  Zap,
  CheckCircle2,
  Terminal,
  Palette,
  ShieldCheck,
  Copy,
  Clock,
  FileText
} from "lucide-react";

interface BrandKitData {
    _id: string;
    name: string;
    colors: string[];
}

export const ImageToText = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  
  // Tasks: caption, marketing caption (2-stage), SEO, brand audit
  const [selectedTask, setSelectedTask] = useState("marketing");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Results
  const [generatedCaption, setGeneratedCaption] = useState<string | null>(null);
  const [generatedCopy, setGeneratedCopy] = useState<string | null>(null);
  const [appliedBrandKit, setAppliedBrandKit] = useState<{ id: string; name: string; colors: string[] } | null>(null);

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const { data: brands = [] } = useQuery({
    queryKey: ["brand-kits", user?.id],
    queryFn: () => apiClient.get<BrandKitData[]>("/api/brand/"),
    enabled: !!user,
  });

  const tasks = [
    { id: "marketing", name: "Persuasive Copy", desc: "Vision + Copywriting pipeline", icon: Sparkles },
    { id: "caption", name: "Detailed Caption", desc: "Florence-2 technical captioning", icon: FileText },
    { id: "seo", name: "SEO Metadata", desc: "Keyword and description audit", icon: Layers },
    { id: "audit", name: "Brand Alignment Check", desc: "Colors and visual audit", icon: ShieldCheck }
  ];

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setImageFile(file);
    setIsUploading(true);
    toast.info("Uploading image...", { description: "Sending asset to generative storage." });

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await apiClient.post<{ image_url: string }>("/api/generate/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setImageUrl(response.image_url);
      setManualUrl("");
      toast.success("Image Uploaded", { description: "Visual blueprint registered successfully." });
    } catch (error) {
      setImageFile(null);
      toast.error("Upload Failed", { description: "Unable to store visual asset." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (manualUrl) {
      setImageUrl(manualUrl);
      setImageFile(null);
      toast.success("Image URL Linked", { description: "Using external image resource." });
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImageUrl("");
    setManualUrl("");
    setGeneratedCaption(null);
    setGeneratedCopy(null);
    setLogs([]);
  };

  const startAnalysis = async () => {
    if (!imageUrl) {
      toast.error("Image Missing", { description: "Please upload or link an image first." });
      return;
    }

    setIsGenerating(true);
    setProgress(10);
    setGeneratedCaption(null);
    setGeneratedCopy(null);

    const brandName = selectedBrand ? brands.find(b => b._id === selectedBrand)?.name : "agnostic";

    // Setup initial logs
    if (selectedTask === "marketing") {
      setLogs([
        "[system] initializing dual-stage marketing pipeline...",
        `[auth] verifying scope: ${user?.name || "enterprise"}`,
        `[brand] locking brand alignment parameters: ${brandName}`,
        "[stage 1] dispatching visual asset to vision core..."
      ]);
    } else {
      setLogs([
        "[system] initializing generative vision workstation...",
        `[auth] verifying scope: ${user?.name || "enterprise"}`,
        `[task] mapped request to preset: ${selectedTask.toUpperCase()}`,
        "[vision] loading model weights..."
      ]);
    }

    try {
      // Setup progress animation
      const interval = setInterval(() => {
        setProgress(prev => {
          if (selectedTask === "marketing") {
            return prev >= 85 ? 85 : prev + 8;
          } else {
            return prev >= 90 ? 90 : prev + 12;
          }
        });
      }, 700);

      // Task 1: Vision Caption
      let visionPrompt = "<DETAILED_CAPTION>";
      if (selectedTask === "seo") {
        visionPrompt = "Extract key topics, objects, and SEO metadata from this image.";
      } else if (selectedTask === "audit") {
        visionPrompt = "Identify dominant colors, typography style, and brand consistency elements.";
      } else if (customPrompt) {
        visionPrompt = customPrompt;
      }

      setLogs(prev => [...prev, `[vision] task token: ${visionPrompt}`]);
      const visionResponse = await apiClient.post<{ content: string, id: string }>("/api/generate/image-to-text", {
        image_url: imageUrl,
        prompt: visionPrompt,
        brand_kit_id: selectedBrand,
        selected_task: selectedTask
      });

      clearInterval(interval);
      setProgress(50);
      setGeneratedCaption(visionResponse.content);
      
      setLogs(prev => [
        ...prev,
        "[stage 1] vision core mapping successful.",
        `[vision] extracted output: "${visionResponse.content.substring(0, 100)}..."`
      ]);

      // Stage 2: If dual-stage Marketing Copy is selected
      if (selectedTask === "marketing") {
        setLogs(prev => [
          ...prev,
          "[stage 2] launching copywriting module...",
          "[nlp] injecting visual context and brand kit..."
        ]);

        const copywritingPrompt = customPrompt 
          ? `${customPrompt}\n\nVisual Context: ${visionResponse.content}`
          : `Create a highly persuasive, brand-aligned marketing caption for an image described as: ${visionResponse.content}. Use a strong call to action.`;

        const textResponse = await apiClient.post<{ 
          content: string,
          brand_kit?: { id: string; name: string; colors: string[] } | null
        }>("/api/generate/text-to-text", {
          prompt: copywritingPrompt,
          brand_kit_id: selectedBrand,
          content_type: "social"
        });

        setGeneratedCopy(textResponse.content);
        setAppliedBrandKit(textResponse.brand_kit ?? null);
        try {
          await apiClient.put(`/api/content/${visionResponse.id}`, {
            marketing_copy: textResponse.content
          });
        } catch (err) {
          console.error("Failed to sync marketing copy to backend history", err);
        }
        setProgress(100);
        setLogs(prev => [
          ...prev,
          "[stage 2] copywriting synthesis complete.",
          textResponse.brand_kit 
            ? `[brand] copy locked to: ${textResponse.brand_kit.name}`
            : "[brand] neutral voice applied.",
          "[system] pipeline cycle complete. asset finalized."
        ]);
        
        toast.success("Marketing Copy Synced", {
          description: textResponse.brand_kit
            ? `Brand-locked copy for "${textResponse.brand_kit.name}" ready.`
            : "Dual-stage vision and copywriting pipeline has successfully executed."
        });
      } else {
        setProgress(100);
        setLogs(prev => [
          ...prev,
          "[vision] visual mapping complete.",
          "[system] parameters recorded."
        ]);
        
        toast.success("Analysis Complete", {
          description: "Visual parameters extracted successfully."
        });
      }

      queryClient.invalidateQueries({ queryKey: ["generation-history", "image_analysis"] });
    } catch (error) {
      setLogs(prev => [...prev, "[error] pipeline failed. generative engine offline."]);
      toast.error("Analysis Failed", {
        description: "An error occurred during generative mapping."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 pb-20 animate-in fade-in duration-700">
      <HistorySidebar
        type="image_analysis"
        selectedId={selectedHistoryId}
        onSelectItem={(item: HistoryItem) => {
          setSelectedHistoryId(item.id);
          setCustomPrompt(item.prompt || "");
          setSelectedBrand(item.brand_kit_id || null);
          setGeneratedCaption(item.content);
          if (item.image_url) {
            setImageUrl(item.image_url);
          }
          if (item.selected_task) {
            setSelectedTask(item.selected_task);
          }
          if (item.marketing_copy) {
            setGeneratedCopy(item.marketing_copy);
          } else {
            setGeneratedCopy(null);
          }
          setLogs(prev => [
            ...prev,
            `[system] restored image analysis from archive: ID ${item.id}`,
            `[system] restored custom directive: "${item.prompt || "none"}"`,
            `[system] preset task restored: ${item.selected_task || "default"}`,
            `[system] brand kit context restored.`
          ]);
          toast.info("Analysis Restored", {
            description: "Loaded previous visual analysis parameters."
          });
        }}
      />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Controls Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <GlassCard className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Sparkles size={20} />
            </div>
            <h3 className="text-xl font-display font-bold">Vision Workstation</h3>
          </div>

          <div className="space-y-6">
            {/* Brand Kit Selector */}
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
                      : "bg-glass/5 border-glass/10 hover:bg-glass/10"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-glass/5 border border-glass/10 flex items-center justify-center">
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
                        : "bg-glass/5 border-glass/10 hover:bg-glass/10"
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden" 
                      style={{ 
                        background: brand.colors && brand.colors.length > 0 
                          ? (brand.colors.length > 1 
                            ? `linear-gradient(135deg, ${brand.colors[0]}, ${brand.colors[1]})` 
                            : brand.colors[0]) 
                          : "#3b82f6" 
                      }}
                    >
                      <ShieldCheck size={16} className="text-foreground relative z-10" />
                      <div className="absolute inset-0 bg-glass-inverse/20" />
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

            <div className="h-px bg-glass/5" />

            {/* Presets Task Selectors */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Generative Preset</label>
              <div className="grid grid-cols-1 gap-2">
                {tasks.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTask(t.id)}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
                      selectedTask === t.id 
                        ? "bg-primary/10 border-primary/50 ring-1 ring-primary/20" 
                        : "bg-glass/5 border-glass/10 hover:bg-glass/10"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                      selectedTask === t.id 
                        ? "bg-primary/20 border-primary/30 text-primary" 
                        : "bg-glass/5 border-glass/5 text-muted-foreground"
                    }`}>
                      <t.icon size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{t.name}</div>
                      <div className="text-[9px] text-muted-foreground leading-normal">{t.desc}</div>
                    </div>
                    {selectedTask === t.id && <CheckCircle2 size={14} className="ml-auto text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Instruction Box */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Custom Directive (Optional)</label>
              <textarea 
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Direct the model (e.g. Focus on product colors...)"
                className="w-full h-20 bg-glass/5 border border-glass/10 rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
              />
            </div>

            <Button 
              onClick={startAnalysis}
              disabled={isGenerating || isUploading || !imageUrl}
              className="w-full h-14 rounded-full font-bold shadow-glow-sm hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-3 mt-4"
            >
              {isGenerating ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <Zap size={20} />
              )}
              <span>{isGenerating ? "Analyzing..." : "Awaken Vision Pipeline"}</span>
            </Button>
          </div>
        </GlassCard>

        {/* Live Logs */}
        <GlassCard className="p-6 bg-glass-inverse/60 border-glass/5 font-mono text-[10px]">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground pb-2 border-b border-glass/5">
            <Terminal size={12} />
            <span className="uppercase tracking-[0.2em]">Live Engine Logs</span>
          </div>
          <div className="space-y-2 h-40 overflow-y-auto custom-scrollbar pr-2">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-primary/40">[{String(i+1).padStart(2, '0')}]</span>
                <span className={log.includes('[stage 1]') ? "text-cyan-400" : log.includes('[stage 2]') ? "text-purple-400 font-bold" : log.includes('[error]') ? "text-red-500 font-bold" : "text-primary/70"}>
                  {log}
                </span>
              </div>
            ))}
            {isGenerating && <div className="text-primary animate-pulse italic">_ processing...</div>}
            {logs.length === 0 && <div className="text-muted-foreground/30">Idle. Waiting for image upload.</div>}
          </div>
        </GlassCard>
      </div>

      {/* Main Workspace Frame */}
      <div className="lg:col-span-8 space-y-6">
        {/* Upload Frame / Analysis Panel */}
        <GlassCard className="min-h-[500px] relative overflow-hidden flex flex-col items-center justify-center border-glass/5 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.02)_0%,transparent_70%)] pointer-events-none" />
          
          {isGenerating ? (
            <div className="flex flex-col items-center gap-8 w-full max-w-md my-auto">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-[ping_3s_infinite]" />
                <div className="absolute inset-2 rounded-full border border-primary/40 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu size={56} className="text-primary animate-pulse" />
                </div>
              </div>
              <div className="w-full space-y-3">
                <div className="flex justify-between text-xs font-mono uppercase tracking-widest">
                  <span>Pipeline Analysis</span>
                  <span className="text-primary">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-glass/5 rounded-full overflow-hidden p-[2px]">
                  <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-center text-[10px] text-muted-foreground italic tracking-widest">Running generative filters on visual boundaries...</p>
              </div>
            </div>
          ) : imageUrl ? (
            /* Split View when image is loaded */
            <div className="w-full flex flex-col md:grid md:grid-cols-12 gap-8 h-full animate-in fade-in duration-500">
              {/* Left Column: Image Preview */}
              <div className="md:col-span-5 flex flex-col gap-4">
                <div className="relative rounded-2xl overflow-hidden border border-glass/10 shadow-glow-sm bg-glass-inverse/40 group aspect-square flex items-center justify-center">
                  <img src={imageUrl} alt="Uploaded Source" className="max-w-full max-h-full object-contain" />
                  <div className="absolute inset-0 bg-glass-inverse/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={clearImage}
                      className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                      title="Clear visual asset"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-glass/5 border border-glass/10">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Visual Matrix</span>
                  <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-mono text-[9px] font-bold uppercase">Online</span>
                </div>
              </div>

              {/* Right Column: Dynamic Output display based on task */}
              <div className="md:col-span-7 flex flex-col gap-6">
                {/* Visual Description Card (Stage 1 Output) */}
                {(generatedCaption || selectedTask !== "marketing") && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-cyan-400" />
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                          {selectedTask === "seo" ? "SEO Metadata" : selectedTask === "audit" ? "Color Audit" : "Visual Description"}
                        </span>
                      </div>
                      {generatedCaption && (
                        <button 
                          onClick={() => copyToClipboard(generatedCaption)}
                          className="p-1 hover:text-cyan-400 text-muted-foreground transition-colors"
                        >
                          <Copy size={14} />
                        </button>
                      )}
                    </div>
                    <div className="p-4 bg-glass/5 border border-glass/10 rounded-2xl text-sm leading-relaxed text-foreground/80 font-sans min-h-[80px]">
                      {generatedCaption || "Visual blueprint is being mapped. Start the workstation to populate."}
                    </div>
                  </div>
                )}

                {/* Persuasive Copywriting Card (Stage 2 Output) */}
                {selectedTask === "marketing" && (
                  <div className="space-y-3 flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-purple-400" />
                        <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Marketing Synthesis</span>
                      </div>
                      {generatedCopy && (
                        <button 
                          onClick={() => copyToClipboard(generatedCopy)}
                          className="p-1 hover:text-purple-400 text-muted-foreground transition-colors"
                        >
                          <Copy size={14} />
                        </button>
                      )}
                    </div>
                    <div className="flex-1 p-5 bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/20 rounded-2xl text-base leading-relaxed text-foreground/95 font-sans min-h-[160px] relative">
                      {generatedCopy ? (
                        <>
                          <p className="whitespace-pre-wrap">{generatedCopy}</p>
                          <div className="mt-8 pt-4 border-t border-glass/5 flex items-center justify-between">
                            <span className="flex items-center gap-1 text-[10px] font-mono opacity-60"><Clock size={10} /> Sync: Realtime</span>
                            {appliedBrandKit ? (
                              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                                <div
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{ background: appliedBrandKit.colors?.[0] ?? "#3b82f6" }}
                                />
                                <ShieldCheck size={10} className="text-primary" />
                                <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-wider">
                                  {appliedBrandKit.name}
                                </span>
                              </div>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-mono text-green-400 font-bold opacity-60">
                                <ShieldCheck size={10} /> Brand Compliant
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground/30 text-xs italic">
                          Awaiting Stage 1 vision mapping.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Upload States / Inputs */
            <div className="w-full max-w-lg flex flex-col gap-6 py-8">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full aspect-[21/9] rounded-3xl border border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer group ${
                  isDragOver 
                    ? "border-primary bg-primary/10 scale-98 shadow-glow-sm" 
                    : "border-glass/10 bg-glass/5 hover:border-primary/40 hover:bg-primary/5 hover:scale-101"
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                  accept="image/*" 
                  className="hidden" 
                />
                <div className="p-4 rounded-2xl bg-glass/5 border border-glass/10 group-hover:scale-110 transition-transform duration-500">
                  {isUploading ? (
                    <RefreshCw size={28} className="animate-spin text-primary" />
                  ) : (
                    <Upload size={28} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold tracking-wide">
                    {isUploading ? "Uploading visual parameters..." : "Drop image visual here"}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                    Drag & Drop or Click to browse (PNG, JPG, WEBP)
                  </p>
                </div>
              </div>

              {/* Or Divider */}
              <div className="flex items-center gap-4 text-muted-foreground/30 text-[10px] font-mono uppercase tracking-[0.2em]">
                <div className="h-px bg-glass/5 flex-1" />
                <span>Or</span>
                <div className="h-px bg-glass/5 flex-1" />
              </div>

              {/* Manual URL Link Input */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-3 bg-glass/5 border border-glass/10 rounded-2xl px-4 py-3 focus-within:border-primary/50 transition-colors">
                  <LinkIcon size={16} className="text-muted-foreground" />
                  <input 
                    type="url" 
                    placeholder="Paste public image address..." 
                    value={manualUrl}
                    onChange={(e) => setManualUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                    className="bg-transparent border-none outline-none text-xs w-full text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
                <Button 
                  onClick={handleUrlSubmit}
                  disabled={!manualUrl}
                  variant="outline" 
                  className="rounded-2xl px-6"
                >
                  Link
                </Button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
      </div>
    </div>
  );
};

