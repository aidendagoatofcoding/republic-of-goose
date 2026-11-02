const WRAP = 'absolute -translate-x-1/2 -translate-y-1/2';

export function Counter({ p }) {
  return (
    <div className={WRAP} style={{ left: `${p.x}%`, top: `${p.y}%`, width: 'min(46vw, 210px)' }}>
      <div className="rounded-t-sm border border-b-0 border-[#7a6242] bg-gradient-to-b from-[#8f7047] to-[#5d4a2e] px-1.5 pb-1 pt-1.5">
        <div className="flex items-stretch gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-6 flex-1 rounded-sm border border-[#2c2116] bg-[#17110b]/75"
              style={{ opacity: 0.85 - i * 0.12 }}
            />
          ))}
        </div>
      </div>
      <div className="h-1.5 rounded-b-sm border border-t-0 border-[#4a3a24] bg-[#6b5638]" />
      <span className="mt-1 block text-center font-mono text-[7px] uppercase tracking-[0.26em] text-[#e8d9b0]/60">
        {p.label || 'COUNTER'}
      </span>
    </div>
  );
}

export function Vault({ p }) {
  return (
    <div className={WRAP} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
      <div className="relative h-24 w-24 rounded-full border-[5px] border-[#7a6a4e] bg-[#2b2418] shadow-[inset_0_0_16px_rgba(0,0,0,0.85)] sm:h-28 sm:w-28">
        <div className="vault-wheel absolute inset-3 rounded-full border-2 border-[#c8a86a]/70">
          <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-[#c8a86a]/60" />
          <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-[#c8a86a]/60" />
          <span className="absolute inset-[22%] rounded-full border border-[#c8a86a]/45" />
        </div>
        <span className="glow-pulse absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f2c96b]" />
      </div>
      <span className="mt-1 block text-center font-mono text-[7px] uppercase tracking-[0.22em] text-[#c8a86a]/60">
        RESERVES
      </span>
    </div>
  );
}

export function Board({ p }) {
  const rows = [
    { w: 72, up: true, delay: '0s' },
    { w: 54, up: false, delay: '0.5s' },
    { w: 88, up: true, delay: '1.1s' },
    { w: 40, up: true, delay: '0.3s' },
    { w: 64, up: false, delay: '1.6s' },
  ];
  return (
    <div
      className={WRAP}
      style={{ left: `${p.x}%`, top: `${p.y}%`, width: 'min(52vw, 250px)' }}
    >
      <div className="rounded-sm border-2 border-[#5b472c] bg-[#0f1510] p-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.5)]">
        <span className="mb-1 block font-mono text-[7px] uppercase tracking-[0.26em] text-[#8fdca0]/70">
          BREAD · SHARES · GULL
        </span>
        <div className="space-y-1">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="w-5 font-mono text-[6.5px] text-[#e8d9b0]/50">HNK</span>
              <span
                className="ticker-bar h-1.5 rounded-full"
                style={{
                  width: `${row.w}%`,
                  background: row.up ? '#8fdca0' : '#ff8a6a',
                  animationDelay: row.delay,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MapProp({ p }) {
  return (
    <div className={WRAP} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
      <div className="h-20 w-28 rounded-sm border-2 border-[#5b472c] bg-[#22301f] p-1.5">
        <div className="h-full w-full rounded-sm border border-[#c8b48a]/30 bg-[radial-gradient(circle_at_30%_40%,#3c5233,transparent_60%),radial-gradient(circle_at_70%_60%,#4a6240,transparent_55%)]" />
      </div>
      <span className="mt-1 block text-center font-mono text-[7px] uppercase tracking-[0.2em] text-[#c8b48a]/60">
        THE DISTRICTS
      </span>
    </div>
  );
}

export function Shelf({ p }) {
  return (
    <div className={WRAP} style={{ left: `${p.x}%`, top: `${p.y}%`, width: 'min(30vw, 130px)' }}>
      <div className="rounded-sm border border-[#5b472c] bg-[#3a2e1e] p-1">
        {[0, 1, 2].map((row) => (
          <div key={row} className="mb-1 flex items-end gap-1 border-b border-[#5b472c]/70 pb-1">
            {[0, 1, 2, 3].map((box) => (
              <span
                key={box}
                className="block flex-1 rounded-[1px]"
                style={{
                  height: `${10 + ((row + box) % 3) * 5}px`,
                  background: ['#c88a5a', '#8fa06a', '#c8b48a', '#7d8fa0'][(row + box) % 4],
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Sacks({ p }) {
  return (
    <div className={`${WRAP} flex items-end gap-1`} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="room-bob block rounded-t-full border border-[#8a7040] bg-gradient-to-b from-[#c8b48a] to-[#8a7040]"
          style={{
            width: 18 + i * 3,
            height: 22 + i * 4,
            animationDelay: `${i * 0.4}s`,
            boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.3)',
          }}
        />
      ))}
    </div>
  );
}

export function Mill({ p }) {
  return (
    <div className={WRAP} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
      <div className="mill-wheel relative h-20 w-20 rounded-full border-[3px] border-[#7a6242] bg-[#2a2317]/70">
        {[0, 1, 2, 3, 4, 5].map((spoke) => (
          <span
            key={spoke}
            className="absolute left-1/2 top-1/2 h-[2px] w-9 origin-left bg-[#c8a86a]/70"
            style={{ transform: `rotate(${spoke * 30}deg)` }}
          />
        ))}
        <span className="absolute inset-[38%] rounded-full bg-[#c8a86a]/70" />
      </div>
    </div>
  );
}

export function Press({ p }) {
  return (
    <div className={WRAP} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
      <div className="relative">
        <div className="rounded-sm border-2 border-[#5b472c] bg-[#3a3a30] p-1.5">
          <div className="press-arm h-2.5 rounded-sm bg-[#c8b48a]/70" />
          <div className="mt-1 h-3 rounded-sm bg-[#1a1a14]" />
          <div className="mt-1 h-2 rounded-sm bg-[#c8b48a]/40" />
        </div>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="paper-scrap absolute h-2.5 w-2 rounded-[1px] bg-[#efe6cf]"
            style={{ left: `${8 + i * 18}px`, top: '-2px', animationDelay: `${i * 1.3}s` }}
          />
        ))}
      </div>
      <span className="mt-1 block text-center font-mono text-[7px] uppercase tracking-[0.2em] text-[#c8c8b0]/60">
        THE PRESS
      </span>
    </div>
  );
}

export function Oven({ p }) {
  return (
    <div className={WRAP} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
      <div className="rounded-t-[40%] border-2 border-[#5b472c] bg-[#3a2e1e] px-2 pb-1.5 pt-2">
        <div className="relative h-10 w-16 overflow-hidden rounded-t-full border border-[#2c2116] bg-[#140d07]">
          <span
            className="fire-glow absolute inset-x-2 bottom-0 h-7 rounded-t-full bg-[radial-gradient(circle_at_50%_100%,#ffd27a,#ff8a3a_45%,transparent_75%)]"
            aria-hidden="true"
          />
        </div>
        <span className="mt-1 block text-center font-mono text-[7px] uppercase tracking-[0.18em] text-[#e8d9b0]/60">
          OVEN
        </span>
      </div>
    </div>
  );
}

export function Benches({ p }) {
  return (
    <div className={WRAP} style={{ left: `${p.x}%`, top: `${p.y}%`, width: 'min(34vw, 150px)' }}>
      {[0, 1].map((row) => (
        <div key={row} className="mb-1 flex gap-1">
          {[0, 1, 2].map((seat) => (
            <span
              key={seat}
              className="h-2.5 flex-1 rounded-sm border border-[#5b472c] bg-[#6b5638]"
              style={{ opacity: 0.9 - row * 0.2 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function Podium({ p }) {
  return (
    <div className={WRAP} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
      <div className="mx-auto h-3 w-16 rounded-t-sm border border-[#5b472c] bg-[#8a7040]" />
      <div className="mx-auto h-8 w-10 border-x border-b border-[#5b472c] bg-[#6b5638]" />
      <span className="mt-1 block text-center font-mono text-[7px] uppercase tracking-[0.18em] text-[#e8d9b0]/60">
        {p.label || 'THE FLOOR'}
      </span>
    </div>
  );
}