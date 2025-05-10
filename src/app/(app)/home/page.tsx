
'use client';

import React, { useMemo } from 'react';
import { ContentCard } from '@/components/content/content-card';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { Filter, Loader2, AlertTriangle, Film } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIPTVSource } from '@/contexts/iptv-source-context';
import type { IPTVMovie } from '@/types/iptv';

interface ContentSectionProps {
  title: string;
  items: IPTVMovie[]; 
}

function ContentSection({ title, items }: ContentSectionProps) {
  if (items.length === 0) {
    return (
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-6 text-foreground px-1">{title}</h2>
        <div className="text-center py-10 text-muted-foreground">
          <Film className="mx-auto h-12 w-12 mb-4" />
          <p className="text-lg">No movies found in this section.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-3xl font-semibold mb-6 text-foreground px-1">{title}</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-4 pb-4 px-1">
          {items.map((item) => (
            <div key={item.id} className="w-[200px] md:w-[240px] lg:w-[280px] shrink-0 h-full">
              <ContentCard
                itemId={item.id} // Pass item ID
                title={item.name}
                description={item.plot || `Rating: ${item.rating_5based || item.rating || 'N/A'}`}
                imageUrl={item.coverImageUrl || `https://picsum.photos/400/600?blur=2&grayscale&random=${item.id}`}
                type="movie"
                dataAiHint={item.dataAiHint || 'movie poster'}
                streamUrl={item.streamUrl}
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

export default function HomePage() {
  const { iptvData, loading: contextLoading, isFetchingContent } = useIPTVSource();
  const [filters, setFilters] = React.useState({
    genre: { action: false, comedy: false, drama: false, horror: false, scifi: true },
    year: { y2023: false, y2022: true, y2021: false },
  });

  const isLoading = contextLoading || isFetchingContent;

  const movies = useMemo(() => iptvData?.movies || [], [iptvData]);
  // TODO: Actual filtering logic based on movie properties and selected filters

  const handleFilterChange = (category: 'genre' | 'year', key: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key as keyof typeof prev.genre], 
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Loading movies...</p>
      </div>
    );
  }

  if (!iptvData && !isLoading) {
     return (
       <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No IPTV Source Configured</h2>
        <p className="text-muted-foreground">Please add an IPTV source in the 'Manage Source' section to view movies.</p>
        <Button onClick={() => window.location.href = '/add-source'} className="mt-6">Add IPTV Source</Button>
      </div>
    );
  }

  if (movies.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Film className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Movies Found</h2>
        <p className="text-muted-foreground">Your IPTV source does not seem to have any movies, or they could not be loaded.</p>
      </div>
    );
  }

  // Simple sectioning for demonstration
  const latestMovies = movies.sort((a,b) => parseInt(b.added || "0") - parseInt(a.added || "0")).slice(0, 10);
  const popularMovies = [...movies].sort((a, b) => (Number(b.rating_5based || b.rating) || 0) - (Number(a.rating_5based || a.rating) || 0)).slice(0, 10);
  const recommendedMovies = movies.length > 2 ? movies.slice(Math.max(0, movies.length - 5), movies.length -2 ) : movies;


  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto py-8 px-1 md:px-4">
        <div className="flex justify-between items-center mb-8 px-1">
          <h1 className="text-4xl font-bold text-primary">Movies</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg">
                <Filter className="mr-2 h-5 w-5" /> Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Genre</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(filters.genre).map(([key, value]) => (
                <DropdownMenuCheckboxItem key={key} checked={value} onCheckedChange={() => handleFilterChange('genre', key)}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuLabel>Year</DropdownMenuLabel>
              <DropdownMenuSeparator />
               {Object.entries(filters.year).map(([key, value]) => (
                <DropdownMenuCheckboxItem key={key} checked={value} onCheckedChange={() => handleFilterChange('year', key)}>
                  {key.substring(1)} 
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ContentSection title="Latest Additions" items={latestMovies} />
        <ContentSection title="Popular Movies" items={popularMovies} />
        <ContentSection title="Recommended For You" items={recommendedMovies} />
        
        {movies.length > 0 && (latestMovies.length === 0 || popularMovies.length === 0) && (
            <ContentSection title="All Movies" items={movies} />
        )}
      </div>
    </ScrollArea>
  );
}
