// src/components/iptv/source-summary.tsx
'use client';

import type { IPTVData, DnsStatusResult } from '@/types/iptv';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListTree, Tv, Film, CheckCircle, AlertCircle, Info, UserCircle, CalendarDays, LinkIcon, Wifi, WifiOff, ServerCog, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { checkDnsStatus } from '@/app/actions';

interface SourceSummaryProps {
  iptvData: IPTVData | null;
}

export function SourceSummary({ iptvData }: SourceSummaryProps) {
  const [dnsStatus, setDnsStatus] = useState<DnsStatusResult>({ status: 'Checking...' });

  useEffect(() => {
    async function fetchDns() {
      if (iptvData && iptvData.dataSourceUrl) {
        // For Xtream, dataSourceUrl is host:port. For M3U, it's the full URL.
        // The DNS check needs a base URL (scheme + host + port).
        let urlToCheck = iptvData.dataSourceUrl;
        if (iptvData.sourceType === 'xtream') {
            // Ensure it has a scheme
            if (!urlToCheck.startsWith('http://') && !urlToCheck.startsWith('https://')) {
                urlToCheck = `http://${urlToCheck}`; // Default to http for Xtream if not specified
            }
        }
        // For M3U, dataSourceUrl is already a full URL.
        
        try {
          const result = await checkDnsStatus(urlToCheck);
          setDnsStatus(result);
        } catch (error) {
          console.error("Error fetching DNS status:", error);
          setDnsStatus({ status: 'Error', error: error instanceof Error ? error.message : 'Unknown error' });
        }
      }
    }
    fetchDns();
  }, [iptvData]);

  if (!iptvData) {
    return (
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Info className="mr-2 h-5 w-5 text-blue-500" /> No Source Data Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">IPTV source data is not available or has been cleared.</p>
        </CardContent>
      </Card>
    );
  }

  const { accountInfo, liveChannels, movies, series, categories, sourceType, dataSourceUrl } = iptvData;
  const isActive = accountInfo?.status?.toLowerCase() === 'active';

  const renderDnsStatus = () => {
    switch (dnsStatus.status) {
      case 'Checking...':
        return <span className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...</span>;
      case 'Online':
        return <span className="flex items-center text-sm text-green-500"><Wifi className="mr-2 h-4 w-4" /> Online ({dnsStatus.statusCode})</span>;
      case 'Maintenance':
        return <span className="flex items-center text-sm text-yellow-500"><ServerCog className="mr-2 h-4 w-4" /> Maintenance ({dnsStatus.statusCode})</span>;
      case 'Offline':
        return <span className="flex items-center text-sm text-red-500"><WifiOff className="mr-2 h-4 w-4" /> Offline {dnsStatus.statusCode ? `(${dnsStatus.statusCode})` : dnsStatus.error ? `(${dnsStatus.error})` : ''}</span>;
      case 'Error':
        return <span className="flex items-center text-sm text-red-500"><WifiOff className="mr-2 h-4 w-4" /> Error ({dnsStatus.error || 'Unknown'})</span>;
      default:
        return null;
    }
  };


  return (
    <Card className="shadow-lg border-primary/30 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-semibold">
          {accountInfo ? (
            isActive ? <CheckCircle className="mr-3 h-7 w-7 text-green-500" /> : <AlertCircle className="mr-3 h-7 w-7 text-yellow-500" />
          ) : <Info className="mr-3 h-7 w-7 text-blue-500" />}
          Source Details ({sourceType.toUpperCase()})
        </CardTitle>
        <CardDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
          <span className="flex items-center truncate" title={dataSourceUrl}>
            <LinkIcon className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" /> 
            <span className="truncate">{dataSourceUrl}</span>
          </span>
          <span className="mt-1 sm:mt-0">{renderDnsStatus()}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {accountInfo && (
          <section className="space-y-3 p-4 bg-muted/20 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center mb-2">
              <UserCircle className="mr-2 h-5 w-5 text-primary" /> Account Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p><strong className="text-foreground">Username:</strong> {accountInfo.username}</p>
              <p><strong className="text-foreground">Status:</strong> <Badge variant={isActive ? "default" : "destructive"} className={`ml-1 px-2 py-0.5 text-xs ${isActive ? 'bg-green-600 hover:bg-green-500' : 'bg-yellow-600 hover:bg-yellow-500'} text-white`}>{accountInfo.status}</Badge></p>
              {accountInfo.expiryDate && (
                <p className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4 text-muted-foreground" /><strong className="text-foreground">Expires:</strong> {format(parseISO(accountInfo.expiryDate), "PPP")}</p>
              )}
              <p><strong className="text-foreground">Connections:</strong> {accountInfo.activeConnections} / {accountInfo.maxConnections}</p>
              {accountInfo.createdAt && (
                 <p><strong className="text-foreground">Created:</strong> {format(parseISO(accountInfo.createdAt), "PPP")}</p>
              )}
               <p><strong className="text-foreground">Trial:</strong> {accountInfo.isTrial ? "Yes" : "No"}</p>
            </div>
          </section>
        )}

        <section className="space-y-3">
           <h3 className="text-lg font-semibold flex items-center mb-3">
              <ListTree className="mr-2 h-5 w-5 text-primary" /> Content Overview
            </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg shadow-sm">
              <Tv className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="text-xl font-bold text-foreground">{liveChannels.length}</p>
                <p className="text-xs text-muted-foreground">Live Channels</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg shadow-sm">
              <Film className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="text-xl font-bold text-foreground">{movies.length}</p>
                <p className="text-xs text-muted-foreground">Movies (VOD)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg shadow-sm">
              <ListTree className="h-8 w-8 text-primary shrink-0" /> {/* Icon for series */}
              <div>
                <p className="text-xl font-bold text-foreground">{series.length}</p>
                <p className="text-xs text-muted-foreground">TV Series</p>
              </div>
            </div>
          </div>
        </section>
        
        {(categories.live.length > 0 || categories.movie.length > 0 || categories.series.length > 0) && (
          <section className="space-y-3">
            <h4 className="text-lg font-semibold text-foreground">Available Content Categories:</h4>
            {categories.live.length > 0 && <CategoryList title="Live TV" items={categories.live.map(c=>c.name)} />}
            {categories.movie.length > 0 && <CategoryList title="Movies" items={categories.movie.map(c=>c.name)} />}
            {categories.series.length > 0 && <CategoryList title="Series" items={categories.series.map(c=>c.name)} />}
          </section>
        )}
      </CardContent>
    </Card>
  );
}

interface CategoryListProps {
  title: string;
  items: string[];
}
function CategoryList({ title, items }: CategoryListProps) {
  if (items.length === 0) return null;
  return (
    <div>
      <h5 className="text-md font-medium mb-1 text-primary/90">{title}:</h5>
      <div className="flex flex-wrap gap-2">
        {items.slice(0, 10).map((category, index) => ( // Show up to 10 categories
          <Badge key={index} variant="secondary" className="px-2 py-1 text-xs bg-accent/70 text-accent-foreground hover:bg-accent">
            {category}
          </Badge>
        ))}
        {items.length > 10 && <Badge variant="outline">...and {items.length - 10} more</Badge>}
      </div>
    </div>
  );
}
