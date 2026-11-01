import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import Panel from '@/components/Panel';
import useNation from '@/hooks/useNation';
import { INSULT_ENTRIES } from '@/lib/honkish';
import { toRoman } from '@/lib/numerals';

const PENALTIES = [
  ['Minor Offense', 'One public apology in HONKISH.'],
  ['Moderate Offense', 'Temporary suspension of bread privileges.'],
  ['Major Offense', 'Appearance before the Goose Parliament.'],
];

export default function Laws() {
  const { laws } = useNation();
  const [query, setQuery] = useState('');

  const insults = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return INSULT_ENTRIES;
    return INSULT_ENTRIES.filter(([phrase]) => phrase.includes(term));
  }, [query]);

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <Panel>
        <span className="meta-label">Constitution</span>
        <h2 className="display-title mt-3 text-3xl md:text-4xl">Constitution and National Laws</h2>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-foreground/75">
          The following articles govern the Republic of Goose. All laws are fictional and form part
          of the country's lore.
        </p>

        <div className="mt-8 space-y-3">
          {laws.map((law, index) => (
            <article
              key={law.id || law.title}
              className="border-l-2 border-primary/60 bg-background/40 px-5 py-4"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                Article {toRoman(index + 1)}
              </span>
              <h3 className="mt-2 font-display text-xl font-bold">{law.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-foreground/70">
                {law.description}
              </p>
            </article>
          ))}
        </div>
      </Panel>

      <Panel>
        <span className="meta-label text-[#FF6B4A]">Restricted Language</span>
        <h2 className="mt-3 font-display text-2xl font-bold text-[#FF6B4A] md:text-3xl">
          Official Insult Register
        </h2>
        <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-foreground/70">
          The following expressions are considered particularly disrespectful in goose society. Do
          not use them near the Parliament.
        </p>

        <div className="relative mt-5 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search offensive phrases..."
            className="w-full rounded-sm border border-input bg-background/80 py-3 pl-10 pr-4 font-mono text-[13px] text-foreground placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="mt-5 grid gap-px border border-[#FF6B4A]/30 bg-[#FF6B4A]/20 md:grid-cols-2 xl:grid-cols-3">
          {insults.map(([phrase, code]) => (
            <div key={phrase} className="bg-card p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#FF6B4A]">
                {phrase}
              </p>
              <p className="mt-2 font-mono text-[10px] leading-relaxed break-words text-muted-foreground">
                {code}
              </p>
            </div>
          ))}
        </div>
        {insults.length === 0 && (
          <p className="mt-4 font-mono text-[12px] text-muted-foreground">No phrases found.</p>
        )}
      </Panel>

      <Panel>
        <span className="meta-label">Judiciary</span>
        <h2 className="mt-3 font-display text-2xl font-bold">National Penalties</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {PENALTIES.map(([label, text]) => (
            <div key={label} className="border-l-2 border-[#FF6B4A]/70 bg-background/40 px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#FF6B4A]">
                {label}
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-foreground/70">{text}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}