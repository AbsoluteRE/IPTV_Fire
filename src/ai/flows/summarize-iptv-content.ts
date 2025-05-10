'use server';
/**
 * @fileOverview Summarizes and categorizes IPTV content (channels, movies, series) after validating the Xtream API.
 *
 * - summarizeIPTVContent - A function that handles the IPTV content summarization process.
 * - SummarizeIPTVContentInput - The input type for the summarizeIPTVContent function.
 * - SummarizeIPTVContentOutput - The return type for the summarizeIPTVContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeIPTVContentInputSchema = z.object({
  xtreamApiUrl: z.string().describe('The URL for the Xtream Codes API.'),
  username: z.string().describe('The username for the Xtream Codes API.'),
  password: z.string().describe('The password for the Xtream Codes API.'),
});
export type SummarizeIPTVContentInput = z.infer<typeof SummarizeIPTVContentInputSchema>;

const SummarizeIPTVContentOutputSchema = z.object({
  summary: z.string().describe('A summary of the IPTV content, including the number of channels, movies, and series.'),
  categories: z.array(z.string()).describe('A list of categories available in the IPTV content.'),
});
export type SummarizeIPTVContentOutput = z.infer<typeof SummarizeIPTVContentOutputSchema>;

export async function summarizeIPTVContent(input: SummarizeIPTVContentInput): Promise<SummarizeIPTVContentOutput> {
  return summarizeIPTVContentFlow(input);
}

const summarizeIPTVContentPrompt = ai.definePrompt({
  name: 'summarizeIPTVContentPrompt',
  input: {schema: SummarizeIPTVContentInputSchema},
  output: {schema: SummarizeIPTVContentOutputSchema},
  prompt: `You are an expert in summarizing IPTV content. You will receive the URL, username, and password for an Xtream Codes API. You will use this information to summarize the IPTV content, including the number of channels, movies, and series, and a list of categories available.

Xtream API URL: {{{xtreamApiUrl}}}
Username: {{{username}}}
Password: {{{password}}}

Provide a summary of the IPTV content and a list of categories available.`, 
});

const summarizeIPTVContentFlow = ai.defineFlow(
  {
    name: 'summarizeIPTVContentFlow',
    inputSchema: SummarizeIPTVContentInputSchema,
    outputSchema: SummarizeIPTVContentOutputSchema,
  },
  async input => {
    const {output} = await summarizeIPTVContentPrompt(input);
    return output!;
  }
);
