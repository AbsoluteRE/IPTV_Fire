// src/contexts/iptv-source-context.tsx
'use client';
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { IPTVData } from '@/types/iptv';

interface IPTVSourceContextType {
  sourceConfigured: boolean;
  iptvData: IPTVData | null;
  setIPTVData: (data: IPTVData | null) => void;
  clearIPTVData: () => void;
  loading: boolean; // Indicates if context is initially loading from localStorage
  isFetchingContent: boolean; // Indicates if new content is being fetched via action
  setIsFetchingContent: (isFetching: boolean) => void;
}

const IPTVSourceContext = createContext<IPTVSourceContextType | undefined>(undefined);

export function IPTVSourceProvider({ children }: { children: ReactNode }) {
  const [iptvData, setIptvDataState] = useState<IPTVData | null>(null);
  const [loading, setLoading] = useState(true); // For initial localStorage load
  const [isFetchingContent, setIsFetchingContent] = useState(false); // For active fetching

  useEffect(() => {
    const storedData = typeof window !== 'undefined' ? localStorage.getItem('iptvDataRunTV') : null;
    if (storedData) {
      try {
        const parsedData: IPTVData = JSON.parse(storedData);
        setIptvDataState(parsedData);
      } catch (error) {
        console.error("Failed to parse stored IPTV data", error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('iptvDataRunTV');
        }
      }
    }
    setLoading(false);
  }, []);

  const setIPTVData = useCallback((data: IPTVData | null) => {
    setIptvDataState(data);
    if (typeof window !== 'undefined') {
      if (data) {
        localStorage.setItem('iptvDataRunTV', JSON.stringify(data));
      } else {
        localStorage.removeItem('iptvDataRunTV');
      }
    }
  }, []);

  const clearIPTVData = useCallback(() => {
    setIptvDataState(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('iptvDataRunTV');
    }
  }, []);

  const sourceConfigured = !!iptvData;

  return (
    <IPTVSourceContext.Provider value={{ 
        sourceConfigured, 
        iptvData, 
        setIPTVData, 
        clearIPTVData, 
        loading,
        isFetchingContent,
        setIsFetchingContent
    }}>
      {children}
    </IPTVSourceContext.Provider>
  );
}

export function useIPTVSource() {
  const context = useContext(IPTVSourceContext);
  if (context === undefined) {
    throw new Error('useIPTVSource must be used within an IPTVSourceProvider');
  }
  return context;
}
