
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, Info, Tv, FilmIcon, ListVideo } from 'lucide-react'; // Added ListVideo for series
import { VideoPlayerModal } from '@/components/video/video-player-modal';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // For potential navigation on series click

interface ContentCardProps {
  title: string;
  description?: string;
  imageUrl: string;
  type: 'movie' | 'series' | 'live'; // Added 'live' for completeness, though not used by this card currently for playing
  dataAiHint?: string;
  streamUrl?: string; // Optional stream URL for direct play (movies, live tv channels)
  itemId?: string; // Optional item ID for series navigation
}

export function ContentCard({ title, description, imageUrl, type, dataAiHint = "content poster", streamUrl, itemId }: ContentCardProps) {
  const router = useRouter();
  let IconType = FilmIcon; // Default to movie
  if (type === 'series') IconType = ListVideo; // Use ListVideo for series
  else if (type === 'live') IconType = Tv; // Use Tv for live, though card not typically used for this

  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);

  const handlePlayClick = () => {
    if (type === 'movie' && streamUrl) {
      setCurrentStreamUrl(streamUrl);
      setCurrentTitle(title);
      setIsPlayerOpen(true);
    } else if (type === 'series') {
      // For series, "Play" could mean navigate to series detail page or play first episode/trailer if available
      // For now, let's assume it navigates to a (future) series detail page if itemId is provided
      if (itemId) {
        // router.push(`/series/${itemId}`); // Example navigation
        alert(`Navigate to series detail for: ${title} (ID: ${itemId}) - Page not yet implemented.`);
      } else {
         alert(`More info about series: ${title}`);
      }
    } else {
      console.warn(`Play clicked for ${title} (${type}) but action is not defined or streamUrl missing.`);
    }
  };

  const handleInfoClick = () => {
     if (type === 'series' && itemId) {
        // router.push(`/series/${itemId}?tab=details`); // Example navigation
        alert(`Show details for series: ${title} (ID: ${itemId}) - Page not yet implemented.`);
     } else {
       alert(`More info about: ${title} (${type})`);
     }
  };
  
  const canPlay = type === 'movie' && !!streamUrl;
  const playButtonText = type === 'series' ? 'View Episodes' : 'Play';
  const playButtonTitle = type === 'series' 
    ? `View episodes for ${title}` 
    : (streamUrl ? `Play ${title}` : `No stream available for ${title}`);

  return (
    <>
      <Card className="overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 group flex flex-col h-full">
        <CardHeader className="p-0 relative aspect-[2/3]">
          <Image
            src={imageUrl || `https://picsum.photos/400/600?blur=1&random=${itemId || title}`} // Fallback if imageUrl is null/empty
            alt={title}
            fill // Changed from layout="fill" to fill property
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Provide sizes for responsiveness
            style={{objectFit:"cover"}} // Replaced objectFit with style prop
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={dataAiHint}
            onError={(e) => { 
              // Fallback for broken images
              (e.target as HTMLImageElement).srcset = `https://picsum.photos/400/600?grayscale&blur=2&random=${itemId || title}`;
              (e.target as HTMLImageElement).src = `https://picsum.photos/400/600?grayscale&blur=2&random=${itemId || title}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <CardTitle className="text-lg font-semibold text-white line-clamp-2">{title}</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-3 md:p-4 flex-grow min-h-[60px]">
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
          )}
           {!description && <p className="text-sm text-muted-foreground italic">No description available.</p>}
        </CardContent>

        <CardFooter className="p-2 md:p-3 flex justify-between items-center bg-muted/30 mt-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:text-primary hover:bg-primary/10 flex-1 justify-start"
            onClick={handlePlayClick}
            title={playButtonTitle}
            disabled={type === 'movie' && !canPlay} // Disable play for movies without URL. For series, this button now means "View Episodes".
          >
            <PlayCircle className="mr-2 h-4 w-4" /> {playButtonText}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground" 
            title={`More info about ${title}`}
            onClick={handleInfoClick}
          >
            <Info className="h-4 w-4" />
            <span className="sr-only">More info</span>
          </Button>
        </CardFooter>
      </Card>
      {type === 'movie' && ( // Only render VideoPlayerModal if it's a movie, as series play action is different
        <VideoPlayerModal 
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          streamUrl={currentStreamUrl}
          title={currentTitle}
        />
      )}
    </>
  );
}
