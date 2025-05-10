'use client';

import { ContentCard } from '@/components/content/content-card';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from 'react';

const mockMovies = [
  { id: '1', title: 'Interstellar Exploration', description: 'A journey to the edge of the universe.', imageUrl: 'https://picsum.photos/400/600?random=1', type: 'movie', dataAiHint: 'space movie' },
  { id: '2', title: 'Cyber City Chronicles', description: 'In a neon-lit future, a detective uncovers a conspiracy.', imageUrl: 'https://picsum.photos/400/600?random=2', type: 'movie', dataAiHint: 'cyberpunk city' },
  { id: '3', title: 'The Lost Kingdom', description: 'An adventurer seeks a mythical lost kingdom.', imageUrl: 'https://picsum.photos/400/600?random=3', type: 'movie', dataAiHint: 'fantasy landscape' },
  { id: '4', title: 'Deep Sea Mystery', description: 'Scientists explore the Mariana Trench.', imageUrl: 'https://picsum.photos/400/600?random=4', type: 'movie', dataAiHint: 'underwater scene' },
  { id: '5', title: 'Mountain Peak Echoes', description: 'A thrilling tale of survival on a treacherous peak.', imageUrl: 'https://picsum.photos/400/600?random=5', type: 'movie', dataAiHint: 'snowy mountain' },
  { id: '6', title: 'Desert Mirage', description: 'Lost in the desert, a fight for survival begins.', imageUrl: 'https://picsum.photos/400/600?random=6', type: 'movie', dataAiHint: 'desert landscape' },
];

interface ContentSectionProps {
  title: string;
  items: typeof mockMovies;
}

function ContentSection({ title, items }: ContentSectionProps) {
  return (
    <section className="mb-10">
      <h2 className="text-3xl font-semibold mb-6 text-foreground px-1">{title}</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-4 pb-4 px-1">
          {items.map((item) => (
            <div key={item.id} className="w-[200px] md:w-[240px] lg:w-[280px] shrink-0">
              <ContentCard {...item} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

export default function HomePage() {
    const [filters, setFilters] = React.useState({
    genre: { action: false, comedy: false, drama: false, horror: false, scifi: true },
    year: { y2023: false, y2022: true, y2021: false },
  });

  const handleFilterChange = (category: 'genre' | 'year', key: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key as keyof typeof prev.genre],
      }
    }));
  };


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
                  {key.substring(1)} {/* Remove 'y' prefix */}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ContentSection title="Latest Additions" items={mockMovies} />
        <ContentSection title="Popular Movies" items={[...mockMovies].reverse()} />
        <ContentSection title="Recommended For You" items={mockMovies.slice(0,3)} />
      </div>
    </ScrollArea>
  );
}
