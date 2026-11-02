import { Image } from '@/components/ui/image';
import { speciesInfo } from '@/lib/species';
import { cn } from '@/lib/utils';

const SIZES = {
  sm: 'h-8 w-8 text-base',
  md: 'h-12 w-12 text-2xl',
  lg: 'h-24 w-24 text-5xl',
};

export default function SpeciesAvatar({ species = 'goose', src, size = 'md', className }) {
  const info = speciesInfo(species);

  return (
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
  );
}