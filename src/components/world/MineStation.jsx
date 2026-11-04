import { useState } from 'react';
import { Pickaxe } from 'lucide-react';
import { useCitizen } from '@/hooks/useCitizen';
import useShopItems from '@/hooks/useShopItems';

// The bread seam. Swing the pick, fill your pockets, let the ore grow back.
export default function MineStation() {
  const { citizen, signedIn, run } = useCitizen();
  const items = useShopItems();
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  if (!signedIn) {
    return (
      <p className="text-[13px] text-muted-foreground">
        The pit boss will not hand a pick to a goose without a passport. Enrol at the Registry first.
      </p>
    );
  }

  const owned = Array.isArray(citizen?.possessions) ? citizen.possessions : [];
  const bestPick = items
    .filter((item) => /pick/i.test(item.name || '') && owned.includes(item.id))
    .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))[0];
  const pickName = bestPick ? `${bestPick.emoji} ${bestPick.name}` : 'bare webbed feet';

  const swing = async () => {
    setBusy(true);
    setNote('');
    try {
      const data = await run({ action: 'mine' });
      setNote(`You break off a chunk worth 🍞 ${data.haul}. Ore in your pack: ⛏ ${data.citizen.ore}.`);
    } catch (error) {
      setNote(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Pickaxe className="h-4 w-4 text-primary" />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          The bread seam
        </p>
      </div>
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        Raw bread ore, still warm from the earth. Every swing knocks a little bread loose and
        leaves a lump of ore in your pack.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-sm border border-border bg-secondary/50 px-3 py-2">
          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">Ore</p>
          <p className="font-mono text-sm text-primary">⛏ {citizen?.ore ?? 0}</p>
        </div>
        <div className="rounded-sm border border-border bg-secondary/50 px-3 py-2">
          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">Bread</p>
          <p className="font-mono text-sm text-primary">🍞 {citizen?.bread ?? 0}</p>
        </div>
      </div>

      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        In hand · <span className="text-primary">{pickName}</span>
      </p>

      <button
        type="button"
        onClick={swing}
        disabled={busy}
        className="w-full rounded-sm border border-primary bg-primary/15 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary hover:bg-primary/25 disabled:opacity-50"
      >
        {busy ? 'Swinging…' : 'Swing the pick'}
      </button>

      {note && (
        <p className="rounded-sm border border-primary/40 bg-primary/10 px-3 py-2 text-[12px] text-primary">
          {note}
        </p>
      )}
    </div>
  );
}