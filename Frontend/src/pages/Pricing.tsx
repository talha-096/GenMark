import { useState } from "react";
import { Check } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { GradientText } from "@/components/shared/GradientText";
import { cn } from "@/lib/utils";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      description: "For solo marketers and small brands.",
      price: isAnnual ? 49 : 59,
      popular: false,
      features: [
        "100 Neural Generations/mo",
        "50 Image Synthesis/mo",
        "1 Brand Kit",
        "Standard Export Formats",
        "Email Support"
      ]
    },
    {
      name: "Professional",
      description: "For growing teams needing scale.",
      price: isAnnual ? 149 : 179,
      popular: true,
      features: [
        "Unlimited Neural Generations",
        "500 Image Synthesis/mo",
        "10 Brand Kits",
        "API Access (1k req/mo)",
        "Priority 24/7 Support",
        "Advanced Analytics"
      ]
    },
    {
      name: "Enterprise",
      description: "For large agencies and corporations.",
      price: "Custom",
      popular: false,
      features: [
        "Unlimited Everything",
        "Unlimited Brand Kits",
        "Dedicated Account Manager",
        "Custom Neural Model Tuning",
        "SSO & Custom Security",
        "White-label Reports"
      ]
    }
  ];

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
          <GradientText>Simple Pricing.</GradientText><br />
          Infinite Value.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Choose the plan that fits your growth. Upgrade, downgrade, or cancel anytime.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <span className={cn("text-sm font-medium transition-colors", !isAnnual ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
          <button 
            type="button" 
            role="switch" 
            aria-checked={isAnnual} 
            onClick={() => setIsAnnual(!isAnnual)} 
            className="w-14 h-7 bg-surface/80 rounded-full border border-white/10 relative shadow-inner p-1 cursor-pointer transition-colors"
          >
            <div className={cn("w-5 h-5 bg-primary rounded-full shadow-md transition-transform duration-300", isAnnual ? "translate-x-7" : "translate-x-0")} />
          </button>
          <span className={cn("text-sm font-medium transition-colors flex items-center gap-2", isAnnual ? "text-foreground" : "text-muted-foreground")}>
            Annually <span className="text-[10px] font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-5xl mx-auto">
        {plans.map((plan) => (
          <GlassCard 
            key={plan.name} 
            variant={plan.popular ? "orange" : "default"}
            className={cn("p-8 relative flex flex-col h-full", plan.popular && "scale-105 shadow-glow-orange border-secondary/40")}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(135deg,hsl(var(--secondary)),hsl(var(--secondary-dark)))] text-primary-foreground text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-glow-md">
                Most Popular
              </div>
            )}
            
            <h3 className="text-2xl font-display font-medium mb-2">{plan.name}</h3>
            <p className="text-muted-foreground text-sm mb-6 pb-6 border-b border-white/10 h-16">{plan.description}</p>
            
            <div className="mb-8 font-display">
              {typeof plan.price === 'number' ? (
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground pb-1">/mo</span>
                </div>
              ) : (
                <div className="text-5xl font-bold">{plan.price}</div>
              )}
            </div>

            <button className={cn(
              "w-full py-4 rounded-xl font-semibold mb-8 transition-all hover:scale-[1.02] active:scale-[0.98]",
              plan.popular 
                ? "bg-[linear-gradient(135deg,hsl(var(--secondary)),hsl(var(--secondary-dark)))] text-primary-foreground shadow-glow-sm hover:shadow-glow-md" 
                : "bg-white/5 border border-white/10 text-foreground hover:bg-white/10"
            )}>
              {typeof plan.price === 'number' ? "Get Started" : "Contact Sales"}
            </button>

            <ul className="space-y-4 text-sm text-foreground/80 mt-auto">
              {plan.features.map(feat => (
                <li key={feat} className="flex gap-3">
                  <Check className={cn("w-5 h-5 shrink-0", plan.popular ? "text-secondary" : "text-primary")} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>
      
      {/* Fill empty space */}
      <div className="mt-24 max-w-5xl mx-auto flex gap-4 overflow-hidden rounded-2xl border border-white/10 bg-surface/30 px-8 py-6">
          <div className="flex-1">
              <h3 className="text-xl font-display font-medium text-foreground mb-2">Need a custom enterprise solution?</h3>
              <p className="text-muted-foreground text-sm">We provide tailored SLAs, dedicated nodes, and custom LLM tuning.</p>
          </div>
          <button className="self-center px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-sm font-medium transition-colors">
              Talk to Engineering
          </button>
      </div>
    </div>
  );
};

export { Pricing };
