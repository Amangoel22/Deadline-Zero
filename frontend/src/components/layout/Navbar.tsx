import {
  Bell,
  Search,
  Star,
  Flame,
} from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

import { useEffect, useState } from "react";
import { getUserStats } from "../../lib/user.service";
export default function Navbar() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUserStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="h-16 border-b border-white/5 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-muted-foreground hover:text-foreground">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[240px] border-r-white/10 bg-sidebar">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div className="hidden sm:block">

          <h2 className="text-sm text-muted-foreground">
            {getGreeting()},
            <span className="font-semibold text-foreground">
              {" "}
              {localStorage.getItem("userName") || "Commander"}
            </span>
          </h2>

          {stats && (
            <div className="mt-2 flex items-center gap-4">

              <div className="flex items-center gap-1 text-xs">
                <Star className="w-3.5 h-3.5 text-yellow-400" />
                Level {stats.level}
              </div>

              <div className="flex items-center gap-1 text-xs">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                {stats.streak} Day
              </div>

              <div className="text-xs text-muted-foreground">
                {stats.xp}/{stats.nextLevelXP} XP
              </div>

            </div>
          )}

          {stats && (
            <div className="mt-2 w-56 h-1.5 rounded-full bg-white/10 overflow-hidden">

              <div
                className="h-full bg-primary transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (stats.xp / stats.nextLevelXP) * 100,
                    100
                  )}%`,
                }}
              />

            </div>
          )}

        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:flex items-center w-64 group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search tasks, docs..."
            className="w-full h-9 bg-white/[0.03] border-white/5 pl-9 text-sm rounded-full focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:bg-white/[0.05] transition-all"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground rounded-full w-9 h-9">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
        </Button>

        <Avatar className="w-8 h-8 border border-white/10 cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback className="bg-primary/20 text-primary text-xs">U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
