import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "featured" | "orange";
  hoverable?: boolean;
}

export const GlassCard = React.memo(
  React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, variant = "default", hoverable = true, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn(
            "relative overflow-hidden rounded-xl transition-all duration-300",
            "bg-white/[0.03] backdrop-blur-md border border-white/[0.07] shadow-glass",
            hoverable &&
              "hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-glow hover:scale-[1.015]",
            variant === "featured" && "ring-1 ring-primary/30 shadow-glow-lg",
            variant === "orange" &&
              "ring-1 ring-secondary/30 shadow-glow-orange hover:border-secondary/30",
            className
          )}
          {...props}
        >
          {variant === "featured" && (
            <div className="absolute inset-0 pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.1),transparent)] before:bg-[length:200%_100%] before:animate-shimmer" />
          )}
          <div className="relative z-10">{children}</div>
        </div>
      );
    }
  )
);
GlassCard.displayName = "GlassCard";
