// src/types/iptv.ts

export interface IPTVChannel {
  id: string; // e.g., stream_id from Xtream or a generated ID from M3U
  name: string;
  logoUrl: string | null;
  category: string; // Or categoryId
  streamUrl: string;
  epgData?: {
    title: string;
    startTime: string; // ISO string or timestamp
    endTime: string; // ISO string or timestamp
    description?: string;
  };
  dataAiHint?: string; // For placeholder images
}

export interface IPTVMovie {
  id: string; // e.g., stream_id from Xtream or a generated ID from M3U
  name: string;
  coverImageUrl: string | null;
  category: string; // Or categoryId
  streamUrl: string;
  rating?: number | string;
  year?: string;
  plot?: string;
  cast?: string;
  director?: string;
  genre?: string;
  duration?: string; // e.g., "1h 30m" or minutes as string/number
  dataAiHint?: string; // For placeholder images
}

export interface IPTVEpisode {
  id: string; // e.g., episode_id from Xtream
  title: string;
  seasonNumber: number;
  episodeNumber: number;
  streamUrl: string;
  coverImageUrl?: string | null;
  plot?: string;
  duration?: string; // e.g., "45m" or minutes
  releaseDate?: string;
  rating?: number | string;
  dataAiHint?: string; // For placeholder images
}

export interface IPTVSeries {
  id: string; // e.g., series_id from Xtream
  name: string;
  coverImageUrl: string | null;
  category: string; // Or categoryId
  plot?: string;
  cast?: string;
  director?: string;
  genre?: string;
  releaseDate?: string;
  rating?: number | string;
  // Seasons and episodes can be loaded separately or fetched with series info
  // For simplicity here, we might load them on demand or include a summary
  seasonsCount?: number;
  episodesCount?: number;
  // episodes?: IPTVEpisode[]; // If fetching all upfront, not recommended for large series
  dataAiHint?: string; // For placeholder images
}


export interface IPTVCategory {
  id: string; // category_id
  name: string;
  type: 'live' | 'movie' | 'series'; // To distinguish category types
  parentId?: string | null;
}

export interface IPTVAccountInfo {
  username: string;
  status: string;
  expiryDate: string | null;
  isTrial: boolean;
  activeConnections: number;
  maxConnections: number;
  createdAt?: string | null;
  // V1 Xtream fields
  auth?: 1 | 0; // 1 for authenticated, 0 for not
  message?: string; // Message from server, e.g. "Invalid Credentials"
  user_info?: {
    username: string;
    password?: string; // Usually not returned for security
    message?: string;
    auth: 1 | 0;
    status: string; // "Active", "Expired", "Banned", "Disabled"
    exp_date: string | null; // "1609459199" (timestamp) or null
    is_trial: "0" | "1";
    active_cons: string; // "0"
    created_at: string; // "1577836800" (timestamp)
    max_connections: string; // "1"
    allowed_output_formats: string[]; // ["m3u8", "ts"]
  };
  server_info?: {
    url: string;
    port: string;
    https_port: string;
    server_protocol: "http" | "https";
    rtmp_port: string;
    timezone: string; // "Europe/Paris"
    timestamp_now: string; // "1606750216"
    time_now: string; // "2020-11-30 15:30:16"
  };
}

export interface IPTVData {
  liveChannels: IPTVChannel[];
  movies: IPTVMovie[];
  series: IPTVSeries[];
  categories: {
    live: IPTVCategory[];
    movie: IPTVCategory[];
    series: IPTVCategory[];
  };
  accountInfo: IPTVAccountInfo | null;
  sourceType: 'm3u' | 'xtream';
  dataSourceUrl: string; 
}

// Result from the server action `loadIPTVSource`
export interface LoadIPTVSourceResult {
  success: boolean;
  data?: IPTVData;
  error?: string;
  validationErrors?: Record<string, string>;
}
