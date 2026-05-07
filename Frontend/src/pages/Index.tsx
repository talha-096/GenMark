import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GradientText } from "@/components/shared/GradientText";
import { GlassCard } from "@/components/shared/GlassCard";
import { TextMarquee } from "@/components/shared/TextMarquee";

import { AgentCanvasFrame } from "@/components/home/AgentCanvasFrame";
import { CreativeTransformation } from "@/components/home/CreativeTransformation";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Zap,
  ArrowUpRight
} from "lucide-react";


export const Index = () => {

  const scene1Ref = useRef<HTMLElement>(null);
  const scene2Ref = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initial load animations
    gsap.from(".hero-content > *", {
      y: 50,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: "power4.out"
    });

    // Simple interaction with 3D background on scroll
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: () => {
        // Method doesn't exist, we skip
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen text-foreground selection:bg-primary/30 selection:text-white overflow-x-hidden">


      {/* SCENE 1: The Vision (Landing) */}
      <section ref={scene1Ref} className="relative min-h-screen w-full flex items-center justify-center pt-20 overflow-hidden px-6">
        <div className="max-w-6xl mx-auto w-full text-center mt-[5vh] z-10 relative">
          <div className="hero-content">
            <div className="font-mono text-xs tracking-[0.4em] text-primary/80 mb-8 uppercase animate-pulse-glow">Intelligence Re-imagined</div>
            <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black font-display tracking-tighter leading-none mb-4 drop-shadow-2xl">
              <GradientText size="hero" className="block hover:scale-105 transition-transform duration-700 cursor-default">GenMark</GradientText>
            </h1>
            <h2 className="text-4xl md:text-6xl font-display font-light tracking-tight text-foreground/80 mb-12">
              Creative <span className="text-primary font-medium italic">Efficiency.</span>
            </h2>
            <p className="text-xl md:text-3xl text-foreground font-medium max-w-4xl mx-auto mb-8 leading-tight">
              Scale your content production without compromising your brand identity.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              GenMark integrates state-of-the-art AI with modern marketing workflows to automate the generation, analysis, and management of high-impact visual assets.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
              <Link to="/signup" className="group w-full sm:w-auto bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary-dark)))] text-primary-foreground font-semibold px-10 py-5 text-lg rounded-full shadow-glow-xl hover:scale-105 transition-all flex items-center gap-3">
                <span>Try the Engine</span>
                <Zap size={20} className="group-hover:fill-current" />
              </Link>
              <Link to="/features" className="w-full sm:w-auto bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] text-foreground font-semibold px-10 py-5 text-lg rounded-full backdrop-blur-md transition-all">
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TextMarquee />
      <CreativeTransformation />

      {/* SCENE 2: The SRS Vision / Philosophy */}
      <section ref={scene2Ref} className="relative min-h-screen py-32 px-6 flex items-center justify-center">
        <div className="max-w-5xl mx-auto w-full z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="font-mono text-sm tracking-widest text-primary mb-6">THE PHILOSOPHY</div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
                Consolidating the <GradientText>Fragmented Marketing Stack.</GradientText>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Traditional design tools and manual workflows often require substantial time and expertise, resulting in inconsistent branding and reduced creative productivity.
                </p>
                <p>
                  <span className="text-foreground font-semibold">GenMark</span> solves this by providing a centralized platform to create, store, and organize marketing content through intelligent automation.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {[
                { title: "Increased Productivity", desc: "Automate visual content creation through AI-driven text-to-image synthesis." },
                { title: "Absolute Consistency", desc: "Every asset is analyzed against your brand kit for perfect alignment." },
                { title: "Data-Driven Decisions", desc: "View real-time analytics to understand creative performance." }
              ].map((value, i) => (
                <GlassCard key={i} className="p-8 group hover:bg-white/5 transition-colors">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-primary" />
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AgentCanvasFrame />

      {/* SCENE 3: The Unified Ecosystem Bridge */}
      <section className="relative min-h-screen py-32 px-6 flex items-center justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto w-full z-10 relative">
          <div className="text-center mb-16">
            <div className="font-mono text-sm tracking-widest text-primary mb-4">THE ECOSYSTEM</div>
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-8">One Neural Engine. <br/><GradientText>Infinite Possibilities.</GradientText></h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              GenMark's architecture is built of specialized layers, each dedicated to a critical aspect of your marketing workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "The Engine", 
                path: "/engine", 
                desc: "The core neural processing unit for copy and visual synthesis.",
                tags: ["LLM", "Diffusion", "Motion"]
              },
              { 
                title: "Enterprise Grid", 
                path: "/enterprise", 
                desc: "SOC 2 infrastructure designed for massive scale and security.",
                tags: ["Scalability", "Security", "Team"]
              },
              { 
                title: "Roadmap", 
                path: "/roadmap", 
                desc: "Our vision for the future of decentralized creative intelligence.",
                tags: ["Web3", "Agents", "Future"]
              }
            ].map((node, i) => (
              <GlassCard key={i} className="p-10 flex flex-col justify-between group hover:bg-white/5 transition-all">
                <div>
                  <h3 className="text-3xl font-display font-bold mb-4 group-hover:text-primary transition-colors">{node.title}</h3>
                  <p className="text-muted-foreground mb-8 text-lg">{node.desc}</p>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap gap-2">
                    {node.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono">{tag}</span>
                    ))}
                  </div>
                  <Link to={node.path} className="flex items-center gap-2 font-bold group-hover:gap-4 transition-all">
                    Explore Layer <ArrowUpRight size={20} />
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-48 px-6 text-center border-t border-white/5">
        <div className="max-w-4xl mx-auto z-10 relative">
          <h2 className="text-5xl md:text-8xl font-display font-black mb-12 leading-tight">
            Ready to <GradientText>Scale?</GradientText>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link to="/signup" className="group w-full sm:w-auto bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary-dark)))] text-primary-foreground font-black px-12 py-6 text-xl rounded-full shadow-glow-xl hover:scale-105 transition-all flex items-center justify-center gap-3">
              <span>GET STARTED NOW</span>
              <Zap size={24} />
            </Link>
            <Link to="/login" className="px-12 py-6 font-bold text-xl border border-white/20 rounded-full hover:bg-white/5 transition-all">
              MEMBER LOGIN
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
};
