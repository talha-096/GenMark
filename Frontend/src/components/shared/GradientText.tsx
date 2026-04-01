import React from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "neural";
  size?: "hero" | "section" | "card" | "body";
}

export const GradientText = React.memo(
  React.forwardRef<HTMLSpanElement, GradientTextProps>(
    ({ className, variant = "primary", size = "body", children, ...props }, ref) => {
      return (
        <span
          ref={ref}
          className={cn(
            variant === "primary" ? "gradient-text" : "gradient-text-neural",
            size === "hero" && "text-5xl md:text-7xl lg:text-9xl",
            size === "section" && "text-3xl md:text-5xl lg:text-6xl",
            size === "card" && "text-xl md:text-2xl lg:text-3xl",
            className
          )}
          {...props}
        >
          {children}
        </span>
      );
    }
  )
);
GradientText.displayName = "GradientText";
