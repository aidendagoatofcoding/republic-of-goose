import { Link } from 'react-router-dom';
import { SHOPS } from '@/lib/shops';

// The market streets: one door per trade, instead of a single shop selling everything.
export default function Shop() {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <header>
        <span className="meta-label">The Market Streets</span>
        <h1 className="display-title mt-2 text-3xl">The Shops of the Republic</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-foreground/70">
          Every trade keeps its own shop now. Decorations sit on the High Street, the Homes
          Office keeps the deeds, and motorcars wait out on the dealership lot.
        </p>
      </header>

      <div className="grid gap-px border border-border/70 bg-border/70 sm:grid-cols-2">
        {SHOPS.map((shop) => (
          <Link
            key={shop.id}
            to={`/shop/${shop.id}`}
            className="group bg-card p-4 transition-colors hover:bg-accent/50"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-display text-lg leading-tight text-foreground group-hover:text-primary">
                {shop.name}
              </h2>
              <span className="text-2xl" aria-hidden="true">
                {shop.emoji}
              </span>
            </div>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              {shop.sign}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-foreground/70">{shop.blurb}</p>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
              Step inside →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}