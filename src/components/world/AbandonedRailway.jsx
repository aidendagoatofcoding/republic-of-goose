const TRACK = Array.from({ length: 121 }, (_, i) => {
  const x = (i / 120) * 100;
  return { x, y: 77 - 4 * Math.sin((Math.PI * x) / 100) };
});

const at = (x) => 77 - 4 * Math.sin((Math.PI * x) / 100);

const line = (offset) =>
  TRACK.map((point, i) => `${i === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${(point.y + offset).toFixed(2)}`).join(' ');

const SLEEPERS = Array.from({ length: 44 }, (_, i) => {
  const x = 2 + i * 2.2;
  return { x, y: at(x) };
});

const WEEDS = Array.from({ length: 30 }, (_, i) => {
  const x = 1 + i * 3.4 + ((i * 7) % 5) * 0.35;
  return { x, y: at(x) };
});

// The line that used to run before the geese walked everywhere. Nothing calls at the halt
// any more, but the rails are still there, rusting under the grass.
export default function AbandonedRailway() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {/* the ballast shoulder */}
        <path d={line(0)} fill="none" stroke="#4a4436" strokeOpacity="0.85" strokeWidth="3" />
        <path d={line(0)} fill="none" stroke="#5a5241" strokeOpacity="0.5" strokeWidth="1.6" />

        {/* sleepers, rotted and half sunk */}
        {SLEEPERS.map((sleeper) => (
          <line
            key={`sleeper-${sleeper.x}`}
            x1={sleeper.x}
            y1={sleeper.y - 2.1}
            x2={sleeper.x + 0.4}
            y2={sleeper.y + 2.1}
            stroke="#38301f"
            strokeOpacity="0.8"
            strokeWidth="0.55"
          />
        ))}

        {/* two rusted rails */}
        <path d={line(-1.05)} fill="none" stroke="#7c6a51" strokeWidth="0.22" />
        <path d={line(1.05)} fill="none" stroke="#7c6a51" strokeWidth="0.22" />
        <path d={line(-1.05)} fill="none" stroke="#2b231a" strokeOpacity="0.6" strokeWidth="0.1" />
        <path d={line(1.05)} fill="none" stroke="#2b231a" strokeOpacity="0.6" strokeWidth="0.1" />

        {/* grass creeping back over the permanent way */}
        <g stroke="#4e7a3c" strokeOpacity="0.75" strokeWidth="0.18" fill="none" strokeLinecap="round">
          {WEEDS.map((weed) => (
            <path
              key={`weed-${weed.x}`}
              d={`M${weed.x} ${weed.y + 0.5}q0.5-1.4 0.1-2.6M${weed.x + 0.4} ${weed.y + 0.4}q0.3-1.1 1-1.7`}
            />
          ))}
        </g>

        {/* the buffer stop where the line begins */}
        <g stroke="#4a3b28" strokeWidth="0.7" strokeLinecap="round">
          <path d={`M3 ${at(3) - 1.8}v3.6`} />
          <path d={`M4.4 ${at(4.4) - 1.8}v3.6`} />
          <path d={`M3 ${at(3)}l1.4 1.6`} />
        </g>
      </svg>

      {/* the halt that nobody catches a train from */}
      <div
        className="absolute -translate-x-1/2 -translate-y-full"
        style={{ left: '17%', top: `${at(17)}%` }}
      >
        <div className="relative h-24 w-48">
          <div
            className="absolute bottom-0 left-0 right-0 h-4 border border-[#2c261c]"
            style={{
              background:
                'repeating-linear-gradient(90deg, rgba(0,0,0,0.3) 0 1px, transparent 1px 15px), linear-gradient(180deg,#6f6754,#4d4636)',
            }}
          />
          <span className="absolute bottom-3 left-2 block h-16 w-[3px] bg-[#4c3d29]" />
          <span className="absolute bottom-3 right-4 block h-14 w-[3px] bg-[#4c3d29]" />
          <div
            className="absolute bottom-14 left-0 right-0 h-4 border border-[#33291d]"
            style={{
              background: 'repeating-linear-gradient(90deg,#6a5334 0 4px, #57432a 4px 8px)',
              transform: 'rotate(-5deg)',
              clipPath: 'polygon(0 0, 100% 12%, 100% 100%, 0 78%)',
            }}
          />
          <span className="absolute bottom-3 left-8 block h-3 w-14 border border-[#3d3325] bg-[#6f5c40]" />
        </div>
      </div>

      {/* a signal rusted off its own bearings */}
      <div
        className="absolute -translate-x-1/2 -translate-y-full"
        style={{ left: '45%', top: `${at(45)}%` }}
      >
        <div className="relative h-28 w-16">
          <span className="absolute bottom-0 left-1/2 h-24 w-[3px] -translate-x-1/2 bg-[#4a4033]" />
          <div
            className="absolute left-2 top-2 h-2.5 w-11 border border-[#3a2c1e]"
            style={{ background: 'linear-gradient(180deg,#8a5a4a,#5e3a2e)', transform: 'rotate(-9deg)' }}
          />
          <div
            className="absolute left-4 top-6 h-2 w-8 border border-[#3a2c1e] opacity-70"
            style={{ background: '#6c6553', transform: 'rotate(-6deg)' }}
          />
          <span className="absolute bottom-2 left-1/2 h-8 w-[10px] -translate-x-1/2 border-x border-[#4a4033]" />
        </div>
      </div>

      {/* a handcar left where it stopped, in another age */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: '62%', top: `${at(62)}%` }}>
        <div className="relative h-12 w-24">
          <div
            className="absolute bottom-0 left-0 right-0 h-2.5 border border-[#33291d]"
            style={{ background: 'linear-gradient(180deg,#7a6244,#52402a)' }}
          />
          <span className="absolute bottom-2.5 left-3 h-7 w-[3px] rotate-[10deg] bg-[#5a452c]" />
          <span className="absolute bottom-2.5 right-3 h-7 w-[3px] rotate-[-10deg] bg-[#5a452c]" />
          <span className="absolute bottom-8 left-1 right-1 h-[3px] bg-[#5a452c]" />
          <span className="absolute bottom-1 left-2 h-2.5 w-2.5 rounded-full border border-[#2b231a] bg-[#463b2b]" />
          <span className="absolute bottom-1 right-2 h-2.5 w-2.5 rounded-full border border-[#2b231a] bg-[#463b2b]" />
        </div>
      </div>

      {/* the water crane that fed the engines */}
      <div className="absolute -translate-x-1/2 -translate-y-full" style={{ left: '84%', top: `${at(84)}%` }}>
        <div className="relative h-32 w-24">
          <span className="absolute bottom-0 left-2 h-24 w-[4px] bg-[#463c2d]" />
          <span className="absolute bottom-0 right-2 h-24 w-[4px] bg-[#463c2d]" />
          <div
            className="absolute bottom-20 left-0 right-0 h-12 border border-[#2f2619]"
            style={{
              background:
                'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 7px), linear-gradient(180deg,#7d6446,#4e3d29)',
              borderRadius: '22px 22px 6px 6px',
            }}
          />
          <span className="absolute bottom-14 -right-6 h-[3px] w-10 rotate-[18deg] bg-[#463c2d]" />
          <span className="absolute bottom-0 left-2 h-24 w-[1px] bg-[#2f2619]" />
        </div>
      </div>

      {/* spare sleepers stacked beside the line */}
      <div className="absolute -translate-x-1/2" style={{ left: '30%', top: `${at(30) + 2.6}%` }}>
        <div className="relative h-7 w-24">
          <span className="absolute left-0 top-0 h-1.5 w-full bg-[#453422]" />
          <span className="absolute left-1 top-2 h-1.5 w-full bg-[#4d3b27]" />
          <span className="absolute left-0 top-4 h-1.5 w-full bg-[#3f2f20]" />
        </div>
      </div>
    </div>
  );
}