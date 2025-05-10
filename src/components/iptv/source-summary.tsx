import type { SummarizeIPTVContentOutput } from '@/ai/flows/summarize-iptv-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListTree, Tv, Film, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface SourceSummaryProps {
  summary: SummarizeIPTVContentOutput | null;
}

// Helper to parse the AI summary string for structured data (basic example)
// In a real scenario, the AI flow should return structured data.
// For now, we assume the summary string might contain keywords.
const parseSummaryDetails = (summaryText: string) => {
  const details: Record<string, string | number> = {};
  const lines = summaryText.split(',').map(line => line.trim());
  
  lines.forEach(line => {
    if (line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      details[key.trim().toLowerCase().replace(/\s+/g, '_')] = value;
    }
  });

  // Extract counts if available
  const channelsMatch = summaryText.match(/(\d+)\s*Chaînes/i) || summaryText.match(/Channels:\s*(\d+)/i);
  if (channelsMatch) details.channels = parseInt(channelsMatch[1]);

  const moviesMatch = summaryText.match(/(\d+)\s*Films/i) || summaryText.match(/Movies:\s*(\d+)/i);
  if (moviesMatch) details.movies = parseInt(moviesMatch[1]);

  const seriesMatch = summaryText.match(/(\d+)\s*Séries/i) || summaryText.match(/Series:\s*(\d+)/i);
  if (seriesMatch) details.series = parseInt(seriesMatch[1]);

  return details;
};


export function SourceSummary({ summary }: SourceSummaryProps) {
  if (!summary) {
    return (
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Info className="mr-2 h-5 w-5 text-blue-500" /> No Summary Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">IPTV source summary data is not available.</p>
        </CardContent>
      </Card>
    );
  }

  const details = parseSummaryDetails(summary.summary);
  const statusText = (details.statut || details.xtream_status || "Unknown").toString();
  const isActive = statusText.toLowerCase().includes('active') || statusText.toLowerCase().includes('online');

  return (
    <Card className="shadow-lg border-primary/30 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-semibold">
          {isActive ? <CheckCircle className="mr-3 h-7 w-7 text-green-500" /> : <AlertCircle className="mr-3 h-7 w-7 text-yellow-500" />}
          Source Status: <Badge variant={isActive ? "default" : "destructive"} className={`ml-2 px-3 py-1 text-sm ${isActive ? 'bg-green-500/80 hover:bg-green-500' : 'bg-yellow-500/80 hover:bg-yellow-500'} text-white`}>{statusText}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-invert max-w-none text-muted-foreground">
          <p className="text-lg">{summary.summary}</p>
        </div>

        {(details.expiration || details.date_d_expiration) && (
          <p className="text-sm">
            <strong className="text-foreground">Expiration:</strong> { (details.expiration || details.date_d_expiration).toString() }
          </p>
        )}
        {(details.screens_max || details.ecrans_max) && (
          <p className="text-sm">
            <strong className="text-foreground">Max Connections:</strong> { (details.screens_max || details.ecrans_max).toString() }
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {details.channels && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Tv className="h-6 w-6 text-primary" />
              <div>
                <p className="text-lg font-semibold text-foreground">{details.channels}</p>
                <p className="text-xs text-muted-foreground">Live Channels</p>
              </div>
            </div>
          )}
          {details.movies && (
             <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Film className="h-6 w-6 text-primary" />
               <div>
                <p className="text-lg font-semibold text-foreground">{details.movies}</p>
                <p className="text-xs text-muted-foreground">Movies (VOD)</p>
              </div>
            </div>
          )}
          {details.series && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <ListTree className="h-6 w-6 text-primary" />
              <div>
                <p className="text-lg font-semibold text-foreground">{details.series}</p>
                <p className="text-xs text-muted-foreground">TV Series</p>
              </div>
            </div>
          )}
        </div>
        
        {summary.categories && summary.categories.length > 0 && (
          <div className="pt-4">
            <h4 className="text-lg font-semibold mb-2 text-foreground">Available Categories:</h4>
            <div className="flex flex-wrap gap-2">
              {summary.categories.map((category, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1 text-sm bg-accent/70 text-accent-foreground hover:bg-accent">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
