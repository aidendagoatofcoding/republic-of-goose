import { Link } from 'react-router-dom';
import { SHOPS } from '@/lib/shops';

// The signpost in the main hall: each trade has its own door on the market streets.
export default function ShopDoors({ current = '' }) {
  return (
    <div className="mt-4 border-t border-border/60 pt-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
        Other shops on the market streets
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {SHOPS.filter((shop) => shop.key !== current).map((shop) => (
          <Link
            key={shop.id}
            to={`/shop/${shop.id}`}
            className="rounded-sm border border-border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:border-primary/60 hover:text-primary"
          >
            {shop.emoji} {shop.name.replace('The ', '')}
          </Link>
        ))}
      </div>
    </div>
  );
}