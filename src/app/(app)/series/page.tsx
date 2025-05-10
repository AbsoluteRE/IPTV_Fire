'use client';

import { ContentCard } from '@/components/content/content-card';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Check } from 'lucide-react';
import React from 'react';

const mockSeries = [
  { id: 's1', title: 'Galaxy Defenders', description: 'A team of heroes protects the galaxy.', imageUrl: 'https://picsum.photos/400/600?random=11', type: 'series', dataAiHint: 'sci-fi team' },
  { id: 's2', title: 'Medieval Dynasties', description: 'Power struggles in a medieval kingdom.', imageUrl: 'https://picsum.photos/400/600?random=12', type: 'series', dataAiHint: 'knights castle' },
  { id: 's3', title: 'Tech Wizards', description: 'Young geniuses create world-changing tech.', imageUrl: 'https://picsum.photos/400/600?random=13', type: 'series', dataAiHint: 'futuristic technology' },
  { id: 's4', title: 'Urban Jungle Detectives', description: 'Solving crimes in a bustling metropolis.', imageUrl: 'https://picsum.photos/400/600?random=14', type: 'series', dataAiHint: 'city detective' },
];

interface SeriesCardProps extends Omit<React.ComponentProps<typeof ContentCard>, 'type'> {
  seasons?: number;
  episodesViewed?: number;
  totalEpisodes?: number;
}

function SeriesDisplayCard({ title, description, imageUrl, dataAiHint, seasons, episodesViewed, totalEpisodes }: SeriesCardProps) {
  return (
    <div className="w-[240px] md:w-[280px] lg:w-[320px] shrink-0">
       <ContentCard title={title} description={description} imageUrl={imageUrl} type="series" dataAiHint={dataAiHint} />
       <div className="mt-2 p-2 bg-muted/30 rounded-b-md">
        {seasons && <Badge variant="secondary" className="mr-2">S{seasons}</Badge>}
        {typeof episodesViewed === 'number' && typeof totalEpisodes === 'number' && (
          <Badge variant="outline">
            {episodesViewed}/{totalEpisodes} viewed <Check className="ml-1 h-3 w-3 text-green-500" />
          </Badge>
        )}
       </div>
    </div>
  );
}


export default function SeriesPage() {
  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto py-8 px-1 md:px-4">
        <div className="flex justify-between items-center mb-8 px-1">
          <h1 className="text-4xl font-bold text-primary">TV Series</h1>
          <Button variant="outline" size="lg">
            <Filter className="mr-2 h-5 w-5" /> Filters
          </Button>
        </div>

        <section className="mb-10">
          <h2 className="text-3xl font-semibold mb-6 text-foreground px-1">New Episodes This Week</h2>
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex w-max space-x-4 pb-4 px-1">
              {mockSeries.map((series) => (
                <SeriesDisplayCard 
                  key={series.id} {...series} 
                  seasons={Math.floor(Math.random() * 5) + 1} 
                  episodesViewed={Math.floor(Math.random() * 10)}
                  totalEpisodes={10 + Math.floor(Math.random() * 5)}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

         <section className="mb-10">
          <h2 className="text-3xl font-semibold mb-6 text-foreground px-1">Trending Series</h2>
           <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex w-max space-x-4 pb-4 px-1">
              {[...mockSeries].reverse().map((series) => (
                 <SeriesDisplayCard 
                  key={series.id} {...series} 
                  seasons={Math.floor(Math.random() * 5) + 1} 
                  episodesViewed={Math.floor(Math.random() * 10)}
                  totalEpisodes={10 + Math.floor(Math.random() * 5)}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
      </div>
    </ScrollArea>
  );
}
