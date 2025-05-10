// src/components/iptv/source-form.tsx
'use client';

import React, { useEffect, useState } from 'react';
// Removed: import { useFormState, useFormStatus } from 'react-dom';
// Added:
import { useFormStatus } from 'react-dom';
import { loadIPTVSourceAction } from '@/app/actions';
import type { LoadIPTVSourceResult } from '@/types/iptv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Loader2, CheckCircle2 } from 'lucide-react';
import { SourceSummary } from './source-summary';
import { useIPTVSource } from '@/contexts/iptv-source-context';
import { M3U_URL_REGEX, XTREAM_CODES_URL_REGEX } from '@/lib/constants';


const initialActionState: LoadIPTVSourceResult = {
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full text-lg py-6" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Connecting & Loading Data...
        </>
      ) : (
        'Add IPTV Source'
      )}
    </Button>
  );
}

export function SourceForm() {
  // Changed useFormState to React.useActionState
  const [state, formAction] = React.useActionState(loadIPTVSourceAction, initialActionState); 
  const [sourceType, setSourceType] = useState<'m3u' | 'xtream'>('xtream');
  const { setIPTVData, clearIPTVData, iptvData: existingIPTVData, setIsFetchingContent } = useIPTVSource();
  const { pending } = useFormStatus(); // To disable form inputs while submitting

  useEffect(() => {
    setIsFetchingContent(pending);
  }, [pending, setIsFetchingContent]);

  useEffect(() => {
    if (state.success && state.data) {
      setIPTVData(state.data);
    }
  }, [state, setIPTVData]);

  const handleRemoveSource = () => {
    clearIPTVData();
    // Reset the form action state if needed, although it will be fresh on next submit
  };

  if (existingIPTVData && !pending && !state.error) { // Ensure we don't show this if an error just occurred from a new submission attempt
    return (
      <div className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <CheckCircle2 className="h-8 w-8 text-green-500 mr-3" /> IPTV Source Configured
          </CardTitle>
          <CardDescription>
            Your IPTV source is active ({existingIPTVData.sourceType} - {existingIPTVData.dataSourceUrl}). You can now explore content or manage your source.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SourceSummary iptvData={existingIPTVData} />
        </CardContent>
        <CardFooter>
          <Button onClick={handleRemoveSource} variant="destructive" className="w-full">
            Remove Source & Add New
          </Button>
        </CardFooter>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      <RadioGroup
        name="sourceType"
        defaultValue="xtream"
        onValueChange={(value: 'm3u' | 'xtream') => setSourceType(value)}
        className="flex gap-4 mb-6"
        disabled={pending}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="xtream" id="xtream" />
          <Label htmlFor="xtream" className="text-lg font-medium">Xtream Codes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="m3u" id="m3u" />
          <Label htmlFor="m3u" className="text-lg font-medium">M3U URL</Label>
        </div>
      </RadioGroup>

      {sourceType === 'm3u' && (
        <div className="space-y-4 p-6 border border-dashed border-primary/50 rounded-lg bg-primary/5">
          <h3 className="text-xl font-semibold text-primary">M3U Playlist URL</h3>
          <div className="space-y-2">
            <Label htmlFor="m3uUrl">M3U/M3U8 URL</Label>
            <Input id="m3uUrl" name="m3uUrl" placeholder="http://example.com/playlist.m3u" className="bg-input/80" disabled={pending}/>
            {state.validationErrors?.m3uUrl && <p className="text-sm text-destructive">{state.validationErrors.m3uUrl}</p>}
            <p className="text-xs text-muted-foreground">Example: http://your.provider.com/get.php?username=USER&amp;password=PASS&amp;type=m3u_plus&amp;output=ts</p>
          </div>
        </div>
      )}

      {sourceType === 'xtream' && (
        <div className="space-y-4 p-6 border border-dashed border-primary/50 rounded-lg bg-primary/5">
           <h3 className="text-xl font-semibold text-primary">Xtream Codes API</h3>
          <div className="space-y-2">
            <Label htmlFor="xtreamApiUrl">API URL (Server Base)</Label>
            <Input id="xtreamApiUrl" name="xtreamApiUrl" placeholder="http://sub.example.com:80" className="bg-input/80" disabled={pending}/>
            {state.validationErrors?.xtreamApiUrl && <p className="text-sm text-destructive">{state.validationErrors.xtreamApiUrl}</p>}
             <p className="text-xs text-muted-foreground">Format: http://hostname:port (do not include /player_api.php or /panel_api.php)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="Your Xtream Username" className="bg-input/80" disabled={pending}/>
              {state.validationErrors?.username && <p className="text-sm text-destructive">{state.validationErrors.username}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Your Xtream Password" className="bg-input/80" disabled={pending}/>
              {state.validationErrors?.password && <p className="text-sm text-destructive">{state.validationErrors.password}</p>}
            </div>
          </div>
        </div>
      )}
      
      {state.validationErrors?.sourceType && <p className="text-sm text-destructive mt-2">{state.validationErrors.sourceType}</p>}

      <SubmitButton />

      {state.error && (
        <Alert variant="destructive" className="mt-6">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Adding Source</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state.success && state.data && !existingIPTVData && (
         <Alert variant="default" className="mt-6 bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700 dark:text-green-300">Source Added Successfully!</AlertTitle>
          <AlertDescription className="text-green-600 dark:text-green-400">
            Your IPTV source has been connected and initial data loaded.
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
}
