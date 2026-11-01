import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { PAGE_TITLES } from '@/lib/nav';
import GooseSidebar from '@/components/GooseSidebar';

export default function GooseShell() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grain-overlay" aria-hidden="true" />
      <GooseSidebar open={open} onClose={() => setOpen(false)} />

      <div className="md:pl-[262px]">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border/70 bg-background/85 px-4 py-4 backdrop-blur-md md:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 rounded-sm border border-border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary md:hidden"
            >
              <Menu className="h-3.5 w-3.5" />
              Clearance
            </button>
            <h1 className="truncate font-display text-xl font-bold md:text-3xl">
              {PAGE_TITLES[pathname] ?? 'Republic of Goose'}
            </h1>
          </div>
          <span className="meta-label hidden shrink-0 sm:block">Honkish 5.4</span>
        </header>

        <main className="px-4 pb-24 pt-8 md:px-10 md:pt-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}