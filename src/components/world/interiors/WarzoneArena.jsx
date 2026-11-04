import { useState } from 'react';
import { Swords } from 'lucide-react';
import ArenaGame from '@/components/arena/ArenaGame';
import { useCitizen } from '@/hooks/useCitizen';
import { levelProgress, nextSword, swordFor } from '@/lib/swords';

export default function WarzoneArena({ arenaBus }) {
  const { citizen, signedIn, run } = useCitizen();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');

  const tier = citizen?.sword_tier ?? 0;
  const blade = swordFor(tier);
  const upgrade = nextSword(tier);
  const progress = levelProgress(citizen?.xp ?? 0);

  const buySword = async () => {
    setBusy(true);
    setError('');
    setNote('');
    try {
      await run({ action: 'upgradeSword' });
      setNote('The smith hands over your new blade. It balances beautifully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const recordFight = async ({ kills, duels }) => {
    if (!signedIn) return;
    try {
      const data = await run({ action: 'arenaResult', kills, duels });
      if (data.gained) setNote(`+${data.gained} xp banked from the front line.`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (open) {
    return (
      <ArenaGame
        bus={arenaBus}
        tier={tier}
        xp={citizen?.xp ?? 0}
        onExit={() => setOpen(false)}
        onFinish={recordFight}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-sm border border-[#e0664a]/40 bg-[#1a0f0b]/60 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#e0664a]">
              Your blade
            </p>
            <p className="font-display text-lg text-[#f6ecc9]">{blade.name}</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#e8d9b0]/70">
              Lv {progress.level} · {progress.into}/{progress.need} xp · power ×{blade.power}
            </p>
          </div>
          <span className="text-3xl" aria-hidden="true">
            {blade.emoji}
          </span>
        </div>
        <p className="mt-1.5 text-[13px] leading-snug text-[#e8d9b0]/75">{blade.blurb}</p>
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-[#e0664a]/60 bg-[#e0664a]/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#ffb9a5] hover:bg-[#e0664a]/30"
      >
        <Swords className="h-4 w-4" />
        Step onto the front line
      </button>

      <p className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.12em] text-[#e8d9b0]/50">
        WASD to move · J slash · K stab · L parry · Shift guard · Space dodge
      </p>

      {error && (
        <p role="alert" className="font-mono text-[10px] text-[#FF6B4A]">
          {error}
        </p>
      )}
      {note && <p className="font-mono text-[10px] text-primary">{note}</p>}

      <div className="rounded-sm border border-border/60 bg-card/50 p-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-primary">
          The regimental smith
        </p>
        {upgrade ? (
          <>
            <p className="mt-1 text-[13px] leading-snug text-foreground/75">
              {upgrade.name} · power ×{upgrade.power} — yours for 🍞 {upgrade.cost}.
            </p>
            <button
              type="button"
              disabled={busy || !signedIn || (citizen?.bread ?? 0) < upgrade.cost}
              onClick={buySword}
              className="mt-2 rounded-sm border border-[#f2c96b]/50 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f2c96b] hover:bg-[#f2c96b]/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? 'Forge in progress…' : `Upgrade blade — 🍞 ${upgrade.cost}`}
            </button>
            {!signedIn && (
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                Sign in with your passport to buy a blade.
              </p>
            )}
          </>
        ) : (
          <p className="mt-1 text-[13px] leading-snug text-foreground/75">
            You already carry Honkbringer. The smith salutes you and goes back to his tea.
          </p>
        )}
      </div>
    </div>
  );
}