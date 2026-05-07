import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import ASMRStaticBackground from "@/components/ui/asmr-background";
import NeuralBackground from "@/components/ui/flow-field-background";

export const PublicLayout = React.memo(() => {
  return (
    <div className="min-h-screen flex flex-col relative w-full overflow-x-hidden">

      {/* ── Multi-layer Atmospheric Background ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden bg-[#070b14]">
        {/* Layer 1: Indigo Neural Flow Field (Bottom) */}
        <div className="absolute inset-0 -z-30 opacity-100">
          <NeuralBackground 
            color="#a5b4fc" // Lighter Indigo
            trailOpacity={0.12} 
            speed={0.7}
            particleCount={600}
          />
        </div>

        {/* Layer 2: Reactive ASMR Dust (Top) */}
        <div className="absolute inset-0 -z-20">
          <ASMRStaticBackground />
        </div>
      </div>

      {/* Vignette – significantly lighter now */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: [
            "rgba(7, 11, 20, 0.22)",
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.12) 0%, transparent 70%)",
          ].join(", "),
        }}
      />

      <Navbar />

      <main className="flex-1 relative z-10 w-full" id="scroll-container">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
});
PublicLayout.displayName = "PublicLayout";
