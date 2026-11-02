export default function AreaZone({ area, active }) {
  return (
    <div
      className="pointer-events-none absolute z-0 -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${area.x}%`,
        top: `${area.y}%`,
        width: `${area.rx * 2}%`,
        height: `${area.ry * 2}%`,
      }}
      aria-hidden="true"
    >
      <div
        className={`absolute inset-0 rounded-[45%] border border-dashed transition-colors ${
          active ? 'border-primary/45 bg-primary/[0.07]' : 'border-[#c7b48a]/20 bg-[#c7b48a]/[0.03]'
        }`}
      />
      <span
        className={`absolute left-2 top-1.5 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.3em] transition-colors ${
          active ? 'text-primary' : 'text-[#c7b48a]/50'
        }`}
      >
        {area.name}
      </span>
    </div>
  );
}