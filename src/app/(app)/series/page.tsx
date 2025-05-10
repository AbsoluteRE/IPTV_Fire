
'use client';

import React, { useMemo } from 'react';
import { ContentCard } from '@/components/content/content-card';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Check, Loader2, AlertTriangle, ListVideo } from 'lucide-react';
import { useIPTVSource } from '@/contexts/iptv-source-context';
import type { IPTVSeries } from '@/types/iptv';

interface SeriesCardProps {
  series: IPTVSeries;
}

function SeriesDisplayCard({ series }: SeriesCardProps) {
  return (
    <div className="w-[240px] md:w-[280px] lg:w-[320px] shrink-0 h-full">
       <ContentCard 
          itemId={series.id} // Pass series ID
          title={series.name} 
          description={series.plot || `Rating: ${series.rating || 'N/A'}`} 
          imageUrl={series.coverImageUrl || series.cover || `https://picsum.photos/400/600?blur=2&grayscale&random=${series.id}`}
          type="series" 
          dataAiHint={series.dataAiHint || 'series poster'}
          // streamUrl is not applicable for a series card directly
        />
       <div className="mt-2 p-2 bg-muted/30 rounded-b-md">
        {series.seasonsCount && <Badge variant="secondary" className="mr-2">S{series.seasonsCount}</Badge>}
        {series.genre && <Badge variant="outline">{series.genre}</Badge>}
        {series.releaseDate && <Badge variant="outline">{new Date(series.releaseDate).getFullYear()}</Badge>}
       </div>
    </div>
  );
}


export default function SeriesPage() {
  const { iptvData, loading: contextLoading, isFetchingContent } = useIPTVSource();
  // Filters state - for future implementation
  // const [filters, setFilters] = React.useState({});

  const isLoading = contextLoading || isFetchingContent;

  const seriesList = useMemo(() => iptvData?.series || [], [iptvData]);
  // TODO: Actual filtering based on series properties and filters

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Loading TV series...</p>
      </div>
    );
  }

  if (!iptvData && !isLoading) {
     return (
       <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No IPTV Source Configured</h2>
        <p className="text-muted-foreground">Please add an IPTV source in the 'Manage Source' section to view series.</p>
        <Button onClick={() => window.location.href = '/add-source'} className="mt-6">Add IPTV Source</Button>
      </div>
    );
  }

  if (seriesList.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <ListVideo className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No TV Series Found</h2>
        <p className="text-muted-foreground">Your IPTV source does not seem to have any TV series, or they could not be loaded.</p>
      </div>
    );
  }

  // Simple sectioning for demonstration
  const newSeries = seriesList.slice(0, 10); // Assuming sorted by added date (last_modified)
  const trendingSeries = [...seriesList]
    .sort((a, b) => (Number(b.rating_5based || b.rating) || 0) - (Number(a.rating_5based || a.rating) || 0))
    .slice(0, 10);


  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto py-8 px-1 md:px-4">
        <div className="flex justify-between items-center mb-8 px-1">
          <h1 className="text-4xl font-bold text-primary">TV Series</h1>
          <Button variant="outline" size="lg" disabled> {/* Filters disabled for now */}
            <Filter className="mr-2 h-5 w-5" /> Filters
          </Button>
        </div>

        {newSeries.length > 0 && (
          <section className="mb-10">
            <h2 className="text-3xl font-semibold mb-6 text-foreground px-1">New & Updated Series</h2>
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
              <div className="flex w-max space-x-4 pb-4 px-1">
                {newSeries.map((s) => (
                  <SeriesDisplayCard key={s.id} series={s} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>
        )}

         {trendingSeries.length > 0 && (
           <section className="mb-10">
            <h2 className="text-3xl font-semibold mb-6 text-foreground px-1">Trending Series</h2>
             <ScrollArea className="w-full whitespace-nowrap rounded-md">
              <div className="flex w-max space-x-4 pb-4 px-1">
                {trendingSeries.map((s) => (
                   <SeriesDisplayCard key={s.id} series={s} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>
        )}
        
        {seriesList.length > 0 && (newSeries.length === 0 || trendingSeries.length === 0) && (
             <section className="mb-10">
             <h2 className="text-3xl font-semibold mb-6 text-foreground px-1">All Series</h2>
              <ScrollArea className="w-full whitespace-nowrap rounded-md">
               <div className="flex w-max space-x-4 pb-4 px-1">
                 {seriesList.map((s) => (
                    <SeriesDisplayCard key={s.id} series={s} />
                 ))}
               </div>
               <ScrollBar orientation="horizontal" />
             </ScrollArea>
           </section>
        )}
      </div>
    </ScrollArea>
  );
}
