import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import Panel from '@/components/Panel';
import { useCitizen } from '@/hooks/useCitizen';

export default function Games() {
  const { citizen, signedIn, run } = useCitizen();
  const pendingRef = useRef(0);
  const [pending, setPending] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(async () => {
      const batch = Math.min(pendingRef.current, 40);
      if (batch < 1) return;
      pendingRef.current -= batch;
      setPending(pendingRef.current);
      try {
        const data = await run({ action: 'bake', clicks: batch });
        setMessage(`+${data.earned} bread out of the oven`);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    }, 1500);
    return () => clearInterval(timer);
  }, [run]);

  const bake = () => {
    pendingRef.current += 1;
    setPending(pendingRef.current);
  };

  if (!signedIn) {
    return (
      <Panel>
        <div className="flex items-center gap-3">
          <Gamepad2 className="h-4 w-4 text-primary" />
          <span className="meta-label">Citizens Only</span>
        </div>
        <h2 className="display-title mt-4 text-3xl">The Bread Bakery</h2>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-foreground/75">
          Goose jobs pay in bread, and only registered citizens may work the ovens. Sign in with your
          passport, or apply for citizenship first.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/passport"
            className="rounded-sm bg-primary px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground"
          >
            Sign in
          </Link>
          <Link
            to="/citizenship"
            className="rounded-sm border border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            Apply for citizenship
          </Link>
        </div>
      </Panel>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Panel>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <span className="meta-label">Goose Jobs · Bakery Division</span>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">The Bread Bakery</h2>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Bread in hand
            </p>
            <p className="font-mono text-xl font-bold text-primary">
              🍞 {(citizen.bread ?? 0) + pending}
            </p>
          </div>
        </div>

        <p className="mt-4 text-[16px] leading-relaxed text-foreground/75">
          Every press of the honk lever bakes one loaf. Loaves are counted at the door every second
          and a half, so keep clicking.
        </p>

        <button
          onClick={bake}
          className="mt-8 flex w-full flex-col items-center justify-center gap-3 rounded-md border border-primary/40 bg-primary/10 px-6 py-12 transition-transform active:scale-[0.99]"
        >
          <span className="text-5xl" aria-hidden="true">
            🪿
          </span>
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
            Honk the lever
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            +1 bread per honk
          </span>
        </button>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {pending > 0 ? `${pending} loaves in the oven` : 'Oven idle'}
          </span>
          {error ? (
            <span role="alert" className="font-mono text-[10px] text-[#FF6B4A]">
              {error}
            </span>
          ) : (
            <span className="font-mono text-[10px] text-muted-foreground">{message}</span>
          )}
        </div>
      </Panel>

      <Panel>
        <span className="meta-label">Other Ways To Earn</span>
        <ul className="mt-4 space-y-3">
          {[
            ['Honk in the chat', '5 bread per message, once every 12 seconds.'],
            ['Trade the market', 'Buy low, sell high on seven goose listings.'],
            ['Win the war on ducks', 'Payment pending parliamentary approval.'],
          ].map(([title, note]) => (
            <li key={title} className="flex gap-3">
              <span className="font-mono text-[12px] text-primary">/</span>
              <span>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
                  {title}
                </span>
                <span className="mt-1 block text-[14.5px] leading-relaxed text-foreground/65">
                  {note}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}