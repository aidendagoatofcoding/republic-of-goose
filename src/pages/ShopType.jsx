import { Link, useParams } from 'react-router-dom';
import ShopShelf from '@/components/shop/ShopShelf';
import { SHOPS, shopById } from '@/lib/shops';

// One trade, one shop: the shelf shows only what this counter sells.
export default function ShopType() {
  const { shopId } = useParams();
  const shop = shopById(shopId);

  if (!shop) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="display-title text-2xl">There is no shop by that name.</h1>
        <Link
          to="/shop"
          className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.16em] text-primary hover:underline"
        >
          ← Back to the market streets
        </Link>
      </div>
    );
  }

  const others = SHOPS.filter((entry) => entry.id !== shop.id);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border/70 pb-3">
        <div>
          <Link
            to="/shop"
            className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground hover:text-primary"
          >
            ← The market streets
          </Link>
          <h1 className="display-title mt-1 text-3xl">{shop.name}</h1>
          <p className="mt-1 max-w-xl text-[15px] leading-relaxed text-foreground/70">
            {shop.blurb}
          </p>
        </div>
        <span className="text-4xl" aria-hidden="true">
          {shop.emoji}
        </span>
      </div>

      <ShopShelf category={shop.key} />

      <nav className="flex flex-wrap gap-1.5 border-t border-border/70 pt-3">
        {others.map((entry) => (
          <Link
            key={entry.id}
            to={`/shop/${entry.id}`}
            className="rounded-sm border border-border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:border-primary/60 hover:text-primary"
          >
            {entry.emoji} {entry.name.replace('The ', '')}
          </Link>
        ))}
      </nav>
    </div>
  );
}