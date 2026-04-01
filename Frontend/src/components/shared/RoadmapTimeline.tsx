import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { GlassCard } from "./GlassCard";

interface TimelineNode {
  date: string;
  title: string;
  description: string;
}

const NODES: TimelineNode[] = [
  { date: "Q2 2026", title: "Cinematic Motion Engine", description: "AI-generated video content from text prompts." },
  { date: "Q3 2026", title: "Neural Asset Refiner", description: "Iterate on existing designs with AI-guided refinement." },
  { date: "2027", title: "Predictive Market Intelligence", description: "Real-time audience and trend analysis built in." },
  { date: "2028", title: "Fully Autonomous", description: "End-to-end autonomous campaign generation and optimization." }
];

export const RoadmapTimeline = React.memo(({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return;

    // Line drawing animation
    const pathLength = lineRef.current.getTotalLength();
    gsap.set(lineRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        end: "bottom center",
        once: true,
      }
    });

    tl.to(lineRef.current, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" });

    // Node popping animation
    nodesRef.current.forEach((node) => {
      if (node) {
        gsap.fromTo(node, 
          { scale: 0.5, opacity: 0 },
          { 
            scale: 1, 
            opacity: 1, 
            duration: 0.8, 
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: node,
              start: "top 85%",
              once: true,
            }
          }
        );
      }
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-5xl mx-auto py-16 px-4 md:px-0", className)}>
      <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 hidden md:block">
        <svg fill="none" className="w-full h-full preserve-3d" preserveAspectRatio="none">
          <path 
            ref={lineRef}
            d="M 0 2 L 10000 2" 
            stroke="hsl(var(--primary) / 0.5)" 
            strokeWidth="2" 
            strokeDasharray="4 4"
          />
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        {NODES.map((node, i) => (
          <div 
            key={i} 
            ref={el => nodesRef.current[i] = el!}
            className="flex flex-col items-center text-center md:text-left md:items-start group"
          >
            <div className="md:mx-auto w-6 h-6 rounded-full bg-surface border-2 border-primary shadow-glow mb-6 relative">
              <div className="absolute inset-0 bg-primary rounded-full animate-pulse-glow" />
            </div>
            <GlassCard className="p-6 w-full transform transition-transform group-hover:-translate-y-2">
              <div className="text-sm font-mono text-primary mb-2">{node.date}</div>
              <h4 className="text-lg font-display font-semibold text-foreground mb-3">{node.title}</h4>
              <p className="text-sm text-muted-foreground">{node.description}</p>
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  );
});
RoadmapTimeline.displayName = "RoadmapTimeline";
