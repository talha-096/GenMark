import { useState, useEffect } from "react";
import { GlassCard } from "@/components/shared/GlassCard";
import { Plus, X, PaintBucket, Type, Check, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";

interface BrandKitData {
    _id?: string;
    name: string;
    colors: string[];
    fonts: string[];
    logo_url?: string;
    guidelines?: string;
}

export const BrandKit = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [kitName, setKitName] = useState("");
    const [colors, setColors] = useState<string[]>([]);
    const [fonts, setFonts] = useState<string[]>([]);
    const [logoUrl, setLogoUrl] = useState<string>("");
    const [guidelines, setGuidelines] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [newColor, setNewColor] = useState("#3b82f6");
    const [newFont, setNewFont] = useState("");
    const [hasPopulated, setHasPopulated] = useState(false);

    // Presets
    const colorPresets = [
        { name: "Neon", colors: ["#ff007f", "#00f0ff", "#7b2cbf", "#10002b"] },
        { name: "Ocean", colors: ["#1e3a8a", "#3b82f6", "#60a5fa", "#dbeafe"] },
        { name: "Sunset", colors: ["#ea580c", "#f97316", "#facc15", "#fef3c7"] },
        { name: "Eco", colors: ["#065f46", "#10b981", "#6ee7b7", "#ecfdf5"] },
        { name: "Luxury", colors: ["#111827", "#374151", "#f59e0b", "#fffbeb"] }
    ];

    const fontPresets = ["Inter", "Outfit", "Playfair Display", "Space Grotesque", "Montserrat", "Syne"];

    const tonePresets = [
        { name: "Bold & Professional", guidelines: "Write in a formal, authoritative, and corporate tone. Focus on performance metrics, value creation, and institutional reliability." },
        { name: "Friendly & Casual", guidelines: "Use warm, highly engaging, and friendly language. Speak like a helpful companion. Include moderate emoji and approachable calls to action." },
        { name: "Innovative & Tech-Forward", guidelines: "Use visionary, highly modern, and direct copywriting language. Highlight automation, artificial intelligence, generative aesthetics, and speed." },
        { name: "Minimalist & Luxury", guidelines: "Use minimalist, sophisticated, and quiet-luxury language. Focus on quality, craft, exclusivity, and premium details." }
    ];

    // Fetch Brand Kits
    const { data: kits = [], isLoading } = useQuery({
        queryKey: ["brand-kits", user?.id],
        queryFn: () => apiClient.get<BrandKitData[]>("/api/brand/"),
        enabled: !!user,
    });

    // Populate state with first brand kit if exists
    useEffect(() => {
        if (kits.length > 0 && !hasPopulated) {
            const first = kits[0];
            setKitName(first.name);
            setColors(first.colors || []);
            setFonts(first.fonts || []);
            setLogoUrl(first.logo_url || "");
            setGuidelines(first.guidelines || "");
            setHasPopulated(true);
        } else if (kits.length === 0 && hasPopulated) {
            setKitName("");
            setColors([]);
            setFonts([]);
            setLogoUrl("");
            setGuidelines("");
            setHasPopulated(false);
        }
    }, [kits, hasPopulated]);

    const saveMutation = useMutation({
        mutationFn: (data: BrandKitData) => {
            const kitId = kits[0]?._id;
            if (kitId) {
                return apiClient.put(`/api/brand/${kitId}`, data);
            } else {
                return apiClient.post("/api/brand/", data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brand-kits"] });
            toast.success("Brand Matrix Optimized", {
                description: "Your generative identity parameters have been synchronized."
            });
        },
        onError: () => {
            toast.error("Synchronization Failed", {
                description: "The brand matrix could not be committed to the vault."
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => {
            const kitId = kits[0]?._id;
            if (!kitId) throw new Error("No brand kit found to delete");
            return apiClient.delete(`/api/brand/${kitId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brand-kits"] });
            setKitName("");
            setColors([]);
            setFonts([]);
            setLogoUrl("");
            setGuidelines("");
            setHasPopulated(false);
            toast.success("Brand Matrix Deleted", {
                description: "Your brand parameters have been reset."
            });
        },
        onError: () => {
            toast.error("Deletion Failed", {
                description: "Could not remove the brand kit."
            });
        }
    });

    const handleSave = () => {
        if (!kitName || colors.length === 0) {
            toast.error("Incomplete Parameters", {
                description: "Name and at least one color are required for generative training."
            });
            return;
        }
        saveMutation.mutate({
            name: kitName,
            colors,
            fonts,
            logo_url: logoUrl,
            guidelines
        });
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this Brand Matrix? This action cannot be undone.")) {
            deleteMutation.mutate();
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("logo", file);
        if (kits[0]?._id) {
            formData.append("kit_id", kits[0]._id);
        }

        setIsUploading(true);
        try {
            const response = await apiClient.post<{logo_url: string}>("/api/brand/upload-logo", formData);
            setLogoUrl(response.logo_url);
            toast.success("Visual Asset Synchronized", {
                description: "Your logo has been uploaded to the generative storage."
            });
        } catch (error) {
            toast.error("Upload Failed", {
                description: "Could not synchronize the visual asset."
            });
        } finally {
            setIsUploading(false);
        }
    };

    const applyColorPreset = (presetColors: string[], presetName: string) => {
        setColors(presetColors);
        toast.info(`Color Preset Applied: ${presetName}`, {
            description: "Generative colors successfully updated."
        });
    };

    const applyTonePreset = (presetGuidelines: string, presetName: string) => {
        setGuidelines(presetGuidelines);
        toast.info(`Tone Preset Applied: ${presetName}`, {
            description: "Brand guidelines text block synchronized."
        });
    };

    const addFont = (fontName: string) => {
        if (!fonts.includes(fontName)) {
            setFonts([...fonts, fontName]);
            toast.success(`Font Added: ${fontName}`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="animate-pulse tracking-widest font-mono text-xs uppercase">Calibrating Identity Matrix...</p>
            </div>
        );
    }

    return (
        <div className="pb-12 h-full flex flex-col gap-8 max-w-6xl mx-auto w-full animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
                <div>
                   <h2 className="text-3xl font-display font-semibold mb-2">Brand Identity Matrix</h2>
                   <p className="text-muted-foreground">Train the generative engine on your exact brand parameters.</p>
                </div>
            </div>

            {/* Strategic Label */}
            <GlassCard className="p-8">
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3 block">Strategy Label</label>
                <input 
                   type="text" 
                   value={kitName} 
                   onChange={(e) => setKitName(e.target.value)}
                   placeholder="e.g. GenMark Core Identity"
                   className="w-full bg-glass/5 border border-glass/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors text-2xl font-display font-medium text-foreground"
                />
            </GlassCard>

            {/* Matrix Parameters (Colors, Fonts, Logo) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Colors Card */}
                <GlassCard variant="featured" className="p-6 flex flex-col gap-5">
                    <div className="flex items-center gap-3 border-b border-glass/10 pb-3">
                        <PaintBucket className="text-primary" size={20} />
                        <h3 className="text-lg font-display font-medium text-primary">Color Taxonomy</h3>
                    </div>

                    {/* Presets swatches */}
                    <div className="space-y-2">
                        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Presets</span>
                        <div className="flex flex-wrap gap-1.5">
                            {colorPresets.map(preset => (
                                <button
                                    key={preset.name}
                                    onClick={() => applyColorPreset(preset.colors, preset.name)}
                                    className="px-2 py-1 rounded bg-glass/5 border border-glass/10 hover:border-primary/50 text-[10px] flex items-center gap-1.5 transition-all"
                                >
                                    <div className="flex gap-0.5">
                                        {preset.colors.slice(0, 3).map((c, i) => (
                                            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
                                        ))}
                                    </div>
                                    <span>{preset.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-glass/5" />
                    
                    <div className="grid grid-cols-4 gap-3">
                        {colors.map((color, idx) => (
                           <div key={idx} className="flex flex-col gap-1.5">
                               <div className="h-12 rounded-xl border border-glass/20 shadow-inner relative group cursor-pointer overflow-hidden" style={{ backgroundColor: color }}>
                                  <div className="absolute inset-0 bg-glass-inverse/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                      <button onClick={() => setColors(colors.filter((_, i) => i !== idx))}>
                                        <X size={14} className="text-foreground" />
                                      </button>
                                  </div>
                               </div>
                               <span className="text-[9px] font-mono text-center text-muted-foreground uppercase">{color}</span>
                           </div>
                        ))}
                        {/* Inline color picker */}
                        <div className="flex flex-col gap-1">
                            <div className="h-12 rounded-xl border border-dashed border-glass/20 flex items-center justify-center overflow-hidden relative hover:border-primary/50 transition-colors">
                                <input
                                    type="color"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    title="Pick a color"
                                />
                                <div className="w-full h-full rounded-xl" style={{ backgroundColor: newColor }} />
                            </div>
                            <button
                                onClick={() => {
                                    if (!colors.includes(newColor)) setColors([...colors, newColor]);
                                }}
                                className="text-[9px] font-mono text-primary hover:underline uppercase tracking-widest text-center"
                            >
                                + Add
                            </button>
                        </div>
                    </div>
                </GlassCard>

                {/* Typography Card */}
                <GlassCard variant="featured" className="p-6 flex flex-col gap-5">
                    <div className="flex items-center gap-3 border-b border-glass/10 pb-3">
                        <Type className="text-purple-400" size={20} />
                        <h3 className="text-lg font-display font-medium text-purple-400">Typography</h3>
                    </div>

                    {/* Font Presets Suggestions */}
                    <div className="space-y-2">
                        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Suggested Google Fonts</span>
                        <div className="flex flex-wrap gap-1.5">
                            {fontPresets.map(font => (
                                <button
                                    key={font}
                                    onClick={() => addFont(font)}
                                    className="px-2 py-0.5 rounded-full bg-glass/5 border border-glass/10 hover:border-purple-400/50 hover:bg-purple-400/5 text-[9px] font-medium transition-all"
                                >
                                    {font}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-glass/5" />
                    
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-48 pr-1">
                        {fonts.map((font, idx) => (
                           <div key={idx} className="flex items-center justify-between p-3 bg-glass/5 rounded-xl border border-glass/10 group animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                               <span className="font-display text-sm font-medium" style={{ fontFamily: font }}>{font}</span>
                               <button 
                                onClick={() => setFonts(fonts.filter((_, i) => i !== idx))}
                                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                           </div>
                        ))}
                        {/* Inline font input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newFont}
                                onChange={(e) => setNewFont(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && newFont.trim()) {
                                        setFonts([...fonts, newFont.trim()]);
                                        setNewFont("");
                                    }
                                }}
                                placeholder="Custom Font Name..."
                                className="flex-1 bg-glass/5 border border-glass/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-purple-400/50 transition-colors"
                            />
                            <button
                                onClick={() => {
                                    if (newFont.trim()) {
                                        setFonts([...fonts, newFont.trim()]);
                                        setNewFont("");
                                    }
                                }}
                                className="p-2 rounded-xl bg-glass/5 border border-glass/10 hover:border-purple-400/50 text-muted-foreground hover:text-purple-400 transition-all"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                </GlassCard>

                {/* Visual Identity (Logo) */}
                <GlassCard variant="featured" className="p-6 flex flex-col gap-5">
                    <div className="flex items-center gap-3 border-b border-glass/10 pb-3">
                        <Loader2 className={`text-cyan-400 ${isUploading ? 'animate-spin' : ''}`} size={20} />
                        <h3 className="text-lg font-display font-medium text-cyan-400">Visual Identity</h3>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center flex-1 min-h-[160px]">
                        {logoUrl ? (
                            <div className="relative group w-full aspect-video flex items-center justify-center bg-glass/5 rounded-2xl border border-glass/10 overflow-hidden">
                                <img src={logoUrl} alt="Logo" className="max-h-24 max-w-[80%] object-contain" />
                                <div className="absolute inset-0 bg-glass-inverse/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all cursor-default">
                                    <label className="bg-glass/10 hover:bg-glass/20 px-3 py-1.5 rounded-lg cursor-pointer text-xs font-medium transition-colors">
                                        Update Logo
                                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                    </label>
                                    <button 
                                        onClick={() => setLogoUrl("")}
                                        className="text-[10px] text-muted-foreground hover:text-destructive underline"
                                    >
                                        Remove Logo
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="w-full aspect-video flex flex-col items-center justify-center gap-2 bg-glass/5 rounded-2xl border border-dashed border-glass/20 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all cursor-pointer group">
                                <div className="p-3 rounded-full bg-glass/5 group-hover:scale-110 transition-transform">
                                    {isUploading ? <Loader2 className="animate-spin text-cyan-400" /> : <Plus className="text-muted-foreground group-hover:text-cyan-400" />}
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-medium">Upload Brand Mark</p>
                                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-1">PNG, SVG or JPG (Max 5MB)</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                            </label>
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Brand Guidelines & Tone of Voice Presets (Full Width Card) */}
            <GlassCard className="p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-glass/10 pb-4 justify-between">
                    <div className="flex items-center gap-3">
                        <MessageSquare className="text-emerald-400" size={24} />
                        <h3 className="text-xl font-display font-bold text-foreground">Guidelines & Copywriting Tone</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={10} /> AI Dynamic Alignment
                    </span>
                </div>

                {/* Tone Presets Selector */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Suggested Tone of Voice Presets</label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {tonePresets.map(preset => (
                            <button
                                key={preset.name}
                                onClick={() => applyTonePreset(preset.guidelines, preset.name)}
                                className={`p-4 rounded-2xl border text-left transition-all hover:scale-102 flex flex-col gap-2 ${
                                    guidelines === preset.guidelines
                                        ? "bg-emerald-500/10 border-emerald-500/30"
                                        : "bg-glass/5 border-glass/10 hover:bg-glass/10"
                                }`}
                            >
                                <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                                    <Sparkles size={12} />
                                    <span>{preset.name}</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-normal line-clamp-3">
                                    {preset.guidelines}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-glass/5" />

                {/* Guidelines Textbox */}
                <div className="space-y-2">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">AI Copywriting Directives</label>
                    <textarea 
                        value={guidelines}
                        onChange={(e) => setGuidelines(e.target.value)}
                        placeholder="Write down custom constraints or rules for the generative copy engine. e.g. Do not use hashtags, avoid professional jargon, use exclamation marks..."
                        className="w-full h-32 bg-glass/5 border border-glass/10 rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all resize-none text-foreground leading-relaxed"
                    />
                </div>
            </GlassCard>
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
               {kits.length > 0 && (
                 <button 
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending || saveMutation.isPending}
                  className="flex items-center gap-2 border border-red-500/20 hover:border-red-500 bg-red-500/10 text-red-400 hover:text-white font-semibold px-8 py-3.5 rounded-xl transition-all disabled:opacity-50 hover:bg-red-500"
                 >
                    {deleteMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <X size={18} />}
                    <span>Delete Brand Matrix</span>
                 </button>
               )}

               <button 
                onClick={handleSave}
                disabled={saveMutation.isPending || deleteMutation.isPending}
                className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-xl shadow-glow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
               >
                  {saveMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                  <span>Save Matrix parameters</span>
               </button>
            </div>
        </div>
    )
};

