import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // Removed as it's causing an error and not directly used.
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { IPTVSourceProvider } from '@/contexts/iptv-source-context';

export const metadata: Metadata = {
  title: 'RunTV Streamer',
  description: 'Modern IPTV Streaming Application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.variable} font-sans antialiased`}> {/* Removed GeistMono.variable */}
        <AuthProvider>
          <IPTVSourceProvider>
            {children}
            <Toaster />
          </IPTVSourceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
