import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Radio } from 'lucide-react';
import { useCitizen } from '@/hooks/useCitizen';
import CitizenBadge from '@/components/CitizenBadge';
import ChatMessage from './ChatMessage';
import ChatComposer from './ChatComposer';

export default function ChatRoom({ name, citizen, onChangeName }) {
  const { run } = useCitizen();
  const [messages, setMessages] = useState(null);
  const [earned, setEarned] = useState(0);
  const [error, setError] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const page = await base44.entities.ChatMessage.filter(
          {},
          { sort: '-created_date', limit: 100 }
        );
        if (active) setMessages([...(page.items ?? [])].reverse());
      } catch (err) {
        if (active) {
          setError('The Honk Hall could not be reached. Reload the page to try again.');
          setMessages([]);
        }
      }
    };

    load();

    const unsubscribe = base44.entities.ChatMessage.subscribe((event) => {
      const id = event?.data?.id ?? event?.id;
      setMessages((current) => {
        if (!current) return current;
        if (event.type === 'create' && event.data?.id) {
          if (current.some((message) => message.id === event.data.id)) return current;
          return [...current, event.data];
        }
        if (event.type === 'delete' && id) {
          return current.filter((message) => message.id !== id);
        }
        return current;
      });
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const element = listRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages?.length]);

  const send = async (body) => {
    const record = await base44.entities.ChatMessage.create({
      author_name: name,
      body,
      author_species: citizen?.species || '',
      author_avatar: citizen?.avatar_url || '',
      author_citizen: Boolean(citizen),
    });
    setMessages((current) => {
      if (!current) return [record];
      if (current.some((message) => message.id === record.id)) return current;
      return [...current, record];
    });

    if (citizen) {
      try {
        const data = await run({ action: 'chatReward' });
        setEarned(data.earned || 0);
      } catch (err) {
        setEarned(0);
      }
    }
  };

  return (
    <section className="overflow-hidden rounded-md border border-border/80 bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Radio className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
            Chatting as {name}
          </span>
          {citizen ? <CitizenBadge species={citizen.species} /> : null}
          {earned > 0 ? (
            <span className="font-mono text-[10px] text-primary">+{earned} 🍞</span>
          ) : null}
        </div>
        {onChangeName ? (
          <button
            onClick={onChangeName}
            className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Change name
          </button>
        ) : null}
      </div>

      {error && (
        <p role="alert" className="border-b border-border/70 px-4 py-2 font-mono text-[11px] text-[#FF6B4A]">
          {error}
        </p>
      )}

      <div ref={listRef} className="h-[52vh] min-h-[280px] divide-y divide-border/50 overflow-y-auto">
        {messages === null && (
          <p className="p-4 font-mono text-[11px] text-muted-foreground">Opening the hall...</p>
        )}

        {messages?.length === 0 && (
          <p className="p-4 font-mono text-[11px] text-muted-foreground">
            No honks yet. Be the first to speak.
          </p>
        )}

        {messages?.map((message) => (
          <ChatMessage key={message.id} message={message} isMine={message.author_name === name} />
        ))}
      </div>

      <ChatComposer onSend={send} />
    </section>
  );
}