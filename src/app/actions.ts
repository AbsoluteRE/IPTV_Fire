// src/app/actions.ts
'use server';

import { XTREAM_CODES_URL_REGEX, M3U_URL_REGEX } from '@/lib/constants';
import type { LoadIPTVSourceResult } from '@/types/iptv';
import { fetchXtreamData } from '@/services/xtream-service';
import { parseM3UFile } from '@/services/m3u-parser';

// The summarizeIPTVContent AI flow from src/ai/flows/summarize-iptv-content.ts
// is no longer suitable for the primary task of fetching and structuring actual IPTV data.
// We will call direct service functions instead.

export async function loadIPTVSourceAction(
  prevState: LoadIPTVSourceResult | null, // prevState can be null initially
  formData: FormData
): Promise<LoadIPTVSourceResult> {
  const sourceType = formData.get('sourceType') as 'm3u' | 'xtream' | null;
  const m3uUrl = formData.get('m3uUrl') as string | null;
  const xtreamApiUrl = formData.get('xtreamApiUrl') as string | null;
  const username = formData.get('username') as string | null;
  const password = formData.get('password') as string | null;

  const validationErrors: Record<string, string> = {};

  if (!sourceType) {
    validationErrors.sourceType = 'Source type is required.';
  }

  if (sourceType === 'm3u') {
    if (!m3uUrl) {
      validationErrors.m3uUrl = 'M3U URL is required.';
    } else if (!M3U_URL_REGEX.test(m3uUrl)) {
      // Allow URLs like http://vip.sipderott4k.info:14820/get.php?...
      // The current M3U_URL_REGEX might be too restrictive. Let's simplify or trust user input more for M3U.
      // For now, we accept it if it's a string. More robust validation can be added.
      // A simple check for starting with http/https might be enough initially for M3U.
      if (!m3uUrl.startsWith('http://') && !m3uUrl.startsWith('https://')) {
         validationErrors.m3uUrl = 'Invalid M3U URL format. Must start with http:// or https://.';
      }
    }
  } else if (sourceType === 'xtream') {
    if (!xtreamApiUrl) {
      validationErrors.xtreamApiUrl = 'Xtream API URL is required.';
    } else if (!XTREAM_CODES_URL_REGEX.test(xtreamApiUrl)) {
      validationErrors.xtreamApiUrl = 'Invalid Xtream API URL format. Expected http://hostname:port';
    }
    if (!username) {
      validationErrors.username = 'Username is required.';
    }
    if (!password) {
      validationErrors.password = 'Password is required.';
    }
  } else if (sourceType) { // sourceType is not null but also not 'm3u' or 'xtream'
     validationErrors.sourceType = 'Invalid source type selected.';
  }
  
  if (Object.keys(validationErrors).length > 0) {
    return { success: false, validationErrors };
  }

  try {
    if (sourceType === 'm3u' && m3uUrl) {
      const data = await parseM3UFile(m3uUrl);
      return { success: true, data };
    } else if (sourceType === 'xtream' && xtreamApiUrl && username && password) {
      const data = await fetchXtreamData(xtreamApiUrl, username, password);
      return { success: true, data };
    } else {
      // Should not happen if validation is correct
      return { success: false, error: "Incomplete or invalid input for the selected source type." };
    }
  } catch (error) {
    console.error('Error processing IPTV source:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { 
        success: false, 
        error: `Failed to load IPTV source: ${errorMessage}`,
    };
  }
}
