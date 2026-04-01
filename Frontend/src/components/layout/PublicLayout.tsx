import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { ModelsCanvas } from "../models/ModelsCanvas";

export const PublicLayout = React.memo(() => {
  return (
    <div className="min-h-screen flex flex-col relative w-full overflow-hidden">
      <Navbar />
      <ModelsCanvas />
      <main className="flex-1 relative z-10 w-full" id="scroll-container">
        <Outlet />
      </main>
      <footer className="relative z-10 border-t border-white/[0.05] bg-surface/50 backdrop-blur-md py-12 mt-24 text-center text-muted-foreground text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <p>© {new Date().getFullYear()} GenMark. The ultimate AI-Powered Content Ecosystem.</p>
        </div>
      </footer>
    </div>
  );
});
PublicLayout.displayName = "PublicLayout";
