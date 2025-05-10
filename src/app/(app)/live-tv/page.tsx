'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlayIcon, Tv2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Channel {
  id: string;
  name: string;
  logoUrl: string;
  category: string;
  currentProgram?: string;
  dataAiHint?: string;
}

const mockChannels: Channel[] = [
  { id: 'c1', name: 'Action Sports HD', logoUrl: 'https://picsum.photos/100/100?random=21&grayscale', category: 'Sports', currentProgram: 'Live: Champions League Final', dataAiHint: 'sports logo' },
  { id: 'c2', name: 'Movie Max', logoUrl: 'https://picsum.photos/100/100?random=22&grayscale', category: 'Movies', currentProgram: 'The Grand Heist (2023)', dataAiHint: 'movie logo' },
  { id: 'c3', name: 'News Now 24/7', logoUrl: 'https://picsum.photos/100/100?random=23&grayscale', category: 'News', currentProgram: 'Evening News Bulletin', dataAiHint: 'news logo' },
  { id: 'c4', name: 'Kids Planet', logoUrl: 'https://picsum.photos/100/100?random=24&grayscale', category: 'Kids', currentProgram: 'Cartoon Adventures S2 E5', dataAiHint: 'kids logo' },
  { id: 'c5', name: 'Global Docs', logoUrl: 'https://picsum.photos/100/100?random=25&grayscale', category: 'Documentaries', currentProgram: 'Wonders of the Amazon', dataAiHint: 'documentary logo' },
  { id: 'c6', name: 'Music Hits TV', logoUrl: 'https://picsum.photos/100/100?random=26&grayscale', category: 'Music', currentProgram: 'Top 40 Countdown', dataAiHint: 'music logo' },
];

const categories = ["All", "Sports", "Movies", "News", "Kids", "Documentaries", "Music"];

export default function LiveTvPage() {
  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto py-8 px-1 md:px-4">
        <div className="flex justify-between items-center mb-8 px-1">
          <h1 className="text-4xl font-bold text-primary flex items-center"><Tv2 className="mr-3 h-10 w-10" />Live TV</h1>
        </div>

        <Tabs defaultValue="All" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-6 h-auto p-2 bg-muted/30">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {mockChannels
                  .filter(ch => category === "All" || ch.category === category)
                  .map(channel => (
                  <Card key={channel.id} className="overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out group transform hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center gap-4 p-4 bg-muted/20">
                      <Image src={channel.logoUrl} alt={`${channel.name} logo`} width={60} height={60} className="rounded-md border border-border" data-ai-hint={channel.dataAiHint} />
                      <div>
                        <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary">{channel.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1 text-xs">{channel.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      {channel.currentProgram ? (
                        <>
                          <p className="text-xs text-muted-foreground mb-1">Now Playing:</p>
                          <p className="text-sm font-medium text-foreground line-clamp-2">{channel.currentProgram}</p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Program information unavailable</p>
                      )}
                    </CardContent>
                    <CardFooter className="p-2 bg-muted/30">
                      <Button className="w-full" variant="ghost">
                        <Zap className="mr-2 h-4 w-4 text-primary" /> Watch Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
               {mockChannels.filter(ch => category === "All" || ch.category === category).length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <Tv2 className="mx-auto h-12 w-12 mb-4" />
                  <p className="text-lg">No channels found in {category}.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </ScrollArea>
  );
}
