import { GradientText } from "@/components/shared/GradientText";
import { GlassCard } from "@/components/shared/GlassCard";
import { Zap, Play, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Quickstart = () => {
  return (
    <article className="prose prose-invert max-w-none">
      <div className="mb-12">
        <h1 className="text-5xl font-display font-black mb-4">GenMark <GradientText>Quickstart</GradientText></h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Get up and running with the GenMark generative marketing platform in under 5 minutes. Learn how to configure your brand guidelines and trigger your first content generation.
        </p>
      </div>

      <div className="space-y-12">
        {/* Step 1 */}
        <section className="relative pl-12 border-l border-glass/10">
          <div className="absolute left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-mono text-sm font-bold text-primary-foreground shadow-glow-sm">
            1
          </div>
          <h2 className="text-2xl font-display font-bold mb-4">Initialize Your Account</h2>
          <p className="text-muted-foreground mb-4">
            First, create a generative workspace account. This establishes your dedicated tenant environment.
          </p>
          <Link to="/signup" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline">
            <span>Create Free Account</span>
            <ChevronRight size={14} />
          </Link>
        </section>

        {/* Step 2 */}
        <section className="relative pl-12 border-l border-glass/10">
          <div className="absolute left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-mono text-sm font-bold text-primary-foreground shadow-glow-sm">
            2
          </div>
          <h2 className="text-2xl font-display font-bold mb-4">Configure Your Brand Kit</h2>
          <p className="text-muted-foreground mb-4">
            Navigate to the **Brand Kit** workspace in the dashboard. Define your corporate hex colors, primary and secondary typographies, and upload official brand logos. GenMark’s validation engine uses this kit to automatically review every output.
          </p>
          <div className="bg-glass/5 border border-glass/10 rounded-xl p-4 font-mono text-xs max-w-md">
            <span className="text-muted-foreground">// Example configuration payload</span><br/>
            <span className="text-primary">colors</span>: &#123; primary: <span className="text-secondary">"#3B82F6"</span>, secondary: <span className="text-secondary">"#F97316"</span> &#125;
          </div>
        </section>

        {/* Step 3 */}
        <section className="relative pl-12 border-l border-glass/10">
          <div className="absolute left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-mono text-sm font-bold text-primary-foreground shadow-glow-sm">
            3
          </div>
          <h2 className="text-2xl font-display font-bold mb-4">Launch Your First Workstation</h2>
          <p className="text-muted-foreground">
            Head to the **Text-to-Image** workstation. Enter a creative prompt (e.g., *"Modern minimalist poster of a futuristic smartwatch"*), choose your layout aspect ratio, and click **Generate**.
          </p>
        </section>

        {/* Step 4 */}
        <section className="relative pl-12">
          <div className="absolute left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-mono text-sm font-bold text-primary-foreground shadow-glow-sm">
            4
          </div>
          <h2 className="text-2xl font-display font-bold mb-4">Edit and Stabilize</h2>
          <p className="text-muted-foreground">
            Use the built-in **Image Editor** to apply dual-layer text overlays, rotate visual components, sync typography with your brand kit, and fine-tune aesthetics before downloading or exporting.
          </p>
        </section>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 not-prose">
        <GlassCard className="p-6">
          <Play className="text-primary mb-3" size={24} />
          <h3 className="font-bold mb-1">Visual Workstations</h3>
          <p className="text-xs text-muted-foreground mb-4">Learn detailed structures of text-to-image and image-to-image models.</p>
          <Link to="/docs/visual" className="text-xs font-bold text-primary flex items-center gap-1">
            Explore Visual Docs <ChevronRight size={12} />
          </Link>
        </GlassCard>
        
        <GlassCard className="p-6">
          <Zap className="text-secondary mb-3" size={24} />
          <h3 className="font-bold mb-1">API Integrations</h3>
          <p className="text-xs text-muted-foreground mb-4">Integrate the GenMark generative endpoints directly into your backend.</p>
          <Link to="/docs/api" className="text-xs font-bold text-secondary flex items-center gap-1">
            View API Reference <ChevronRight size={12} />
          </Link>
        </GlassCard>
      </div>
    </article>
  );
};
