import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GlassCard } from "@/components/shared/GlassCard";
import { GradientText } from "@/components/shared/GradientText";

export const CreativeTransformation = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center+=100",
        end: "bottom center",
        scrub: 1.5,
        // markers: true,
      }
    });

    // Zoom and Reveal Animation
    tl.fromTo(imageRef.current, 
      { scale: 1.4, filter: "blur(20px) brightness(0.5)" },
      { scale: 1, filter: "blur(0px) brightness(1)", ease: "none", duration: 1 }
    );

    tl.fromTo(frameRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, ease: "power3.out", duration: 0.8 },
      "-=0.5"
    );

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative py-32 px-6 overflow-hidden bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.05),transparent_70%)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="font-mono text-xs tracking-[0.4em] text-primary/80 mb-4 uppercase">Neural Output</div>
          <h2 className="text-5xl md:text-7xl font-display font-black leading-tight">
            From Prompt to <br />
            <GradientText size="section">Reality.</GradientText>
          </h2>
        </div>

        <div ref={frameRef} className="relative group">
          {/* Decorative Frame Elements */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
          
          <GlassCard className="relative p-2 rounded-[2rem] border-white/10 shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
            <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
              <img 
                ref={imageRef}
                src="https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2670&auto=format&fit=crop" 
                alt="GenMark Cinematic Result" 
                className="w-full h-full object-cover transform-gpu"
              />
              
              {/* Overlay Glass Layer */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12">
                <div className="max-w-xl">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-mono uppercase tracking-widest mb-4">
                    Synthesized Frame v4.0.2
                  </span>
                  <p className="text-lg md:text-xl text-foreground font-medium mb-2 italic">
                    "A futuristic cinematic vista of a 'Glass City' with floating organic structures..."
                  </p>
                  <p className="text-sm text-muted-foreground font-mono">
                    Output Fidelity: 98.4% • Render Time: 1.2s
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};
