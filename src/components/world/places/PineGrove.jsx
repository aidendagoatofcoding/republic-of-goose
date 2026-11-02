const TREES = [
  { left: '4%', top: '44%', size: 'text-2xl', opacity: 'opacity-80' },
  { left: '26%', top: '18%', size: 'text-xl', opacity: 'opacity-70' },
  { left: '52%', top: '52%', size: 'text-3xl', opacity: 'opacity-85' },
  { left: '72%', top: '14%', size: 'text-lg', opacity: 'opacity-65' },
  { left: '16%', top: '72%', size: 'text-lg', opacity: 'opacity-60' },
  { left: '60%', top: '82%', size: 'text-base', opacity: 'opacity-55' },
  { left: '86%', top: '46%', size: 'text-2xl', opacity: 'opacity-75' },
  { left: '38%', top: '88%', size: 'text-sm', opacity: 'opacity-50' },
];

export default function PineGrove() {
  return (
    <div className="absolute left-[93%] top-[13%] h-[150px] w-[220px] -translate-x-1/2 -translate-y-1/2 sm:h-[190px] sm:w-[280px]">
      <div className="absolute inset-0 rounded-[50%] bg-[#1b3324]/50 ring-1 ring-inset ring-[#2f5238]/40" />
      {TREES.map((tree) => (
        <span
          key={`${tree.left}-${tree.top}`}
          className={`absolute ${tree.size} ${tree.opacity}`}
          style={{ left: tree.left, top: tree.top }}
        >
          🌲
        </span>
      ))}
      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.28em] text-[#7fa98a]/70">
        Pine Grove
      </span>
    </div>
  );
}