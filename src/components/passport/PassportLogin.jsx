import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useCitizen } from '@/hooks/useCitizen';

export default function PassportLogin() {
  const { signIn } = useCitizen();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await signIn(code);
      setCode('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-md border border-border/80 bg-card p-6 md:p-8">
      <div className="flex items-center gap-3">
        <KeyRound className="h-4 w-4 text-primary" />
        <span className="meta-label">Passport Code</span>
      </div>

      <label
        htmlFor="passport-code"
        className="mt-6 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
      >
        Citizen passport code
      </label>
      <input
        id="passport-code"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="e.g. 4b1f7c2e-9a3d-4f10-8c55-1e2b3a4c5d6e"
        autoComplete="off"
        className="mt-2 w-full rounded-sm border border-input bg-background/80 px-4 py-3 font-mono text-[13px] text-foreground placeholder:text-muted-foreground/60"
      />

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={busy || !code.trim()}
          className="rounded-sm bg-primary px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-50"
        >
          {busy ? 'Checking...' : 'Sign in as citizen'}
        </button>
        {error && (
          <p role="alert" className="font-mono text-[11px] text-[#FF6B4A]">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}