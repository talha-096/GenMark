import { useState, useEffect } from "react";
import { GlassCard } from "@/components/shared/GlassCard";
import { Plus, X, PaintBucket, Type, Check, Loader2 } from "lucide-react";
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
    const [isUploading, setIsUploading] = useState(false);
    
    // Fetch Brand Kits
    const { data: kits = [], isLoading } = useQuery({
        queryKey: ["brand-kits", user?.id],
        queryFn: () => apiClient.get<BrandKitData[]>("/api/brand/"),
        enabled: !!user,
    });

    // Populate state with first brand kit if exists
    useEffect(() => {
        if (kits.length > 0 && !kitName) {
            const first = kits[0];
            setKitName(first.name);
            setColors(first.colors || []);
            setFonts(first.fonts || []);
            setLogoUrl(first.logo_url || "");
        }
    }, [kits, kitName]);

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
                description: "Your neural identity parameters have been synchronized."
            });
        },
        onError: () => {
            toast.error("Synchronization Failed", {
                description: "The brand matrix could not be committed to the vault."
            });
        }
    });

    const handleSave = () => {
        if (!kitName || colors.length === 0) {
            toast.error("Incomplete Parameters", {
                description: "Name and at least one color are required for neural training."
            });
            return;
        }
        saveMutation.mutate({
            name: kitName,
            colors,
            fonts,
            logo_url: logoUrl
        });
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
            const response = await apiClient.post<{logo_url: string}>("/api/brand/upload-logo", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setLogoUrl(response.logo_url);
            toast.success("Visual Asset Synchronized", {
                description: "Your logo has been uploaded to the neural storage."
            });
        } catch (error) {
            toast.error("Upload Failed", {
                description: "Could not synchronize the visual asset."
            });
        } finally {
            setIsUploading(false);
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
                <div>
                   <h2 className="text-3xl font-display font-semibold mb-2">Brand Identity Matrix</h2>
                   <p className="text-muted-foreground">Train the neural engine on your exact brand parameters.</p>
                </div>
            </div>

            <GlassCard className="p-8">
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3 block">Strategy Label</label>
                <input 
                   type="text" 
                   value={kitName} 
                   onChange={(e) => setKitName(e.target.value)}
                   placeholder="e.g. GenMark Core Identity"
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors text-2xl font-display font-medium text-foreground"
                />
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <GlassCard variant="featured" className="p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <PaintBucket className="text-primary" size={24} />
                        <h3 className="text-xl font-display font-medium text-primary">Color Taxonomy</h3>
                    </div>
                    
                    <div className="grid grid-cols-4 lg:grid-cols-5 gap-4">
                        {colors.map((color, idx) => (
                           <div key={idx} className="flex flex-col gap-2">
                               <div className="h-16 rounded-xl border border-white/20 shadow-inner relative group cursor-pointer overflow-hidden" style={{ backgroundColor: color }}>
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                      <button onClick={() => setColors(colors.filter((_, i) => i !== idx))}>
                                        <X size={16} className="text-white" />
                                      </button>
                                  </div>
                               </div>
                               <span className="text-[10px] font-mono text-center text-muted-foreground uppercase">{color}</span>
                           </div>
                        ))}
                        <button 
                            className="h-16 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors hover:border-primary/50"
                            onClick={() => {
                                const newColor = prompt("Enter Hex Code:", "#");
                                if (newColor && /^#[0-9A-F]{6}$/i.test(newColor)) {
                                    setColors([...colors, newColor]);
                                }
                            }}
                        >
                           <Plus size={20} />
                        </button>
                    </div>
                </GlassCard>

                <GlassCard variant="featured" className="p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <Type className="text-purple-400" size={24} />
                        <h3 className="text-xl font-display font-medium text-purple-400">Typography Constraints</h3>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        {fonts.map((font, idx) => (
                           <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 group animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                               <span className="font-display font-medium" style={{ fontFamily: font }}>{font}</span>
                               <button 
                                onClick={() => setFonts(fonts.filter((_, i) => i !== idx))}
                                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><X size={16}/></button>
                           </div>
                        ))}
                        <button 
                            className="flex items-center justify-center p-4 rounded-xl border border-dashed border-white/20 text-muted-foreground hover:text-purple-400 transition-colors hover:border-purple-400/50"
                            onClick={() => {
                                const newFont = prompt("Enter Font Family Name:");
                                if (newFont) setFonts([...fonts, newFont]);
                            }}
                        >
                           <Plus size={20} />
                        </button>
                    </div>
                </GlassCard>

                <GlassCard variant="featured" className="p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <Loader2 className={`text-cyan-400 ${isUploading ? 'animate-spin' : ''}`} size={24} />
                        <h3 className="text-xl font-display font-medium text-cyan-400">Visual Identity</h3>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center h-full gap-6">
                        {logoUrl ? (
                            <div className="relative group w-full aspect-video flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                                <img src={logoUrl} alt="Logo" className="max-h-32 max-w-[80%] object-contain" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all cursor-default">
                                    <label className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors">
                                        Update Logo
                                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                    </label>
                                    <button 
                                        onClick={() => setLogoUrl("")}
                                        className="text-xs text-muted-foreground hover:text-destructive underline"
                                    >
                                        Remove Logo
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="w-full aspect-video flex flex-col items-center justify-center gap-3 bg-white/5 rounded-2xl border border-dashed border-white/20 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all cursor-pointer group">
                                <div className="p-4 rounded-full bg-white/5 group-hover:scale-110 transition-transform">
                                    {isUploading ? <Loader2 className="animate-spin text-cyan-400" /> : <Plus className="text-muted-foreground group-hover:text-cyan-400" />}
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium">Upload Brand Mark</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">PNG, SVG or JPG (Max 5MB)</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                            </label>
                        )}
                    </div>
                </GlassCard>
            </div>
            
            <div className="mt-8 flex justify-end">
               <button 
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-xl shadow-glow-md hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
               >
                  {saveMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                  <span>Save Matrix parameters</span>
               </button>
            </div>
        </div>
    )
};
