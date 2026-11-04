import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useCitizen } from '@/hooks/useCitizen';
import ShopCard from '@/components/shop/ShopCard';

export const SECTIONS = [
  { key: 'decoration', title: 'Decorations', blurb: 'Worn on your animal in the Hall of Honks.' },
  { key: 'home', title: 'Homes', blurb: 'A roof of your own in the Honk Commons.' },
  { key: 'furniture', title: 'Furniture', blurb: 'Beds, chairs and shelves for the home you own.' },
  { key: 'vehicle', title: 'Vehicles', blurb: 'Cross the Republic without walking.' },
  { key: 'pet', title: 'Pets', blurb: 'Small companions that live on your plot.' },
  { key: 'tool', title: 'Tools', blurb: 'Rods and tackle for the harbour dock.' },
];

export default function ShopShelf({ category = 'all' }) {
  const { citizen, signedIn, run } = useCitizen();
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [buying, setBuying] = useState('');

  useEffect(() => {
    let active = true;
    base44.entities.ShopItem.list({ sort: 'price', limit: 80 })
      .then((page) => {
        if (active) setItems(page?.items ?? []);
      })
      .catch(() => {
        if (active) {
          setItems([]);
          setError('The shelf could not be reached.');
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const buy = async (item) => {
    setBuying(item.id);
    setError('');
    try {
      await run({ action: 'buyItem', item_id: item.id });
    } catch (err) {
      setError(err.message);
    } finally {
      setBuying('');
    }
  };

  const ownedIds = new Set([...(citizen?.decorations ?? []), ...(citizen?.possessions ?? [])]);
  const ownsHome = (items ?? []).some(
    (item) => item.category === 'home' && ownedIds.has(item.id)
  );

  const groups = SECTIONS.filter(
    (section) => category === 'all' || section.key === category
  )
    .map((section) => ({
      ...section,
      items: (items ?? []).filter((item) => (item.category || 'decoration') === section.key),
    }))
    .filter((section) => section.items.length > 0);

  if (items === null) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        The shopkeeper is opening the shelves...
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {signedIn ? `🍞 ${citizen.bread} in hand` : 'Not signed in'}
        </p>
        {!signedIn && (
          <Link
            to="/passport"
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary underline-offset-4 hover:underline"
          >
            Sign in with your passport
          </Link>
        )}
      </div>

      {error && (
        <p role="alert" className="font-mono text-[11px] text-[#FF6B4A]">
          {error}
        </p>
      )}

      {groups.length === 0 ? (
        <p className="text-[15px] leading-relaxed text-foreground/70">
          This shelf is bare. The shopkeeper has gone south for the winter.
        </p>
      ) : (
        groups.map((group) => (
          <section key={group.key} className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-lg leading-tight">{group.title}</h3>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                {group.key === 'furniture' && !ownsHome
                  ? 'Buy a home before you furnish it'
                  : group.blurb}
              </p>
            </div>
            <div className="grid gap-px border border-border/70 bg-border/70 sm:grid-cols-2">
              {group.items.map((item) => (
                <ShopCard
                  key={item.id}
                  item={item}
                  owned={ownedIds.has(item.id)}
                  canBuy={signedIn}
                  busy={buying === item.id}
                  affordable={(citizen?.bread ?? 0) >= item.price}
                  locked={group.key === 'furniture' && !ownsHome}
                  onBuy={() => buy(item)}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}