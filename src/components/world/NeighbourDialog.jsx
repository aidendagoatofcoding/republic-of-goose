import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const CATEGORY = { home: 'Home', vehicle: 'Vehicle', pet: 'Pet' };

export default function NeighbourDialog({
  target,
  amount,
  onAmount,
  onSend,
  onClose,
  onKnock,
  busy,
  error,
  note,
}) {
  if (!target) return null;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="display-title text-xl">
            {target.item_name}
          </DialogTitle>
          <DialogDescription className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {CATEGORY[target.item_category] || 'Item'} owned by {target.owner_name}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 rounded-sm border border-border/70 bg-background/40 p-3">
          <span className="text-3xl" aria-hidden="true">
            {target.emoji}
          </span>
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-muted-foreground">
            {target.owner_name} paid 🍞 {target.price || '—'} for this. Offer what it is worth to you.
          </p>
        </div>

        <label
          htmlFor="offer-amount"
          className="mt-4 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          Your offer in bread
        </label>
        <input
          id="offer-amount"
          type="number"
          min="1"
          value={amount}
          onChange={(event) => onAmount(event.target.value)}
          className="mt-1.5 w-full rounded-sm border border-input bg-background/80 px-3 py-2.5 font-mono text-[12px] text-foreground"
        />

        {error && (
          <p role="alert" className="mt-2 font-mono text-[10.5px] text-[#FF6B4A]">
            {error}
          </p>
        )}
        {note && <p className="mt-2 font-mono text-[10.5px] text-primary">{note}</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSend}
            disabled={busy}
            className="rounded-sm bg-primary px-4 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-50"
          >
            {busy ? 'Sending...' : 'Send offer'}
          </button>
          {target.item_category === 'home' && (
            <button
              type="button"
              onClick={onKnock}
              className="rounded-sm border border-border px-3 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
            >
              Knock instead
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-transparent px-3 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}