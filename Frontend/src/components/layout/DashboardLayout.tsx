import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { UserNav } from "./UserNav";

export const DashboardLayout = React.memo(() => {
  const location = useLocation();

  // Simple breadcrumb logic
  const breadcrumbName = location.pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard";

  return (
    <div className="min-h-screen flex w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />
        
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/[0.05] bg-background/60 backdrop-blur-xl relative z-10 shrink-0">
          <h1 className="text-xl font-display font-semibold capitalize text-foreground/90">
            {breadcrumbName}
          </h1>
          <UserNav />
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 relative z-10 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
});
DashboardLayout.displayName = "DashboardLayout";
