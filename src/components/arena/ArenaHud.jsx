import { DoorOpen, RotateCcw } from 'lucide-react';
import { ARENA_ATTACKS } from '@/lib/arena';
import { levelProgress, swordFor } from '@/lib/swords';

function Bar({ value, max, tint, label }) {
  return (
    <div className="min-w-[86px] flex-1">
      <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#e8d9b0]/70">{label}</p>
      <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-black/60">
        <span
          className="block h-full transition-[width] duration-100"
          style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%`, background: tint }}
        />
      </span>
    </div>
  );
}

export default function ArenaHud({
  player,
  kills,
  duels,
  tier,
  xp,
  phase,
  onExit,
  onRestart,
  onAttack,
  onParry,
  onDodge,
  onBlock,
}) {
  const blade = swordFor(tier);
  const progress = levelProgress(xp);

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex flex-wrap items-start justify-between gap-3 bg-gradient-to-b from-black/80 to-transparent px-3 pb-6 pt-3 sm:px-5">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#e0664a]">
            The Duck Warzone
          </p>
          <p className="font-display text-lg leading-tight text-[#f6ecc9]">
            {blade.name} · Lv {progress.level}
          </p>
          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#e8d9b0]/60">
            {progress.into}/{progress.need} xp to the next rank
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#f6ecc9]">
            Ducks <span className="text-[#ffb347]">{kills}</span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#f6ecc9]">
            Duels <span className="text-[#ff8a6b]">{duels}</span>
          </span>
          <button
            type="button"
            onClick={onExit}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-sm border border-[#e0664a]/50 bg-black/60 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#ffb9a5] hover:bg-[#e0664a]/20"
          >
            <DoorOpen className="h-3.5 w-3.5" />
            Leave
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 bg-gradient-to-t from-black/85 to-transparent px-3 pb-3 pt-8 sm:px-5">
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          <div className="flex items-end gap-3">
            <Bar value={player?.hp ?? 0} max={100} tint="#e0664a" label={`Health ${Math.round(player?.hp ?? 0)}`} />
            <Bar
              value={player?.stamina ?? 0}
              max={100}
              tint="#9fe0ff"
              label={`Stamina ${Math.round(player?.stamina ?? 0)}`}
            />
            <button
              type="button"
              onClick={onRestart}
              className="pointer-events-auto inline-flex items-center gap-1 rounded-sm border border-[#f6ecc9]/30 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-[#f6ecc9]/80 hover:text-[#f6ecc9]"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>

          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5">
            {Object.entries(ARENA_ATTACKS).map(([kind, spec]) => (
              <button
                key={kind}
                type="button"
                onClick={() => onAttack(kind)}
                className="rounded-sm border border-[#f6ecc9]/35 bg-black/55 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f6ecc9] active:bg-[#f6ecc9]/20"
              >
                {spec.label} <span className="text-[#c2ff85]">[{spec.key}]</span>
              </button>
            ))}
            <button
              type="button"
              onClick={onParry}
              className="rounded-sm border border-[#9fe0ff]/45 bg-black/55 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#9fe0ff] active:bg-[#9fe0ff]/20"
            >
              Parry <span className="text-[#c2ff85]">[L]</span>
            </button>
            <button
              type="button"
              onClick={onDodge}
              className="rounded-sm border border-[#f6ecc9]/35 bg-black/55 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f6ecc9] active:bg-[#f6ecc9]/20"
            >
              Dodge <span className="text-[#c2ff85]">[Space]</span>
            </button>
            <button
              type="button"
              onClick={onBlock}
              className="rounded-sm border border-[#f2c96b]/45 bg-black/55 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f2c96b] active:bg-[#f2c96b]/20"
            >
              Raise guard <span className="text-[#c2ff85]">[Shift]</span>
            </button>
            <span className="ml-auto font-mono text-[8px] uppercase tracking-[0.14em] text-[#e8d9b0]/50">
              WASD to move
            </span>
          </div>
        </div>
      </div>

      {phase === 'down' && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-2 bg-black/75 px-6 text-center">
          <p className="font-display text-3xl text-[#f6ecc9]">You went down swinging.</p>
          <p className="text-[14px] text-[#e8d9b0]/80">
            {kills} duck{kills === 1 ? '' : 's'} and {duels} duel{duels === 1 ? '' : 's'} before the line
            took you.
          </p>
          <button
            type="button"
            onClick={onRestart}
            className="mt-1 rounded-sm border border-[#e0664a]/60 bg-[#e0664a]/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ffb9a5] hover:bg-[#e0664a]/30"
          >
            Back to the front
          </button>
        </div>
      )}
    </>
  );
}