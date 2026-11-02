export default function ShopCard({ item, owned, canBuy, busy, affordable, onBuy }) {
  return (
    <article className="flex flex-col bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl" aria-hidden="true">
          {item.emoji || '🍞'}
        </span>
        <span className="font-mono text-[11px] font-bold text-primary">🍞 {item.price}</span>
      </div>

      <h3 className="mt-4 font-display text-xl font-bold">{item.name}</h3>
      <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-foreground/65">
        {item.description}
      </p>

      <button
        onClick={onBuy}
        disabled={owned || busy || !canBuy}
        className="mt-5 rounded-sm border border-border px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors enabled:hover:border-primary/60 enabled:hover:text-primary disabled:opacity-50"
      >
        {owned
          ? 'Worn with pride'
          : busy
            ? 'Paying...'
            : !canBuy
              ? 'Sign in to buy'
              : affordable
                ? 'Buy for bread'
                : 'Not enough bread'}
      </button>
    </article>
  );
}