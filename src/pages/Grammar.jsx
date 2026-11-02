import Panel from '@/components/Panel';

const RULES = [
  ['Sentence Structure', 'HONKISH uses English sentence order: Subject → Verb → Object.'],
  ['Word Separation', 'Every word is separated with a slash (/).'],
  ['Alphabet', 'Each letter is five honks — HONKK for 0, HOOONKK for 1 — closed with K.'],
  [
    'Dictionary Words',
    'Dictionary entries use the GOOSEK prefix, a unique twelve-honk identifier, and a closing K.',
  ],
  ['Questions', 'Questions end with a question mark.'],
  ['Emotions', 'Long honks express stronger emotions. Rapid honks express urgency.'],
  [
    'Unknown Words',
    'Any word not in the dictionary is converted letter by letter using the alphabet.',
  ],
  ['Capitalization', 'HONKISH is not case-sensitive.'],
];

export default function Grammar() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Panel>
        <span className="meta-label">Official Standard</span>
        <h2 className="display-title mt-3 text-3xl md:text-4xl">HONKISH Grammar Rules</h2>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-foreground/75">
          The eight articles of the national grammar, as ratified by the Goose Parliament.
        </p>
      </Panel>

      <div className="divide-y divide-border/60 overflow-hidden rounded-md border border-border/80 bg-card">
        {RULES.map(([title, body], index) => (
          <article key={title} className="px-6 py-6 md:px-8">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-[11px] tabular-nums text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-xl font-bold">{title}</h3>
            </div>
            <p className="mt-2 pl-8 text-[16px] leading-relaxed text-foreground/70">{body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}