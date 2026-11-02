export default function StoneQuarry() {
  return (
    <div className="absolute left-[17%] top-[32%] -translate-x-1/2 -translate-y-1/2">
      <svg viewBox="0 0 180 120" className="w-[190px] sm:w-[250px]">
        <ellipse cx="90" cy="62" rx="86" ry="52" fill="#2c2f28" fillOpacity="0.55" />
        <ellipse cx="90" cy="62" rx="86" ry="52" fill="none" stroke="#7c7a6c" strokeOpacity="0.25" strokeWidth="1.6" />
        <path d="M40 62l18-22 22 12-8 20z" fill="#6a6a5e" fillOpacity="0.85" />
        <path d="M84 46l20-14 22 16-6 18-26 2z" fill="#575749" fillOpacity="0.9" />
        <path d="M56 82l16-10 18 8-4 14-22 2z" fill="#7b7a6b" fillOpacity="0.8" />
        <path d="M108 78l14-8 12 10-4 12-16 1z" fill="#4d4d42" fillOpacity="0.85" />
      </svg>
      <span className="mt-0.5 block text-center font-mono text-[8px] uppercase tracking-[0.28em] text-[#a9a795]/70">
        Stone Quarry
      </span>
    </div>
  );
}