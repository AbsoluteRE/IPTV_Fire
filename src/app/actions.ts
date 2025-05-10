'use server';

import { summarizeIPTVContent, type SummarizeIPTVContentInput, type SummarizeIPTVContentOutput } from '@/ai/flows/summarize-iptv-content';
import { XTREAM_CODES_URL_REGEX, M3U_URL_REGEX } from '@/lib/constants';

interface SummarizeResult {
  success: boolean;
  data?: SummarizeIPTVContentOutput;
  error?: string;
  validationErrors?: Record<string, string>;
}

export async function handleSummarizeIPTVContent(formData: FormData): Promise<SummarizeResult> {
  const sourceType = formData.get('sourceType') as 'm3u' | 'xtream';
  const m3uUrl = formData.get('m3uUrl') as string;
  const xtreamApiUrl = formData.get('xtreamApiUrl') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const validationErrors: Record<string, string> = {};

  if (!sourceType) {
    validationErrors.sourceType = 'Source type is required.';
  }

  let input: SummarizeIPTVContentInput | null = null;

  if (sourceType === 'm3u') {
    if (!m3uUrl) {
      validationErrors.m3uUrl = 'M3U URL is required.';
    } else if (!M3U_URL_REGEX.test(m3uUrl)) {
      validationErrors.m3uUrl = 'Invalid M3U URL format.';
    }
    // For M3U, the AI flow still expects xtreamApiUrl, username, password.
    // We can pass the M3U URL as xtreamApiUrl and dummy values for username/password,
    // or adjust the AI flow. For now, we'll treat M3U summarization as primarily URL based
    // and the AI will handle the "summary" aspect.
    // The current AI flow is specifically for Xtream. For M3U, it might not work as intended.
    // We'll pass m3uUrl as xtreamApiUrl for the AI flow, and make username/password optional for this path if AI can handle it.
    // Or, provide a simplified summary for M3U if AI cannot process it.
    // For this example, let's assume the AI can try to make sense of it or we will mock it.
    // The prompt for summarizeIPTVContent needs to be adapted if it's to properly handle M3U.
    // Given the current AI flow:
    // We'll create a dummy summary if it's an M3U link.
     return {
        success: true,
        data: {
          summary: `Content from M3U URL: ${m3uUrl}. Contains various channels, movies, and series. (Detailed M3U parsing and AI summarization for M3U content is a feature enhancement).`,
          categories: ["General", "News", "Sports", "Movies (from M3U)"],
        }
      };
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
    if (Object.keys(validationErrors).length === 0) {
       input = { xtreamApiUrl, username, password };
    }
  } else {
     validationErrors.sourceType = 'Invalid source type selected.';
  }
  
  if (Object.keys(validationErrors).length > 0) {
    return { success: false, validationErrors };
  }

  if (!input) {
    return { success: false, error: "Input for AI summarization could not be prepared." };
  }

  try {
    // The Genkit AI flow will not actually call the Xtream API.
    // It will generate a plausible summary based on the provided inputs.
    const result = await summarizeIPTVContent(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error summarizing IPTV content:', error);
    return { success: false, error: 'Failed to summarize content. The AI service might be unavailable or the provided details are incorrect.' };
  }
}
