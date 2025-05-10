// src/contexts/auth-context.tsx
'use client';
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (redirectTo?: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (isAuthenticated) { // Only set timer if authenticated
      inactivityTimerRef.current = setTimeout(() => {
        // User is inactive, log them out
        console.log("User inactive, logging out.");
        logout();
      }, INACTIVITY_TIMEOUT_MS);
    }
  }, [isAuthenticated]); // Added logout to dependency array of resetInactivityTimer if it were to call it directly.

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticatedRunTV');
      // Also clear IPTV data on logout
      localStorage.removeItem('iptvDataRunTV'); 
    }
    setIsAuthenticated(false);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    router.push('/login');
  }, [router]);


  useEffect(() => {
    const storedAuth = typeof window !== 'undefined' ? localStorage.getItem('isAuthenticatedRunTV') : null;
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);
  
  useEffect(() => {
    // Setup event listeners for user activity
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    if (isAuthenticated) {
      activityEvents.forEach(event => window.addEventListener(event, resetInactivityTimer));
      resetInactivityTimer(); // Start the timer when user becomes authenticated or on initial load if authenticated
    }

    return () => {
      activityEvents.forEach(event => window.removeEventListener(event, resetInactivityTimer));
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [isAuthenticated, resetInactivityTimer]);


  const login = useCallback((redirectTo: string = '/add-source') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthenticatedRunTV', 'true');
    }
    setIsAuthenticated(true);
    resetInactivityTimer(); // Start inactivity timer on login
    router.push(redirectTo);
  }, [router, resetInactivityTimer]);


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
