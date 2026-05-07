import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  Split, 
  Cpu, 
  Zap, 
  Bot
} from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { GradientText } from "@/components/shared/GradientText";

const CAPABILITIES = [
  {
    icon: Sparkles,
    title: "Neural Copy Engine",
    description: "Create compelling marketing copy instantly, tuned perfectly to your brand voice parameters using GenMark's proprietary LLM fine-tuning.",
    tags: ['Marketing Emails', 'Blog Posts', 'Social Captions', 'Ad Headlines'],
    variant: "featured" as const
  },
  {
    icon: ImageIcon,
    title: "Visual Synthesis Suite",
    description: "Transform words into stunning marketing visuals. Our diffusion models are optimized for high-fidelity branding and commercial aesthetics.",
    tags: ['Social Graphics', 'Ad Banners', 'Product Images', 'Illustrations'],
    variant: "orange" as const
  },
  {
    icon: Video,
    title: "Image to Video",
    description: "Neural motion synthesis for high-fidelity video generation from static imagery. Move your static maps into cinematic fluid motion.",
    tags: ['Cinematic Ads', 'Motion Logos', 'Social Stories'],
    status: "Coming Soon",
    variant: "default" as const
  },
  {
    icon: Split,
    title: "Multi-Modal Fusion",
    description: "Simultaneously generate text and matching visuals in a unified workspace for perfect creative alignment.",
    tags: ['Unified Campaigns', 'Total Consistency'],
    variant: "default" as const
  }
];

const Engine = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    gsap.fromTo(
      ".engine-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-24">
        <div className="font-mono text-sm tracking-widest text-primary mb-3">TECHNOLOGY STACK</div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold mb-6">
          The <GradientText>Neural Core</GradientText>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          GenMark's engine is built on a proprietary multi-modal architecture that bridges the gap between semantic understanding and visual expression.
        </p>
      </div>

      <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
        {CAPABILITIES.map((cap, i) => (
          <GlassCard key={i} variant={cap.variant} className="p-10 engine-card group relative">
            {cap.status && (
              <div className="absolute top-6 right-6 px-3 py-1 rounded bg-white/10 text-[10px] font-mono font-bold tracking-widest uppercase border border-white/5">
                {cap.status}
              </div>
            )}
            <div className="flex items-start gap-6 mb-8">
              <div className="p-4 rounded-xl bg-white/5 text-foreground group-hover:scale-110 transition-transform">
                <cap.icon size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold mb-3">{cap.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{cap.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-6 border-t border-white/10">
              {cap.tags.map(tag => (
                <span key={tag} className="text-xs font-mono bg-white/5 px-3 py-1.5 rounded-full text-foreground/70">{tag}</span>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Cpu, title: "0.4s Latency", desc: "Optimized inference layer for real-time creative feedback." },
          { icon: Zap, title: "100% Brand Lock", desc: "Mandatory architectural constraints ensure every output reflects your brand." },
          { icon: Bot, title: "Autonomous Refine", desc: "Self-correcting neural loops for ultra-high-fidelity generation." }
        ].map((stat, i) => (
          <GlassCard key={i} className="p-8 text-center flex flex-col items-center engine-card">
            <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
              <stat.icon size={24} />
            </div>
            <h4 className="text-xl font-bold mb-2">{stat.title}</h4>
            <p className="text-sm text-muted-foreground">{stat.desc}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Engine;
