import { TACKLE_SLOTS, tackleSlot } from '@/lib/tackle';

// What is in the creel: every rod, bait, lure and net the citizen owns,
// with the one that is rigged up already marked.
export default function TacklePanel({ owned, equipped, onEquip, onUnequip, busy }) {
  const bySlot = TACKLE_SLOTS.map((slot) => ({
    ...slot,
    items: owned.filter((item) => tackleSlot(item) === slot.id),
  })).filter((slot) => slot.items.length > 0);

  if (bySlot.length === 0) return null;

  return (
    <div className="mt-4 border-t border-border/70 pt-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        Your tackle · one of each rigged
      </p>
      <div className="mt-2 space-y-1.5">
        {bySlot.map((slot) => (
          <div key={slot.id} className="flex flex-wrap items-center gap-1.5">
            <span className="w-10 shrink-0 font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
              {slot.emoji} {slot.label}
            </span>
            {slot.items.map((item) => {
              const rigged = equipped.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={busy === item.id}
                  onClick={() => (rigged ? onUnequip(item.id) : onEquip(item.id))}
                  className={`rounded-sm border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] disabled:opacity-50 ${
                    rigged
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/60 hover:text-primary'
                  }`}
                  title={rigged ? 'Take it off the line' : 'Rig it up'}
                >
                  {item.name} {rigged ? '· rigged' : ''}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}