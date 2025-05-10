// src/contexts/auth-context.tsx
'use client';
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (redirectTo?: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedAuth = typeof window !== 'undefined' ? localStorage.getItem('isAuthenticatedRunTV') : null;
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = useCallback((redirectTo: string = '/add-source') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthenticatedRunTV', 'true');
    }
    setIsAuthenticated(true);
    router.push(redirectTo);
  }, [router]);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticatedRunTV');
    }
    setIsAuthenticated(false);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
