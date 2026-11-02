import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import Panel from '@/components/Panel';

const MAX_SUBJECT = 140;
const MAX_BODY = 4000;

export default function NewsletterComposer({ run }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const data = await run('newsletterAudience');
        if (live) setAudience(data);
      } catch (err) {
        if (live) setAudience({ total: 0, withEmail: 0 });
      }
    })();
    return () => {
      live = false;
    };
  }, [run]);

  const send = async () => {
    setBusy(true);
    setError('');
    setResult('');
    try {
      const data = await run('sendNewsletter', { subject, message });
      setResult(
        `Sent to ${data.sent} citizen${data.sent === 1 ? '' : 's'}${
          data.failed ? `, ${data.failed} could not be reached` : ''
        }.`
      );
      setSubject('');
      setMessage('');
      setConfirming(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const ready = subject.trim().length > 2 && message.trim().length > 5;

  return (
    <Panel>
      <div className="flex items-center gap-3">
        <Mail className="h-4 w-4 text-[#D4AF37]" />
        <span className="meta-label">National Post</span>
      </div>
      <h2 className="display-title mt-3 text-2xl">Send a newsletter</h2>
      <p className="mt-2 text-[14.5px] leading-relaxed text-foreground/70">
        Posted to every citizen who left an address with the passport office.
        {audience && (
          <>
            {' '}
            <span className="font-mono text-[11px] text-[#D4AF37]">
              {audience.withEmail} of {audience.total} citizens are reachable.
            </span>
          </>
        )}
      </p>

      <div className="mt-4 space-y-3">
        <div>
          <label
            htmlFor="newsletter-subject"
            className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
          >
            Subject
          </label>
          <input
            id="newsletter-subject"
            value={subject}
            maxLength={MAX_SUBJECT}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Bread rations doubled this winter"
            className="mt-1.5 w-full rounded-sm border border-input bg-background/80 px-3 py-2.5 font-mono text-[12px] text-foreground placeholder:text-muted-foreground/60"
          />
        </div>

        <div>
          <label
            htmlFor="newsletter-body"
            className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
          >
            Message
          </label>
          <textarea
            id="newsletter-body"
            value={message}
            maxLength={MAX_BODY}
            rows={7}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Citizens, by order of the Assembly..."
            className="mt-1.5 w-full resize-y rounded-sm border border-input bg-background/80 px-3 py-2.5 text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground/60"
          />
          <p className="mt-1 text-right font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            {message.length}/{MAX_BODY}
          </p>
        </div>

        {error && (
          <p role="alert" className="font-mono text-[11px] text-[#FF6B4A]">
            {error}
          </p>
        )}
        {result && <p className="font-mono text-[11px] text-primary">{result}</p>}

        {confirming ? (
          <div className="flex flex-wrap items-center gap-2 rounded-sm border border-[#D4AF37]/50 bg-[#D4AF37]/5 p-3">
            <p className="flex-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#D4AF37]">
              Send this to {audience?.withEmail ?? 0} citizens?
            </p>
            <button
              type="button"
              onClick={send}
              disabled={busy}
              className="rounded-sm bg-[#D4AF37] px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#0A0F0D] disabled:opacity-50"
            >
              {busy ? 'Sending...' : 'Confirm send'}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={busy}
              className="rounded-sm border border-border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={!ready || busy}
            className="rounded-sm bg-[#D4AF37] px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#0A0F0D] disabled:opacity-40"
          >
            Review newsletter
          </button>
        )}
      </div>
    </Panel>
  );
}