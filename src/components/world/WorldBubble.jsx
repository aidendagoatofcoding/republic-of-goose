export default function WorldBubble({ text }) {
  return (
    <span
      className="bubble-pop pointer-events-none absolute bottom-full left-1/2 z-40 mb-1 max-w-[140px] whitespace-nowrap rounded-sm border border-primary/50 bg-card/95 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-primary shadow-lg"
    >
      {text}
    </span>
  );
}