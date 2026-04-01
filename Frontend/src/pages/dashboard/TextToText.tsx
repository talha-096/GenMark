import { useState } from "react";
import { GlassCard } from "@/components/shared/GlassCard";
import { Send, Sparkles, Copy, CheckCircle2 } from "lucide-react";

export const TextToText = () => {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResult(null);
    setCopied(false);
    
    // Mock Generation
    setTimeout(() => {
      setResult("Here is the generated high-converting marketing copy based on your prompt:\n\nAttention all trailblazers of the digital frontier! Are you tired of manual pipelines slowing down your creative velocity? GenMark is the unified neural architecture that transforms weeks of content production into mere seconds.\n\nStop wrangling dozens of disconnected tools. Unleash the power of autonomous marketing today.");
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full pb-12">
      {/* LEFT: Configuration Sidebar */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6 h-full">
        <GlassCard className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-primary/10 rounded-lg"><Sparkles className="text-primary" size={20} /></div>
             <h2 className="text-xl font-display font-semibold">Copy Engine</h2>
          </div>

          <form onSubmit={handleGenerate} className="flex flex-col flex-1 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground/80">Brand Tone</label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors text-foreground"
              >
                {['Professional', 'Witty', 'Urgent', 'Inspirational', 'Casual', 'Technical'].map(t => (
                  <option key={t} value={t} className="bg-background text-foreground">{t}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium text-foreground/80">Prompt Parameter Context</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the product update or marketing campaign..."
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors text-foreground resize-none flex-1 min-h-[200px]"
              />
            </div>
            
            <button 
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="mt-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-4 rounded-xl shadow-glow-sm hover:shadow-glow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Synthesizing...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Generate Copy
                </>
              )}
            </button>
          </form>
        </GlassCard>
      </div>

      {/* RIGHT: Output Display */}
      <div className="w-full lg:w-2/3 h-full flex flex-col pt-4 lg:pt-0">
        <div className="flex-1 bg-surface-raised border border-white/[0.05] rounded-2xl relative overflow-hidden flex flex-col">
          {/* Header Bar */}
          <div className="h-14 border-b border-white/[0.05] flex justify-between items-center px-6 shrink-0 bg-background/50 backdrop-blur-sm relative z-10">
             <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Output Buffer</div>
             {result && (
               <button onClick={copyToClipboard} className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-white/5">
                 {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
               </button>
             )}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative z-10 text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {result ? (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {result}
               </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50">
                 <Sparkles size={48} className="mb-4 opacity-50" />
                 <p className="font-mono text-sm tracking-widest uppercase">Awaiting Parameters</p>
              </div>
            )}
          </div>
          
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
      </div>
    </div>
  );
};
