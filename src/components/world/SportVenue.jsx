import { Lock } from 'lucide-react';

export default function SportVenue({ venue, reachable, onSelect }) {
  return (
    <button
      type="button"
      title={venue.name}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(venue.id);
      }}
      style={{ left: `${venue.x}%`, top: `${venue.y}%` }}
      className="absolute z-10 -translate-x-1/2 -translate-y-full text-center"
    >
      <span className="relative mx-auto block w-[64px] sm:w-[78px]">
        {reachable && (
          <span
            className="absolute -inset-1.5 rounded-md bg-primary/15 ring-1 ring-primary/45"
            aria-hidden="true"
          />
        )}
        <span className="relative block overflow-hidden rounded-t-sm bg-gradient-to-b from-[#4b5b43] to-[#24301f] ring-1 ring-black/50">
          <span className="block h-1.5 w-full bg-[#8a7a55]/85" aria-hidden="true" />
          <span className="flex h-8 items-center justify-center text-xl leading-none" aria-hidden="true">
            {venue.glyph}
          </span>
        </span>
        <span className="block h-1.5 rounded-b-sm bg-[#141c12]" aria-hidden="true" />
        <span className="mt-1 block truncate font-mono text-[7.5px] uppercase tracking-[0.1em] text-foreground/70">
          {venue.name}
        </span>
      </span>

      <span
        className={`mt-1 inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.1em] ${
          reachable
            ? 'border-primary/50 bg-primary/10 text-primary'
            : 'border-border/70 bg-card/90 text-muted-foreground'
        }`}
      >
        {reachable ? 'Enter' : <><Lock className="h-2 w-2" /> Walk closer</>}
      </span>
    </button>
  );
}