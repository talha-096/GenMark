import { useState } from 'react';
import { GlassCard } from "@/components/shared/GlassCard";
import { Eye, Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { toast } from "sonner";

export const ImageToText = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleUpload = () => {
        setIsUploading(true);
        // Simulate AI Vision analysis
        setTimeout(() => {
            setIsUploading(false);
            setResult("A professional studio photograph of a sleek, minimalist tech product with metallic accents, set against a soft-focus architectural background with warm natural lighting. The composition follows the rule of thirds with high contrast and sharp detailing.");
            toast.success("Image analyzed successfully");
        }, 3000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-display font-bold tracking-tight">Semantic Vision (Image to Text)</h1>
                <p className="text-muted-foreground mt-1">Reverse engineer any image into high-fidelity descriptive prompts and metadata.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <GlassCard className="p-8 border-dashed border-2 relative overflow-hidden group">
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Upload size={24} className="text-primary" />
                            </div>
                            <h3 className="font-bold text-lg">Upload Source Image</h3>
                            <p className="text-sm text-muted-foreground mt-2 max-w-xs">Drop an image here or click to browse. Max size 10MB.</p>
                            <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setPreview(URL.createObjectURL(file));
                                        handleUpload();
                                    }
                                }}
                            />
                        </div>
                    </GlassCard>

                    {preview && (
                        <div className="rounded-2xl overflow-hidden aspect-video border border-white/10 relative">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Button variant="secondary" size="sm" onClick={() => setPreview(null)}>Remove</Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <GlassCard className="p-8 min-h-[400px] flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-accent/20 text-accent">
                                <FileText size={20} />
                            </div>
                            <h3 className="font-bold text-lg">Neural Analysis Result</h3>
                        </div>

                        {isUploading ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                                <Loader2 className="animate-spin text-primary" size={32} />
                                <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest">Calibrating vision sensors...</p>
                            </div>
                        ) : result ? (
                            <div className="flex-1 space-y-6 animate-in fade-in duration-500">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-sm leading-relaxed italic text-foreground/90">{result}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-lg bg-surface/50 border border-white/5">
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Confidence</span>
                                        <span className="text-sm font-bold text-green-400">98.4%</span>
                                    </div>
                                    <div className="p-3 rounded-lg bg-surface/50 border border-white/5">
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Processing Time</span>
                                        <span className="text-sm font-bold text-blue-400">2.8s</span>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <Button className="flex-1 gap-2" variant="outline" onClick={() => {
                                        navigator.clipboard.writeText(result);
                                        toast.success("Copied to clipboard");
                                    }}>
                                        Copy Result
                                    </Button>
                                    <Button className="flex-1 gap-2">
                                        Use as Prompt
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
                                <Eye size={40} className="mb-4 opacity-20" />
                                <p className="text-sm">Analysis metadata will appear here once an image is uploaded.</p>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};
