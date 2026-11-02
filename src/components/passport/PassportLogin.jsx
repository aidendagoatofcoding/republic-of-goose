import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useCitizen } from '@/hooks/useCitizen';

const INPUT =
  'mt-2 w-full rounded-sm border border-input bg-background/80 px-4 py-3 font-mono text-[13px] text-foreground placeholder:text-muted-foreground/60';

const LABEL = 'block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground';

export default function PassportLogin() {
  const { signIn, signInWithPassword } = useCitizen();
  const [mode, setMode] = useState('password');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mode === 'password') {
        await signInWithPassword(username, password);
        setPassword('');
      } else {
        await signIn(code);
        setCode('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const ready =
    mode === 'password' ? Boolean(username.trim() && password) : Boolean(code.trim());

  return (
    <form onSubmit={submit} className="rounded-md border border-border/80 bg-card p-6 md:p-8">
      <div className="flex items-center gap-3">
        <KeyRound className="h-4 w-4 text-primary" />
        <span className="meta-label">
          {mode === 'password' ? 'Citizen Sign In' : 'Passport Code'}
        </span>
      </div>

      {mode === 'password' ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="citizen-username" className={LABEL}>
              Username
            </label>
            <input
              id="citizen-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="e.g. sir_honksalot"
              autoComplete="username"
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="citizen-password" className={LABEL}>
              Password
            </label>
            <input
              id="citizen-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your citizen password"
              autoComplete="current-password"
              className={INPUT}
            />
          </div>
        </div>
      ) : (
        <>
          <label htmlFor="passport-code" className={`mt-6 ${LABEL}`}>
            Citizen passport code
          </label>
          <input
            id="passport-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="e.g. 4b1f7c2e-9a3d-4f10-8c55-1e2b3a4c5d6e"
            autoComplete="off"
            className={INPUT}
          />
        </>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={busy || !ready}
          className="rounded-sm bg-primary px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-50"
        >
          {busy ? 'Checking...' : 'Sign in as citizen'}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'password' ? 'code' : 'password');
            setError('');
          }}
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          {mode === 'password' ? 'Use my passport code' : 'Use username and password'}
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