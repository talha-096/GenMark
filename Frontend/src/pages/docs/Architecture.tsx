import { GradientText } from "@/components/shared/GradientText";
import { GlassCard } from "@/components/shared/GlassCard";
import { Cpu, Server, Database, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export const Architecture = () => {
  return (
    <article className="prose prose-invert max-w-none">
      <div className="mb-12">
        <h1 className="text-5xl font-display font-black mb-4">Core <GradientText>Architecture</GradientText></h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Understanding the multi-tier design of the GenMark marketing platform, built for scalability, reliability, and security.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-display font-bold mb-4">Architectural Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            GenMark employs a decoupled architecture separating the presentation layer, the API orchestration gateway, and the heavy deep learning inference servers. This ensures frontend operations remain completely responsive even during high-compute visual generation cycles.
          </p>
        </section>

        {/* Technical Layers */}
        <section className="not-prose grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <Cpu className="text-primary mb-3" size={24} />
            <h3 className="font-bold text-lg mb-1">Presentation Layer</h3>
            <p className="text-xs text-muted-foreground">
              Built using React, TailwindCSS, Vite, and GSAP. Handles real-time image editing, workstation controls, and interactive brand configurations.
            </p>
          </GlassCard>
          
          <GlassCard className="p-6">
            <Server className="text-secondary mb-3" size={24} />
            <h3 className="font-bold text-lg mb-1">API Orchestration</h3>
            <p className="text-xs text-muted-foreground">
              A Flask-based API Gateway that coordinates authentication, rate limiting, brand compliance scoring, and project state operations.
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <Database className="text-green-400 mb-3" size={24} />
            <h3 className="font-bold text-lg mb-1">Storage & Inference</h3>
            <p className="text-xs text-muted-foreground">
              Stores raw metadata, user credentials, and brand assets. Connects to the PyTorch diffusion and LLM pipelines.
            </p>
          </GlassCard>
        </section>

        <section>
          <h2 className="text-3xl font-display font-bold mb-4">Authentication Flow</h2>
          <p className="text-muted-foreground leading-relaxed">
            GenMark utilizes state-of-the-art token security. When a user requests access, credentials are validated, and a stateless JSON Web Token (JWT) is signed and returned. This token is stored in the client browser storage and verified via HTTP Authorization headers for all subsequently accessed REST endpoints.
          </p>
          <div className="bg-glass/5 border border-glass/10 rounded-2xl p-6 flex items-center gap-3">
             <Shield className="text-primary shrink-0" size={24} />
             <div className="text-sm">
                <span className="font-bold text-foreground">Secure Token Lifecycle:</span> Session validity is set to 24 hours. A built-in profile route automatically refreshes credentials during active user interactions.
             </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-display font-bold mb-4">Data Persistence & Uploads</h2>
          <p className="text-muted-foreground leading-relaxed">
            All user-uploaded brand logo files and generated visual posters are securely handled. The backend employs a fallback framework: if a cloud-based storage system like AWS S3 is unavailable, the application switches to local storage securely mounted in the system.
          </p>
        </section>
      </div>

      <div className="mt-16 border-t border-glass/5 pt-12 flex justify-between not-prose">
        <Link to="/docs/quickstart" className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1">
          ← Quickstart
        </Link>
        <Link to="/docs/copy" className="text-sm font-bold text-primary hover:text-primary-light flex items-center gap-1">
          Generative Copy →
        </Link>
      </div>
    </article>
  );
};
