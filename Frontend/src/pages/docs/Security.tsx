import { GradientText } from "@/components/shared/GradientText";
import { GlassCard } from "@/components/shared/GlassCard";
import { Lock, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export const Security = () => {
  return (
    <article className="prose prose-invert max-w-none">
      <div className="mb-12">
        <h1 className="text-5xl font-display font-black mb-4">Security & <GradientText>Compliance</GradientText></h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Learn how GenMark implements SOC 2 guidelines, credentials protection, data isolation, and rate limit protections to secure your workspace.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-display font-bold mb-4">Data Security Framework</h2>
          <p className="text-muted-foreground leading-relaxed">
            GenMark employs rigorous security practices across every operational layer:
            1. **JSON Web Token (JWT)**: Client connections are authenticated using stateless bearer tokens. These tokens are signed cryptographically with a secret server key and verified on every resource fetch.
            2. **Bcrypt Password Salting**: User passwords are encrypted using Bcrypt prior to storage in the database, protecting profiles against unauthorized access or breaches.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-display font-bold mb-4">API Protection & Rate Limiting</h2>
          <p className="text-muted-foreground leading-relaxed">
            To prevent abuse, denial-of-service, or compute spikes, GenMark runs a Redis/Memory-based rate limiting utility. Authentication and generation routes are restricted at the gateway:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
             <GlassCard className="p-6">
                <Lock className="text-primary mb-3" size={24} />
                <h3 className="font-bold text-lg mb-1">Auth Endpoints</h3>
                <p className="text-xs text-muted-foreground">
                   `/api/auth/register` is limited to **5 requests per minute**; `/api/auth/login` is limited to **10 requests per minute** per IP address.
                </p>
             </GlassCard>

             <GlassCard className="p-6">
                <EyeOff className="text-secondary mb-3" size={24} />
                <h3 className="font-bold text-lg mb-1">Generation Endpoints</h3>
                <p className="text-xs text-muted-foreground">
                   Heavy GPU resource actions (like text-to-image synthesis) include concurrency limits to ensure equitable allocation of server resources.
                </p>
             </GlassCard>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-display font-bold mb-4">Tenant Isolation</h2>
          <p className="text-muted-foreground leading-relaxed">
            All user data, generated visual files, brand configs, and history items are logically isolated. Database lookups are structured around strict owner IDs derived directly from authenticated JWT identities, making cross-tenant data leaks impossible.
          </p>
        </section>
      </div>

      <div className="mt-16 border-t border-glass/5 pt-12 flex justify-between not-prose">
        <Link to="/docs/api" className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1">
          ← API Reference
        </Link>
        <Link to="/docs" className="text-sm font-bold text-primary hover:text-primary-light flex items-center gap-1">
          Introduction Docs →
        </Link>
      </div>
    </article>
  );
};
