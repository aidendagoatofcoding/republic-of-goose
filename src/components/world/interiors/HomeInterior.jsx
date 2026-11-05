import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useCitizen } from '@/hooks/useCitizen';
import InteriorRoom from '@/components/world/interiors/InteriorRoom';
import Furnishing from '@/components/world/interiors/Furnishing';
import Walker from '@/components/world/Walker';
import useInteriorWalk from '@/hooks/useInteriorWalk';
import { HOME_ROOMS, tierFor } from '@/lib/homeRooms';
import { sfx } from '@/lib/sfx';
import { DoorOpen, KeyRound, Lock } from 'lucide-react';

const FURNITURE_SCALE = { cottage: 0.78, hall: 0.92, manor: 1.06 };

export default function HomeInterior({ price = 0, onExit }) {
  const tier = tierFor(price);
  const room = HOME_ROOMS[tier];
  const scale = FURNITURE_SCALE[tier] || 0.8;
  const { citizen, signedIn, run } = useCitizen();
  const floorRef = useRef(null);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [openBusy, setOpenBusy] = useState(false);
  const homeOpen = citizen?.home_open === true;

  // You can walk about your own rooms, the same way you walk the Commons.
  const { pos, nudge } = useInteriorWalk({
    roomRef: floorRef,
    start: { x: 50, y: 86, face: 1 },
    bounds: { x: [8, 92], y: [66, 92] },
  });

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
    sfx.pickup();
    setSelected('');
  };

  const pickUp = (itemId) => {
    save({ action: 'homeItem', item_id: itemId });
    sfx.pickup();
    setSelected('');
  };

  return (
    <div className="fixed inset-0 z-[55] overflow-hidden bg-[#f7f2e6]">
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
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-105"
            >
              <Furnishing name={item.name} scale={scale} className="drop-shadow-[0_6px_6px_rgba(74,52,24,0.35)]" />
            </button>
          );
        })}

        <div className="pointer-events-none absolute inset-0 z-20">
          <Walker
            label="You"
            species={citizen?.species || 'goose'}
            worn={citizen?.worn}
            x={pos.x}
            y={pos.y}
            face={pos.face}
            isMe
            ink
            speed="0s"
          />
        </div>
      </div>

      <div className="absolute bottom-24 right-3 z-30 grid grid-cols-3 gap-1 md:hidden">
        <span />
        <button
          type="button"
          onClick={() => nudge(0, -1)}
          aria-label="Walk up"
          className="rounded-sm border border-[#b9a880] bg-[#fffdf7]/95 px-2 py-1.5 font-mono text-[9px] text-[#3a2f1c]"
        >
          ↑
        </button>
        <span />
        <button
          type="button"
          onClick={() => nudge(-1, 0)}
          aria-label="Walk left"
          className="rounded-sm border border-[#b9a880] bg-[#fffdf7]/95 px-2 py-1.5 font-mono text-[9px] text-[#3a2f1c]"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => nudge(0, 1)}
          aria-label="Walk down"
          className="rounded-sm border border-[#b9a880] bg-[#fffdf7]/95 px-2 py-1.5 font-mono text-[9px] text-[#3a2f1c]"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => nudge(1, 0)}
          aria-label="Walk right"
          className="rounded-sm border border-[#b9a880] bg-[#fffdf7]/95 px-2 py-1.5 font-mono text-[9px] text-[#3a2f1c]"
        >
          →
        </button>
      </div>

      <div className="absolute left-3 top-3 z-30 max-w-[58%] rounded-sm border border-[#c9b58c]/70 bg-[#fdfaf1]/90 px-3 py-2 sm:left-5 sm:top-5">
        <h1 className="font-display text-lg leading-tight text-[#20180d] sm:text-2xl">
          {room.sign.split('·')[0].trim()}
        </h1>
        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-[#6b5836]">
          {tier} · {room.sign.split('·')[1]?.trim() || tier}
        </p>
        <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-[#6b5836]">
          {selected
            ? 'Now tap the floor to set it down'
            : 'Walk with W A S D · pick a piece below, then tap the floor'}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#3a2f1c]">
          🍞 {citizen?.bread ?? 0} in hand
        </p>
      </div>

      <button
        type="button"
        onClick={onExit}
        className="absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-sm border border-[#b9a880] bg-[#fdfaf1]/95 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#3a2f1c] hover:bg-[#f0e6cc] sm:right-5 sm:top-5"
      >
        <DoorOpen className="h-3.5 w-3.5" />
        Step outside
      </button>

      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-[#c9b58c] bg-[#fdfaf1]/97 px-3 py-2.5 backdrop-blur-sm sm:px-5">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#6b5836]">
              Your furniture
            </span>
            <div className="flex items-center gap-2">
              {placed.length > 0 && (
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#6b5836]">
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
                      ? 'border-[#7d9a4e] bg-[#e6f0d2] text-[#3f5222]'
                      : 'border-[#c9b58c] text-[#6b5836] hover:text-[#20180d]'
                  }`}
                >
                  {homeOpen ? <KeyRound className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  {homeOpen ? 'Open to visitors' : 'Friends only'}
                </button>
              )}
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-1 font-mono text-[10px] text-[#b03a22]">
              {error}
            </p>
          )}

          {!signedIn ? (
            <p className="mt-1 text-[14px] text-[#4a3c26]">
              Sign in with your passport to furnish your home.
            </p>
          ) : owned.length === 0 ? (
            <p className="mt-1 text-[14px] text-[#4a3c26]">
              {placed.length > 0
                ? 'Nothing loose in the pack. Tap a piece in the room to put it away.'
                : 'No furniture yet. Buy some at the Cabinetmaker in Market Square.'}
            </p>
          ) : (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {owned.map((item) => {
                const active = selected === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={busy}
                    onClick={() => setSelected(active ? '' : item.id)}
                    className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors ${
                      active
                        ? 'border-[#7d9a4e] bg-[#e6f0d2] text-[#3f5222]'
                        : 'border-[#c9b58c] text-[#4a3c26] hover:bg-[#f0e6cc]'
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