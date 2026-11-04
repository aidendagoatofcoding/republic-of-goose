import { X } from 'lucide-react';
import QuestPanel from '@/components/world/QuestPanel';

// The Warden's quest board, out at the edge of the map.
export default function EdgeWardenPanel({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[65] overflow-y-auto bg-black/75 p-4">
      <div className="mx-auto w-full max-w-lg rounded-md border border-border bg-card p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
              The Edge of the Republic
            </p>
            <h2 className="mt-1 font-display text-xl leading-tight sm:text-2xl">The Edge Warden</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/70">
              Keeper of the last lamp. Bring back what the wind took and the edge stays lit.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-sm border border-primary/45 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-primary hover:bg-primary/10"
          >
            <X className="h-3.5 w-3.5" />
            Close
          </button>
        </div>

        <div className="mt-4">
          <QuestPanel placeId="edge" />
        </div>
      </div>
    </div>
  );
}