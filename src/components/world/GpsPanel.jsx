import { Navigation, X } from 'lucide-react';
import { DESTINATIONS } from '@/lib/destinations';

// A hand-held navigator: pick a place and the route is drawn along the streets.
export default function GpsPanel({ open, onToggle, destination, distance, onPick, onStop }) {
  return (
    <div className="absolute left-1/2 top-2 z-40 -translate-x-1/2">
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] ${
          destination
            ? 'border-primary bg-primary/20 text-primary'
            : 'border-border bg-card/90 text-muted-foreground hover:text-primary'
        }`}
      >
        <Navigation className="h-3 w-3" />
        {destination ? `${destination.name} · ${distance}m` : 'GPS'}
      </button>

      {open && (
        <div className="mt-1.5 w-[268px] max-w-[86vw] rounded-sm border border-border/80 bg-card/97 shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between border-b border-border/70 px-2.5 py-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-primary">
              Navigate
            </span>
            <button
              type="button"
              onClick={onToggle}
              aria-label="Close the navigator"
              className="text-muted-foreground hover:text-primary"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          <div className="max-h-[42vh] overflow-y-auto px-1.5 py-1.5">
            {DESTINATIONS.map((place) => {
              const active = destination?.id === place.id;
              return (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => onPick(place.id)}
                  className={`flex w-full items-center gap-2 rounded-sm px-1.5 py-1 text-left text-[12px] leading-snug transition-colors ${
                    active
                      ? 'bg-primary/15 text-primary'
                      : 'text-foreground/85 hover:bg-secondary/60 hover:text-primary'
                  }`}
                >
                  <span aria-hidden="true">{place.glyph}</span>
                  <span className="min-w-0 truncate">{place.name}</span>
                </button>
              );
            })}
          </div>

          {destination && (
            <div className="border-t border-border/70 px-2.5 py-1.5">
              <button
                type="button"
                onClick={onStop}
                className="w-full rounded-sm border border-border/70 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:border-[#FF6B4A]/60 hover:text-[#FF6B4A]"
              >
                End route
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}