import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useCitizen } from '@/hooks/useCitizen';
import InteriorRoom from '@/components/world/interiors/InteriorRoom';
import { DoorOpen } from 'lucide-react';

// A home's size on the outside decides how much room there is on the inside.
const HOME_ROOMS = {
  cottage: {
    id: 'home',
    name: 'Your Home',
    sign: 'YOUR HOME · COTTAGE',
    honkish: 'HONK HONK',
    accent: '#e0b98a',
    props: [
      { type: 'chandelier', x: 50, y: 14 },
      { type: 'shelf', x: 14, y: 44 },
      { type: 'shelf', x: 86, y: 44 },
      { type: 'benches', x: 30, y: 60 },
      { type: 'counter', x: 66, y: 56, label: 'YOUR HEARTH' },
    ],
    actors: [],
  },
  hall: {
    id: 'home',
    name: 'Your Home',
    sign: 'YOUR HOME · HALL',
    honkish: 'HONK HONK HONK',
    accent: '#e0b98a',
    props: [
      { type: 'chandelier', x: 32, y: 13 },
      { type: 'chandelier', x: 68, y: 13 },
      { type: 'shelf', x: 10, y: 42 },
      { type: 'shelf', x: 90, y: 42 },
      { type: 'banner', x: 24, y: 26 },
      { type: 'banner', x: 76, y: 26 },
      { type: 'benches', x: 22, y: 62 },
      { type: 'benches', x: 78, y: 62 },
      { type: 'counter', x: 50, y: 54, label: 'YOUR HEARTH' },
    ],
    actors: [],
  },
  manor: {
    id: 'home',
    name: 'Your Home',
    sign: 'YOUR HOME · MANOR',
    honkish: 'HONK HOOONKK HONK',
    accent: '#f2c96b',
    props: [
      { type: 'chandelier', x: 26, y: 12 },
      { type: 'chandelier', x: 50, y: 10 },
      { type: 'chandelier', x: 74, y: 12 },
      { type: 'shelf', x: 8, y: 40 },
      { type: 'shelf', x: 50, y: 36 },
      { type: 'shelf', x: 92, y: 40 },
      { type: 'banner', x: 18, y: 26 },
      { type: 'banner', x: 82, y: 26 },
      { type: 'map', x: 66, y: 30 },
      { type: 'benches', x: 18, y: 64 },
      { type: 'benches', x: 82, y: 64 },
      { type: 'counter', x: 50, y: 58, label: 'YOUR GREAT HEARTH' },
      { type: 'coins', x: 12, y: 86 },
    ],
    actors: [],
  },
};

const tierFor = (price) => (price >= 900 ? 'manor' : price >= 400 ? 'hall' : 'cottage');
const FURNITURE_SIZE = { cottage: 'text-3xl', hall: 'text-4xl', manor: 'text-5xl' };

export default function HomeInterior({ price = 0, onExit }) {
  const tier = tierFor(price);
  const room = HOME_ROOMS[tier];
  const { citizen, signedIn, run } = useCitizen();
  const floorRef = useRef(null);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    base44.entities.ShopItem.list({ sort: 'price', limit: 200 })
      .then((page) => active && setItems(page?.items ?? []))
      .catch(() => active && setItems([]));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onExit]);

  const byId = new Map(items.map((item) => [item.id, item]));
  const owned = (citizen?.possessions ?? [])
    .map((id) => byId.get(id))
    .filter((item) => item && (item.category || '') === 'furniture');
  const placed = (citizen?.home_items ?? []).filter((entry) => byId.has(entry.item_id));

  const save = async (payload) => {
    setBusy(true);
    setError('');
    try {
      await run(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const placeAt = (event) => {
    if (!selected) return;
    const box = floorRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    save({ action: 'homeItem', item_id: selected, x, y });
    setSelected('');
  };

  const pickUp = (itemId) => {
    save({ action: 'homeItem', item_id: itemId });
    setSelected('');
  };

  const placedIds = new Set(placed.map((entry) => entry.item_id));

  return (
    <div className="fixed inset-0 z-[55] overflow-hidden bg-[#070b08]">
      <div
        ref={floorRef}
        onClick={placeAt}
        className={`absolute inset-0 ${selected ? 'cursor-crosshair' : ''}`}
      >
        <InteriorRoom place={room} />

        {placed.map((entry) => {
          const item = byId.get(entry.item_id);
          return (
            <button
              key={entry.item_id}
              type="button"
              title={`Put the ${item.name} away`}
              onClick={(event) => {
                event.stopPropagation();
                pickUp(entry.item_id);
              }}
              style={{ left: `${entry.x}%`, top: `${entry.y}%` }}
              className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-sm px-1 ${FURNITURE_SIZE[tier]} drop-shadow-[0_6px_6px_rgba(0,0,0,0.6)] transition-transform hover:scale-110`}
            >
              <span aria-hidden="true">{item.emoji || '🪑'}</span>
            </button>
          );
        })}
      </div>

      <div className="absolute left-3 top-3 z-30 max-w-[58%] sm:left-5 sm:top-5">
        <h1 className="font-display text-lg leading-tight text-[#f6ecc9] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-2xl">
          {room.sign.split('·')[0].trim()}
        </h1>
        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-[#f2c96b]/80">
          {tier} · {room.sign.split('·')[1]?.trim() || tier}
        </p>
        <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-[#f2c96b]/80">
          {selected ? 'Now tap the floor to set it down' : 'Pick a piece below, then tap the floor'}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#e8d9b0]/70">
          🍞 {citizen?.bread ?? 0} in hand
        </p>
      </div>

      <button
        type="button"
        onClick={onExit}
        className="absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-sm border border-[#f2c96b]/45 bg-[#0a0f0b]/85 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f2c96b] hover:bg-[#f2c96b]/10 sm:right-5 sm:top-5"
      >
        <DoorOpen className="h-3.5 w-3.5" />
        Step outside
      </button>

      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-primary/35 bg-background/95 px-3 py-2.5 backdrop-blur-sm sm:px-5">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
              Your furniture
            </span>
            {placed.length > 0 && (
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                {placed.length} piece{placed.length === 1 ? '' : 's'} set out · tap one to put it away
              </span>
            )}
          </div>

          {error && (
            <p role="alert" className="mt-1 font-mono text-[10px] text-[#FF6B4A]">
              {error}
            </p>
          )}

          {!signedIn ? (
            <p className="mt-1 text-[14px] text-foreground/70">
              Sign in with your passport to furnish your home.
            </p>
          ) : owned.length === 0 ? (
            <p className="mt-1 text-[14px] text-foreground/70">
              No furniture yet. Buy some in the Shop Guild or the National E-Shop.
            </p>
          ) : (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {owned.map((item) => {
                const isPlaced = placedIds.has(item.id);
                const active = selected === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={busy}
                    onClick={() => setSelected(active ? '' : item.id)}
                    className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors ${
                      active
                        ? 'border-primary bg-primary/20 text-primary'
                        : isPlaced
                          ? 'border-border/60 text-muted-foreground'
                          : 'border-[#f2c96b]/40 text-[#f2c96b] hover:bg-[#f2c96b]/10'
                    }`}
                  >
                    <span aria-hidden="true">{item.emoji || '🪑'}</span>
                    {item.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}