import { useMemo, useState } from 'react';
import Panel from '@/components/Panel';
import TranslatorBox from '@/components/translator/TranslatorBox';
import { translateEnglish, translateHonkish } from '@/lib/honkish';

export default function Translator() {
  const [english, setEnglish] = useState('Hello my child, welcome to the Republic of Goose.');
  const [honkish, setHonkish] = useState('');

  const honkOutput = useMemo(() => translateEnglish(english), [english]);
  const englishOutput = useMemo(() => translateHonkish(honkish), [honkish]);

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <TranslatorBox
          eyebrow="English → Honkish"
          title="Translate into HONKISH"
          value={english}
          onChange={setEnglish}
          placeholder="Type in English..."
          output={honkOutput || 'HONK...'}
          outputLabel="HONKISH translation"
          code
          copyable={Boolean(honkOutput)}
        />
        <TranslatorBox
          eyebrow="Honkish → English"
          title="Translate into English"
          value={honkish}
          onChange={setHonkish}
          placeholder="Paste HONKISH here..."
          output={englishOutput || 'Waiting for honks...'}
          outputLabel="English translation"
          copyable={Boolean(englishOutput)}
        />
      </div>

      <Panel>
        <span className="meta-label">Code System</span>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
              Alphabet codes
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground/70">
              Five honks — HONKK for 0 and HOOONKK for 1 — closed with K. Used for any word that is
              not in the national dictionary.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
              Dictionary codes
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground/70">
              GOOSEK + a twelve-honk identifier + closing K. These are separate formats, so
              dictionary words can never be mistaken for alphabet letters.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}