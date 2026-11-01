import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function NamePrompt({ initial = '', onSubmit }) {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (value.trim().length < 2) {
      setError('Choose a name of at least two characters.');
      return;
    }
    onSubmit(value);
  };

  return (
    <form onSubmit={submit} className="rounded-md border border-border/80 bg-card p-6 md:p-8">
      <span className="meta-label">Choose your honk name</span>
      <p className="mt-3 text-[15px] leading-relaxed text-foreground/70">
        Every goose in the hall signs with a name. It is stored on your own device and shown next to
        your messages.
      </p>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="e.g. Sir Honksalot"
        className="mt-4 w-full rounded-sm border border-input bg-background/80 px-4 py-3 font-mono text-[13px] text-foreground placeholder:text-muted-foreground/60"
      />
      {error && (
        <p role="alert" className="mt-2 font-mono text-[11px] text-[#FF6B4A]">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="mt-4 inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground"
      >
        Enter the Honk Hall <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}