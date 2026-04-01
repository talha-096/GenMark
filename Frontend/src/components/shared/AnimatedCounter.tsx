import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}

export const AnimatedCounter = React.memo(
  ({ target, suffix = "", prefix = "", className, decimals = 0 }: AnimatedCounterProps) => {
    const counterRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
      const el = counterRef.current;
      if (!el) return;

      const obj = { val: 0 };

      const tween = gsap.to(obj, {
        val: target,
        duration: 2.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
        onUpdate: () => {
          if (el) el.innerText = obj.val.toFixed(decimals);
        },
      });

      return () => {
        tween.kill();
      };
    }, [target, decimals]);

    return (
      <span className={cn("inline-flex items-center", className)}>
        {prefix && <span className="mr-1">{prefix}</span>}
        <span ref={counterRef}>0</span>
        {suffix && <span className="ml-[1px]">{suffix}</span>}
      </span>
    );
  }
);
AnimatedCounter.displayName = "AnimatedCounter";
