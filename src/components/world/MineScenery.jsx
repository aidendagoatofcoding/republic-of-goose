const SLEEPERS = Array.from({ length: 10 }, (_, i) => {
  const t = i / 9;
  return {
    left: 46.5 - 17 * t,
    right: 53.5 + 17 * t,
    y: 55 + 45 * t,
    width: 0.4 + 1.1 * t,
  };
});

const VEINS = [
  'M5 74c8-8 4-18 13-23s9-10 15-16',
  'M27 88c-5-10 5-16 3-25s4-12 2-19',
  'M70 90c5-10 0-17 8-23s5-13 12-17',
  'M87 62c-4-8 5-13 3-20',
];

const DUST = Array.from({ length: 14 }, (_, i) => ({
  left: 8 + ((i * 19) % 84),
  top: 40 + ((i * 27) % 48),
  delay: (i % 7) * 1.4,
}));

// The Bread Mines: a rock face with an adit cut into it, rails running out of the dark,
// carts on the sleepers and lamps burning against the stone.
export default function MineScenery() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {/* the rock the mine is cut into */}
      <div
        className="absolute inset-x-0 top-[15%] h-[40%]"
        style={{
          background: 'linear-gradient(180deg,#574a3a 0%,#3b3227 30%,#27211a 66%,#1a1611 100%)',
          clipPath:
            'polygon(0 5%,7% 2%,15% 5%,24% 1%,33% 4%,43% 0%,52% 3%,62% 1%,71% 4%,80% 2%,89% 5%,96% 2%,100% 5%,100% 100%,0 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 top-[15%] h-[40%] opacity-25"
        style={{
          backgroundImage:
            'repeating-linear-gradient(3deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 11px), repeating-linear-gradient(-7deg, rgba(0,0,0,0.45) 0 2px, transparent 2px 19px)',
        }}
      />

      {/* bread ore running through the rock */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-[15%] h-[40%] w-full"
      >
        <g fill="none" strokeLinecap="round">
          {VEINS.map((d) => (
            <path key={`glow-${d}`} d={d} stroke="#e8b45a" strokeOpacity="0.16" strokeWidth="2.6" />
          ))}
          {VEINS.map((d) => (
            <path key={d} d={d} stroke="#f2c47a" strokeOpacity="0.5" strokeWidth="0.5" />
          ))}
        </g>
      </svg>

      {/* the floor of the yard */}
      <div
        className="absolute inset-x-0 bottom-0 h-[47%]"
        style={{ background: 'linear-gradient(180deg,#2b241c 0%,#211b15 42%,#171310 100%)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[47%] opacity-30"
        style={{
          backgroundImage:
            'repeating-linear-gradient(88deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 7px), repeating-linear-gradient(-14deg, rgba(0,0,0,0.5) 0 1px, transparent 1px 13px)',
        }}
      />

      {/* rails out of the adit */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 z-[2] h-full w-full"
      >
        {SLEEPERS.map((sleeper) => (
          <line
            key={`sleeper-${sleeper.y}`}
            x1={sleeper.left}
            y1={sleeper.y}
            x2={sleeper.right}
            y2={sleeper.y}
            stroke="#453824"
            strokeWidth={sleeper.width}
          />
        ))}
        <line x1="46.5" y1="55" x2="29.5" y2="100" stroke="#8f8778" strokeWidth="0.45" />
        <line x1="53.5" y1="55" x2="70.5" y2="100" stroke="#8f8778" strokeWidth="0.45" />
        <line x1="46.5" y1="55" x2="29.5" y2="100" stroke="#2a241c" strokeWidth="0.14" />
        <line x1="53.5" y1="55" x2="70.5" y2="100" stroke="#2a241c" strokeWidth="0.14" />
      </svg>

      {/* the adit, timbered and lit */}
      <div
        className="absolute left-1/2 z-[2] -translate-x-1/2 -translate-y-full"
        style={{ top: '55%', width: '26%', height: '18%' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(115% 95% at 50% 100%, #050403 0%, #0b0806 52%, #16110c 76%, #241d15 100%)',
            clipPath: 'polygon(50% 0,90% 10%,100% 30%,100% 100%,0 100%,0 30%,10% 10%)',
          }}
        />
        <span
          className="glow-pulse absolute left-1/2 top-[36%] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#ffcf7a]"
          style={{ boxShadow: '0 0 26px 10px rgba(255,196,106,0.32)' }}
        />
        <span
          className="absolute bottom-0 left-0 h-[76%] w-[8%] border border-[#6d5334]"
          style={{ background: 'linear-gradient(90deg,#8b6a41,#5a4527)' }}
        />
        <span
          className="absolute bottom-0 right-0 h-[76%] w-[8%] border border-[#6d5334]"
          style={{ background: 'linear-gradient(270deg,#8b6a41,#5a4527)' }}
        />
        <span
          className="absolute left-0 right-0 top-[24%] h-[9%] border border-[#6d5334]"
          style={{ background: 'linear-gradient(180deg,#9a7748,#634c2c)' }}
        />
      </div>

      {/* lamps set on posts */}
      {[
        { x: 13, y: 78 },
        { x: 87, y: 74 },
      ].map((lamp) => (
        <div
          key={`lamp-${lamp.x}`}
          className="absolute z-[2] -translate-x-1/2 -translate-y-full"
          style={{ left: `${lamp.x}%`, top: `${lamp.y}%` }}
        >
          <span
            className="glow-pulse mx-auto block h-3.5 w-3.5 rounded-sm border border-[#6d5334] bg-[#ffcf7a]"
            style={{ boxShadow: '0 0 28px 11px rgba(255,190,96,0.26)' }}
          />
          <span className="mx-auto mt-0.5 block h-7 w-[2px] bg-[#54432c]" />
        </div>
      ))}

      {/* carts on the rails, heaped with ore */}
      {[
        { x: 39, y: 84, size: 58 },
        { x: 62, y: 92, size: 44 },
      ].map((cart) => (
        <div
          key={`cart-${cart.x}`}
          className="absolute z-[2] -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${cart.x}%`, top: `${cart.y}%` }}
        >
          <div className="relative" style={{ width: cart.size }}>
            <div
              className="mx-auto h-3 rounded-t-full"
              style={{
                width: '72%',
                background: 'radial-gradient(circle at 40% 30%, #f6d18f, #b6822f 70%, #8a6122)',
              }}
            />
            <div
              className="relative h-[22px] border border-[#4a3420]"
              style={{
                background:
                  'repeating-linear-gradient(90deg, rgba(0,0,0,0.28) 0 1px, transparent 1px 9px), linear-gradient(180deg,#8a6b45,#5c452c)',
                clipPath: 'polygon(5% 0,95% 0,100% 100%,0 100%)',
              }}
            />
            <div className="relative -mt-1 flex justify-between px-[15%]">
              {[0, 1].map((wheel) => (
                <span
                  key={wheel}
                  className="block h-3.5 w-3.5 rounded-full border border-[#2b231a] bg-[#3d3427]"
                  style={{ boxShadow: 'inset 0 0 0 1px rgba(200,180,140,0.25)' }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* rubble at the foot of the rock */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 z-[2] h-full w-full"
      >
        <g fill="#3a3128" stroke="#5c4f3d" strokeWidth="0.25">
          <polygon points="8,86 11,82 15,84 16,88 12,90 8,89" />
          <polygon points="90,84 93,80 96,83 95,87 91,88" />
          <polygon points="20,92 23,89 26,91 25,94 21,94" />
        </g>
      </svg>

      {DUST.map((mote) => (
        <span
          key={`dust-${mote.left}-${mote.top}`}
          className="dust-mote absolute rounded-full bg-[#e8d9b0]"
          style={{
            left: `${mote.left}%`,
            top: `${mote.top}%`,
            height: '2px',
            width: '2px',
            animationDelay: `${mote.delay}s`,
          }}
        />
      ))}
    </div>
  );
}