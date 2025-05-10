
'use server';
/**
 * @fileOverview Summarizes and categorizes IPTV content (channels, movies, series) after validating the Xtream API.
 * NOTE: This AI flow is designed to generate a *plausible summary* based on inputs.
 * It *does not* perform actual API calls to an Xtream server to fetch real data.
 * Real data fetching is handled by dedicated services in `src/services/`.
 *
 * - summarizeIPTVContent - A function that handles the IPTV content summarization process.
 * - SummarizeIPTVContentInput - The input type for the summarizeIPTVContent function.
 * - SummarizeIPTVContentOutput - The return type for the summarizeIPTVContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// This input schema is for the AI to generate a summary from.
const SummarizeIPTVContentInputSchema = z.object({
  xtreamApiUrl: z.string().describe('The URL for the Xtream Codes API.'),
  username: z.string().describe('The username for the Xtream Codes API.'),
  password: z.string().describe('The password for the Xtream Codes API.'),
});
export type SummarizeIPTVContentInput = z.infer<typeof SummarizeIPTVContentInputSchema>;

// This output schema is what the AI is prompted to generate.
const SummarizeIPTVContentOutputSchema = z.object({
  summary: z.string().describe('A plausible summary of the IPTV content, including mock numbers of channels, movies, and series.'),
  categories: z.array(z.string()).describe('A list of plausible categories available in the IPTV content.'),
  // Adding some fields that might be in a real Xtream response for the AI to consider.
  accountStatus: z.string().optional().describe("Plausible account status, e.g., 'Active', 'Expired'."),
  expirationDate: z.string().optional().describe("Plausible expiration date, e.g., '2025-12-31'."),
  maxConnections: z.number().optional().describe("Plausible number of maximum connections, e.g., 2."),
});
export type SummarizeIPTVContentOutput = z.infer<typeof SummarizeIPTVContentOutputSchema>;

export async function summarizeIPTVContent(input: SummarizeIPTVContentInput): Promise<SummarizeIPTVContentOutput> {
  // This function is kept for potential direct calls if needed, but the primary data loading
  // path in actions.ts will bypass this for actual data fetching.
  return summarizeIPTVContentFlow(input);
}

const summarizeIPTVContentPrompt = ai.definePrompt({
  name: 'summarizeIPTVContentPrompt',
  input: {schema: SummarizeIPTVContentInputSchema},
  output: {schema: SummarizeIPTVContentOutputSchema},
  prompt: `You are an assistant that generates a plausible but FAKE summary of IPTV content based on provided Xtream Codes API credentials.
DO NOT attempt to actually connect to any URL. You are generating a realistic-sounding mock summary.

Xtream API URL: {{{xtreamApiUrl}}}
Username: {{{username}}}
Password: {{{password}}}

Based on these (which you should assume are valid for a typical IPTV service), generate:
1. A brief summary paragraph mentioning a realistic (but fake) number of live channels (e.g., 1000-5000), movies (e.g., 5000-20000), and series (e.g., 500-2000).
2. A list of 5-7 common IPTV categories (e.g., Sports, News, Movies, Kids, Documentaries, International, Adult).
3. A plausible accountStatus (e.g., "Active").
4. A plausible expirationDate (e.g., a date 6-12 months in the future).
5. A plausible maxConnections (e.g., 1, 2, or 3).

Example Output Structure (but vary the content):
Summary: "This IPTV service offers a vast selection with approximately 3200 live channels, over 15000 movies, and 1200 TV series. Content is regularly updated..."
Categories: ["Sports", "HD Channels", "Movies International", "Kids TV", "Documentaries", "News Global"]
AccountStatus: "Active"
ExpirationDate: "2025-07-15"
MaxConnections: 2
`, 
});

const summarizeIPTVContentFlow = ai.defineFlow(
  {
    name: 'summarizeIPTVContentFlow',
    inputSchema: SummarizeIPTVContentInputSchema,
    outputSchema: SummarizeIPTVContentOutputSchema,
  },
  async input => {
    const {output} = await summarizeIPTVContentPrompt(input);
    if (!output) {
        // Provide a default fallback if AI fails to generate output
        return {
            summary: "Could not generate AI summary. Default: A large selection of channels, movies, and series is typically available.",
            categories: ["General", "Movies", "Series", "Sports"],
            accountStatus: "Unknown",
            expirationDate: undefined,
            maxConnections: undefined,
        };
    }
    return output;
  }
);

