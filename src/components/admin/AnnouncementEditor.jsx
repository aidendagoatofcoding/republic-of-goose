import { useState } from 'react';
import { Save } from 'lucide-react';

export default function AnnouncementEditor({ value, run }) {
  const [text, setText] = useState((value || []).join('\n'));
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    setStatus('');
    try {
      await run('saveAnnouncement', { announcement: text });
      setStatus('Announcement published to every visitor.');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-md border border-[#D4AF37]/40 bg-card p-6 md:p-8">
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#D4AF37]">
        Directive 01 · National Announcement
      </span>
      <p className="mt-3 font-mono text-[11px] text-muted-foreground">
        One paragraph per line. Shown on the national homepage.
      </p>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={5}
        className="mt-4 w-full resize-y rounded-sm border border-input bg-background/80 px-4 py-3 font-mono text-[13px] leading-relaxed text-foreground"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          onClick={save}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-sm bg-[#D4AF37] px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#0A0F0D] disabled:opacity-50"
        >
          <Save className="h-3 w-3" />
          {busy ? 'Transmitting...' : 'Publish Announcement'}
        </button>
        {status && <span className="font-mono text-[11px] text-muted-foreground">{status}</span>}
      </div>
    </section>
  );
}