'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Clapperboard, Tv, UserCircle, PlusSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIPTVSource } from '@/contexts/iptv-source-context';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  requiresSource?: boolean;
}

const navItems: NavItem[] = [
  { href: '/home', label: 'Home (Movies)', icon: Home, requiresSource: true },
  { href: '/series', label: 'Series', icon: Clapperboard, requiresSource: true },
  { href: '/live-tv', label: 'Live TV', icon: Tv, requiresSource: true },
  { href: '/add-source', label: 'Manage Source', icon: PlusSquare },
  { href: '/account', label: 'Account', icon: UserCircle },
];

interface SidebarNavigationProps {
  isMobile?: boolean;
  className?: string;
}

export function SidebarNavigation({ isMobile = false, className }: SidebarNavigationProps) {
  const pathname = usePathname();
  const { sourceConfigured } = useIPTVSource();

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href || (item.href !== '/home' && pathname.startsWith(item.href));
    const isDisabled = item.requiresSource && !sourceConfigured;

    const linkContent = (
      <>
        <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
        <span className={cn(isMobile ? "text-base" : "text-sm", isDisabled ? "text-muted-foreground/50" : "")}>{item.label}</span>
      </>
    );

    if (isDisabled) {
       return (
        <div
          key={item.href}
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-foreground cursor-not-allowed opacity-50",
            className
          )}
          title="Please add an IPTV source first"
        >
          {linkContent}
        </div>
      );
    }

    return (
      <Link key={item.href} href={item.href} passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-foreground hover:bg-accent/50",
            isActive && "bg-accent text-primary font-semibold",
            isMobile ? "text-lg h-14" : "text-sm h-10",
            className
          )}
          aria-current={isActive ? 'page' : undefined}
        >
          {linkContent}
        </Button>
      </Link>
    );
  };
  
  if (isMobile) {
    return (
      <nav className="grid gap-2 p-4 text-lg font-medium">
        {navItems.map(renderNavItem)}
      </nav>
    );
  }

  return (
    <ScrollArea className="h-full">
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map(renderNavItem)}
      </nav>
    </ScrollArea>
  );
}
