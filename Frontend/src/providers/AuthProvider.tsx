import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  subscription_plan?: string;
  plan?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (credentials: Record<string, unknown>) => Promise<void>;
  register: (data: Record<string, unknown>) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth on load
  useEffect(() => {
    let mounted = true;
    
    // Safety timeout: Ensure the app never stays loading forever (max 2s wait)
    const timeout = setTimeout(() => {
      if (mounted) {
        setIsLoading(false);
        console.warn("Auth initialization timed out, proceeding...");
      }
    }, 2000);

    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await apiClient.get<User>('/api/auth/profile');
          if (mounted) setUser(userData);
        } catch (error) {
          console.error("Session restoration failed:", error);
          localStorage.removeItem('access_token');
        }
      }
      if (mounted) {
        setIsLoading(false);
        clearTimeout(timeout);
      }
    };

    initAuth();
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const login = async (credentials: Record<string, unknown>) => {
    try {
      const data = await apiClient.post<{ token: string, user: User, message: string }>('/api/auth/login', credentials);
      localStorage.setItem('access_token', data.token);
      // After login, fetch the full user profile to ensure consistency
      const userData = await apiClient.get<User>('/api/auth/profile');
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (data: Record<string, unknown>) => {
    try {
      const resp = await apiClient.post<{ token: string, user: User, message: string }>('/api/auth/register', data);
      // Auto-login if token is returned
      if (resp.token) {
        localStorage.setItem('access_token', resp.token);
        const userData = await apiClient.get<User>('/api/auth/profile');
        setUser(userData);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
