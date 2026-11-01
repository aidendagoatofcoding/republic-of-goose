import { cn } from '@/lib/utils';

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

export default function ChatMessage({ message, isMine }) {
  return (
    <div className={cn('px-4 py-3', isMine && 'bg-primary/5')}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          className={cn(
            'font-mono text-[10px] uppercase tracking-[0.16em]',
            isMine ? 'text-primary' : 'text-accent-foreground'
          )}
        >
          {message.author_name}
        </span>
        <span className="font-mono text-[9px] text-muted-foreground">
          {formatTime(message.created_date)}
        </span>
      </div>
      <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground/85">
        {message.body}
      </p>
    </div>
  );
}