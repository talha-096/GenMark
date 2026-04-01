import { SplitText } from "@/components/shared/SplitText";
import { GradientText } from "@/components/shared/GradientText";
import { GlassCard } from "@/components/shared/GlassCard";
import { BrainCircuit, Globe, ArrowRight } from "lucide-react";

export const About = () => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="mb-24 text-center">
        <div className="font-mono text-sm tracking-widest text-primary mb-6">OUR MISSION</div>
        <SplitText 
          text="The future of marketing is completely autonomous."
          className="text-5xl md:text-7xl font-display font-bold leading-tight mb-8"
        />
        <p className="text-xl md:text-2xl text-muted-foreground mt-8 max-w-2xl mx-auto">
          We are engineers, designers, and marketers building the neural engine that powers modern brands.
        </p>
      </div>

      <div className="space-y-16 text-lg text-foreground/80 leading-relaxed max-w-3xl mx-auto">
        <div className="prose prose-invert prose-lg">
          <p>
            For too long, enterprise marketing has been trapped in a cycle of disjointed tools, misaligned brand guidelines, and slow production timelines. Marketers spend more time managing logistics than crafting strategy.
          </p>
          <p>
            At GenMark, we asked a fundamental question: <strong>What if the friction simply disappeared?</strong>
          </p>
          <p>
            What if you could hold a conversation with a neural network that implicitly understood your brand voice, possessed your color palettes, and could generate both the copy and the visuals required for a global campaign in seconds?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
          <GlassCard className="p-8">
            <BrainCircuit size={32} className="text-primary mb-6" />
            <h3 className="text-2xl font-display font-medium mb-3">Neural native.</h3>
            <p className="text-muted-foreground">Every layer of the GenMark stack is built around generative multi-modal models. It's not a feature tacked onto legacy software; it is the foundation.</p>
          </GlassCard>
          
          <GlassCard variant="orange" className="p-8">
            <Globe size={32} className="text-secondary mb-6" />
            <h3 className="text-2xl font-display font-medium mb-3">Global scale.</h3>
            <p className="text-muted-foreground">Operating from data centers securely isolated to regions you select. Compliance and privacy parameters strictly enforced.</p>
          </GlassCard>
        </div>

        <div className="prose prose-invert prose-lg">
          <h2 className="text-3xl font-display font-bold text-foreground">Our Philosophy</h2>
          <p>
            Technology shouldn't replace creativity; it should elevate it. By automating the repetitive, manual labor of content permutation and formatting, GenMark frees creative professionals to focus on what humans do best: <em>strategy, emotion, and connection.</em>
          </p>
          <p>
            We believe the <GradientText>best interfaces get out of the way</GradientText>. That's why GenMark feels less like a traditional dashboard and more like a fluid conversation with a deeply intelligent partner.
          </p>
        </div>

        <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="font-mono text-sm tracking-widest text-primary mb-2">JOIN THE TEAM</div>
              <h3 className="text-2xl font-display font-bold">We are hiring exceptional talent.</h3>
              <p className="text-muted-foreground mt-2">Remote-first. Mission-driven. AI-obsessed.</p>
            </div>
            <button className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-medium transition-all group shrink-0">
               View Open Roles
               <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

      </div>
    </div>
  );
};
