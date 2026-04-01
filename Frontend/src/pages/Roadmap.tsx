import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Zap, Target, Cpu } from "lucide-react";
import { RoadmapTimeline } from "@/components/shared/RoadmapTimeline";
import { GradientText } from "@/components/shared/GradientText";
import { GlassCard } from "@/components/shared/GlassCard";
import { Link } from "react-router-dom";

const Roadmap = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    gsap.fromTo(
      ".roadmap-intro > *",
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
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen relative z-10">
      <div className="text-center mb-24 roadmap-intro">
        <div className="font-mono text-sm tracking-widest text-primary mb-3 uppercase">Evolutionary Logic</div>
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
          The <GradientText>Neural Roadmap</GradientText>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          GenMark isn't just a static tool; it's a living ecosystem designed to evolve with the shifting landscape of digital expression.
        </p>
      </div>

      <div ref={containerRef} className="py-20 mb-24">
        <RoadmapTimeline />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
        <GlassCard className="p-10 flex flex-col gap-6 roadmap-intro">
          <Target size={32} className="text-primary" />
          <h3 className="text-2xl font-display font-bold">2026: Semantic Mastery</h3>
          <p className="text-muted-foreground">Focusing on deep-copy synthesis and pixel-perfect visual alignment. We are currently finalizing the 0.4s latency inference layer and brand-locking algorithms.</p>
        </GlassCard>

        <GlassCard className="p-10 flex flex-col gap-6 roadmap-intro">
          <Cpu size={32} className="text-secondary" />
          <h3 className="text-2xl font-display font-bold">2027: Predictive Intelligence</h3>
          <p className="text-muted-foreground">Launching real-time audience feedback loops where the AI doesn't just generate content—it predicts virality and engagement based on live global data streams.</p>
        </GlassCard>
      </div>

      <div className="mt-12 text-center roadmap-intro">
        <Link to="/signup" className="inline-flex items-center gap-3 bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary-dark)))] text-primary-foreground font-semibold px-12 py-6 text-xl rounded-full shadow-glow-xl hover:scale-105 transition-all">
          <span>Secure Early Access</span>
          < Zap size={24} />
        </Link>
      </div>
    </div>
  );
};

export default Roadmap;
