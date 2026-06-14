import { GradientText } from "@/components/shared/GradientText";
import { GlassCard } from "@/components/shared/GlassCard";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export const Copy = () => {
  return (
    <article className="prose prose-invert max-w-none">
      <div className="mb-12">
        <h1 className="text-5xl font-display font-black mb-4">Generative <GradientText>Copy Synthesis</GradientText></h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Produce high-converting marketing copy, email campaigns, and social hooks tuned to your brand's unique tone and character.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-display font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Text-to-Text workstation in GenMark translates basic content prompts into structured, formatted marketing assets. Rather than generating generic responses, GenMark automatically injects your Brand Kit parameters (e.g. target demographic, tone profiles, corporate constraints) directly into the model prompt context window.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-display font-bold mb-4">Key Configurations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
             <GlassCard className="p-6">
                <h3 className="font-bold text-lg mb-2 text-primary">Creative Temperature</h3>
                <p className="text-xs text-muted-foreground">
                   Configure output randomness. A low temperature produces consistent, highly structured copy suited for technical white papers. A high temperature enables creative brainstorming for social hooks.
                </p>
             </GlassCard>

             <GlassCard className="p-6">
                <h3 className="font-bold text-lg mb-2 text-secondary">Aesthetic Alignment</h3>
                <p className="text-xs text-muted-foreground">
                   Ensures generated text conforms to character limits, tone tags (e.g. bold, professional, educational), and excludes list keywords to maintain regulatory compliance.
                </p>
             </GlassCard>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-display font-bold mb-4">Supported Formats</h2>
          <ul className="space-y-3 pl-0">
             {[
               "**Social Media Hub**: Automatic generation of hooks, captions, and hashtag groupings for LinkedIn, X, and Instagram.",
               "**Email Campaigns**: Newsletter sequences, cold reach templates, and subject line variations.",
               "**SEO Copywriting**: Meta titles, schema descriptions, and optimized blog post outlines."
             ].map((item, idx) => (
                <li key={idx} className="flex gap-3 items-start text-muted-foreground">
                   <CheckCircle2 size={16} className="text-primary shrink-0 mt-1" />
                   <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
             ))}
          </ul>
        </section>
      </div>

      <div className="mt-16 border-t border-glass/5 pt-12 flex justify-between not-prose">
        <Link to="/docs/architecture" className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1">
          ← Architecture
        </Link>
        <Link to="/docs/visual" className="text-sm font-bold text-primary hover:text-primary-light flex items-center gap-1">
          Visual Synthesis →
        </Link>
      </div>
    </article>
  );
};
