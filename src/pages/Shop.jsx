import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import Panel from '@/components/Panel';
import { base44 } from '@/api/base44Client';
import { useCitizen } from '@/hooks/useCitizen';
import ShopCard from '@/components/shop/ShopCard';

const SECTIONS = [
  { key: 'decoration', title: 'Decorations', blurb: 'Worn on your animal in the Hall of Honks.' },
  { key: 'home', title: 'Homes', blurb: 'A roof of your own in the Honk Commons.' },
  { key: 'vehicle', title: 'Vehicles', blurb: 'Cross the Republic without walking.' },
  { key: 'pet', title: 'Pets', blurb: 'Small companions that live on your plot.' },
];

export default function Shop() {
  const { citizen, signedIn, run } = useCitizen();
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [buying, setBuying] = useState('');

  useEffect(() => {
    let active = true;
    base44.entities.ShopItem
      .list({ sort: 'price', limit: 80 })
      .then((page) => {
        if (active) setItems(page?.items ?? []);
      })
      .catch(() => {
        if (active) {
          setItems([]);
          setError('The e-shop could not open its doors.');
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

  const ownedIds = new Set([
    ...(citizen?.decorations ?? []),
    ...(citizen?.possessions ?? []),
  ]);

  const groups = SECTIONS.map((section) => ({
    ...section,
    items: (items ?? []).filter((item) => (item.category || 'decoration') === section.key),
  })).filter((section) => section.items.length > 0);

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <Panel>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="meta-label">National E-Shop · Honkton</span>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">The National E-Shop</h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-foreground/75">
              Dress your animal, buy a home, a vehicle or a pet, and build a life in the Commons.
              Everything is paid for in bread, and everything stays yours.
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              {signedIn ? 'Bread in hand' : 'Not signed in'}
            </p>
            <p className="font-mono text-xl font-bold text-primary">
              🍞 {signedIn ? citizen.bread : '—'}
            </p>
          </div>
        </div>

        {!signedIn && (
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <Link to="/passport" className="text-primary underline-offset-4 hover:underline">
              Sign in with your passport
            </Link>{' '}
            to buy from the shelves.
          </p>
        )}

        {error && (
          <p role="alert" className="mt-4 font-mono text-[11px] text-[#FF6B4A]">
            {error}
          </p>
        )}
      </Panel>

      {items === null ? (
        <Panel>
          <p className="font-mono text-[11px] text-muted-foreground">Opening the shop...</p>
        </Panel>
      ) : items.length === 0 ? (
        <Panel>
          <div className="flex items-center gap-3">
            <Store className="h-4 w-4 text-primary" />
            <p className="font-mono text-[11px] text-muted-foreground">
              The shelves are empty. The shopkeeper has gone south for the winter.
            </p>
          </div>
        </Panel>
      ) : (
        groups.map((group) => (
          <div key={group.key} className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
              <h3 className="display-title text-xl">{group.title}</h3>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                {group.blurb}
              </p>
            </div>
            <div className="grid gap-px border border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <ShopCard
                  key={item.id}
                  item={item}
                  owned={ownedIds.has(item.id)}
                  canBuy={signedIn}
                  busy={buying === item.id}
                  affordable={(citizen?.bread ?? 0) >= item.price}
                  onBuy={() => buy(item)}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}