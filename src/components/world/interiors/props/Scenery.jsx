const WRAP = 'absolute -translate-x-1/2 -translate-y-1/2';

export function Chandelier({ p }) {
  return (
    <div className={WRAP} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
      <div className="sway flex flex-col items-center">
        <span className="h-8 w-[1px] bg-[#c8a86a]/40" />
        <span className="relative flex h-6 w-20 items-center justify-center rounded-b-full border border-[#c8a86a]/60 bg-[#2a2317]/80">
          {[0, 1, 2, 3, 4].map((flame) => (
            <span
              key={flame}
              className="glow-pulse mx-[3px] block h-2 w-1.5 rounded-full bg-[#ffd27a]"
              style={{ animationDelay: `${flame * 0.35}s` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

export function Banner({ p, accent = '#f2c96b' }) {
  return (
    <div className={WRAP} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
      <div
        className="h-16 w-7 rounded-b-sm border border-[#c8a86a]/40"
        style={{
          background: `linear-gradient(${accent}33, ${accent}14)`,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 84%, 0 100%)',
        }}
      >
        <span className="mt-2 block text-center text-[10px]" aria-hidden="true">
          🪶
        </span>
      </div>
    </div>
  );
}

export function Trees({ p }) {
  return (
    <div className={WRAP} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
      <div className="relative flex items-end gap-2">
        {[0, 1, 2].map((tree) => (
          <span
            key={tree}
            className="block"
            style={{
              width: 0,
              height: 0,
              borderLeft: `${14 + tree * 4}px solid transparent`,
              borderRight: `${14 + tree * 4}px solid transparent`,
              borderBottom: `${52 + tree * 14}px solid #16301f`,
              opacity: 0.9 - tree * 0.15,
            }}
          />
        ))}
        {[0, 1, 2].map((fly) => (
          <span
            key={`fly-${fly}`}
            className="firefly absolute h-1 w-1 rounded-full bg-[#d8f0a0]"
            style={{
              left: `${10 + fly * 22}px`,
              top: `${12 + fly * 10}px`,
              animationDelay: `${fly * 1.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function Coins({ p }) {
  return (
    <div className={`${WRAP} flex items-end gap-1`} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
      {[0, 1, 2, 3].map((coin) => (
        <span
          key={coin}
          className="room-bob block h-2.5 w-2.5 rounded-full border border-[#8a7040] bg-[#f2c96b]"
          style={{ animationDelay: `${coin * 0.3}s`, marginBottom: `${(coin % 2) * 5}px` }}
        />
      ))}
    </div>
  );
}

export const SCENERY = { Chandelier, Banner, Trees, Coins };