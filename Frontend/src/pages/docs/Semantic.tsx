import { GradientText } from "@/components/shared/GradientText";
import { GlassCard } from "@/components/shared/GlassCard";
import { Star, Shield, Activity } from "lucide-react";
import { Link } from "react-router-dom";

export const Semantic = () => {
  return (
    <article className="prose prose-invert max-w-none">
      <div className="mb-12">
        <h1 className="text-5xl font-display font-black mb-4">Semantic <GradientText>Analysis Engine</GradientText></h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Parse raw marketing designs, extract underlying copywriting text, and audit asset compliance against your active Brand Kit rules.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-display font-bold mb-4">Introduction to Semantic Auditing</h2>
          <p className="text-muted-foreground leading-relaxed">
            GenMark’s Semantic Analysis pipeline parses raw visual layouts to extract copy and verify compliance. Uploading an asset triggers an OCR process that recovers embedded slogans, text titles, and descriptions, followed by a color layout check that audits hex colors against your brand’s active guidelines.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-display font-bold mb-4">Key Metrics Extracted</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
             <GlassCard className="p-6">
                <Star className="text-primary mb-3" size={24} />
                <h3 className="font-bold mb-1">OCR Copy Extraction</h3>
                <p className="text-xs text-muted-foreground">
                   Recovers exact text contents from banner images, posters, and product cards.
                </p>
             </GlassCard>

             <GlassCard className="p-6">
                <Activity className="text-secondary mb-3" size={24} />
                <h3 className="font-bold mb-1">Brand Compliance Score</h3>
                <p className="text-xs text-muted-foreground">
                   Evaluates layout, colors, and tone alignment, returning a percentage compliance score.
                </p>
             </GlassCard>

             <GlassCard className="p-6">
                <Shield className="text-green-400 mb-3" size={24} />
                <h3 className="font-bold mb-1">Copy Tone Check</h3>
                <p className="text-xs text-muted-foreground">
                   Analyzes whether the extracted copy aligns with corporate tone requirements (e.g. professional).
                </p>
             </GlassCard>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-display font-bold mb-4">Real-time Dashboard Reports</h2>
          <p className="text-muted-foreground leading-relaxed">
            All analysis results are populated directly in the workstation. Compliance feedback details exactly which parameters (such as secondary hex color deviations or layout imbalances) failed compliance checks, so creators can correct errors inside the editor before production.
          </p>
        </section>
      </div>

      <div className="mt-16 border-t border-glass/5 pt-12 flex justify-between not-prose">
        <Link to="/docs/visual" className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1">
          ← Visual Synthesis
        </Link>
        <Link to="/docs/brand" className="text-sm font-bold text-primary hover:text-primary-light flex items-center gap-1">
          Brand Alignment →
        </Link>
      </div>
    </article>
  );
};
