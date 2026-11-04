import { useState } from 'react';
import { useCitizen } from '@/hooks/useCitizen';
import { levelProgress, nextSword, swordFor } from '@/lib/swords';

// The regimental smith and the blade you carry. Shown at the front line and inside the warzone.
export default function SwordsmithPanel({ onNotice }) {
  const { citizen, signedIn, run } = useCitizen();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const tier = citizen?.sword_tier ?? 0;
  const blade = swordFor(tier);
  const upgrade = nextSword(tier);
  const progress = levelProgress(citizen?.xp ?? 0);

  const buySword = async () => {
    setBusy(true);
    setError('');
    try {
      await run({ action: 'upgradeSword' });
      onNotice?.('The smith hands over your new blade. It balances beautifully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="rounded-sm border border-[#e0664a]/40 bg-[#1a0f0b]/80 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#e0664a]">Your blade</p>
            <p className="font-display text-lg text-[#f6ecc9]">{blade.name}</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#e8d9b0]/70">
              Lv {progress.level} · power ×{blade.power}
            </p>
          </div>
          <span className="text-3xl" aria-hidden="true">
            {blade.emoji}
          </span>
        </div>
        <p className="mt-1.5 text-[13px] leading-snug text-[#e8d9b0]/75">{blade.blurb}</p>
      </div>

      <div className="rounded-sm border border-border/60 bg-card/70 p-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-primary">
          The regimental smith
        </p>
        {upgrade ? (
          <>
            <p className="mt-1 text-[13px] leading-snug text-foreground/75">
              {upgrade.emoji} {upgrade.name} · power ×{upgrade.power} — yours for 🍞 {upgrade.cost}.
            </p>
            <button
              type="button"
              disabled={busy || !signedIn || (citizen?.bread ?? 0) < upgrade.cost}
              onClick={buySword}
              className="mt-2 rounded-sm border border-[#f2c96b]/50 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f2c96b] hover:bg-[#f2c96b]/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? 'At the anvil…' : `Buy ${upgrade.name} — 🍞 ${upgrade.cost}`}
            </button>
            {!signedIn && (
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                Sign in with your passport to buy a blade.
              </p>
            )}
          </>
        ) : (
          <p className="mt-1 text-[13px] leading-snug text-foreground/75">
            You carry Dawnpiercer. The smith salutes and goes back to his tea.
          </p>
        )}
        {error && (
          <p role="alert" className="mt-1 font-mono text-[10px] text-[#FF6B4A]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}