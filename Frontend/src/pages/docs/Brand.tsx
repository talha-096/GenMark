import { GradientText } from "@/components/shared/GradientText";
import { Sliders, Palette, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export const Brand = () => {
  return (
    <article className="prose prose-invert max-w-none">
      <div className="mb-12">
        <h1 className="text-5xl font-display font-black mb-4">Brand <GradientText>Alignment & Kits</GradientText></h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Establish corporate design systems, color schemes, and textual tone guidelines that govern every asset generated inside GenMark.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-display font-bold mb-4">The Brand Kit Core</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Brand Kit is the central configuration store for your workspace guidelines. By declaring these variables, you train the generative workstations to automatically tailor outputs to your company’s brand standards.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-display font-bold mb-4">Configuration Properties</h2>
          
          <div className="space-y-6">
             <div className="flex gap-4 p-4 bg-glass/5 border border-glass/10 rounded-xl">
                <Palette className="text-primary shrink-0" size={24} />
                <div>
                   <h3 className="font-bold mb-1">Color Palette Mapping</h3>
                   <p className="text-sm text-muted-foreground">
                      Define primary, secondary, and accent colors in hexadecimal code format. These hex values are synced to the Image Editor’s color pickers.
                   </p>
                </div>
             </div>

             <div className="flex gap-4 p-4 bg-glass/5 border border-glass/10 rounded-xl">
                <Sliders className="text-secondary shrink-0" size={24} />
                <div>
                   <h3 className="font-bold mb-1">Tone & Voice Cues</h3>
                   <p className="text-sm text-muted-foreground">
                      Define core characteristics (e.g. *"professional"*, *"bold"*, *"conversational"*) and a short company summary to steer textual generations automatically.
                   </p>
                </div>
             </div>

             <div className="flex gap-4 p-4 bg-glass/5 border border-glass/10 rounded-xl">
                <Shield className="text-green-400 shrink-0" size={24} />
                <div>
                   <h3 className="font-bold mb-1">Design System Constraints</h3>
                   <p className="text-sm text-muted-foreground">
                      Upload corporate logo marks and lock typographies. This enforces layout bounds during visual text overlay composition.
                   </p>
                </div>
             </div>
          </div>
        </section>
      </div>

      <div className="mt-16 border-t border-glass/5 pt-12 flex justify-between not-prose">
        <Link to="/docs/semantic" className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1">
          ← Semantic Analysis
        </Link>
        <Link to="/docs/api" className="text-sm font-bold text-primary hover:text-primary-light flex items-center gap-1">
          API Reference →
        </Link>
      </div>
    </article>
  );
};
