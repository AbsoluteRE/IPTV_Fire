import { SourceForm } from '@/components/iptv/source-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TvIcon } from 'lucide-react';

export default function AddSourcePage() {
  return (
    <div className="container mx-auto py-8 px-4 h-full flex flex-col">
      <Card className="w-full max-w-3xl mx-auto shadow-xl bg-card flex-grow">
        <CardHeader className="text-center border-b pb-6">
          <div className="flex justify-center mb-4">
            <TvIcon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold">Configure Your IPTV Source</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Add your M3U playlist or Xtream Codes API details to start streaming.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-10">
          <SourceForm />
        </CardContent>
      </Card>
    </div>
  );
}
