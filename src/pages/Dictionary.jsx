import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import Panel from '@/components/Panel';
import { DICTIONARY_ENTRIES } from '@/lib/honkish';

export default function Dictionary() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return DICTIONARY_ENTRIES;
    return DICTIONARY_ENTRIES.filter(
      ([word, code]) => word.includes(term) || code.toLowerCase().includes(term)
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <Panel>
        <span className="meta-label">National Vocabulary</span>
        <h2 className="display-title mt-3 text-3xl md:text-4xl">Official HONKISH Dictionary</h2>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-foreground/75">
          Every registered word and phrase of the Republic of Goose, with its official GOOSEK code.
        </p>

        <div className="relative mt-6 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search English or HONKISH..."
            className="w-full rounded-sm border border-input bg-background/80 py-3 pl-10 pr-4 font-mono text-[13px] text-foreground placeholder:text-muted-foreground/60"
          />
        </div>

        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {results.length} of {DICTIONARY_ENTRIES.length} entries
        </p>
      </Panel>

      {results.length === 0 ? (
        <Panel>
          <p className="font-mono text-[13px] text-muted-foreground">No words found. HONK.</p>
        </Panel>
      ) : (
        <div className="grid gap-px border border-border/70 bg-border/70 md:grid-cols-2 xl:grid-cols-3">
          {results.map(([word, code]) => (
            <div key={word} className="bg-card p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
                {word}
              </p>
              <p className="mt-2 font-mono text-[10px] leading-relaxed break-words text-muted-foreground">
                {code}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}