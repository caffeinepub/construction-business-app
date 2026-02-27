import { Link, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, FolderKanban, Users, HardHat } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/clients', label: 'Clients', icon: Users },
];

export default function Sidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/logo.dim_256x256.png"
            alt="BuildPro Manager Logo"
            className="w-10 h-10 rounded object-cover"
          />
          <div>
            <div className="font-condensed font-800 text-lg text-foreground leading-tight tracking-wide uppercase">
              BuildPro
            </div>
            <div className="text-xs text-muted-foreground font-medium tracking-widest uppercase">
              Manager
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="text-xs font-700 text-muted-foreground uppercase tracking-widest mb-3 px-3">
          Navigation
        </div>
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-600 transition-all duration-150 group ${
              isActive(path)
                ? 'bg-primary text-primary-foreground shadow-amber'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }`}
          >
            <Icon
              size={18}
              className={`flex-shrink-0 ${
                isActive(path) ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-sidebar-accent-foreground'
              }`}
            />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom branding */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-3 py-2">
          <HardHat size={16} className="text-primary" />
          <span className="text-xs text-muted-foreground font-medium">Construction Suite</span>
        </div>
      </div>
    </aside>
  );
}
