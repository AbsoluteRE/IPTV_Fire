
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, Info, Tv, FilmIcon } from 'lucide-react'; // Added Tv and FilmIcon

interface ContentCardProps {
  title: string;
  description?: string;
  imageUrl: string;
  type: 'movie' | 'series';
  dataAiHint?: string;
  streamUrl?: string; // Optional stream URL for direct play
}

export function ContentCard({ title, description, imageUrl, type, dataAiHint = "content poster", streamUrl }: ContentCardProps) {
  const IconType = type === 'movie' ? FilmIcon : Tv;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 group flex flex-col h-full">
      <CardHeader className="p-0 relative aspect-[2/3]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={dataAiHint}
            onError={(e) => { e.currentTarget.src = 'https://picsum.photos/400/600?blur=2&grayscale&random=fallback';}} // Fallback
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
             <IconType className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <CardTitle className="text-lg font-semibold text-white line-clamp-2">{title}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 md:p-4 flex-grow min-h-[60px]"> {/* Ensure some min height for consistency */}
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
          onClick={() => alert(streamUrl ? `Playing: ${title}\nURL: ${streamUrl}` : `Details for: ${title}`)}
          title={streamUrl ? `Play ${title}` : `More info about ${title}`}
        >
          <PlayCircle className="mr-2 h-4 w-4" /> Play
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" title={`More info about ${title}`}>
          <Info className="h-4 w-4" />
          <span className="sr-only">More info</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
