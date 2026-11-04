import { useEffect, useState } from 'react';
import { Backpack, Coins } from 'lucide-react';
import { useCitizen } from '@/hooks/useCitizen';
import useShopItems from '@/hooks/useShopItems';
import { SIFT_SHARDS } from '@/lib/hidden';
import { tackleSlot } from '@/lib/tackle';

// The toolbar along the bottom of the meadow, and the pack behind it. Press E.
export default function InventoryBar() {
  const { citizen, run } = useCitizen();
  const items = useShopItems();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState('');

  useEffect(() => {
    const onKey = (event) => {
      const tag = event.target?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (event.key.toLowerCase() === 'e') {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!citizen) return null;

  const finds = citizen.finds ?? [];
  const shards = finds.filter((id) => SIFT_SHARDS.includes(id)).length;
  const owned = [
    ...(citizen.possessions ?? []).map((id) => ({ id, worn: false })),
    ...(citizen.decorations ?? []).map((id) => ({ id, worn: true })),
  ].map((entry) => {
    const item = items.find((row) => row.id === entry.id);
    return {
      ...entry,
      name: item?.name || 'An unknown thing',
      emoji: item?.emoji || '❔',
      price: item?.price ?? 0,
      refund: Math.floor((item?.price ?? 0) * 0.8),
      slot: tackleSlot(item),
    };
  });

  const slots = [
    { id: 'bread', emoji: '🍞', label: `🍞 ${citizen.bread}`, title: 'Bread' },
    { id: 'ore', emoji: '⛏', label: `⛏ ${citizen.ore ?? 0}`, title: 'Bread ore' },
    { id: 'shard', emoji: '💠', label: `💠 ${shards}/9`, title: 'Sift shards' },
    { id: 'fish', emoji: '🐟', label: `🐟 ${citizen.fish_caught ?? 0}`, title: 'Fish landed' },
    { id: 'finds', emoji: '🎒', label: `🎒 ${finds.length}`, title: 'Things found' },
  ];

  const rig = async (item, rigged) => {
    setBusy(item.id);
    setNote('');
    try {
      await run({ action: rigged ? 'unequip' : 'equip', item_id: item.id });
    } catch (error) {
      setNote(error.message);
    } finally {
      setBusy('');
    }
  };

  const sell = async (item) => {
    setBusy(item.id);
    setNote('');
    try {
      const data = await run({ action: 'sellItem', item_id: item.id });
      setNote(`Sold ${item.name} for 🍞 ${data.refund}.`);
    } catch (error) {
      setNote(error.message);
    } finally {
      setBusy('');
    }
  };

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[38] flex justify-center pb-1.5">        <div className="pointer-events-auto flex items-end gap-1 rounded-sm border border-border/80 bg-[#0b1310]/92 px-1.5 py-1 shadow-[0_6px_18px_rgba(0,0,0,0.55)]">
          {slots.map((slot) => (
            <div
              key={slot.id}
              title={slot.title}
              className="flex w-14 flex-col items-center rounded-sm border border-border/70 bg-secondary/50 px-1 py-1"
            >
              <span className="text-[15px] leading-none">{slot.emoji}</span>
              <span className="mt-0.5 font-mono text-[8px] leading-none text-primary">{slot.label.replace(`${slot.emoji} `, '')}</span>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex w-12 flex-col items-center rounded-sm border border-primary/50 bg-primary/10 px-1 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-primary hover:bg-primary/20"
          >
            <Backpack className="h-4 w-4" />
            E
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[62] flex items-center justify-center bg-black/70 p-3">
          <div className="max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-border bg-card p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-xl font-bold">Your pack</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  {citizen.goose_name || citizen.full_name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-sm border border-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
              >
                Close · E
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="Bread" value={`🍞 ${citizen.bread}`} />
              <Stat label="Ore" value={`⛏ ${citizen.ore ?? 0}`} />
              <Stat label="Shards" value={`💠 ${shards}/9`} />
              <Stat label="Fish" value={`🐟 ${citizen.fish_caught ?? 0}`} />
            </div>

            {note && (
              <p className="mt-3 rounded-sm border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-[10px] text-primary">
                {note}
              </p>
            )}

            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Things you own · sell back for four fifths
            </p>
            {owned.length === 0 ? (
              <p className="mt-2 text-[13px] text-muted-foreground">
                Nothing yet. The e-shop sells homes, boats, pets and decorations.
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-border/70">
                {owned.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 py-2">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="text-lg">{item.emoji}</span>
                      <span className="truncate text-[13px]">{item.name}</span>
                      {item.worn && (
                        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
                          worn
                        </span>
                      )}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      {item.slot && (
                        <button
                          type="button"
                          disabled={busy === item.id}
                          onClick={() => rig(item, (citizen.gear ?? []).includes(item.id))}
                          className={`rounded-sm border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] disabled:opacity-50 ${
                            (citizen.gear ?? []).includes(item.id)
                              ? 'border-primary bg-primary/15 text-primary'
                              : 'border-border text-muted-foreground hover:border-primary/60 hover:text-primary'
                          }`}
                        >
                          {(citizen.gear ?? []).includes(item.id) ? 'Rigged' : 'Rig'}
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={busy === item.id}
                        onClick={() => sell(item)}
                        className="flex items-center gap-1 rounded-sm border border-primary/50 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-primary hover:bg-primary/10 disabled:opacity-50"
                      >
                        <Coins className="h-3 w-3" />
                        {item.refund}
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Things you found
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              {finds.length === 0
                ? 'Nothing yet. Search the boulders and hollow trees out on the meadow.'
                : finds.join(' · ')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-sm border border-border/80 bg-secondary/50 px-2.5 py-1.5">
      <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-mono text-[13px] text-foreground">{value}</p>
    </div>
  );
}