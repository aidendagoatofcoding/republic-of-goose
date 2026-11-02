const MOTES = Array.from({ length: 12 }, (_, i) => ({
  left: 8 + ((i * 23) % 84),
  top: 30 + ((i * 31) % 52),
  delay: (i % 6) * 1.3,
}));

export default function RealmScenery({ realm }) {
  const accent = realm.accent || '#f2c96b';

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        className="absolute inset-x-0 top-0 h-[54%]"
        style={{ background: `linear-gradient(180deg, #080d0a 0%, ${accent}18 70%, #131b13 100%)` }}
      />
      <div
        className="absolute inset-x-0 top-[38%] h-[20%] opacity-60"
        style={{ background: 'radial-gradient(90% 100% at 24% 100%, #1b261a, transparent)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[54%]"
        style={{ background: 'linear-gradient(180deg, #2a2417 0%, #140f09 100%)' }}
      />
      <div
        className="absolute bottom-0 left-1/2 h-[48%] w-[46%] -translate-x-1/2 opacity-70"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(232,217,176,0.12))',
          clipPath: 'polygon(43% 0, 57% 0, 100% 100%, 0 100%)',
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
            filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.5))',
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

      <div
        className="absolute inset-0"
        style={{ boxShadow: 'inset 0 0 160px 60px rgba(0,0,0,0.7)' }}
      />
    </div>
  );
}