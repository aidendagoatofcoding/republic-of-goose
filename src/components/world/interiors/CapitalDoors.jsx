import { ArrowLeft, DoorOpen } from 'lucide-react';

const DOORS = [
  { id: 'parliament', name: 'The Goose Parliament', glyph: '🪶', note: 'Laws and loud argument' },
  { id: 'bank', name: 'The National Bank', glyph: '🏦', note: 'Loans, files and reserves' },
  { id: 'government', name: 'Government House', glyph: '🗺️', note: 'The districts and the flag' },
  { id: 'exchange', name: 'The Honk Exchange', glyph: '📈', note: 'Shares traded in bread' },
];

export default function CapitalDoors({ onEnter, onExit }) {
  return (
    <section className="rounded-md border border-border/80 bg-card p-5">
      <span className="meta-label">Capital of Honkton</span>
      <h2 className="display-title mt-2 text-2xl">The Marble Hall</h2>
      <p className="mt-2 text-[14.5px] leading-relaxed text-foreground/70">
        Four doors open off the great hall. Step through one to do the Republic&apos;s business.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {DOORS.map((door) => (
          <button
            key={door.id}
            type="button"
            onClick={() => onEnter(door.id)}
            className="door-glow flex items-center gap-3 rounded-sm border border-border/80 bg-background/50 px-3 py-3 text-left transition-colors hover:border-primary/60"
          >
            <span className="text-xl" aria-hidden="true">
              {door.glyph}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-mono text-[10px] uppercase tracking-[0.16em] text-foreground">
                {door.name}
              </span>
              <span className="block truncate font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
                {door.note}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground hover:text-primary"
        >
          <DoorOpen className="h-3.5 w-3.5" />
          Back to the Commons
        </button>
        <span className="inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
          <ArrowLeft className="h-3 w-3" /> Esc leaves any building
        </span>
      </div>
    </section>
  );
}