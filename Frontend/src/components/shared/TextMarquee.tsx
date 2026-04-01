import React from "react";
import { cn } from "@/lib/utils";

const MARQUEE_ITEMS = [
  "GenMark",
  "Neural Copy Engine",
  "Visual Synthesis Suite",
  "GenMark",
  "Semantic Vision Analyst",
  "10K+ Active Marketers",
  "GenMark",
  "Enterprise Ready",
  "99.9% Uptime",
  "SOC 2 Compliant",
  "GenMark",
  "Multi-Language",
];

export const TextMarquee = React.memo(({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "w-full overflow-hidden flex bg-surface-raised border-y border-white/[0.05] py-3",
        className
      )}
    >
      <div className="flex whitespace-nowrap animate-marquee hover:![animation-play-state:paused] w-max">
        {/* Repeat enough times to fill screen and loop seamlessly */}
        {[...Array(3)].map((_, groupIndex) => (
          <div key={groupIndex} className="flex items-center shrink-0">
            {MARQUEE_ITEMS.map((item, i) => (
              <React.Fragment key={i}>
                <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest px-8">
                  {item}
                </span>
                <span className="text-primary/40">•</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});
TextMarquee.displayName = "TextMarquee";
