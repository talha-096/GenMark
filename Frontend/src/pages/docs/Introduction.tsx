import { GradientText } from "@/components/shared/GradientText";
import { GlassCard } from "@/components/shared/GlassCard";
import { BookOpen, Zap, Shield, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Introduction = () => {
  return (
    <article className="prose prose-invert max-w-none">
      <div className="mb-12">
        <h1 className="text-5xl font-display font-black mb-4">Introduction to <GradientText>GenMark</GradientText></h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Welcome to the documentation for GenMark, the ultimate AI-powered content ecosystem for enterprise marketing teams. 
          GenMark is designed to be the "Neural Brain" of your content production pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 not-prose">
        <GlassCard className="p-8 group hover:border-primary/40 transition-all">
          <BookOpen className="text-primary mb-4" size={32} />
          <h3 className="text-xl font-display font-bold mb-2">Core Philosophy</h3>
          <p className="text-sm text-muted-foreground mb-6">Learn how GenMark maintains absolute brand consistency across every neural synthesis.</p>
          <Link to="/docs/philosophy" className="text-primary text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
             <span>Read Philosophy</span>
             <ChevronRight size={14} />
          </Link>
        </GlassCard>
        
        <GlassCard className="p-8 group hover:border-secondary/40 transition-all">
          <Zap className="text-secondary mb-4" size={32} />
          <h3 className="text-xl font-display font-bold mb-2">Platform Velocity</h3>
          <p className="text-sm text-muted-foreground mb-6">Discover the high-velocity architecture powering our real-time generation engine.</p>
          <Link to="/docs/quickstart" className="text-secondary text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
             <span>Start Quickstart</span>
             <ChevronRight size={14} />
          </Link>
        </GlassCard>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-display font-bold">The Problem</h2>
        <p className="text-muted-foreground leading-relaxed">
          In a world of fragmented AI tools, maintaining a unified brand voice is nearly impossible. Modern marketing teams struggle with 
          content velocity vs. brand consistency. GenMark solves this by integrating a multi-modal neural engine that observes, 
          learns, and synthesizes your brand's unique semantic signature.
        </p>
        
        <div className="p-8 rounded-3xl bg-surface/30 border border-white/5 backdrop-blur-md">
           <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <Shield className="text-green-500" size={24} />
              Enterprise Security First
           </h3>
           <p className="text-sm text-muted-foreground leading-relaxed italic">
              "GenMark isn't just about generation; it's about governed creativity. Every asset produced is strictly validated against 
              your brand guidelines and SOC 2 security compliance protocols before it ever touches your pipeline."
           </p>
        </div>
      </div>

      <div className="mt-16 space-y-8">
        <h2 className="text-3xl font-display font-bold">Key Capabilities</h2>
        <div className="space-y-4 not-prose">
           {[
              { title: "Neural Copy Synthesis", desc: "Understanding the nuance of your tone, from professional white papers to playful social media hooks." },
              { title: "Visual Brand Engineering", desc: "Generating stunning visuals that not only look great but feel like they were made by your in-house design team." },
              { title: "Semantic Analysis", desc: "Deeply auditing your existing assets to extract and document your brand's visual and textual language." },
           ].map((cap, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-all">
                 <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                 </div>
                 <div>
                    <h4 className="font-bold mb-1">{cap.title}</h4>
                    <p className="text-sm text-muted-foreground leading-snug">{cap.desc}</p>
                 </div>
              </div>
           ))}
        </div>
      </div>

      <div className="mt-20 p-10 rounded-3xl bg-[linear-gradient(135deg,rgba(59,130,246,0.1),rgba(168,85,247,0.1))] border border-white/10 text-center not-prose">
         <h3 className="text-2xl font-display font-bold mb-4">Ready to build the future?</h3>
         <div className="flex justify-center gap-4">
            <Link to="/docs/quickstart" className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:scale-105 transition-all">
               Quickstart Guide
            </Link>
            <Link to="/signup" className="px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold">
               Get Started Free
            </Link>
         </div>
      </div>
    </article>
  );
};
