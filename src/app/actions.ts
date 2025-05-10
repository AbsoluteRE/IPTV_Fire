// src/app/actions.ts
'use server';

import { XTREAM_CODES_URL_REGEX, M3U_URL_REGEX } from '@/lib/constants';
import type { LoadIPTVSourceResult, DnsStatusResult, IPTVData } from '@/types/iptv';
import { fetchXtreamData } from '@/services/xtream-service';
import { parseM3UFile } from '@/services/m3u-parser';

export async function loadIPTVSourceAction(
  prevState: LoadIPTVSourceResult | null,
  formData: FormData
): Promise<LoadIPTVSourceResult> {
  const sourceType = formData.get('sourceType') as 'm3u' | 'xtream' | null;
  const m3uUrl = formData.get('m3uUrl') as string | null;
  let xtreamApiUrl = formData.get('xtreamApiUrl') as string | null;
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
       validationErrors.m3uUrl = 'Invalid M3U URL format. Must be a valid URL (e.g., http(s)://...).';
    }
  } else if (sourceType === 'xtream') {
    if (!xtreamApiUrl) {
      validationErrors.xtreamApiUrl = 'Xtream API URL is required.';
    } else {
      // Ensure URL ends with host:port, no trailing slash or path
      try {
        const urlObj = new URL(xtreamApiUrl);
        if (urlObj.pathname !== '/' && urlObj.pathname !== '') {
            // Allow common paths like /c/ or /mag/
            if (!['/c/', '/c', '/mag/', '/mag'].includes(urlObj.pathname) && !urlObj.pathname.endsWith('php')) {
                 // If it's not a known common path or ends with php, reconstruct to base
                 xtreamApiUrl = `${urlObj.protocol}//${urlObj.host}`; // This ensures it's base host:port
            } else {
                 xtreamApiUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname.replace(/\/$/,'')}`; // Keep path but remove trailing slash
            }

        } else {
             xtreamApiUrl = `${urlObj.protocol}//${urlObj.host}`; // Base host:port
        }

        if (!XTREAM_CODES_URL_REGEX.test(xtreamApiUrl) && !xtreamApiUrl.includes('player_api.php')) { // Allow full player_api.php urls as well
             // If the reconstructed URL is still not valid (e.g. missing port for http), try original
             if(formData.get('xtreamApiUrl') && XTREAM_CODES_URL_REGEX.test(formData.get('xtreamApiUrl') as string)){
                xtreamApiUrl = formData.get('xtreamApiUrl') as string;
             } else {
                validationErrors.xtreamApiUrl = 'Invalid Xtream API URL. Expected http(s)://hostname:port or a full API path.';
             }
        }

      } catch (e) {
        validationErrors.xtreamApiUrl = 'Invalid Xtream API URL format.';
      }
    }
    if (!username) {
      validationErrors.username = 'Username is required.';
    }
    if (!password) {
      validationErrors.password = 'Password is required.';
    }
  } else if (sourceType) {
     validationErrors.sourceType = 'Invalid source type selected.';
  }
  
  if (Object.keys(validationErrors).length > 0) {
    return { success: false, validationErrors };
  }

  try {
    let data: IPTVData | undefined;
    if (sourceType === 'm3u' && m3uUrl) {
      data = await parseM3UFile(m3uUrl);
    } else if (sourceType === 'xtream' && xtreamApiUrl && username && password) {
      data = await fetchXtreamData(xtreamApiUrl, username, password);
    } else {
      return { success: false, error: "Incomplete or invalid input for the selected source type." };
    }
    return { success: true, data };
  } catch (error) {
    console.error('Error processing IPTV source:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    // Avoid overly technical messages like "failed to fetch"
    if (errorMessage.toLowerCase().includes('failed to fetch') || errorMessage.toLowerCase().includes('networkerror')) {
        return { success: false, error: `Could not connect to the IPTV server. Please check the URL and your network connection.`};
    }
    return { 
        success: false, 
        error: `Failed to load IPTV source: ${errorMessage}`,
    };
  }
}


export async function checkDnsStatus(hostUrl: string): Promise<DnsStatusResult> {
  if (!hostUrl) {
    return { status: 'Error', error: 'Host URL is required.' };
  }

  let urlToTest: URL;
  try {
    // Use the provided hostUrl directly for the HEAD request as per spec: GET http://{{xtream_url}}/
    // The xtream_url is typically the host:port part
    urlToTest = new URL(hostUrl); 
  } catch (e) {
    return { status: 'Error', error: 'Invalid host URL format.' };
  }
  
  try {
    const response = await fetch(urlToTest.toString(), { method: 'HEAD', mode: 'cors', signal: AbortSignal.timeout(5000) }); // 5s timeout
    if (response.status === 200) {
      return { status: 'Online', statusCode: response.status };
    } else if (response.status === 503) {
      return { status: 'Maintenance', statusCode: response.status };
    } else {
      return { status: 'Offline', statusCode: response.status };
    }
  } catch (error) {
    console.warn(`DNS status check for ${urlToTest.toString()} failed:`, error);
    // This could be a network error, CORS issue (if browser runs this directly), or timeout
    if (error instanceof Error && error.name === 'AbortError') {
       return { status: 'Offline', error: 'Request timed out.' };
    }
    // For client-side, CORS errors on HEAD requests to different origins are common if not configured server-side.
    // However, this is a server action, so CORS shouldn't be an issue unless the target server itself blocks.
    return { status: 'Offline', error: 'Could not connect or unexpected response.' };
  }
}
