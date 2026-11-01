import Panel from '@/components/Panel';
import { ALPHABET } from '@/lib/honkish';

const ENTRIES = Object.entries(ALPHABET);

export default function Alphabet() {
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <Panel>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="meta-label">Section I</span>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">HONKISH Alphabet</h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-foreground/75">
              Every letter is represented by a five-bit binary code. The code is closed with an
              additional K marker.
            </p>
          </div>
          <div className="font-mono text-[11px] leading-relaxed text-muted-foreground">
            <div>
              <span className="text-primary">HONKK</span> = 0
            </div>
            <div>
              <span className="text-primary">HOOONKK</span> = 1
            </div>
            <div>
              <span className="text-primary">K</span> = end marker
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-px border border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ENTRIES.map(([letter, code]) => (
          <div key={letter} className="bg-card p-4">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold text-primary">{letter}</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                {letter.charCodeAt(0) - 64}
              </span>
            </div>
            <p className="mt-3 font-mono text-[10.5px] leading-relaxed break-words text-foreground/70">
              {code}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}