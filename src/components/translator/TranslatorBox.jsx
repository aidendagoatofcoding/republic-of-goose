import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import Panel from '@/components/Panel';
import { cn } from '@/lib/utils';

export default function TranslatorBox({
  eyebrow,
  title,
  value,
  onChange,
  placeholder,
  output,
  outputLabel,
  code = false,
  copyable = false,
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Panel className="flex flex-col">
      <div className="flex items-center gap-3">
        <span className="h-px w-6 bg-primary" />
        <span className="meta-label">{eyebrow}</span>
      </div>
      <h2 className="mt-3 font-display text-2xl font-bold">{title}</h2>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={5}
        className="mt-4 w-full resize-y rounded-sm border border-input bg-background/80 px-4 py-3 font-mono text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground/60"
      />

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="meta-label">{outputLabel}</span>
        {copyable && (
          <button
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>

      <div
        className={cn(
          'mt-2 min-h-[110px] flex-1 rounded-sm border border-border/60 bg-background/60 px-4 py-3 break-words',
          code ? 'honk-code' : 'text-[16px] leading-relaxed text-foreground/85'
        )}
      >
        {output}
      </div>
    </Panel>
  );
}