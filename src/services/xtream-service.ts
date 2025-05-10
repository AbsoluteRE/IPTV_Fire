// src/services/xtream-service.ts
'use server';

import type { IPTVData, IPTVAccountInfo, IPTVCategory, IPTVChannel, IPTVMovie, IPTVSeries } from '@/types/iptv';

// Placeholder for actual API calls
async function fetchFromXtreamAPI(apiUrl: string, params: Record<string, string>): Promise<any> {
  const fullUrl = new URL(apiUrl);
  Object.entries(params).forEach(([key, value]) => fullUrl.searchParams.append(key, value));
  
  // In a real implementation:
  // const response = await fetch(fullUrl.toString());
  // if (!response.ok) throw new Error(`Xtream API request failed: ${response.statusText}`);
  // return response.json();

  // Mock responses for now:
  if (params.action === 'get_user_info') {
    return {
      user_info: {
        username: params.username, auth: 1, status: 'Active', exp_date: String(Date.now() / 1000 + 30 * 24 * 60 * 60), 
        is_trial: "0", active_cons: "0", created_at: String(Date.now() / 1000 - 60 * 24 * 60 * 60), max_connections: "2",
        allowed_output_formats: ["m3u8", "ts"],
      },
      server_info: { url: new URL(apiUrl).hostname, port: new URL(apiUrl).port, https_port: "443", server_protocol: "http", timezone: "UTC", timestamp_now: String(Date.now()/1000), time_now: new Date().toISOString()}
    };
  }
  if (params.action === 'get_live_categories' || params.action === 'get_vod_categories' || params.action === 'get_series_categories') {
    const type = params.action.includes('live') ? 'live' : params.action.includes('vod') ? 'movie' : 'series';
    return [
      { category_id: `cat_${type}_1`, category_name: `${type.toUpperCase()} Category 1`, parent_id: 0 },
      { category_id: `cat_${type}_2`, category_name: `${type.toUpperCase()} Category 2`, parent_id: 0 },
    ];
  }
  if (params.action === 'get_live_streams') {
    return [
      { num: 1, name: 'Live Channel 1 HD', stream_type: 'live', stream_id: 101, stream_icon: 'https://picsum.photos/100/100?random=1&grayscale', epg_channel_id: null, added: String(Date.now()/1000), category_id: 'cat_live_1', tv_archive: 0, direct_source: '', tv_archive_duration: 0 },
      { num: 2, name: 'Live Channel 2 FHD', stream_type: 'live', stream_id: 102, stream_icon: 'https://picsum.photos/100/100?random=2&grayscale', epg_channel_id: null, added: String(Date.now()/1000), category_id: 'cat_live_1', tv_archive: 0, direct_source: '', tv_archive_duration: 0 },
    ];
  }
  if (params.action === 'get_vod_streams') {
    return [
      { num: 1, name: 'Awesome Movie 1', stream_type: 'movie', stream_id: 201, stream_icon: 'https://picsum.photos/200/300?random=3', rating: "8.5", rating_5based: 4.2, added: String(Date.now()/1000), category_id: 'cat_movie_1', container_extension: 'mp4', custom_sid: '', direct_source: '' },
      { num: 2, name: 'Fantastic Movie 2', stream_type: 'movie', stream_id: 202, stream_icon: 'https://picsum.photos/200/300?random=4', rating: "7.0", rating_5based: 3.5, added: String(Date.now()/1000), category_id: 'cat_movie_1', container_extension: 'mkv', custom_sid: '', direct_source: '' },
    ];
  }
   if (params.action === 'get_series') { // simplified, get_series_info for details usually
    return [
      { num: 1, name: 'Epic Series 1', series_id: 301, cover: 'https://picsum.photos/200/300?random=5', plot: 'An epic tale.', cast: 'Actor A, Actor B', director: 'Director X', genre: 'Adventure', releaseDate: '2023-01-01', last_modified: String(Date.now()/1000), rating: "9.0", rating_5based: 4.5, episode_run_time: "45", youtube_trailer: '', category_id: 'cat_series_1' },
    ];
  }
  return []; // Default empty for other actions
}


export async function fetchXtreamData(apiUrl: string, username: string, password: string): Promise<IPTVData> {
  const playerApiUrl = `${apiUrl.replace(/\/$/, '')}/player_api.php`; // Ensure correct player_api.php path

  // 1. Get User Info (includes auth check)
  const userInfoResponse = await fetchFromXtreamAPI(playerApiUrl, { username, password, action: 'get_user_info' });
  if (!userInfoResponse || !userInfoResponse.user_info || userInfoResponse.user_info.auth !== 1) {
    throw new Error(userInfoResponse?.user_info?.message || 'Authentication failed or invalid user info.');
  }
  
  const accountInfo: IPTVAccountInfo = {
    ...userInfoResponse.user_info,
    username: userInfoResponse.user_info.username,
    status: userInfoResponse.user_info.status,
    expiryDate: userInfoResponse.user_info.exp_date ? new Date(parseInt(userInfoResponse.user_info.exp_date) * 1000).toISOString() : null,
    isTrial: userInfoResponse.user_info.is_trial === "1",
    activeConnections: parseInt(userInfoResponse.user_info.active_cons),
    maxConnections: parseInt(userInfoResponse.user_info.max_connections),
    createdAt: userInfoResponse.user_info.created_at ? new Date(parseInt(userInfoResponse.user_info.created_at) * 1000).toISOString() : null,
  };

  // 2. Fetch Categories
  const liveCategoriesRaw = await fetchFromXtreamAPI(playerApiUrl, { username, password, action: 'get_live_categories' }) || [];
  const movieCategoriesRaw = await fetchFromXtreamAPI(playerApiUrl, { username, password, action: 'get_vod_categories' }) || [];
  const seriesCategoriesRaw = await fetchFromXtreamAPI(playerApiUrl, { username, password, action: 'get_series_categories' }) || [];

  const categories: IPTVData['categories'] = {
    live: liveCategoriesRaw.map((c: any) => ({ id: String(c.category_id), name: c.category_name, type: 'live' })),
    movie: movieCategoriesRaw.map((c: any) => ({ id: String(c.category_id), name: c.category_name, type: 'movie' })),
    series: seriesCategoriesRaw.map((c: any) => ({ id: String(c.category_id), name: c.category_name, type: 'series' })),
  };
  
  // 3. Fetch Content (simplified: fetching all, no category filter for mock)
  const liveChannelsRaw = await fetchFromXtreamAPI(playerApiUrl, { username, password, action: 'get_live_streams' }) || [];
  const moviesRaw = await fetchFromXtreamAPI(playerApiUrl, { username, password, action: 'get_vod_streams' }) || [];
  const seriesRaw = await fetchFromXtreamAPI(playerApiUrl, { username, password, action: 'get_series' }) || []; // This is for series list, not episodes

  const liveChannels: IPTVChannel[] = liveChannelsRaw.map((ch: any) => ({
    id: String(ch.stream_id),
    name: ch.name,
    logoUrl: ch.stream_icon || null,
    category: String(ch.category_id), // In real app, map to category name
    streamUrl: `${playerApiUrl.replace('/player_api.php', '')}/${params.username}/${params.password}/${ch.stream_id}.${ch.container_extension || 'ts'}`, // construct stream URL
    dataAiHint: 'tv logo'
  }));

  const movies: IPTVMovie[] = moviesRaw.map((m: any) => ({
    id: String(m.stream_id),
    name: m.name,
    coverImageUrl: m.stream_icon || null,
    category: String(m.category_id),
    streamUrl: `${playerApiUrl.replace('/player_api.php', '')}/movie/${params.username}/${params.password}/${m.stream_id}.${m.container_extension || 'mp4'}`,
    rating: m.rating_5based || m.rating || undefined,
    plot: m.plot || undefined,
    duration: m.episode_run_time || undefined, // Xtream sometimes uses this for VOD duration
    dataAiHint: 'movie poster',
  }));

  const series: IPTVSeries[] = seriesRaw.map((s: any) => ({
    id: String(s.series_id),
    name: s.name,
    coverImageUrl: s.cover || null,
    category: String(s.category_id),
    plot: s.plot || undefined,
    cast: s.cast || undefined,
    director: s.director || undefined,
    genre: s.genre || undefined,
    releaseDate: s.releaseDate || undefined, // Xtream uses releaseDate
    rating: s.rating_5based || s.rating || undefined,
    // seasons/episodes count typically comes from get_series_info
    seasonsCount: s.seasons?.length || undefined, // This is a guess if seasons array is part of basic series list
    dataAiHint: 'series poster',
  }));

  return {
    liveChannels,
    movies,
    series,
    categories,
    accountInfo,
    sourceType: 'xtream',
    dataSourceUrl: apiUrl,
  };
}
