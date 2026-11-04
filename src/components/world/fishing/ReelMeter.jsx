// The fight itself: hold to reel, ease off before the line sings.
export default function ReelMeter({ tension, progress, fish, holding }) {
  const safeLow = 18;
  const safeHigh = 82;
  const inSafe = tension >= safeLow && tension <= safeHigh;
  const danger = tension > safeHigh;

  return (
    <div className="mt-3">
      <div className="relative h-3 overflow-hidden rounded-sm border border-border bg-[#0d1a1f]">
        <div
          className="absolute inset-y-0 bg-[#8ec8e0]/20"
          style={{ left: `${safeLow}%`, width: `${safeHigh - safeLow}%` }}
        />
        <div
          className="absolute inset-y-0 w-1 bg-white/80"
          style={{ left: `${Math.min(100, Math.max(0, tension))}%` }}
        />
      </div>
      <div className="mt-1 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.14em]">
        <span className={danger ? 'text-[#FF6B4A]' : 'text-muted-foreground'}>
          {danger ? 'Line screaming — let go' : inSafe ? 'Line taut, keep reeling' : 'Line slack'}
        </span>
        <span className="text-muted-foreground">
          {Math.round(progress)}% landed · {fish?.emoji} {fish?.name}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-sm bg-secondary">
        <div
          className="h-full bg-primary transition-[width] duration-100"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
      <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
        {holding ? 'Reeling' : 'Resting'}
      </p>
    </div>
  );
}