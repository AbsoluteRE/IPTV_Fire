import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, TvIcon } from 'lucide-react';
import { UserAvatar } from './user-avatar';
import { SidebarNavigation } from './navigation'; // Assuming SidebarNavigation is for mobile sheet

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden"> {/* For mobile sidebar trigger */}
         <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <div className="p-4 border-b">
                <Link href="/home" className="flex items-center gap-2 text-lg font-semibold text-primary">
                  <TvIcon className="h-7 w-7" />
                  <span>RunTV Streamer</span>
                </Link>
              </div>
              <SidebarNavigation isMobile={true} />
            </SheetContent>
          </Sheet>
      </div>
      
      <Link href="/home" className="hidden md:flex items-center gap-2 text-xl font-semibold text-primary">
        <TvIcon className="h-7 w-7" />
        <span className="font-bold">RunTV Streamer</span>
      </Link>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search movies, series, channels..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-input/50"
            />
          </div>
        </form>
        <UserAvatar />
      </div>
    </header>
  );
}
