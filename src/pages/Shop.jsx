import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import Panel from '@/components/Panel';
import { base44 } from '@/api/base44Client';
import { useCitizen } from '@/hooks/useCitizen';
import ShopCard from '@/components/shop/ShopCard';

export default function Shop() {
  const { citizen, signedIn, run } = useCitizen();
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [buying, setBuying] = useState('');

  useEffect(() => {
    let active = true;
    base44.entities.ShopItem
      .list({ sort: 'price', limit: 60 })
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
      await run({ action: 'buyDecoration', item_id: item.id });
    } catch (err) {
      setError(err.message);
    } finally {
      setBuying('');
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <Panel>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="meta-label">National E-Shop · Honkton</span>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">Decorations</h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-foreground/75">
              Dress your base animal in the finest goods the Republic can produce. Everything is paid
              for in bread, and everything stays yours.
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
            to buy decorations.
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
        <div className="grid gap-px border border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ShopCard
              key={item.id}
              item={item}
              owned={Boolean(citizen?.decorations?.includes(item.id))}
              canBuy={signedIn}
              busy={buying === item.id}
              affordable={(citizen?.bread ?? 0) >= item.price}
              onBuy={() => buy(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}