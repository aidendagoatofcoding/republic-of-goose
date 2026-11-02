const ROWS = {
  backgroundImage:
    'repeating-linear-gradient(90deg, rgba(214,190,110,0.5) 0 3px, transparent 3px 15px)',
};

export default function WheatReserve() {
  return (
    <div className="absolute left-[12%] top-[76%] -translate-x-1/2 -translate-y-1/2">
      <div className="relative h-[120px] w-[260px] sm:h-[150px] sm:w-[340px]">
        <div className="absolute inset-0 rounded-[45%] bg-[#6b6234]/35 ring-1 ring-inset ring-[#9c8f4c]/30" />
        <div className="absolute inset-3 rounded-[40%] opacity-70" style={ROWS} />
        <svg viewBox="0 0 40 46" className="absolute -top-6 right-2 w-11 sm:w-14">
          <path d="M20 44V16" stroke="#8a7452" strokeWidth="2" strokeLinecap="round" />
          <path d="M20 18L6 6M20 18l14-12M20 26L8 16M20 26l12-10" stroke="#b9a479" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M14 6h12M6 6h6M28 6h6" stroke="#cfbb90" strokeWidth="1.2" />
          <circle cx="20" cy="16" r="1.6" fill="#cfbb90" />
        </svg>
        <span className="absolute bottom-2 left-3 text-base opacity-70">🌾</span>
        <span className="absolute bottom-4 right-6 text-sm opacity-60">🌾</span>
        <span className="absolute left-6 top-3 text-sm opacity-50">🌾</span>
      </div>
      <span className="mt-1 block text-center font-mono text-[8px] uppercase tracking-[0.28em] text-[#d6be6e]/70">
        Wheat Reserve
      </span>
    </div>
  );
}