import { useState } from 'react';
import { KeyRound, Sparkles } from 'lucide-react';
import { useCitizen } from '@/hooks/useCitizen';
import { SHARDS_NEEDED, SIFT_SHARDS } from '@/lib/hidden';
import { sfx } from '@/lib/sfx';

// Nine sockets in the witch's stone. Every shard you carry has to be set into a hole of your
// choosing before the gate will take you anywhere.
export default function SiftGate({ onExit }) {
  const { citizen, signedIn, run } = useCitizen();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const keys = (citizen?.finds ?? []).filter((id) => SIFT_SHARDS.includes(id)).length;
  const holes = Array.isArray(citizen?.sift_keys) ? citizen.sift_keys : [];
  const spare = Math.max(0, keys - holes.length);
  const open = holes.length >= SHARDS_NEEDED;

  const place = async (hole) => {
    if (!signedIn || busy) return;
    setBusy(true);
    setError('');
    try {
      await run({ action: 'siftKey', hole });
      sfx.choose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const step = () => {
    sfx.door();
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

      <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-sm border border-[#ff9ad5]/40 bg-[#120a14]">
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
          className="absolute inset-[18%] rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 45%, #2a1030 0%, #0a0410 80%)',
            boxShadow: open
              ? 'inset 0 0 30px rgba(255,154,213,0.7), 0 0 26px rgba(143,242,224,0.45)'
              : 'inset 0 0 18px rgba(255,154,213,0.18)',
          }}
          aria-hidden="true"
        />
        <span className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-[#ffd6ef]">
          {open ? 'The gate is open' : `${holes.length} / ${SHARDS_NEEDED} holes set`}
        </span>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#8ff2e0]">
          Nine holes in the stone
        </p>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: SHARDS_NEEDED }, (_, index) => {
            const set = holes.includes(index);
            const canSet = set || spare > 0;
            return (
              <button
                key={`hole-${index}`}
                type="button"
                onClick={() => place(index)}
                disabled={!signedIn || busy || !canSet}
                title={set ? 'Take the key back' : 'Set a key in this hole'}
                className={`flex h-14 flex-col items-center justify-center rounded-sm border transition-colors ${
                  set
                    ? 'border-[#ff9ad5] bg-[#ff9ad5]/20 text-[#ffd6ef]'
                    : canSet
                      ? 'border-[#8ff2e0]/45 bg-[#0d0812] text-[#8ff2e0]/80 hover:border-[#8ff2e0]'
                      : 'border-[#3a2c44] bg-[#0b0710] text-[#6b5a78]'
                }`}
              >
                {set ? (
                  <KeyRound className="h-5 w-5" />
                ) : (
                  <span className="block h-4 w-4 rounded-full border border-current opacity-60" />
                )}
                <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em]">
                  {set ? 'set' : `hole ${index + 1}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        {keys} shard{keys === 1 ? '' : 's'} carried · {spare} still in hand
      </p>

      <p className="text-[13px] leading-relaxed text-muted-foreground">
        {open
          ? 'Every hole is set and the stone is awake. Step through and the Sift will catch you.'
          : 'Nine shards are lost out in the Republic. Set each one into a hole of your choosing and the gate will open.'}
      </p>

      {error && (
        <p role="alert" className="font-mono text-[10px] text-[#ff8f6a]">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={step}
        disabled={!signedIn || !open}
        className="w-full rounded-sm border border-[#ff9ad5] bg-[#ff9ad5]/15 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#ff9ad5] hover:bg-[#ff9ad5]/25 disabled:opacity-40"
      >
        {open ? 'Step into the Sift' : 'The gate is closed'}
      </button>
    </div>
  );
}