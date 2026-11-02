import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useCitizen } from '@/hooks/useCitizen';

export default function JobBoard() {
  const { citizen, signedIn, run } = useCitizen();
  const [jobs, setJobs] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    base44.functions
      .invoke('citizen', { action: 'jobs' })
      .then((response) => {
        if (active) setJobs(response?.data?.jobs ?? []);
      })
      .catch((err) => {
        if (active) {
          setJobs([]);
          setError(err?.response?.data?.error || 'The board could not be read.');
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const apply = async (job) => {
    setBusy(job.id);
    setError('');
    setMessage('');
    try {
      await run({ action: 'takeJob', job: job.id });
      setMessage(`Application accepted — you are now ${job.title}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const withdraw = async () => {
    setBusy('withdraw');
    setError('');
    setMessage('');
    try {
      await run({ action: 'quitJob' });
      setMessage('You have withdrawn from your post.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  if (!signedIn) {
    return (
      <section>
        <div className="flex items-center gap-3">
          <ClipboardList className="h-4 w-4 text-primary" />
          <span className="meta-label">Citizens only</span>
        </div>
        <h2 className="display-title mt-3 text-2xl">The Government Job Board</h2>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-foreground/75">
          The ministries only hire registered citizens. Sign in with your passport to read the
          postings and apply.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/passport"
            className="rounded-sm bg-primary px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground"
          >
            Sign in
          </Link>
          <Link
            to="/citizenship"
            className="rounded-sm border border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            Apply for citizenship
          </Link>
        </div>
      </section>
    );
  }

  const earned = citizen.bread_earned ?? 0;
  const current = jobs?.find((job) => job.id === citizen.job) || null;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <ClipboardList className="h-4 w-4 text-primary" />
              <span className="meta-label">Ministry of Employment</span>
            </div>
            <h2 className="display-title mt-3 text-2xl md:text-3xl">The Government Job Board</h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-foreground/75">
              Every posting below is open to citizens. Apply for one at a time — your wage is paid
              in bread for as long as you are on shift.
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Bread in hand
            </p>
            <p className="font-mono text-xl font-bold text-primary">🍞 {citizen.bread}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Earned all time {earned}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border/60 pt-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {current ? `On duty: ${current.title} · 🍞 ${current.wage} / min` : 'No post held'}
          </p>
          {current && (
            <button
              type="button"
              onClick={withdraw}
              disabled={busy === 'withdraw'}
              className="rounded-sm border border-border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground hover:border-destructive/60 hover:text-foreground disabled:opacity-50"
            >
              {busy === 'withdraw' ? 'Withdrawing...' : 'Withdraw'}
            </button>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-2 font-mono text-[11px] text-[#FF6B4A]">
            {error}
          </p>
        )}
        {!error && message && <p className="mt-2 font-mono text-[11px] text-primary">{message}</p>}
      </section>

      {jobs === null ? (
        <p className="font-mono text-[11px] text-muted-foreground">Reading the postings...</p>
      ) : jobs.length === 0 ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          No posts are open today.
        </p>
      ) : (
        <ul className="divide-y divide-border/70 border border-border/70">
          {jobs.map((job) => {
            const onDuty = current?.id === job.id;
            const locked = earned < job.unlock_bread;
            return (
              <li
                key={job.id}
                className={`flex flex-col gap-3 bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
                  onDuty ? 'bg-primary/5' : ''
                } ${locked ? 'opacity-75' : ''}`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="text-xl leading-none" aria-hidden="true">
                    {locked ? '🔒' : job.emoji}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-bold leading-tight">{job.title}</h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-foreground/70">
                      {job.description}
                    </p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                      {onDuty
                        ? 'On duty now'
                        : locked
                          ? `Needs 🍞 ${job.unlock_bread} earned — you have ${earned}`
                          : 'Open to applications'}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                  <span className="font-mono text-[13px] font-bold text-primary">
                    🍞 {job.wage} / min
                  </span>
                  <button
                    type="button"
                    onClick={() => apply(job)}
                    disabled={onDuty || locked || busy === job.id}
                    className="rounded-sm border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:border-primary/60 hover:text-primary disabled:opacity-40"
                  >
                    {onDuty
                      ? 'Applied'
                      : locked
                        ? 'Locked'
                        : busy === job.id
                          ? 'Applying...'
                          : 'Apply'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}