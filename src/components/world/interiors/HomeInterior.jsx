import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useCitizen } from '@/hooks/useCitizen';
import InteriorRoom from '@/components/world/interiors/InteriorRoom';
import { HOME_ROOMS, FURNITURE_SIZE, tierFor } from '@/lib/homeRooms';
import { DoorOpen, KeyRound, Lock } from 'lucide-react';

export default function HomeInterior({ price = 0, onExit }) {
  const tier = tierFor(price);
  const room = HOME_ROOMS[tier];
  const { citizen, signedIn, run } = useCitizen();
  const floorRef = useRef(null);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [openBusy, setOpenBusy] = useState(false);
  const homeOpen = citizen?.home_open === true;

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

  const toggleOpen = async () => {
    setOpenBusy(true);
    setError('');
    try {
      await run({ action: 'homeOpen', open: !homeOpen });
    } catch (err) {
      setError(err.message);
    } finally {
      setOpenBusy(false);
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
            <div className="flex items-center gap-2">
              {placed.length > 0 && (
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                  {placed.length} piece{placed.length === 1 ? '' : 's'} set out · tap one to put it away
                </span>
              )}
              {signedIn && (
                <button
                  type="button"
                  onClick={toggleOpen}
                  disabled={openBusy}
                  className={`inline-flex items-center gap-1 rounded-sm border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] disabled:opacity-50 ${
                    homeOpen
                      ? 'border-primary/60 bg-primary/15 text-primary'
                      : 'border-border/70 text-muted-foreground hover:text-primary'
                  }`}
                >
                  {homeOpen ? <KeyRound className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  {homeOpen ? 'Open to visitors' : 'Friends only'}
                </button>
              )}
            </div>
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