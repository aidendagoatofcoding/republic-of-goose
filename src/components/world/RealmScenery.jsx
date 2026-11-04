const MOTES = Array.from({ length: 12 }, (_, i) => ({
  left: 8 + ((i * 23) % 84),
  top: 30 + ((i * 31) % 52),
  delay: (i % 6) * 1.3,
}));

const STARS = Array.from({ length: 26 }, (_, i) => ({
  left: 4 + ((i * 37) % 92),
  top: 3 + ((i * 19) % 34),
  size: i % 4 === 0 ? 2 : 1.4,
  delay: (i % 7) * 0.7,
}));

// The country beyond the portal: a night sky, hills on the horizon, a lit path and ground
// that actually catches the light, so a realm never reads as a black screen.
export default function RealmScenery({ realm }) {
  const accent = realm.accent || '#f2c96b';
  const bright = Boolean(realm.bright);

  const sky = bright
    ? 'linear-gradient(180deg, #ff9ed2 0%, #ffb9d6 24%, #9fe0f2 58%, #4fb9a8 100%)'
    : 'linear-gradient(180deg, #08151f 0%, #0d2634 32%, #163b44 62%, #1b4136 100%)';

  const ground = bright
    ? 'linear-gradient(180deg, #5fd0a8 0%, #2f9c86 42%, #146b60 100%)'
    : 'linear-gradient(180deg, #3c5333 0%, #2c4028 42%, #171f14 100%)';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* sky */}
      <div className="absolute inset-x-0 top-0 h-[72%]" style={{ background: sky }} />
      <div
        className="absolute inset-x-0 top-0 h-[46%]"
        style={{
          background: bright
            ? 'radial-gradient(60% 80% at 70% 100%, rgba(255,255,255,0.5), transparent 70%)'
            : 'radial-gradient(52% 70% at 72% 88%, rgba(150,220,235,0.22), transparent 72%)',
        }}
      />

      {/* stars and the moon, on a clear northern night */}
      {!bright &&
        STARS.map((star, index) => (
          <span
            key={`star-${index}`}
            className="glow-pulse absolute rounded-full bg-[#dff3ff]"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              height: `${star.size}px`,
              width: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              opacity: 0.75,
            }}
          />
        ))}
      {!bright && (
        <span
          className="absolute right-[12%] top-[9%] block rounded-full"
          style={{
            height: '54px',
            width: '54px',
            background: 'radial-gradient(circle at 36% 32%, #fbf6e2, #cfe6e8 60%, #9fc4c9)',
            boxShadow: '0 0 60px 22px rgba(210,240,245,0.28)',
          }}
        />
      )}

      {/* the hills the realm sits in */}
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-[38%] h-[22%] w-full"
      >
        <path
          d="M0 40V22c8-7 16-2 24-8s14 4 22 0 12-9 20-5 14 9 20 6 10-4 14-1v26z"
          fill={bright ? '#0e6f6a' : '#0d1c1a'}
          fillOpacity={bright ? 0.55 : 0.85}
        />
        <path
          d="M0 40V29c9-5 15 1 23-4s13 5 21 1 13-7 21-3 11 7 18 5 10-2 13 0v12z"
          fill={bright ? '#0a4f4d' : '#111e17'}
          fillOpacity="0.9"
        />
      </svg>

      {/* ground */}
      <div className="absolute inset-x-0 bottom-0 h-[62%]" style={{ background: ground }} />
      <div
        className="absolute inset-x-0 bottom-0 h-[62%] opacity-[0.16]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(77deg, #ffffff 0 1px, transparent 1px 6px), repeating-linear-gradient(-63deg, #000000 0 1px, transparent 1px 9px)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[62%]"
        style={{
          background: bright
            ? 'radial-gradient(72% 100% at 50% 0%, rgba(255,255,255,0.28), transparent 68%)'
            : 'radial-gradient(72% 100% at 50% 0%, rgba(210,235,220,0.16), transparent 70%)',
        }}
      />

      {/* the lit path from the gate to the plaza */}
      <div
        className="absolute bottom-0 left-1/2 h-[52%] w-[46%] -translate-x-1/2 opacity-80"
        style={{
          background: 'linear-gradient(180deg, rgba(232,217,176,0.14), rgba(232,217,176,0.34))',
          clipPath: 'polygon(44% 0, 56% 0, 100% 100%, 0 100%)',
        }}
      />

      {realm.scenery.map((item, index) => (
        <span
          key={`${item.emoji}-${index}`}
          className="room-bob absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size || 22}px`,
            animationDelay: `${(index % 5) * 0.5}s`,
            filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.55))',
          }}
        >
          {item.emoji}
        </span>
      ))}

      {MOTES.map((mote, index) => (
        <span
          key={`mote-${index}`}
          className="firefly absolute rounded-full"
          style={{
            left: `${mote.left}%`,
            top: `${mote.top}%`,
            height: '2px',
            width: '2px',
            background: accent,
            animationDelay: `${mote.delay}s`,
          }}
        />
      ))}

      {/* soft edges only — the old heavy vignette turned whole realms black */}
      <div
        className="absolute inset-0"
        style={{ boxShadow: 'inset 0 0 90px 24px rgba(0,0,0,0.35)' }}
      />
    </div>
  );
}