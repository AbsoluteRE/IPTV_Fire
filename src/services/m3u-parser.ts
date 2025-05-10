// src/services/m3u-parser.ts
'use server';

import type { IPTVData, IPTVChannel, IPTVMovie, IPTVSeries, IPTVCategory } from '@/types/iptv';

// Basic M3U attribute parser
function parseExtInf(line: string): { title: string; attributes: Record<string, string> } {
  const match = line.match(/^#EXTINF:-1\s*(.*),(.*)$/);
  if (!match) return { title: '', attributes: {} };

  const attributesStr = match[1];
  const title = match[2].trim();
  const attributes: Record<string, string> = {};

  const attrRegex = /(\S+?)="([^"]*)"/g;
  let attrMatch;
  while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
    attributes[attrMatch[1].toLowerCase()] = attrMatch[2];
  }
  return { title, attributes };
}


export async function parseM3UFile(m3uUrl: string): Promise<IPTVData> {
  // In a real implementation:
  // const response = await fetch(m3uUrl);
  // if (!response.ok) throw new Error(`Failed to fetch M3U file: ${response.statusText}`);
  // const m3uContent = await response.text();
  // Then parse m3uContent

  // Mock parsing for now:
  const mockLiveChannels: IPTVChannel[] = [
    { id: 'm3u_live_1', name: 'M3U Channel One', logoUrl: 'https://picsum.photos/100/100?random=10&grayscale', category: 'News (M3U)', streamUrl: '#', dataAiHint: 'news logo' },
    { id: 'm3u_live_2', name: 'M3U Channel Two Sport', logoUrl: 'https://picsum.photos/100/100?random=11&grayscale', category: 'Sports (M3U)', streamUrl: '#', dataAiHint: 'sports logo' },
  ];
  const mockMovies: IPTVMovie[] = [
    { id: 'm3u_movie_1', name: 'M3U Movie Alpha', coverImageUrl: 'https://picsum.photos/200/300?random=12', category: 'Action (M3U)', streamUrl: '#', dataAiHint: 'action movie' },
  ];
  const mockSeries: IPTVSeries[] = [
     { id: 'm3u_series_1', name: 'M3U Series Beta', coverImageUrl: 'https://picsum.photos/200/300?random=13', category: 'Drama (M3U)', seasonsCount: 2, dataAiHint: 'drama series' },
  ];
  
  const categories: IPTVData['categories'] = {
      live: [{id: 'm3u_cat_live_1', name: 'News (M3U)', type: 'live'}, {id: 'm3u_cat_live_2', name: 'Sports (M3U)', type: 'live'}],
      movie: [{id: 'm3u_cat_movie_1', name: 'Action (M3U)', type: 'movie'}],
      series: [{id: 'm3u_cat_series_1', name: 'Drama (M3U)', type: 'series'}],
  };

  // Simulate parsing the user-provided URL type:
  // http://vip.sipderott4k.info:14820/get.php?username=656766&password=56568887&type=m3u_plus&output=ts
  // This URL likely provides a standard M3U file, but the parameters are for the server generating it.
  // Our parser would fetch this URL and process the text content.

  // The actual parsing logic would iterate through m3uContent lines:
  // let currentItem: Partial<IPTVChannel | IPTVMovie | IPTVSeries> = {};
  // for (const line of m3uContent.split('\\n')) {
  //   if (line.startsWith('#EXTINF:')) {
  //     const { title, attributes } = parseExtInf(line);
  //     currentItem = { name: attributes['tvg-name'] || title, logoUrl: attributes['tvg-logo'] || null };
  //     const groupTitle = attributes['group-title'];
  //     if (groupTitle) currentItem.category = groupTitle;
  //     // Try to determine type (live, movie, series) based on group-title or other attributes.
  //     // This is often heuristic.
  //   } else if (line.trim() && !line.startsWith('#')) {
  //     currentItem.streamUrl = line.trim();
  //     // Based on determined type, push to respective array.
  //     // e.g., if (type === 'live') liveChannels.push(currentItem as IPTVChannel);
  //     currentItem = {}; // Reset for next item
  //   }
  // }


  return {
    liveChannels: mockLiveChannels,
    movies: mockMovies,
    series: mockSeries,
    categories,
    accountInfo: null, // M3U doesn't have account info in the same way Xtream does
    sourceType: 'm3u',
    dataSourceUrl: m3uUrl,
  };
}
