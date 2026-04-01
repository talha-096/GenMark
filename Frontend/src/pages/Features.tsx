import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Sparkles, Image as ImageIcon, Briefcase, Zap, ShieldCheck, PenTool, BarChart, Video, FileSearch, Target, Cpu } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { RoadmapTimeline } from "@/components/shared/RoadmapTimeline";
import { GradientText } from "@/components/shared/GradientText";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Neural Copy Generation",
    description: "Write long-form articles, short-form posts, and ad copy in your exact brand voice. Never stare at a blank page again.",
    replaces: "Jasper / ChatGPT",
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
  },
  {
    icon: ImageIcon,
    title: "AI Image Synthesis",
    description: "Generate breathtaking, photorealistic images or stylized illustrations perfectly prompted for marketing use.",
    replaces: "Midjourney",
    colorClass: "text-secondary",
    bgClass: "bg-secondary/10",
  },
  {
    icon: PenTool,
    title: "Layout & Formatting",
    description: "Auto-format and arrange text and images into ready-to-publish assets directly in the browser.",
    replaces: "Canva",
    colorClass: "text-accent",
    bgClass: "bg-accent/10",
  },
  {
    icon: Zap,
    title: "Automated Scheduling",
    description: "Distribute your generated content across all social platforms and email lists with one click.",
    replaces: "Hootsuite",
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
  },
  {
    icon: Briefcase,
    title: "Universal Brand Kit",
    description: "Store logos, colors, fonts, and negative prompts. Every generation automatically aligns with these rules.",
    replaces: "Brand Guidelines PDFs",
    colorClass: "text-secondary",
    bgClass: "bg-secondary/10",
  },
  {
    icon: BarChart,
    title: "Performance Analytics",
    description: "Track which generated phrases and images drive the most engagement and let the AI learn from it.",
    replaces: "Google Analytics / Native Insights",
    colorClass: "text-accent",
    bgClass: "bg-accent/10",
  },
  {
    icon: Video,
    title: "Text to Video",
    description: "Generate high-fidelity, cinematic video clips from simple text descriptions. Coming soon.",
    replaces: "Sora / Runway",
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    status: "Coming Soon"
  },
  {
    icon: FileSearch,
    title: "Image to Text",
    description: "Neural analysis of visual assets to generate metadata, SEO tags, and descriptive copy. Coming soon.",
    replaces: "Manual Tagging",
    colorClass: "text-secondary",
    bgClass: "bg-secondary/10",
    status: "Coming Soon"
  },
];

export const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-24">
        <div className="font-mono text-sm tracking-widest text-primary mb-3">CONSOLIDATE YOUR STACK</div>
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
          One Neural Engine.<br />
          <GradientText>Infinite Capabilities.</GradientText>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          GenMark replaces your fragmented marketing stack with a single, highly-focused AI ecosystem.
        </p>
      </div>

      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURES.map((feat, i) => (
          <GlassCard key={i} className="p-8 flex flex-col h-full group">
            {feat.status && (
              <div className="absolute top-6 right-6 px-3 py-1 rounded bg-white/10 text-[10px] font-mono font-bold tracking-widest uppercase border border-white/5">
                {feat.status}
              </div>
            )}
            <div className={cn(
              "p-4 rounded-xl w-fit mb-8 shadow-glow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3",
              feat.bgClass,
              feat.colorClass
            )}>
              <feat.icon size={32} />
            </div>
            
            <h3 className="text-2xl font-display font-bold mb-4">{feat.title}</h3>
            <p className="text-muted-foreground mb-8 flex-1">{feat.description}</p>
            
            <div className="pt-6 border-t border-white/10 mt-auto">
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Replaces</div>
              <div className="font-medium text-foreground/90">{feat.replaces}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ROADMAP SECTION INJECTED INTO FEATURES */}
      <div className="mt-32 max-w-7xl mx-auto px-6">
         <div className="text-center mb-16 roadmap-intro">
            <div className="font-mono text-sm tracking-widest text-primary mb-3 uppercase">Evolutionary Logic</div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">The <GradientText>Neural Roadmap</GradientText></h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">GenMark isn't just a static tool; it's a living ecosystem designed to evolve with the shifting landscape of digital expression.</p>
         </div>
         
         <div className="py-12 mb-16 scale-95 origin-top">
            <RoadmapTimeline />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
            <GlassCard className="p-10 flex flex-col gap-6 roadmap-intro">
               <Target size={32} className="text-primary" />
               <h3 className="text-2xl font-display font-bold text-white">2026: Semantic Mastery</h3>
               <p className="text-muted-foreground">Focusing on deep-copy synthesis and pixel-perfect visual alignment. We are currently finalizing the 0.4s latency inference layer and brand-locking algorithms.</p>
            </GlassCard>

            <GlassCard className="p-10 flex flex-col gap-6 roadmap-intro">
               <Cpu size={32} className="text-secondary" />
               <h3 className="text-2xl font-display font-bold text-white">2027: Predictive Intelligence</h3>
               <p className="text-muted-foreground">Launching real-time audience feedback loops where the AI doesn't just generate content—it predicts virality and engagement based on live global data streams.</p>
            </GlassCard>
         </div>
      </div>

      <div className="mt-16 max-w-4xl mx-auto">
        <GlassCard variant="featured" className="p-12 text-center flex flex-col items-center">
          <ShieldCheck size={48} className="text-primary mb-6" />
          <h2 className="text-3xl font-display font-bold mb-4">Enterprise-grade Security</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            Your brand data is your competitive advantage. GenMark's models are isolated and your proprietary data is never used to train global public models.
          </p>
          <div className="flex gap-4">
             <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium">SOC 2 Type II</span>
             <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium">GDPR Compliant</span>
             <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium">End-to-End Encryption</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
