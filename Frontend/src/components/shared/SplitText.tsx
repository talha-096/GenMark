import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const SplitText = ({ text, className = "", delay = 0 }: SplitTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll(".char");
    
    const ctx = gsap.context(() => {
      gsap.fromTo(chars, 
        { 
          y: 100,
          opacity: 0,
          rotateX: -90
        }, 
        { 
          y: 0, 
          opacity: 1, 
          rotateX: 0,
          stagger: 0.02,
          duration: 1,
          ease: "expo.out",
          delay: delay,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [text, delay]);

  return (
    <div ref={containerRef} className={`overflow-hidden perspective-1000 ${className}`}>
      {text.split("").map((char, i) => (
        <span 
          key={i} 
          className="char inline-block"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};
