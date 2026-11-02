import SpeciesAvatar from '@/components/SpeciesAvatar';
import WorldBubble from '@/components/world/WorldBubble';

export default function Walker({
  label,
  species,
  avatar,
  worn,
  x,
  y,
  face = 1,
  isMe = false,
  bubble,
  speed = '2.4s',
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
        transition: `left ${speed} linear, top ${speed} linear`,
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
          <SpeciesAvatar
            species={species}
            src={avatar}
            worn={worn}
            size="md"
            className={isMe ? 'ring-1 ring-primary' : 'ring-1 ring-primary/40'}
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