import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "featured" | "orange" | "subtle";
  hoverable?: boolean;
  glow?: boolean;
}

export const GlassCard = React.memo(
  React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, variant = "default", hoverable = true, glow = false, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn(
            // Base
            "relative overflow-hidden rounded-2xl transition-all duration-300",
            // Glass base
            "bg-white/[0.025] backdrop-blur-md",
            "border border-white/[0.06]",
            "shadow-[0_4px_24px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.04)]",
            // Hoverable
            hoverable && [
              "hover:bg-white/[0.05]",
              "hover:border-white/[0.12]",
              "hover:shadow-[0_8px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]",
              "hover:-translate-y-0.5",
              "cursor-default",
            ],
            // Variants
            variant === "featured" && [
              "border-primary/20",
              "shadow-[0_4px_24px_rgba(0,0,0,0.25),0_0_40px_rgba(59,130,246,0.08),inset_0_1px_0_rgba(255,255,255,0.06)]",
              hoverable && "hover:border-primary/35 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_60px_rgba(59,130,246,0.12)]",
            ],
            variant === "orange" && [
              "border-orange-500/15",
              "shadow-[0_4px_24px_rgba(0,0,0,0.25),0_0_40px_rgba(249,115,22,0.06),inset_0_1px_0_rgba(255,255,255,0.04)]",
              hoverable && "hover:border-orange-500/30",
            ],
            variant === "subtle" && [
              "bg-transparent border-white/[0.04]",
              "shadow-none",
              hoverable && "hover:bg-white/[0.03]",
            ],
            // Extra glow
            glow && "shadow-[0_0_0_1px_rgba(59,130,246,0.15),0_0_40px_rgba(59,130,246,0.1)]",
            className
          )}
          {...props}
        >
          {/* Featured shimmer sweep */}
          {variant === "featured" && (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent" />
            </div>
          )}

          {/* Top highlight line */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
          />

          <div className="relative z-10">{children}</div>
        </div>
      );
    }
  )
);
GlassCard.displayName = "GlassCard";
