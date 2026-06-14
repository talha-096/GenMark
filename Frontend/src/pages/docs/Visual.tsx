import { GradientText } from "@/components/shared/GradientText";
import { GlassCard } from "@/components/shared/GlassCard";
import { Settings, Sliders } from "lucide-react";
import { Link } from "react-router-dom";

export const Visual = () => {
  return (
    <article className="prose prose-invert max-w-none">
      <div className="mb-12">
        <h1 className="text-5xl font-display font-black mb-4">Visual <GradientText>Synthesis & Editing</GradientText></h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Produce high-impact brand posters, product mocks, and social creatives using Stable Diffusion model configurations and the GenMark Professional Editor.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-display font-bold mb-4">Generative Workstations</h2>
          <p className="text-muted-foreground leading-relaxed">
            GenMark hosts two main pipelines for image synthesis:
            1. **Text-to-Image**: Convert textual descriptions and aspect specifications into complete high-resolution visual layouts.
            2. **Image-to-Image**: Upload an existing image, specify modification instructions (e.g. *"change background to modern office space, keep product mockup"*), and adjust strength parameters to generate targeted edits.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-display font-bold mb-4">The Professional Editor</h2>
          <p className="text-muted-foreground leading-relaxed">
            Every generated visual asset can be opened in the GenMark Image Editor to prepare it for deployment.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
             <GlassCard className="p-6">
                <Sliders className="text-primary mb-3" size={24} />
                <h3 className="font-bold text-lg mb-1">Overlay Control</h3>
                <p className="text-xs text-muted-foreground">
                   Apply dual-layer text blocks (titles and taglines) directly onto the canvas. Set positions, font sizes, text alignments, and color codes dynamically.
                </p>
             </GlassCard>

             <GlassCard className="p-6">
                <Settings className="text-secondary mb-3" size={24} />
                <h3 className="font-bold text-lg mb-1">Canvas Modifiers</h3>
                <p className="text-xs text-muted-foreground">
                   Apply blur layers, rotate visual components, adjust contrast ratios, and sync text color schemes automatically with your active brand kit configuration.
                </p>
             </GlassCard>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-display font-bold mb-4">Best Practices for Prompts</h2>
          <p className="text-muted-foreground leading-relaxed">
            To get the best visual alignment, structure your prompts using the following pattern:
          </p>
          <div className="bg-glass/5 border border-glass/10 rounded-xl p-4 font-mono text-xs">
             <span className="text-primary">[Subject Details]</span>, <span className="text-secondary">[Setting & Mood]</span>, <span className="text-green-400">[Styling Cues (e.g. minimalistic, high key, professional photo)]</span>
          </div>
        </section>
      </div>

      <div className="mt-16 border-t border-glass/5 pt-12 flex justify-between not-prose">
        <Link to="/docs/copy" className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1">
          ← Generative Copy
        </Link>
        <Link to="/docs/semantic" className="text-sm font-bold text-primary hover:text-primary-light flex items-center gap-1">
          Semantic Analysis →
        </Link>
      </div>
    </article>
  );
};
