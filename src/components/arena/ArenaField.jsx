import { swordFor } from '@/lib/swords';

const EFFECTS = {
  slash: { glyph: '⟋', color: '#f6ecc9' },
  stab: { glyph: '➤', color: '#ffd9a0' },
  parry: { glyph: '✧', color: '#9fe0ff' },
  hurt: { glyph: '✸', color: '#ff7a5c' },
};

function Health({ value, max = 100, tint }) {
  return (
    <span className="mt-0.5 block h-[3px] w-10 overflow-hidden rounded-full bg-black/60">
      <span
        className="block h-full"
        style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%`, background: tint }}
      />
    </span>
  );
}

export default function ArenaField({ player, ducks, remotes, effects, tier }) {
  const blade = swordFor(tier);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0b120c]">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, #1d2a1c 0%, #121a13 45%, #080d09 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #c2ff85 0 1px, transparent 1px 56px), repeating-linear-gradient(0deg, #c2ff85 0 1px, transparent 1px 56px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[42%]"
        style={{ background: 'linear-gradient(180deg, rgba(58,42,26,0) 0%, #2a1f14 100%)' }}
        aria-hidden="true"
      />
      <span className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 font-mono text-[8px] uppercase tracking-[0.32em] text-[#e0664a]/70">
        The Front Line
      </span>

      {remotes.map(([key, remote]) => (
        <div
          key={`foe-${key}`}
          style={{ left: `${remote.x}%`, top: `${remote.y}%` }}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <span className="block text-3xl drop-shadow-[0_6px_8px_rgba(0,0,0,0.7)]" aria-hidden="true">
            🦢
          </span>
          <span className="mt-0.5 block whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.12em] text-[#ffb9a5]">
            {String(remote.name || 'A goose').split(' ')[0]}
          </span>
          <Health value={remote.hp ?? 100} tint="#e0664a" />
        </div>
      ))}

      {ducks.map((duck) => (
        <div
          key={duck.id}
          style={{ left: `${duck.x}%`, top: `${duck.y}%` }}
          className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 text-center ${
            duck.stunned > performance.now() ? 'opacity-60' : ''
          }`}
        >
          <span className="block text-2xl drop-shadow-[0_4px_6px_rgba(0,0,0,0.7)]" aria-hidden="true">
            🦆
          </span>
          <Health value={duck.hp} max={34} tint="#ffb347" />
        </div>
      ))}

      {player && (
        <div
          style={{ left: `${player.x}%`, top: `${player.y}%` }}
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <span
            className={`relative block text-4xl drop-shadow-[0_8px_10px_rgba(0,0,0,0.75)] ${
              performance.now() < player.parryUntil ? 'ring-2 ring-[#9fe0ff] rounded-full' : ''
            }`}
            style={{ transform: player.aimX < -0.1 ? 'scaleX(-1)' : undefined }}
            aria-hidden="true"
          >
            🦢
            <span
              className="absolute -right-2 top-1 text-lg"
              style={{ color: blade.tint, filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.8))' }}
            >
              {blade.emoji}
            </span>
          </span>
          <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.16em] text-primary">
            You
          </span>
        </div>
      )}

      {effects.map((effect) => {
        const style = EFFECTS[effect.kind] || EFFECTS.slash;
        return (
          <span
            key={effect.id}
            style={{ left: `${effect.x}%`, top: `${effect.y}%`, color: style.color }}
            className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2 text-2xl"
            aria-hidden="true"
          >
            {style.glyph}
          </span>
        );
      })}
    </div>
  );
}