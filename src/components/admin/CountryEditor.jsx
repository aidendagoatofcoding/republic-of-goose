import { useState } from 'react';
import { Landmark } from 'lucide-react';
import { aboutToText } from '@/lib/nationDefaults';

// The Master Goose rewrites the About the Country page from here. One paragraph, fact or
// border per line; facts and regions take their value after a pipe.
export default function CountryEditor({ about, run }) {
  const [text, setText] = useState(() => aboutToText(about));
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const field = (key, label, hint, rows = 4) => (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <textarea
        value={text[key]}
        onChange={(event) => setText((current) => ({ ...current, [key]: event.target.value }))}
        rows={rows}
        className="mt-1.5 w-full rounded-sm border border-input bg-background/80 px-3 py-2 font-mono text-[12px] leading-relaxed text-foreground"
      />
      <span className="mt-1 block font-mono text-[9px] text-muted-foreground/70">{hint}</span>
    </label>
  );

  const save = async () => {
    setBusy(true);
    setStatus('');
    try {
      await run('saveAbout', text);
      setStatus('The About the Country page is published.');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-md border border-[#D4AF37]/40 bg-card p-6 md:p-8">
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#D4AF37]">
        Directive 07 · About the Country
      </span>
      <p className="mt-2 text-[14px] leading-relaxed text-foreground/70">
        Everything written here appears on the About the Country page for every visitor.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {field('about_intro', 'Opening paragraphs', 'One paragraph per line.', 5)}
        {field('about_facts', 'National facts', 'Label | Value, one per line.', 5)}
        {field('about_borders', 'Borders', 'One border per line.', 3)}
        {field('about_regions', 'Major regions', 'Name | Note, one per line.', 3)}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-sm bg-[#D4AF37] px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#0A0F0D] disabled:opacity-50"
        >
          <Landmark className="h-3 w-3" />
          {busy ? 'Publishing...' : 'Publish About Page'}
        </button>
        {status && <span className="font-mono text-[11px] text-muted-foreground">{status}</span>}
      </div>
    </section>
  );
}