import { Sparkles } from 'lucide-react';
import { useCitizen } from '@/hooks/useCitizen';
import { SHARDS_NEEDED, SIFT_SHARDS } from '@/lib/hidden';

// The gate the witch keeps behind the kettle. It opens for nine shards and nothing else.
export default function SiftGate({ onExit }) {
  const { citizen, signedIn } = useCitizen();
  const found = (citizen?.finds ?? []).filter((id) => SIFT_SHARDS.includes(id));
  const ready = found.length >= SHARDS_NEEDED;

  const step = () => {
    window.dispatchEvent(new CustomEvent('goose:realm', { detail: 'sift' }));
    onExit?.();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[#ff9ad5]" />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#ff9ad5]">
          The Sift gate
        </p>
      </div>

      <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-sm border border-[#ff9ad5]/40 bg-[#120a14]">
        <span
          className="absolute inset-0 opacity-70"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0%, #ff9ad5 18%, transparent 44%, #8ff2e0 70%, transparent 96%)',
            filter: 'blur(3px)',
            animation: 'portal-spin 6s linear infinite',
          }}
          aria-hidden="true"
        />
        <span
          className="absolute inset-[14%] rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 45%, #2a1030 0%, #0a0410 80%)',
            boxShadow: ready
              ? 'inset 0 0 30px rgba(255,154,213,0.6), 0 0 24px rgba(143,242,224,0.4)'
              : 'inset 0 0 18px rgba(255,154,213,0.18)',
          }}
          aria-hidden="true"
        />
        <span className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff9ad5]">
          {found.length} / {SHARDS_NEEDED} shards
        </span>
      </div>

      <p className="text-[13px] leading-relaxed text-muted-foreground">
        {ready
          ? 'The stone is awake. Step through and the Sift will catch you.'
          : 'Nine shards lie out in the open across the Republic, unlocked and unguarded. The gate stays cold until you carry all of them.'}
      </p>

      <button
        type="button"
        onClick={step}
        disabled={!signedIn || !ready}
        className="w-full rounded-sm border border-[#ff9ad5] bg-[#ff9ad5]/15 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#ff9ad5] hover:bg-[#ff9ad5]/25 disabled:opacity-40"
      >
        {ready ? 'Step into the Sift' : 'The gate is closed'}
      </button>
    </div>
  );
}