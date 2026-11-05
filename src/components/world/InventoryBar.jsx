import { useEffect, useState } from 'react';
import { useCitizen } from '@/hooks/useCitizen';
import useShopItems from '@/hooks/useShopItems';
import { SIFT_SHARDS } from '@/lib/hidden';
import { tackleSlot } from '@/lib/tackle';
import Hotbar from '@/components/world/inventory/Hotbar';
import PackPanel from '@/components/world/inventory/PackPanel';

const HOTBAR = 9;

// The quick bar along the bottom of the meadow, and the pack behind it. Press E.
export default function InventoryBar({ position = null, onPlaced }) {
  const { citizen, run } = useCitizen();
  const items = useShopItems();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
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
      const slot = Number(event.key);
      if (Number.isInteger(slot) && slot >= 1 && slot <= HOTBAR) setSelected(slot - 1);
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
      category: item?.category || 'decoration',
      refund: Math.floor((item?.price ?? 0) * 0.8),
      slot: tackleSlot(item),
    };
  });

  const stats = [
    { key: 'bread', emoji: '🍞', count: citizen.bread, title: 'Bread' },
    { key: 'ore', emoji: '⛏', count: citizen.ore ?? 0, title: 'Bread ore' },
    { key: 'shard', emoji: '💠', count: shards, title: `Sift shards ${shards}/9` },
    { key: 'fish', emoji: '🐟', count: citizen.fish_caught ?? 0, title: 'Fish landed' },
    { key: 'finds', emoji: '🎒', count: finds.length, title: 'Things found' },
  ];

  const carried = owned.map((item) => ({
    key: item.id,
    emoji: item.emoji,
    count: 1,
    title: item.name,
  }));

  const slots = Array.from({ length: HOTBAR }, (_, index) => {
    const entry = [...stats, ...carried][index];
    return entry || { key: `empty-${index}`, empty: true, title: 'Empty slot' };
  });

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

  const place = async (item) => {
    setBusy(item.id);
    setNote('');
    try {
      await run({
        action: 'placeHome',
        item_id: item.id,
        x: position?.x ?? 50,
        y: position?.y ?? 60,
      });
      setNote(`${item.name} is standing out in the Commons now.`);
      onPlaced?.();
    } catch (error) {
      setNote(error.message);
    } finally {
      setBusy('');
    }
  };

  return (
    <>
      <Hotbar slots={slots} selected={selected} onSelect={setSelected} onOpen={() => setOpen(true)} />

      {open && (
        <PackPanel
          citizen={citizen}
          stats={stats}
          owned={owned}
          busy={busy}
          note={note}
          onClose={() => setOpen(false)}
          onRig={rig}
          onSell={sell}
          onPlace={place}
        />
      )}
    </>
  );
}