import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

export const UserNav = React.memo(() => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Link
        to="/login"
        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-medium leading-none">{user.name}</span>
          <span className="text-xs text-muted-foreground mt-1 bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/10">
            {user.plan} Plan
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-glow-sm">
          <span className="text-sm font-semibold text-primary">{user.name.charAt(0)}</span>
        </div>
      </div>
      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors ml-2"
      >
        Log out
      </button>
    </div>
  );
});
UserNav.displayName = "UserNav";
