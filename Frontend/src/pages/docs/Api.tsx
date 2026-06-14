import { GradientText } from "@/components/shared/GradientText";
import { GlassCard } from "@/components/shared/GlassCard";
import { Link } from "react-router-dom";

export const Api = () => {
  return (
    <article className="prose prose-invert max-w-none">
      <div className="mb-12">
        <h1 className="text-5xl font-display font-black mb-4">API <GradientText>Reference Guide</GradientText></h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Integrate the GenMark generative endpoints into external scripts, automation flows, and corporate pipelines.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-display font-bold mb-4">Authentication</h2>
          <p className="text-muted-foreground leading-relaxed">
            All API endpoints require a valid JWT bearer token. Include the token in your headers:
          </p>
          <div className="bg-glass/5 border border-glass/10 rounded-xl p-4 font-mono text-xs">
             Authorization: Bearer &lt;access_token&gt;
          </div>
        </section>

        {/* Endpoints */}
        <section className="space-y-8">
           <h2 className="text-3xl font-display font-bold">Key REST Endpoints</h2>
           
           <div className="space-y-6">
              {/* Endpoint 1 */}
              <GlassCard className="p-6">
                 <div className="flex items-center gap-3 mb-3">
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono text-[10px] font-bold">POST</span>
                    <span className="font-mono text-sm">/api/generation/text-to-image</span>
                 </div>
                 <p className="text-xs text-muted-foreground mb-4">
                    Synthesize visual assets using text prompt instructions and aspect parameters.
                 </p>
                 <div className="bg-[#0b0c10] p-4 rounded-xl font-mono text-xs text-muted-foreground border border-glass/5">
                    <span className="text-foreground">Request Body:</span><br/>
                    &#123;<br/>
                    &nbsp;&nbsp;"prompt": <span className="text-secondary">"Futuristic shoes"</span>,<br/>
                    &nbsp;&nbsp;"aspect_ratio": <span className="text-secondary">"16:9"</span><br/>
                    &#125;
                 </div>
              </GlassCard>

              {/* Endpoint 2 */}
              <GlassCard className="p-6">
                 <div className="flex items-center gap-3 mb-3">
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono text-[10px] font-bold">POST</span>
                    <span className="font-mono text-sm">/api/generation/image-to-image</span>
                 </div>
                 <p className="text-xs text-muted-foreground mb-4">
                    Modify an existing image based on textual edits and strength parameters.
                 </p>
                 <div className="bg-[#0b0c10] p-4 rounded-xl font-mono text-xs text-muted-foreground border border-glass/5">
                    <span className="text-foreground">Request Body (Form Data):</span><br/>
                    &nbsp;&nbsp;"image": <span className="text-secondary">[File Binary]</span>,<br/>
                    &nbsp;&nbsp;"prompt": <span className="text-secondary">"Change background to a beach"</span>,<br/>
                    &nbsp;&nbsp;"strength": <span className="text-secondary">0.6</span>
                 </div>
              </GlassCard>
           </div>
        </section>
      </div>

      <div className="mt-16 border-t border-glass/5 pt-12 flex justify-between not-prose">
        <Link to="/docs/brand" className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1">
          ← Brand Alignment
        </Link>
        <Link to="/docs/security" className="text-sm font-bold text-primary hover:text-primary-light flex items-center gap-1">
          Security & Compliance →
        </Link>
      </div>
    </article>
  );
};
