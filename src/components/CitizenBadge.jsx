import { BadgeCheck } from 'lucide-react';
import { speciesInfo } from '@/lib/species';
import { cn } from '@/lib/utils';

export default function CitizenBadge({ species = 'goose', className }) {
  const info = speciesInfo(species);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-primary',
        className
      )}
    >
      <BadgeCheck className="h-3 w-3" />
      Citizen · {info.label}
    </span>
  );
}