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