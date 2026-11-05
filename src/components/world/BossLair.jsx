// The lair of a realm's great beast, standing where the realm keeps it.
export default function BossLair({ boss, near, beaten, pet, onOpen }) {
  if (!boss) return null;
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ left: `${boss.at.x}%`, top: `${boss.at.y}%` }}
      title={beaten ? `${boss.name} — already beaten` : boss.name}
      className="absolute z-30 -translate-x-1/2 -translate-y-1/2 text-center"
    >
      <span
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${boss.accent}44 0%, transparent 70%)`,
          boxShadow: near ? `0 0 30px ${boss.accent}77` : 'none',
        }}
        aria-hidden="true"
      />
      <span
        className="meadow-bob block text-[46px] leading-none"
        style={{ filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.75))', opacity: beaten ? 0.55 : 1 }}
        aria-hidden="true"
      >
        {boss.glyph}
      </span>
      <span
        className="mt-1 block whitespace-nowrap rounded-sm border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em]"
        style={{
          borderColor: `${boss.accent}77`,
          background: 'rgba(8,14,10,0.88)',
          color: boss.accent,
        }}
      >
        {beaten ? `${boss.name} · beaten` : near ? (pet ? `⏎ Face ${boss.name}` : 'A pet is needed') : boss.name}
      </span>
    </button>
  );
}