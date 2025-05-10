// src/services/xtream-service.ts
'use server';

import type { 
  IPTVData, 
  IPTVAccountInfo, 
  IPTVChannel, 
  IPTVMovie, 
  IPTVSeries,
  XtreamUserInfo,
  XtreamServerInfo
} from '@/types/iptv';

const DEFAULT_REQUEST_TIMEOUT = 15000; // 15 seconds

async function fetchWithTimeout(resource: RequestInfo | URL, options: RequestInit & { timeout?: number } = {}): Promise<Response> {
  const { timeout = DEFAULT_REQUEST_TIMEOUT } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);
  return response;
}


async function fetchFromXtreamAPI(apiUrl: string, params: Record<string, string>): Promise<any> {
  const fullUrl = new URL(apiUrl);
  Object.entries(params).forEach(([key, value]) => fullUrl.searchParams.append(key, value));
  
  try {
    const response = await fetchWithTimeout(fullUrl.toString());
    if (!response.ok) {
      // Try to parse error from Xtream if possible, otherwise use statusText
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // Not a JSON response
      }
      if (errorData && errorData.user_info && errorData.user_info.message) {
        throw new Error(`Xtream API Error: ${errorData.user_info.message} (Status: ${response.status})`);
      }
      throw new Error(`Xtream API request failed: ${response.statusText} (Status: ${response.status})`);
    }
    const data = await response.json();
    // Xtream sometimes returns an empty array for errors instead of a proper error structure
    if (Array.isArray(data) && params.action === 'get_user_info' && data.length === 0) {
        throw new Error('Authentication failed or invalid user info (empty response).');
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Xtream API request timed out after ${DEFAULT_REQUEST_TIMEOUT / 1000} seconds.`);
      }
      throw error; // Re-throw other errors (e.g., network errors, parsing errors from above)
    }
    throw new Error('An unknown error occurred while fetching from Xtream API.');
  }
}

export async function fetchXtreamData(apiUrl: string, username: string, password: string): Promise<IPTVData> {
  const playerApiUrl = `${apiUrl.replace(/\/$/, '')}/player_api.php`;

  // 1. Get User Info, Server Info, and main content lists (if API provides them in one go)
  // The user spec implies that player_api.php?username=...&password=... returns all this.
  const mainResponse = await fetchFromXtreamAPI(playerApiUrl, { username, password });

  if (!mainResponse || !mainResponse.user_info || mainResponse.user_info.auth !== 1) {
    throw new Error(mainResponse?.user_info?.message || 'Authentication failed or invalid user info.');
  }
  
  const rawUserInfo: XtreamUserInfo = mainResponse.user_info;
  const rawServerInfo: XtreamServerInfo = mainResponse.server_info;

  const accountInfo: IPTVAccountInfo = {
    username: rawUserInfo.username,
    status: rawUserInfo.status,
    expiryDate: rawUserInfo.exp_date ? new Date(parseInt(rawUserInfo.exp_date) * 1000).toISOString() : null,
    isTrial: rawUserInfo.is_trial === "1",
    activeConnections: parseInt(rawUserInfo.active_cons),
    maxConnections: parseInt(rawUserInfo.max_connections),
    createdAt: rawUserInfo.created_at ? new Date(parseInt(rawUserInfo.created_at) * 1000).toISOString() : null,
    rawUserInfo,
    rawServerInfo,
  };

  const streamBaseUrl = `${rawServerInfo.server_protocol || 'http'}://${rawServerInfo.url}:${rawServerInfo.port}`;

  // 2. Map content from the main response
  const rawAvailableChannels: any[] = mainResponse.available_channels || [];
  const rawMovieData: any[] = mainResponse.vod_info || mainResponse.movie_data || []; // Some panels use vod_info
  const rawSeriesData: any[] = mainResponse.series_info || mainResponse.series_data || []; // Some panels use series_info

  const liveChannels: IPTVChannel[] = rawAvailableChannels.map((ch: any) => ({
    id: String(ch.stream_id),
    name: ch.name,
    logoUrl: ch.stream_icon || null,
    category: String(ch.category_id || 'uncategorized_live'), 
    streamUrl: `${streamBaseUrl}/live/${username}/${password}/${ch.stream_id}.${ch.container_extension || 'ts'}`,
    dataAiHint: 'tv logo',
    epg_channel_id: ch.epg_channel_id,
    added: ch.added, // Keep as string timestamp
    tv_archive: ch.tv_archive,
    tv_archive_duration: ch.tv_archive_duration,
    container_extension: ch.container_extension || 'ts',
  }));

  const movies: IPTVMovie[] = rawMovieData.map((m: any) => ({
    id: String(m.stream_id || m.vod_id), // vod_id for some panels
    name: m.name,
    coverImageUrl: m.stream_icon || m.cover_big || null,
    category: String(m.category_id || 'uncategorized_movie'),
    streamUrl: `${streamBaseUrl}/movie/${username}/${password}/${m.stream_id || m.vod_id}.${m.container_extension || 'mp4'}`,
    rating: m.rating_5based || m.rating || undefined,
    rating_5based: m.rating_5based,
    plot: m.plot || undefined, // Often not in list, but in get_vod_info
    cast: m.cast || undefined,
    director: m.director || undefined,
    genre: m.genre || undefined,
    duration: m.info?.duration || m.episode_run_time || undefined, 
    added: m.added, // Keep as string timestamp
    container_extension: m.container_extension || 'mp4',
    dataAiHint: 'movie poster',
  }));

  const series: IPTVSeries[] = rawSeriesData.map((s: any) => ({
    id: String(s.series_id),
    name: s.name,
    coverImageUrl: s.cover || s.cover_big || null,
    category: String(s.category_id || 'uncategorized_series'),
    plot: s.plot || undefined,
    cast: s.cast || undefined,
    director: s.director || undefined,
    genre: s.genre || undefined,
    releaseDate: s.releaseDate || s.release_date || undefined, 
    rating: s.rating_5based || s.rating || undefined,
    rating_5based: s.rating_5based,
    last_modified: s.last_modified, // Keep as string timestamp
    episode_run_time: s.episode_run_time,
    youtube_trailer: s.youtube_trailer,
    backdrop_path: s.backdrop_path,
    // seasonsCount can be derived if full series info is fetched later or if 'seasons' array is present.
    // For now, it's often not in the basic series list from player_api.php root.
    dataAiHint: 'series poster',
  }));

  // 3. Fetch Categories separately as they are usually not in the main dump
  const liveCategoriesRaw = await fetchFromXtreamAPI(playerApiUrl, { username, password, action: 'get_live_categories' }) || [];
  const movieCategoriesRaw = await fetchFromXtreamAPI(playerApiUrl, { username, password, action: 'get_vod_categories' }) || [];
  const seriesCategoriesRaw = await fetchFromXtreamAPI(playerApiUrl, { username, password, action: 'get_series_categories' }) || [];

  const categories = {
    live: liveCategoriesRaw.map((c: any) => ({ id: String(c.category_id), name: c.category_name, type: 'live' as const })),
    movie: movieCategoriesRaw.map((c: any) => ({ id: String(c.category_id), name: c.category_name, type: 'movie' as const })),
    series: seriesCategoriesRaw.map((c: any) => ({ id: String(c.category_id), name: c.category_name, type: 'series' as const })),
  };

  return {
    liveChannels,
    movies,
    series,
    categories,
    accountInfo,
    sourceType: 'xtream',
    dataSourceUrl: apiUrl, // Store the original API URL (host:port)
    rawAvailableChannels,
    rawMovieData,
    rawSeriesData,
  };
}
