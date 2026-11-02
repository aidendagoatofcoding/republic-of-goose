import { Link } from 'react-router-dom';

const LABELS = {
  home: 'Home',
  vehicle: 'Vehicle',
  pet: 'Pet',
  decoration: 'Decoration',
};

export default function CommonsPalette({ items, placingId, onPlace, onCancel }) {
  return (
    <section className="rounded-md border border-border/80 bg-card p-5">
      <span className="meta-label">Your plot</span>
      <h3 className="display-title mt-2 text-xl">What you own</h3>

      {items.length === 0 ? (
        <p className="mt-3 text-[14.5px] leading-relaxed text-foreground/70">
          No homes, vehicles or pets yet.{' '}
          <Link to="/shop" className="text-primary underline-offset-4 hover:underline">
            Visit the E-Shop
          </Link>{' '}
          and start building.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {items.map((item) => {
            const active = placingId === item.item_id;
            return (
              <li
                key={item.item_id}
                className="flex items-center justify-between gap-2 border-b border-border/50 pb-2 last:border-0"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="text-lg" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-[11px] text-foreground">
                      {item.name}
                    </span>
                    <span className="block font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
                      {LABELS[item.category] || 'Item'} · {item.placed ? 'in the meadow' : 'unplaced'}
                    </span>
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => (active ? onCancel() : onPlace(item))}
                  className={`shrink-0 rounded-sm border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] ${
                    active
                      ? 'border-primary text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/60 hover:text-primary'
                  }`}
                >
                  {active ? 'Cancel' : item.placed ? 'Move' : 'Place'}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
        Tap Place, then tap the meadow to set your home down. You can also drag anything you own on
        the map. Everything else is fixed.
      </p>
    </section>
  );
}