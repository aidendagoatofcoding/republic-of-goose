import { useEffect, useRef, useState } from 'react';
import { DoorOpen, Send, UserPlus, UserCheck, UserMinus, X } from 'lucide-react';
import { useCitizen } from '@/hooks/useCitizen';

// Talking to another citizen: an ordinary chat, with no favours and no riddles.
export default function PlayerChat({ resident, onClose, onVisit, onFriendsChanged }) {
  const { signedIn, run } = useCitizen();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState({
    friend: Boolean(resident.friend),
    pending: Boolean(resident.friend_pending),
    incoming: Boolean(resident.friend_incoming),
    request: resident.friend_request || '',
  });
  const listRef = useRef(null);

  useEffect(() => {
    if (!signedIn) return undefined;
    let active = true;
    const load = async () => {
      try {
        const data = await run({ action: 'whisper', to_key: resident.key });
        if (active) setMessages(data.messages ?? []);
      } catch (err) {
        if (active) setError(err.message);
      }
    };
    load();
    const timer = setInterval(load, 5000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [resident.key, run, signedIn]);

  useEffect(() => {
    const box = listRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [messages]);

  const send = async () => {
    const body = text.trim();
    if (!body || busy) return;
    setBusy(true);
    setError('');
    try {
      await run({ action: 'whisperSend', to_key: resident.key, body });
      setText('');
      const data = await run({ action: 'whisper', to_key: resident.key });
      setMessages(data.messages ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const befriend = async () => {
    setError('');
    try {
      if (state.incoming) {
        const data = await run({ action: 'friendReply', request_id: state.request, accept: true });
        setState((current) => ({ ...current, friend: true, incoming: false, request: '' }));
        onFriendsChanged?.(data.friends);
        return;
      }
      if (state.friend) {
        const data = await run({ action: 'friendRemove', to_key: resident.key });
        setState((current) => ({ ...current, friend: false }));
        onFriendsChanged?.(data.friends);
        return;
      }
      const data = await run({ action: 'friendRequest', to_key: resident.key });
      setState((current) => ({ ...current, pending: true }));
      onFriendsChanged?.(data.friends);
    } catch (err) {
      setError(err.message);
    }
  };

  const friendLabel = state.friend
    ? 'Friends'
    : state.incoming
      ? 'Accept request'
      : state.pending
        ? 'Request sent'
        : 'Add friend';

  return (
    <div className="fixed inset-0 z-[58] flex items-end justify-center bg-black/45 px-3 pb-3 sm:items-center sm:pb-0">
      <div className="w-full max-w-md rounded-sm border border-primary/45 bg-[#0b1310]/98 shadow-[0_16px_50px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between border-b border-primary/25 px-3 py-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              {resident.name}
            </p>
            <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
              {resident.species} · {state.friend ? 'friend' : 'a citizen of the Republic'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="End the conversation"
            className="text-muted-foreground hover:text-primary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div ref={listRef} className="max-h-[42vh] min-h-[130px] space-y-1.5 overflow-y-auto px-3 py-2.5">
          {!signedIn && (
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Sign in with your passport to talk to {resident.name.split(' ')[0]}.
            </p>
          )}
          {signedIn && messages.length === 0 && (
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              No words yet. Say hello — they will see it when they next wander past.
            </p>
          )}
          {messages.map((message) => (
            <p
              key={message.id}
              className={`max-w-[86%] rounded-sm border px-2 py-1 text-[13px] leading-snug ${
                message.mine
                  ? 'ml-auto border-primary/40 bg-primary/10 text-foreground'
                  : 'border-border/70 bg-secondary/50 text-foreground/90'
              }`}
            >
              {message.body}
            </p>
          ))}
        </div>

        {error && (
          <p role="alert" className="px-3 pb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#FF6B4A]">
            {error}
          </p>
        )}

        {signedIn && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
            className="flex items-center gap-1.5 border-t border-border/60 px-2.5 py-2"
          >
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Say something..."
              maxLength={300}
              className="min-w-0 flex-1 rounded-sm border border-border/70 bg-background px-2 py-1.5 text-[13px] text-foreground outline-none focus:border-primary/70"
            />
            <button
              type="submit"
              disabled={busy || !text.trim()}
              aria-label="Send the message"
              className="rounded-sm border border-primary/50 bg-primary/15 p-1.5 text-primary disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        )}

        <div className="flex flex-wrap items-center gap-1.5 border-t border-border/60 px-2.5 py-2">
          <button
            type="button"
            onClick={befriend}
            disabled={!signedIn || state.pending}
            className="inline-flex items-center gap-1 rounded-sm border border-border/70 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/80 hover:border-primary/60 hover:text-primary disabled:opacity-45"
          >
            {state.friend ? (
              <UserMinus className="h-3 w-3" />
            ) : state.incoming ? (
              <UserCheck className="h-3 w-3" />
            ) : (
              <UserPlus className="h-3 w-3" />
            )}
            {friendLabel}
          </button>

          {resident.can_enter && (
            <button
              type="button"
              onClick={() => onVisit?.(resident)}
              className="inline-flex items-center gap-1 rounded-sm border border-[#f2c96b]/45 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#f2c96b] hover:bg-[#f2c96b]/10"
            >
              <DoorOpen className="h-3 w-3" />
              Step inside
            </button>
          )}
        </div>
      </div>
    </div>
  );
}