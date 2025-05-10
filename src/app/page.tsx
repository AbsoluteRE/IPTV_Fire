'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useIPTVSource } from '@/contexts/iptv-source-context';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { sourceConfigured, loading: iptvLoading } = useIPTVSource();

  useEffect(() => {
    if (authLoading || iptvLoading) {
      return; // Wait until loading is complete
    }

    if (!isAuthenticated) {
      router.replace('/login');
    } else {
      if (!sourceConfigured) {
        router.replace('/add-source');
      } else {
        router.replace('/home');
      }
    }
  }, [isAuthenticated, sourceConfigured, authLoading, iptvLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="ml-4 text-xl text-muted-foreground">Loading RunTV Streamer...</p>
    </div>
  );
}
