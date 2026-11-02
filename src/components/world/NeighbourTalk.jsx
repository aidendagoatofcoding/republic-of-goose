import { X } from 'lucide-react';

export default function NeighbourTalk({ target, onClose }) {
  if (!target) return null;
  return (
    <div className="absolute bottom-14 left-1/2 z-50 w-[min(340px,calc(100%-1.5rem))] -translate-x-1/2 rounded-sm border border-primary/50 bg-card/95 px-3 py-2.5 shadow-xl backdrop-blur-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-display text-base leading-tight text-foreground">
            {target.name}
          </p>
          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
            {target.species || 'goose'} · neighbour
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="End the conversation"
          className="shrink-0 rounded-sm border border-border p-1 text-muted-foreground hover:text-primary"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
      <p className="mt-2 text-[15px] leading-relaxed text-foreground/85">“{target.line}”</p>
      <button
        type="button"
        onClick={onClose}
        className="mt-2 rounded-sm border border-primary/50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-primary hover:bg-primary/10"
      >
        Honk back
      </button>
    </div>
  );
}