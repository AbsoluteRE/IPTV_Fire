
'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlayIcon, Tv2, Zap, Loader2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIPTVSource } from "@/contexts/iptv-source-context";
import type { IPTVChannel, IPTVCategory } from "@/types/iptv";
import React, { useMemo } from "react";

export default function LiveTvPage() {
  const { iptvData, loading: contextLoading, isFetchingContent } = useIPTVSource();

  const isLoading = contextLoading || isFetchingContent;

  const channels = useMemo(() => iptvData?.liveChannels || [], [iptvData]);
  const liveCategories = useMemo(() => [{id: 'all', name: 'All', type: 'live' as const}, ...(iptvData?.categories?.live || [])], [iptvData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Loading Live TV channels...</p>
      </div>
    );
  }

  if (!iptvData && !isLoading) {
    return (
       <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No IPTV Source Configured</h2>
        <p className="text-muted-foreground">Please add an IPTV source in the 'Manage Source' section to view live channels.</p>
        <Button onClick={() => window.location.href = '/add-source'} className="mt-6">Add IPTV Source</Button>
      </div>
    );
  }
  
  if (channels.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Tv2 className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Live Channels Found</h2>
        <p className="text-muted-foreground">Your IPTV source does not seem to have any live TV channels, or they could not be loaded.</p>
      </div>
    );
  }
  
  const getCategoryName = (categoryId: string) => {
    return liveCategories.find(cat => cat.id === categoryId)?.name || categoryId;
  }

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto py-8 px-1 md:px-4">
        <div className="flex justify-between items-center mb-8 px-1">
          <h1 className="text-4xl font-bold text-primary flex items-center"><Tv2 className="mr-3 h-10 w-10" />Live TV</h1>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 mb-6 h-auto p-2 bg-muted/30">
            {liveCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {liveCategories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {channels
                  .filter(ch => category.id === "all" || ch.category === category.id)
                  .map(channel => (
                  <Card key={channel.id} className="overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out group transform hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center gap-4 p-4 bg-muted/20">
                      {channel.logoUrl ? (
                        <Image src={channel.logoUrl} alt={`${channel.name} logo`} width={60} height={60} className="rounded-md border border-border object-contain" data-ai-hint={channel.dataAiHint || 'tv channel logo'} />
                      ) : (
                        <div className="h-[60px] w-[60px] flex items-center justify-center bg-secondary rounded-md border border-border">
                          <Tv2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary">{channel.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1 text-xs">{getCategoryName(channel.category)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 min-h-[60px]">
                      {channel.epgData?.title ? (
                        <>
                          <p className="text-xs text-muted-foreground mb-1">Now Playing:</p>
                          <p className="text-sm font-medium text-foreground line-clamp-2">{channel.epgData.title}</p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Program information unavailable</p>
                      )}
                    </CardContent>
                    <CardFooter className="p-2 bg-muted/30">
                      <Button className="w-full" variant="ghost" onClick={() => alert(`Playing ${channel.name}\n${channel.streamUrl}`)}>
                        <Zap className="mr-2 h-4 w-4 text-primary" /> Watch Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
               {channels.filter(ch => category.id === "all" || ch.category === category.id).length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <Tv2 className="mx-auto h-12 w-12 mb-4" />
                  <p className="text-lg">No channels found in {getCategoryName(category.id)}.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </ScrollArea>
  );
}
