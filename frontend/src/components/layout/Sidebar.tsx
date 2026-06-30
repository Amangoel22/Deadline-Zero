import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Crosshair, 
  BarChart3, 
  User, 
  Settings as SettingsIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Mission Center', path: '/mission', icon: Crosshair },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
];

const BOTTOM_NAV_ITEMS = [
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: SettingsIcon },
];

export default function Sidebar() {
  const location = useLocation();

  const renderNavLink = (item: typeof NAV_ITEMS[0]) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    
    return (
      <Link 
        key={item.path}
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
          isActive 
            ? "text-foreground bg-white/[0.06] shadow-sm" 
            : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
        )}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full" />
        )}
        <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground/80")} />
        {item.name}
      </Link>
    );
  };

  return (
    <aside className="w-[240px] flex-shrink-0 border-r border-white/5 bg-sidebar flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6">
        <Link to="/" className="flex items-center gap-3 group">
  <img
    src="/logo.png"
    alt="Deadline Zero"
    className="h-9 w-9 object-contain transition-transform group-hover:scale-105"
  />

  <span className="font-semibold tracking-tight text-[15px]">
    Deadline Zero
  </span>
</Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        <div className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest px-3 mb-2 mt-4">Workspace</div>
        {NAV_ITEMS.map(renderNavLink)}
      </div>

      <div className="p-3 mt-auto border-t border-white/5 space-y-1 bg-black/10">
        {BOTTOM_NAV_ITEMS.map(renderNavLink)}
      </div>
    </aside>
  );
}
