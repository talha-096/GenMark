import { useState } from "react";
import { GlassCard } from "@/components/shared/GlassCard";
import { Plus, X, PaintBucket, Type, Info, Check, Sparkles } from "lucide-react";

export const BrandKit = () => {
    const [kitName, setKitName] = useState("GenMark Core Identity");
    const [colors] = useState(['#3b82f6', '#f97316', '#a855f7', '#0a1a3a']);
    const [fonts] = useState(['Space Grotesk', 'Inter']);
    const [modifiers] = useState(['professional', 'innovative', 'cinematic', 'minimalist']);
    
    return (
        <div className="pb-12 h-full flex flex-col gap-8 max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
                <div>
                   <h2 className="text-3xl font-display font-semibold mb-2">Brand Identity Matrix</h2>
                   <p className="text-muted-foreground">Train the neural engine on your exact brand parameters.</p>
                </div>
                <button className="bg-white/10 text-foreground font-semibold px-6 py-2.5 rounded-full hover:bg-white/20 transition-colors border border-white/5">
                   Create New Kit
                </button>
            </div>

            <GlassCard className="p-8">
                <label className="text-sm font-medium text-foreground/80 mb-2 block">Brand Strategy Name</label>
                <input 
                   type="text" 
                   value={kitName} 
                   onChange={(e) => setKitName(e.target.value)}
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors text-2xl font-display font-medium text-foreground"
                />
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard variant="featured" className="p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <PaintBucket className="text-primary" size={24} />
                        <h3 className="text-xl font-display font-medium">Color Taxonomy</h3>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                        {colors.map((color, idx) => (
                           <div key={idx} className="flex flex-col gap-2">
                               <div className="h-16 rounded-xl border border-white/20 shadow-inner relative group cursor-pointer" style={{ backgroundColor: color }}>
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                                      <X size={16} className="text-white" />
                                  </div>
                               </div>
                               <span className="text-xs font-mono text-center text-muted-foreground">{color}</span>
                           </div>
                        ))}
                        <button className="h-16 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors hover:border-primary/50">
                           <Plus size={20} />
                        </button>
                    </div>
                </GlassCard>

                <GlassCard variant="orange" className="p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <Type className="text-secondary" size={24} />
                        <h3 className="text-xl font-display font-medium">Typography Constraints</h3>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        {fonts.map((font, idx) => (
                           <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 group">
                               <span className="font-display font-medium" style={{ fontFamily: font }}>{font}</span>
                               <button className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><X size={16}/></button>
                           </div>
                        ))}
                        <button className="flex items-center justify-center p-4 rounded-xl border border-dashed border-white/20 text-muted-foreground hover:text-secondary transition-colors hover:border-secondary/50">
                           <Plus size={20} />
                        </button>
                    </div>
                </GlassCard>
                
                <GlassCard className="p-8 flex flex-col gap-6 col-span-1 md:col-span-2">
                   <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <Sparkles className="text-accent" size={24} />
                        <h3 className="text-xl font-display font-medium">Implicit Modifiers</h3>
                        <div className="ml-auto text-muted-foreground hover:text-primary cursor-help"><Info size={18} /></div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">These tags are automatically appended to the neural network context on every generation.</p>

                    <div className="flex flex-wrap gap-3">
                        {modifiers.map((mod, idx) => (
                           <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-foreground/90 font-medium text-sm">
                               {mod}
                               <button className="hover:text-destructive transition-colors"><X size={14}/></button>
                           </div>
                        ))}
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-dashed border-white/20 rounded-full text-muted-foreground hover:text-foreground hover:border-white/40 transition-colors text-sm font-medium">
                           <Plus size={16} /> Add Modifier
                        </button>
                    </div>
                </GlassCard>
            </div>
            
            <div className="mt-8 flex justify-end">
               <button className="flex items-center gap-2 bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary-dark)))] text-primary-foreground font-semibold px-8 py-3.5 rounded-xl shadow-glow-md hover:scale-105 transition-transform">
                  <Check size={18} /> Save Matrix parameters
               </button>
            </div>
        </div>
    )
};
