// The pine stand on the eastern hill. The trees stand as tall as the cottages out on the meadow.
const TREES = [
  { left: '4%', top: '34%', size: 108, opacity: 'opacity-80' },
  { left: '26%', top: '14%', size: 94, opacity: 'opacity-70' },
  { left: '52%', top: '44%', size: 124, opacity: 'opacity-85' },
  { left: '72%', top: '10%', size: 88, opacity: 'opacity-65' },
  { left: '16%', top: '66%', size: 90, opacity: 'opacity-60' },
  { left: '60%', top: '76%', size: 80, opacity: 'opacity-55' },
  { left: '86%', top: '40%', size: 110, opacity: 'opacity-75' },
  { left: '38%', top: '84%', size: 76, opacity: 'opacity-50' },
  { left: '84%', top: '74%', size: 86, opacity: 'opacity-60' },
];

export default function PineGrove() {
  return (
    <div className="absolute left-[93%] top-[13%] h-[420px] w-[560px] -translate-x-1/2 -translate-y-1/2">
      <div className="absolute inset-0 rounded-[50%] bg-[#1b3324]/50 ring-1 ring-inset ring-[#2f5238]/40" />
      {TREES.map((tree) => (
        <span
          key={`${tree.left}-${tree.top}`}
          className={`absolute ${tree.opacity}`}
          style={{ left: tree.left, top: tree.top, fontSize: `${tree.size}px` }}
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