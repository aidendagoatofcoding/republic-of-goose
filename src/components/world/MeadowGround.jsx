export default function MeadowGround() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-[#16241b] via-[#1d3125] to-[#101d15]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(150,220,150,0.16),transparent_62%)]" />

      <svg viewBox="0 0 100 75" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d="M-5 58C18 44 34 52 52 44S84 26 105 34" fill="none" stroke="#7c8a63" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round" />
        <path d="M-5 62C18 48 34 56 52 48S84 30 105 38" fill="none" stroke="#a9b78c" strokeOpacity="0.22" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="22" cy="34" rx="15" ry="10" fill="#2c5a63" />
        <ellipse cx="22" cy="34" rx="15" ry="10" fill="none" stroke="#a9d3d8" strokeOpacity="0.4" strokeWidth="0.6" />
        <ellipse cx="18" cy="31" rx="5" ry="2.4" fill="#cfe9ec" opacity="0.28" />
        <ellipse cx="76" cy="62" rx="11" ry="7" fill="#2c5a63" opacity="0.85" />
        <ellipse cx="76" cy="62" rx="11" ry="7" fill="none" stroke="#a9d3d8" strokeOpacity="0.3" strokeWidth="0.5" />
        <path d="M6 70h11M86 20h9M40 20h7" stroke="#4d6b46" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.6" />
        <path d="M62 16c2-4 4-4 6 0M12 50c2-4 4-4 6 0" stroke="#6d8f57" strokeWidth="1.2" fill="none" strokeOpacity="0.6" />
      </svg>

      <span className="absolute left-[8%] top-[14%] text-2xl opacity-80">🌲</span>
      <span className="absolute left-[15%] top-[24%] text-lg opacity-70">🌲</span>
      <span className="absolute right-[10%] top-[10%] text-2xl opacity-80">🌲</span>
      <span className="absolute right-[20%] top-[22%] text-base opacity-60">🌿</span>
      <span className="absolute left-[46%] top-[8%] text-base opacity-50">🌾</span>
      <span className="absolute bottom-[8%] left-[6%] text-lg opacity-60">🌾</span>
      <span className="absolute bottom-[10%] right-[8%] text-lg opacity-60">🪨</span>
    </div>
  );
}