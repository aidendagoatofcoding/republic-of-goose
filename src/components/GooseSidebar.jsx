import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { NAV_GROUPS } from '@/lib/nav';
import { cn } from '@/lib/utils';

export default function GooseSidebar({ open, onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-30 bg-background/80 backdrop-blur-sm transition-opacity md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-full w-[262px] flex-col overflow-y-auto border-r border-border bg-sidebar px-4 py-6 transition-transform duration-300 ease-out md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-start justify-between gap-2 border-b border-border/80 pb-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Official Portal
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold leading-none text-primary">
              Republic
              <br />
              of Goose
            </h2>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Est. 2026 · Honkish only
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-sm p-1.5 text-muted-foreground transition-colors hover:text-foreground md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-4 flex-1">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mt-6 first:mt-2">
              <div className="meta-label px-2">{group.label}</div>
              <div className="mt-2 space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center gap-3 rounded-sm px-2 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors',
                          isActive
                            ? 'bg-sidebar-accent text-primary'
                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-foreground'
                        )
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-70" />
                      <span className="leading-tight">{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-8 border border-border/70 px-3 py-3 text-center">
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
            🪿 Official Goose Territory
          </p>
        </div>
      </aside>
    </>
  );
}