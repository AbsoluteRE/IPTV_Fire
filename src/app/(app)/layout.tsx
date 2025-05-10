'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AppHeader } from '@/components/layout/header';
import { SidebarNavigation } from '@/components/layout/navigation';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // This fallback is for the brief moment before redirection or if effect hasn't run
    return null; 
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 sticky top-0">
          <div className="flex h-16 items-center border-b px-4 lg:px-6">
             <Link href="/home" className="flex items-center gap-2 font-semibold text-primary">
              <TvIcon className="h-6 w-6" />
              <span>RunTV Streamer</span>
            </Link>
          </div>
          <SidebarNavigation />
        </div>
      </aside>
      <div className="flex flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background_alt">
          <Card className="flex-1 shadow-lg rounded-xl overflow-hidden">
             {children}
          </Card>
        </main>
      </div>
    </div>
  );
}

// Helper icons if not already imported or available globally
import Link from 'next/link';
import { TvIcon } from 'lucide-react'; // Assuming TvIcon is used for logo
