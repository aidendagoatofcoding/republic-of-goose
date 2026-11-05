import { useState } from 'react';
import { Check, DoorOpen, UserMinus, Users, X } from 'lucide-react';
import { useCitizen } from '@/hooks/useCitizen';

// The friends of a citizen: who has asked, who has been asked, and whose door is open.
export default function FriendsPanel({ friends, residents, onClose, onVisit }) {
  const { run } = useCitizen();
  const [list, setList] = useState(friends ?? { friends: [], incoming: [], outgoing: [] });
  const [error, setError] = useState('');

  const act = async (payload, message) => {
    setError('');
    try {
      const data = await run(payload);
      setList(data.friends ?? list);
      if (message) setError(message);
    } catch (err) {
      setError(err.message);
    }
  };

  const byKey = new Map(residents.map((resident) => [resident.key, resident]));

  return (
    <div className="absolute right-0 top-0 z-[50] flex h-full w-[300px] max-w-[86vw] flex-col border-l border-border/80 bg-background/98 shadow-[-16px_0_40px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between border-b border-border/70 px-3 py-2">
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
          <Users className="h-3.5 w-3.5" />
          Friends
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close friends"
          className="rounded-sm border border-border/70 p-1 text-muted-foreground hover:text-primary"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-3">
        <section>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            Your friends ({list.friends.length})
          </p>
          <ul className="mt-1.5 space-y-1">
            {list.friends.map((friend) => {
              const resident = byKey.get(friend.key);
              return (
                <li
                  key={friend.key}
                  className="flex items-center justify-between gap-2 rounded-sm border border-border/60 px-2 py-1.5"
                >
                  <span className="min-w-0 truncate text-[13px] text-foreground">{friend.name}</span>
                  <span className="flex shrink-0 items-center gap-1">
                    {resident?.can_enter && (
                      <button
                        type="button"
                        onClick={() => onVisit(resident)}
                        className="inline-flex items-center gap-1 rounded-sm border border-[#f2c96b]/40 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-[#f2c96b]"
                      >
                        <DoorOpen className="h-2.5 w-2.5" />
                        Visit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => act({ action: 'friendRemove', to_key: friend.key })}
                      aria-label={`Remove ${friend.name}`}
                      className="rounded-sm border border-border/60 p-0.5 text-muted-foreground hover:text-[#FF6B4A]"
                    >
                      <UserMinus className="h-2.5 w-2.5" />
                    </button>
                  </span>
                </li>
              );
            })}
            {list.friends.length === 0 && (
              <li className="text-[12px] leading-snug text-muted-foreground">
                Nobody yet. Walk up to a goose and ask to be friends.
              </li>
            )}
          </ul>
        </section>

        <section>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            Asked to be friends ({list.incoming.length})
          </p>
          <ul className="mt-1.5 space-y-1">
            {list.incoming.map((request) => (
              <li
                key={request.id}
                className="flex items-center justify-between gap-2 rounded-sm border border-[#D4AF37]/40 px-2 py-1.5"
              >
                <span className="min-w-0 truncate text-[13px] text-foreground">{request.name}</span>
                <span className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => act({ action: 'friendReply', request_id: request.id, accept: true })}
                    aria-label={`Accept ${request.name}`}
                    className="rounded-sm border border-primary/50 p-0.5 text-primary"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => act({ action: 'friendReply', request_id: request.id, accept: false })}
                    aria-label={`Decline ${request.name}`}
                    className="rounded-sm border border-border/60 p-0.5 text-muted-foreground hover:text-[#FF6B4A]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </li>
            ))}
            {list.incoming.length === 0 && (
              <li className="text-[12px] leading-snug text-muted-foreground">No requests waiting.</li>
            )}
          </ul>
        </section>

        {list.outgoing.length > 0 && (
          <section>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              Waiting on an answer
            </p>
            <ul className="mt-1.5 space-y-1">
              {list.outgoing.map((request) => (
                <li
                  key={request.id}
                  className="truncate rounded-sm border border-border/60 px-2 py-1.5 text-[12px] text-muted-foreground"
                >
                  {request.name}
                </li>
              ))}
            </ul>
          </section>
        )}

        {error && (
          <p role="alert" className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#FF6B4A]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}