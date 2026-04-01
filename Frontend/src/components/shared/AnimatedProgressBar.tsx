import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";

interface AnimatedProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  percentage: number;
}

export const AnimatedProgressBar = React.memo(({ label, percentage, className, ...props }: AnimatedProgressBarProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current || !containerRef.current) return;
    
    // Set the CSS variable for the target width
    barRef.current.style.setProperty("--progress-width", `${percentage}%`);

    const tween = gsap.fromTo(barRef.current, 
      { width: "0%" },
      { 
        width: `${percentage}%`,
        duration: 1.5, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          once: true,
        }
      }
    );

    return () => {
      tween.kill();
    };
  }, [percentage]);

  return (
    <div ref={containerRef} className={cn("flex flex-col gap-2 w-full", className)} {...props}>
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold text-foreground/90">{label}</span>
        <span className="font-mono text-primary">{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden border border-white/[0.05]">
        <div 
          ref={barRef}
          className="h-full bg-primary shadow-glow-sm rounded-full"
          style={{ width: "0%" }}
        />
      </div>
    </div>
  );
});
AnimatedProgressBar.displayName = "AnimatedProgressBar";
