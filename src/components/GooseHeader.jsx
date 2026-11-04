import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { PAGE_TITLES } from '@/lib/nav';
import { useCitizen } from '@/hooks/useCitizen';
import CitizenBadge from '@/components/CitizenBadge';

export default function GooseHeader({ onOpenNav }) {
  const { pathname } = useLocation();
  const { citizen, loading } = useCitizen();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border/70 bg-background/85 px-4 py-4 backdrop-blur-md md:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onOpenNav}
          className="flex items-center gap-2 rounded-sm border border-border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary md:hidden"
        >
          <Menu className="h-3.5 w-3.5" />
          Clearance
        </button>
        <h1 className="truncate font-display text-xl font-bold md:text-3xl">
          {PAGE_TITLES[pathname] ?? 'Republic of Goose'}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        {citizen ? (
          <Link
            to="/passport"
            className="flex items-center gap-2 rounded-sm border border-border px-2.5 py-1.5 transition-colors hover:border-primary/60"
          >
            <span className="font-mono text-[11px] font-bold text-primary">🍞 {citizen.bread}</span>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground sm:inline">
              bread
            </span>
          </Link>
        ) : null}
        {citizen ? (
          <CitizenBadge species={citizen.species} className="hidden md:inline-flex" />
        ) : (
          <span className="meta-label hidden shrink-0 sm:block">
            {loading ? 'Checking passport' : 'Honkish 6.6'}
          </span>
        )}
      </div>
    </header>
  );
}