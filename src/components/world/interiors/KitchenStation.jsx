import { Play } from 'lucide-react';
import { eventName } from '@/lib/isleEvents';

// A working station of the National Bakery: describe the kitchen task, then open
// the Champion Isle game it hides. Scores land on the isle standings as usual.
export default function KitchenStation({ station, onPlay }) {
  return (
    <div className="space-y-3">
      <div className="rounded-sm border border-border/80 bg-card p-4">
        <span className="meta-label">{eventName(station.game)} · Champion Isle</span>
        <p className="mt-2 text-[15px] leading-relaxed text-foreground/80">{station.blurb}</p>
        <button
          type="button"
          onClick={() => onPlay?.(station.game)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-sm border border-primary/60 bg-primary/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-primary hover:bg-primary/20"
        >
          <Play className="h-3 w-3" />
          Start the game
        </button>
      </div>
      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        Your score is entered on the Champion Isle standings
      </p>
    </div>
  );
}