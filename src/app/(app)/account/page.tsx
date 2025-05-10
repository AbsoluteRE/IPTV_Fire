
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SourceSummary } from "@/components/iptv/source-summary"; 
import { useAuth } from "@/contexts/auth-context";
import { useIPTVSource } from "@/contexts/iptv-source-context";
import { User, Mail, ShieldCheck, Edit3, LogOut, Trash2, Tv, History, CreditCard, Loader2, AlertTriangle, CalendarDays, ListChecks } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock data - replace with actual data from your backend/context
const userProfile = {
  name: "John Doe", // This should come from auth context eventually
  email: "john.doe@example.com",
  avatarUrl: "https://picsum.photos/200/200?grayscale",
  profiles: [
    { id: '1', name: 'Main Profile', avatar: 'https://picsum.photos/100/100?random=31' },
    { id: '2', name: 'Kids', avatar: 'https://picsum.photos/100/100?random=32' },
  ],
  maxProfiles: 5,
};

const subscription = {
  status: "Active", 
  plan: "Premium (Zen Access)",
  expirationDate: "2024-12-31",
  isPremium: true,
};

export default function AccountPage() {
  const { logout } = useAuth();
  const { iptvData, loading: iptvContextLoading, isFetchingContent } = useIPTVSource();
  const router = useRouter();

  const isLoadingIPTVData = iptvContextLoading || isFetchingContent;

  const handleLogout = () => {
    logout();
  };

  const handleDeleteAccount = () => {
    if(confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      console.log("Account deletion initiated for", userProfile.email);
      logout(); 
    }
  };

  return (
    <div className="container mx-auto py-8 px-2 md:px-4 max-w-4xl">
      <Card className="shadow-xl">
        <CardHeader className="text-center border-b pb-6">
          <User className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl md:text-4xl font-bold">Account Management</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Manage your profile, subscription, and IPTV source details.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-8">
          {/* Profile Section */}
          <section id="profile">
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><User className="mr-3 h-6 w-6 text-primary" /> Profile</h2>
            <div className="flex items-center space-x-6 p-6 bg-muted/30 rounded-lg">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} data-ai-hint="person avatar" />
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">{userProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-bold">{userProfile.name}</h3>
                <p className="text-muted-foreground flex items-center"><Mail className="mr-2 h-4 w-4" /> {userProfile.email}</p>
                <Link href="/account/edit" passHref>
                  <Button variant="outline" size="sm" className="mt-3">
                    <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-lg font-medium mb-2">User Profiles ({userProfile.profiles.length}/{userProfile.maxProfiles})</h4>
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {userProfile.profiles.map(p => (
                  <div key={p.id} className="flex flex-col items-center p-2 bg-muted/20 rounded-md w-24 shrink-0">
                    <Avatar className="h-12 w-12 mb-1">
                       <AvatarImage src={p.avatar} alt={p.name} data-ai-hint="profile picture" />
                       <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-center truncate w-full">{p.name}</span>
                  </div>
                ))}
                {userProfile.profiles.length < userProfile.maxProfiles && (
                  <Button variant="outline" size="sm" className="w-24 h-auto flex flex-col items-center justify-center shrink-0">
                    <User className="h-8 w-8 mb-1" /> Add
                  </Button>
                )}
              </div>
            </div>
          </section>

          <Separator />

          {/* Subscription Section */}
          <section id="subscription">
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><CreditCard className="mr-3 h-6 w-6 text-primary" /> Subscription</h2>
            <div className="p-6 bg-muted/30 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <span className={`font-semibold ${subscription.status === "Active" ? "text-green-500" : "text-red-500"}`}>{subscription.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Plan:</span>
                <span className="font-semibold">{subscription.plan}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Expires On:</span>
                <span className="font-semibold">{subscription.expirationDate}</span>
              </div>
              <Button className="w-full mt-4" variant={subscription.isPremium ? "outline" : "default"}>
                {subscription.isPremium ? "Manage Subscription" : "Upgrade to Premium"}
              </Button>
            </div>
          </section>
          
          <Separator />

          {/* IPTV Source Info */}
          <section id="iptv-source">
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><Tv className="mr-3 h-6 w-6 text-primary" /> IPTV Source</h2>
            {isLoadingIPTVData ? (
                <div className="flex items-center justify-center p-6 border-2 border-dashed border-border rounded-lg">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    <p className="text-muted-foreground">Loading IPTV source details...</p>
                </div>
            ) : iptvData ? (
              <div>
                <SourceSummary iptvData={iptvData} />
                <Button variant="outline" className="w-full mt-4" onClick={() => router.push('/add-source')}>Manage Source</Button>
              </div>
            ) : (
              <div className="text-center p-6 border-2 border-dashed border-border rounded-lg">
                 <AlertTriangle className="mx-auto h-10 w-10 text-yellow-500 mb-3" />
                <p className="text-muted-foreground mb-3">No IPTV source configured.</p>
                <Button onClick={() => router.push('/add-source')}>Add IPTV Source</Button>
              </div>
            )}
          </section>

          <Separator />
          
          {/* Other Actions */}
           <section className="space-y-3">
             <Button variant="outline" className="w-full justify-start text-left py-5 text-base">
                <History className="mr-3 h-5 w-5 text-primary" /> Reading History
             </Button>
             <Button variant="outline" className="w-full justify-start text-left py-5 text-base" onClick={() => router.push('/settings')}>
                <ShieldCheck className="mr-3 h-5 w-5 text-primary" /> Settings & Security
             </Button>
          </section>

        </CardContent>
        <CardFooter className="p-6 md:p-8 border-t flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" /> Delete Account
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

