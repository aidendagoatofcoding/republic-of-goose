import { SIFT_CENTER } from '@/lib/sift';

const TOWERS = [
  { x: 8, w: 9, h: 30, tint: '#ff9ad5' },
  { x: 20, w: 6, h: 22, tint: '#8ff2e0' },
  { x: 30, w: 11, h: 36, tint: '#ffb3e0' },
  { x: 46, w: 7, h: 26, tint: '#8ff2e0' },
  { x: 58, w: 10, h: 40, tint: '#ff9ad5' },
  { x: 74, w: 6, h: 24, tint: '#a9f4ea' },
  { x: 84, w: 12, h: 33, tint: '#ffb3e0' },
];

const MOTES = Array.from({ length: 18 }, (_, i) => ({
  left: 4 + ((i * 23) % 92),
  top: 18 + ((i * 17) % 54),
  delay: (i % 9) * 0.7,
  size: i % 3 === 0 ? 4 : 2,
}));

// The Sift's own sky: pink overhead, turquoise water underfoot, glass towers between.
export default function SiftScenery() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #22031c 0%, #5b1050 16%, #a92a86 34%, #ff6fc4 52%, #7ef0e2 68%, #1e8f96 82%, #0b3d47 100%)',
        }}
      />

      {/* the sun of the Sift, low and hot */}
      <span
        className="absolute left-1/2 top-[26%] h-40 w-40 -translate-x-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,236,250,0.95) 0%, rgba(255,154,213,0.55) 42%, transparent 72%)',
          filter: 'blur(2px)',
        }}
      />

      {/* glass towers standing in the shallows */}
      {TOWERS.map((tower, index) => (
        <div
          key={`tower-${index}`}
          className="absolute bottom-[34%] rounded-t-sm border border-white/25"
          style={{
            left: `${tower.x}%`,
            width: `${tower.w}%`,
            height: `${tower.h}%`,
            background: `linear-gradient(180deg, ${tower.tint}66 0%, ${tower.tint}33 45%, rgba(20,10,30,0.55) 100%)`,
            boxShadow: `inset 0 0 22px ${tower.tint}55`,
            backdropFilter: 'blur(1px)',
          }}
        >
          <span className="absolute inset-x-1 top-2 grid gap-1.5">
            {Array.from({ length: 5 }, (_, row) => (
              <span key={`pane-${row}`} className="block h-[3px] rounded-full bg-white/35" />
            ))}
          </span>
        </div>
      ))}

      {/* the water */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40%]"
        style={{
          background:
            'linear-gradient(180deg, rgba(126,240,226,0.85) 0%, rgba(46,178,182,0.9) 34%, rgba(11,61,71,0.98) 100%)',
        }}
      >
        {[10, 26, 42, 58, 74, 88].map((left, index) => (
          <span
            key={`ripple-${left}`}
            className="absolute h-[2px] rounded-full bg-white/45"
            style={{
              left: `${left}%`,
              top: `${12 + ((index * 13) % 62)}%`,
              width: `${8 + ((index * 5) % 14)}%`,
              opacity: 0.35,
            }}
          />
        ))}
      </div>

      {/* the pale stone spawn the portals stand on */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/30"
        style={{
          left: `${SIFT_CENTER.x}%`,
          top: `${SIFT_CENTER.y}%`,
          width: '76%',
          height: '46%',
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(255,244,252,0.92) 0%, rgba(255,196,235,0.75) 42%, rgba(143,242,224,0.35) 74%, transparent 100%)',
          boxShadow: 'inset 0 0 60px rgba(255,154,213,0.5)',
        }}
      />
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-dashed border-white/35"
        style={{
          left: `${SIFT_CENTER.x}%`,
          top: `${SIFT_CENTER.y}%`,
          width: '52%',
          height: '30%',
        }}
      />

      {MOTES.map((mote, index) => (
        <span
          key={`mote-${index}`}
          className="firefly absolute rounded-full bg-white"
          style={{
            left: `${mote.left}%`,
            top: `${mote.top}%`,
            height: `${mote.size}px`,
            width: `${mote.size}px`,
            animationDelay: `${mote.delay}s`,
            boxShadow: '0 0 8px rgba(255,255,255,0.9)',
          }}
        />
      ))}
    </div>
  );
}