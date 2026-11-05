import { lootById } from '@/lib/bosses';

// The cabinet where a citizen keeps what the great beasts dropped.
export default function BossCabinet({ loot = [] }) {
  const items = loot.map((id) => lootById(id)).filter(Boolean);
  return (
    <section className="rounded-md border border-border/80 bg-card p-6">
      <span className="meta-label">Cabinet of spoils</span>
      {items.length ? (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-3 rounded-sm border border-border/60 bg-secondary/40 px-3 py-2"
            >
              <span className="text-xl leading-none" aria-hidden="true">
                {item.emoji}
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
                  {item.name}
                </span>
                <span className="mt-0.5 block text-[13px] leading-snug text-foreground/70">
                  {item.note}
                </span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-[15px] leading-relaxed text-foreground/70">
          Nothing in the cabinet yet. The great beasts of the realms keep their own trophies — and
          they drop them when they fall.
        </p>
      )}
    </section>
  );
}