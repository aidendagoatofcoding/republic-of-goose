import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function OwnedDecorations({ owned }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    base44.entities.ShopItem
      .list({ sort: 'price', limit: 60 })
      .then((page) => {
        if (active) setItems(page?.items ?? []);
      })
      .catch(() => {
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const worn = items.filter((item) => owned?.includes(item.id));

  return (
    <section className="rounded-md border border-border/80 bg-card p-6">
      <span className="meta-label">Decorations</span>
      {worn.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {worn.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/80"
            >
              <span className="text-base">{item.emoji}</span>
              {item.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-[15px] leading-relaxed text-foreground/70">
          Your animal is wearing nothing at all. Visit the{' '}
          <Link to="/shop" className="text-primary underline-offset-4 hover:underline">
            national e-shop
          </Link>{' '}
          and spend some bread.
        </p>
      )}
    </section>
  );
}