'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Film, ShieldQuestion, HelpCircle, Info, ListVideo } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  // Mock settings state
  // In a real app, these would come from user preferences storage
  
  return (
    <div className="container mx-auto py-8 px-2 md:px-4 max-w-3xl">
      <Card className="shadow-xl">
        <CardHeader className="text-center border-b pb-6">
          <ListVideo className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl md:text-4xl font-bold">Application Settings</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Customize your RunTV Streamer experience.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-8">
          {/* Video Settings */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center"><Film className="mr-3 h-6 w-6 text-primary" /> Video & Playback</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <Label htmlFor="videoQuality" className="text-base font-medium">Default Video Quality</Label>
                <Select defaultValue="auto">
                  <SelectTrigger id="videoQuality" className="w-[180px] bg-background">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                    <SelectItem value="720p">720p (HD)</SelectItem>
                    <SelectItem value="480p">480p (SD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <Label htmlFor="videoPlayer" className="text-base font-medium">Preferred Video Player</Label>
                 <Select defaultValue="exoplayer">
                  <SelectTrigger id="videoPlayer" className="w-[180px] bg-background">
                    <SelectValue placeholder="Select player" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exoplayer">ExoPlayer (Recommended)</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                    <SelectItem value="custom">Custom Player</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label htmlFor="autoplayNext" className="text-base font-medium">Autoplay Next Episode</Label>
                  <p className="text-sm text-muted-foreground">Automatically play the next episode in a series.</p>
                </div>
                <Switch id="autoplayNext" defaultChecked />
              </div>
            </div>
          </section>

          <Separator />

          {/* Notification Settings */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center"><Bell className="mr-3 h-6 w-6 text-primary" /> Notifications</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label htmlFor="newContentNotifs" className="text-base font-medium">New Content Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify about new movies or series added.</p>
                </div>
                <Switch id="newContentNotifs" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                 <div>
                  <Label htmlFor="appUpdatesNotifs" className="text-base font-medium">App Updates & Offers</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new features and special offers.</p>
                </div>
                <Switch id="appUpdatesNotifs" />
              </div>
            </div>
          </section>

          <Separator />

          {/* Legal & Help Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center"><Info className="mr-3 h-6 w-6 text-primary" /> Information & Support</h2>
            <div className="space-y-3">
              <Link href="/terms" passHref legacyBehavior>
                <a target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full justify-start text-left py-5 text-base hover:bg-primary/10 hover:border-primary">
                    <ShieldQuestion className="mr-3 h-5 w-5 text-primary" /> Terms of Service (CGU)
                  </Button>
                </a>
              </Link>
              <Link href="/privacy" passHref legacyBehavior>
                 <a target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full justify-start text-left py-5 text-base hover:bg-primary/10 hover:border-primary">
                    <ShieldQuestion className="mr-3 h-5 w-5 text-primary" /> Privacy Policy
                  </Button>
                </a>
              </Link>
              <Link href="/help" passHref legacyBehavior>
                <a target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full justify-start text-left py-5 text-base hover:bg-primary/10 hover:border-primary">
                    <HelpCircle className="mr-3 h-5 w-5 text-primary" /> Help & Support Center
                  </Button>
                </a>
              </Link>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
