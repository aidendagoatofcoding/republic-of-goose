import AnimalSprite from '@/components/world/AnimalSprite';
import WorldBubble from '@/components/world/WorldBubble';

export default function Walker({
  label,
  species,
  worn,
  x,
  y,
  face = 1,
  isMe = false,
  hasQuest = false,
  bubble,
  speed = '2.4s',
  lift = 0,
  onPoke,
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onPoke?.();
      }}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        marginTop: lift ? -lift : undefined,
        transition: `left ${speed} linear, top ${speed} linear, margin-top 200ms ease-out`,
      }}
      className="absolute z-30 flex -translate-x-1/2 -translate-y-full flex-col items-center focus:outline-none"
    >
      {bubble && <WorldBubble text={bubble} />}
      {hasQuest && !bubble && (
        <span
          className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full"
          title="Has a favour to ask"
        >
          <span className="meadow-bob block rounded-full border border-[#D4AF37] bg-[#0A0F0D]/95 px-1.5 py-0.5 font-display text-[13px] font-bold leading-none text-[#D4AF37] shadow-[0_2px_8px_rgba(0,0,0,0.75)]">
            !
          </span>
        </span>
      )}
      <span
        className="block"
        style={{ transform: face === -1 ? 'scaleX(-1)' : undefined }}
        aria-hidden="true"
      >
        <span className="meadow-bob block">
          <AnimalSprite
            species={species}
            worn={worn}
            className={
              isMe
                ? 'drop-shadow-[0_6px_8px_rgba(0,0,0,0.5)]'
                : 'drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)] opacity-95'
            }
          />
        </span>
      </span>
      <span
        className={`mt-0.5 max-w-[96px] truncate rounded-sm px-1 font-mono text-[8px] uppercase tracking-[0.12em] ${
          isMe ? 'bg-primary/15 text-primary' : 'text-foreground/80'
        }`}
      >
        {label}
      </span>
    </button>
  );
}