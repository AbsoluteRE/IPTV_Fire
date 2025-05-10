import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, Info } from 'lucide-react';

interface ContentCardProps {
  title: string;
  description?: string;
  imageUrl: string;
  type: 'movie' | 'series';
  dataAiHint?: string;
}

export function ContentCard({ title, description, imageUrl, type, dataAiHint = "movie poster" }: ContentCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 group">
      <CardHeader className="p-0 relative aspect-[2/3]">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={dataAiHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <CardTitle className="text-lg font-semibold text-white line-clamp-2">{title}</CardTitle>
        </div>
      </CardHeader>
      {description && (
        <CardContent className="p-4 hidden md:block"> {/* Hide description on smaller cards if needed */}
          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        </CardContent>
      )}
      <CardFooter className="p-2 md:p-4 flex justify-between items-center bg-muted/30">
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
          <PlayCircle className="mr-2 h-4 w-4" /> Play
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Info className="h-4 w-4" />
          <span className="sr-only">More info</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
