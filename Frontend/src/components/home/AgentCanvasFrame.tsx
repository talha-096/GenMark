import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlassCard } from "@/components/shared/GlassCard";
import { Terminal, Globe, Palette, Layers, Cpu } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const AgentCanvasFrame = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    const trigger = triggerRef.current;
    if (!el || !trigger) return;

    const ctx = gsap.context(() => {
      // Pin the workstation
      ScrollTrigger.create({
        trigger: trigger,
        start: "top top",
        end: "bottom bottom",
        pin: el,
        scrub: true,
      });

      // Orchestrate the progress bar and image reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        }
      });
      
      tl.fromTo(".gen-progress", 
        { width: "0%" },
        { width: "100%", ease: "none" },
        0
      );

      // Scroll effect for the picture in the background
      tl.fromTo(".gen-image",
        { scale: 1.5, opacity: 0, filter: "blur(20px)" },
        { scale: 1, opacity: 0.6, filter: "blur(0px)", ease: "power1.inOut" },
        0
      );

      // Update the percentage text
      tl.to(".gen-percentage", {
        textContent: "100%",
        modifiers: {
          textContent: value => Math.round(parseFloat(value)) + "%"
        },
        snap: { textContent: 1 },
        ease: "none"
      }, 0);

      // Sequence the steps
      const steps = [".step-1", ".step-2", ".step-3", ".step-4"];
      steps.forEach((step, i) => {
        gsap.fromTo(step,
          { opacity: 0, scale: 0.95, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: trigger,
              start: `${i * 25}% center`,
              end: `${(i + 1) * 25}% center`,
              scrub: 1.5,
              toggleActions: "play reverse play reverse",
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} className="relative w-full h-[400vh] mt-32">
      <div ref={containerRef} className="h-screen w-full flex items-center justify-center px-6 overflow-hidden">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="font-mono text-sm tracking-widest text-primary font-bold uppercase">System C: Live Agent Canvas</div>
              <h2 className="text-4xl md:text-6xl font-display font-black leading-tight">
                Watch the future <br /> 
                <span className="gradient-text italic">generate in real-time.</span>
              </h2>
            </div>

            <div className="relative space-y-4">
              {[
                { id: "step-1", icon: Terminal, label: "Semantic Analysis", desc: "Understanding brand voice and strategic intent." },
                { id: "step-2", icon: Cpu, label: "Neural Synthesis", desc: "Building core content structures across 7 layers." },
                { id: "step-3", icon: Palette, label: "Visual Integration", desc: "Generating high-fidelity brand-aligned assets." },
                { id: "step-4", icon: Globe, label: "Global Distribution", desc: "Optimizing for omni-channel performance." },
              ].map((step, idx) => (
                <div key={idx} className={`${step.id} flex items-center gap-6 p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm transition-colors hover:bg-white/10`}>
                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <step.icon size={24} />
                   </div>
                   <div>
                      <h4 className="font-display font-bold text-xl">{step.label}</h4>
                      <p className="text-muted-foreground text-sm">{step.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <GlassCard variant="featured" className="w-full max-w-[600px] h-[600px] p-0 overflow-hidden group shadow-glow-xl">
              <div className="h-12 border-b border-white/10 px-6 flex items-center justify-between bg-black/40">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/40" />
                </div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">genmark-workstation-v4.0.0.core</div>
                <Terminal size={14} className="text-primary/60" />
              </div>
              
              <div className="p-8 h-full flex flex-col font-mono text-sm">
                 <div className="flex-1 space-y-4 text-primary/80">
                    <div className="flex items-center gap-3">
                       <span className="text-green-500">▶</span>
                       <span className="animate-pulse">_ initializing engine...</span>
                    </div>
                    <div className="text-xs text-muted-foreground opacity-50">
                       [system] authenticating secure-token... <br />
                       [neural] loading content-signal-field v9... <br />
                       [vision] cache-hit strategy: enabled
                    </div>
                    
                    <div className="mt-12 space-y-12">
                        <div className="h-64 w-full rounded-lg border border-white/10 bg-black flex items-center justify-center relative overflow-hidden">
                           <img 
                             className="gen-image absolute inset-0 w-full h-full object-cover" 
                             src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop" 
                             alt="Synthesis" 
                           />
                           <Layers className="text-white/20 w-24 h-24 animate-float relative z-10 drop-shadow-2xl" />
                           <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
                           <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
                        </div>
                        
                        <div className="space-y-2">
                           <div className="flex justify-between text-[10px] uppercase tracking-tighter">
                              <span>Synthesis Progress</span>
                              <span className="gen-percentage font-bold text-primary">0%</span>
                           </div>
                           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="gen-progress h-full bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--primary-dark)))] shadow-glow-sm" />
                           </div>
                        </div>
                    </div>
                 </div>
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
};
