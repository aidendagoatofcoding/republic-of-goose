import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import SpeciesAvatar from '@/components/SpeciesAvatar';

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

export default function ChatMessage({ message, isMine }) {
  return (
    <div className={cn('flex gap-3 px-4 py-3', isMine && 'bg-primary/5')}>
      <SpeciesAvatar
        species={message.author_species || 'goose'}
        src={message.author_avatar}
        size="sm"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span
            className={cn(
              'font-mono text-[10px] uppercase tracking-[0.16em]',
              isMine ? 'text-primary' : 'text-accent-foreground'
            )}
          >
            {message.author_name}
          </span>
          {message.author_citizen ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-primary">
              <BadgeCheck className="h-2.5 w-2.5" /> Citizen
            </span>
          ) : null}
          <span className="font-mono text-[9px] text-muted-foreground">
            {formatTime(message.created_date)}
          </span>
        </div>
        <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground/85">
          {message.body}
        </p>
      </div>
    </div>
  );
}