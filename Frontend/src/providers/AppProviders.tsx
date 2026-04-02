import { ReactNode, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { AppQueryProvider } from "./QueryProvider";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Toaster } from "sonner";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  useEffect(() => {
    const isSafe = import.meta.env.VITE_USE_MOCKS === 'true';
    console.log(`[GenMark] App initialized (Safe Mode: ${isSafe})`);
  }, []);

  return (
    <ErrorBoundary>
      <AppQueryProvider>
        <AuthProvider>
          <SmoothScrollProvider>
            <BrowserRouter>
              {children}
              <Toaster position="bottom-right" theme="dark" closeButton richColors />
            </BrowserRouter>
          </SmoothScrollProvider>
        </AuthProvider>
      </AppQueryProvider>
    </ErrorBoundary>
  );
};
