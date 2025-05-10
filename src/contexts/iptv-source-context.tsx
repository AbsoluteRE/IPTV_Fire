// src/contexts/iptv-source-context.tsx
'use client';
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { SummarizeIPTVContentOutput } from '@/ai/flows/summarize-iptv-content';

interface IPTVSourceContextType {
  sourceConfigured: boolean;
  sourceSummary: SummarizeIPTVContentOutput | null;
  setSourceData: (summary: SummarizeIPTVContentOutput | null) => void;
  clearSourceData: () => void;
  loading: boolean;
}

const IPTVSourceContext = createContext<IPTVSourceContextType | undefined>(undefined);

export function IPTVSourceProvider({ children }: { children: ReactNode }) {
  const [sourceConfigured, setSourceConfigured] = useState(false);
  const [sourceSummary, setSourceSummary] = useState<SummarizeIPTVContentOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedSummary = typeof window !== 'undefined' ? localStorage.getItem('iptvSourceSummaryRunTV') : null;
    if (storedSummary) {
      try {
        const parsedSummary: SummarizeIPTVContentOutput = JSON.parse(storedSummary);
        setSourceSummary(parsedSummary);
        setSourceConfigured(true);
      } catch (error) {
        console.error("Failed to parse stored IPTV summary", error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('iptvSourceSummaryRunTV');
        }
      }
    }
    setLoading(false);
  }, []);

  const setSourceData = useCallback((summary: SummarizeIPTVContentOutput | null) => {
    setSourceSummary(summary);
    setSourceConfigured(!!summary);
    if (typeof window !== 'undefined') {
      if (summary) {
        localStorage.setItem('iptvSourceSummaryRunTV', JSON.stringify(summary));
      } else {
        localStorage.removeItem('iptvSourceSummaryRunTV');
      }
    }
  }, []);

  const clearSourceData = useCallback(() => {
    setSourceSummary(null);
    setSourceConfigured(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('iptvSourceSummaryRunTV');
    }
  }, []);


  return (
    <IPTVSourceContext.Provider value={{ sourceConfigured, sourceSummary, setSourceData, clearSourceData, loading }}>
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
