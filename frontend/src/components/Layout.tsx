import { type ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/sonner';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <div className="flex-1 p-6 lg:p-8">
          {children}
        </div>
        <footer className="border-t border-border px-8 py-4 text-center text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} BuildPro Manager. Built with </span>
          <span className="text-primary">♥</span>
          <span> using </span>
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'buildpro-manager')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-semibold"
          >
            caffeine.ai
          </a>
        </footer>
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
