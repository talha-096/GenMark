import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && allowedRoles && user) {
      const userRole = user.plan || user.subscription_plan || "free";
      if (!allowedRoles.includes(userRole)) {
        toast.error("Access Restricted: This feature requires a higher tier plan.");
      }
    }
  }, [isLoading, isAuthenticated, allowedRoles, user]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Basic RBAC check
  if (allowedRoles && user) {
    const userRole = user.plan || user.subscription_plan || "free";
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};
