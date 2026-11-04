import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import ChatRoom from '@/components/chat/ChatRoom';
import { useCitizen } from '@/hooks/useCitizen';

// The Honk Hall, folded into the edge of the Commons.
export default function CommonsChat({ name }) {
  const { citizen } = useCitizen();
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute right-0 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-1 rounded-l-sm border border-r-0 border-primary/50 bg-card/90 px-1.5 py-3 font-mono text-[8px] uppercase tracking-[0.16em] text-primary hover:bg-primary/10"
        aria-label="Open the Honk Hall chat"
      >
        <MessageSquare className="h-3.5 w-3.5" />
        <span className="[writing-mode:vertical-rl]">Honk Hall</span>
      </button>
    );
  }

  return (
    <aside className="absolute right-0 top-0 z-40 flex h-full w-[320px] max-w-[86vw] flex-col border-l border-border/80 bg-background/97 shadow-[-16px_0_40px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between border-b border-border/70 px-3 py-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
          The Honk Hall
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-sm border border-border/70 p-1 text-muted-foreground hover:text-primary"
          aria-label="Fold the chat away"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ChatRoom name={name} citizen={citizen} />
      </div>
    </aside>
  );
}