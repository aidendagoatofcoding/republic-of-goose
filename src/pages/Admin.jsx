import { useState } from 'react';
import { Lock, LogOut } from 'lucide-react';
import Panel from '@/components/Panel';
import { base44 } from '@/api/base44Client';
import useNation from '@/hooks/useNation';
import AnnouncementEditor from '@/components/admin/AnnouncementEditor';
import LawManager from '@/components/admin/LawManager';
import ThemePicker from '@/components/admin/ThemePicker';
import CitizenRegistry from '@/components/admin/CitizenRegistry';
import NewsletterComposer from '@/components/admin/NewsletterComposer';
import NewsComposer from '@/components/admin/NewsComposer';

export default function Admin() {
  const nation = useNation();
  const [passphrase, setPassphrase] = useState('');
  const [draft, setDraft] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const enter = async (event) => {
    event.preventDefault();
    if (!draft.trim()) {
      setError('Enter the Master Goose password.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await base44.functions.invoke('gooseAdmin', {
        action: 'ping',
        passphrase: draft,
      });
      if (res.data?.ok) {
        setPassphrase(draft);
        setAuthed(true);
        setDraft('');
      } else {
        setError(res.data?.error || 'Access denied.');
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Access denied. Incorrect Master Goose password.');
    } finally {
      setBusy(false);
    }
  };

  const run = async (action, payload = {}) => {
    let res;
    try {
      res = await base44.functions.invoke('gooseAdmin', { action, passphrase, ...payload });
    } catch (err) {
      throw new Error(
        err?.response?.data?.error || 'The nation database refused that change.'
      );
    }
    if (res.data?.error) throw new Error(res.data.error);
    await nation.reload();
    return res.data;
  };

  if (!authed) {
    return (
      <div className="mx-auto max-w-xl">
        <Panel>
          <div className="flex items-center gap-3">
            <Lock className="h-4 w-4 text-[#D4AF37]" />
            <span className="meta-label">Restricted Area</span>
          </div>
          <h2 className="display-title mt-3 text-3xl">Master Goose Login</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-foreground/70">
            Authorized members of the Goose Government only. Changes made here are published to
            every visitor immediately.
          </p>

          <form onSubmit={enter} className="mt-6 space-y-3">
            <label
              htmlFor="master-password"
              className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
            >
              Administrator password
            </label>
            <input
              id="master-password"
              type="password"
              autoComplete="off"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Enter the Master Goose password"
              className="w-full rounded-sm border border-input bg-background/80 px-4 py-3 font-mono text-[13px] text-foreground placeholder:text-muted-foreground/60"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-sm bg-[#D4AF37] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#0A0F0D] disabled:opacity-50"
            >
              {busy ? 'Verifying...' : 'Enter Admin Panel'}
            </button>
            {error && (
              <p className="font-mono text-[11px] text-[#FF6B4A]" role="alert">
                {error}
              </p>
            )}
          </form>
        </Panel>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#D4AF37]/40 bg-card px-6 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#D4AF37]">
            Clearance Granted
          </p>
          <p className="mt-1 font-display text-xl font-bold">Welcome, Master Goose.</p>
        </div>
        <button
          onClick={() => {
            setAuthed(false);
            setPassphrase('');
          }}
          className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-3 w-3" /> Log out
        </button>
      </div>

      <AnnouncementEditor
        key={nation.announcement.join('\n')}
        value={nation.announcement}
        run={run}
      />
      <LawManager laws={nation.laws} run={run} />
      <NewsComposer run={run} />
      <CitizenRegistry run={run} />
      <NewsletterComposer run={run} />
      <ThemePicker key={nation.theme} theme={nation.theme} run={run} />
    </div>
  );
}