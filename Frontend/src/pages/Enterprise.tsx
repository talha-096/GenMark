import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  ShieldCheck, 
  Users, 
  Globe, 
  Lock, 
  HardDrive,
  BarChart3,
  Box
} from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { AnimatedProgressBar } from "@/components/shared/AnimatedProgressBar";
import { GradientText } from "@/components/shared/GradientText";

const Enterprise = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    gsap.fromTo(
      ".ent-card",
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
        <div className="font-mono text-sm tracking-widest text-primary mb-3">TRUSTED INFRASTRUCTURE</div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold mb-6">
          The <GradientText>Enterprise Standard</GradientText>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          GenMark provides the power of state-of-the-art AI generation backed by the most rigorous security and governance frameworks in the industry.
        </p>
      </div>

      <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
        <div className="flex flex-col gap-10">
          <div className="mb-4">
             <h2 className="text-3xl font-display font-bold mb-6">Security & Resilience</h2>
             <p className="text-lg text-muted-foreground">GenMark's architecture ensures total brand isolation and enterprise-grade data handling. Our SOC 2 Type II compliance guarantees your data never touches public training datasets.</p>
          </div>

          <div className="space-y-6 bg-surface/40 p-10 rounded-3xl border border-white/[0.05] backdrop-blur-3xl ent-card">
            <AnimatedProgressBar label="SOC 2 Type II Compliance" percentage={100} />
            <AnimatedProgressBar label="Neural Uptime SLA" percentage={99.99} className="text-secondary" />
            <AnimatedProgressBar label="Regional Encryption" percentage={98} className="text-accent" />
            <AnimatedProgressBar label="Team Security Score" percentage={96} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, text: 'SOC 2 Compliant' },
              { icon: Lock, text: 'End-to-End Encryption' },
              { icon: Users, text: 'Role-Based Access' },
              { icon: HardDrive, text: 'Region Isolation' },
              { icon: Box, text: 'Private Brand Kits' },
              { icon: Globe, text: 'Global Distribution' }
            ].map((feat, i) => (
              <GlassCard key={i} className="p-4 flex items-center gap-3 ent-card group">
                <feat.icon size={20} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">{feat.text}</span>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
           <GlassCard variant="featured" className="p-10 ent-card">
              <Users size={32} className="text-primary mb-6" />
              <h3 className="text-2xl font-display font-bold mb-4">Multi-Role Governance</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Define distinct permissions for **Marketers**, **Designers**, and **Administrators** to control brand asset flow and API credit utilization across global teams.
              </p>
              <div className="flex gap-3">
                 <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono uppercase tracking-widest text-primary">Marketers</span>
                 <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono uppercase tracking-widest text-secondary">Designers</span>
                 <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono uppercase tracking-widest text-accent">Admins</span>
              </div>
           </GlassCard>

           <GlassCard className="p-10 ent-card">
              <BarChart3 size={32} className="text-secondary mb-6" />
              <h3 className="text-2xl font-display font-bold mb-4">Centralized Asset Library</h3>
              <p className="text-muted-foreground leading-relaxed">
                Automatically organize and search high-fidelity marketing assets in a central repository with automated tag generation and brand kit cross-referencing.
              </p>
           </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Enterprise;
