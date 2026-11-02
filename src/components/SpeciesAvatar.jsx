import { Image } from '@/components/ui/image';
import { speciesInfo } from '@/lib/species';
import { cn } from '@/lib/utils';

const SIZES = {
  sm: 'h-8 w-8 text-base',
  md: 'h-12 w-12 text-2xl',
  lg: 'h-24 w-24 text-5xl',
};

const WORN_SIZES = {
  sm: 'text-[9px]',
  md: 'text-[11px]',
  lg: 'text-lg',
};

export default function SpeciesAvatar({
  species = 'goose',
  src,
  size = 'md',
  worn = [],
  className,
}) {
  const info = speciesInfo(species);
  const wornItems = (worn || []).filter(Boolean).slice(0, 3);

  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={cn(
          'flex shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border/80 bg-secondary',
          SIZES[size],
          className
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={`${info.label} portrait`}
            className="h-full w-full"
            fittingType="fill"
          />
        ) : (
          <span aria-hidden="true">{info.emoji}</span>
        )}
      </span>

      {wornItems.length > 0 && (
        <span
          aria-label={`Wearing ${wornItems.join(' ')}`}
          className={cn(
            'pointer-events-none absolute -bottom-1.5 -right-1.5 flex gap-0.5 rounded-sm border border-border/80 bg-card px-1 py-0.5 leading-none',
            WORN_SIZES[size]
          )}
        >
          {wornItems.map((emoji, index) => (
            <span key={`${emoji}-${index}`} aria-hidden="true">
              {emoji}
            </span>
          ))}
        </span>
      )}
    </span>
  );
}