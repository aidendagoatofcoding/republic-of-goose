import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import Panel from '@/components/Panel';
import { base44 } from '@/api/base44Client';
import { useCitizen } from '@/hooks/useCitizen';
import JobCard from '@/components/jobs/JobCard';

export default function Jobs() {
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
          setError(err?.response?.data?.error || 'The Labour Office could not open its doors.');
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const take = async (job) => {
    setBusy(job.id);
    setError('');
    try {
      await run({ action: 'takeJob', job: job.id });
      setMessage(`You signed on as ${job.title}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const quit = async () => {
    setBusy('quit');
    setError('');
    try {
      await run({ action: 'quitJob' });
      setMessage('You have left your post at the Labour Office.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  if (!signedIn) {
    return (
      <Panel>
        <div className="flex items-center gap-3">
          <Briefcase className="h-4 w-4 text-primary" />
          <span className="meta-label">Citizens Only</span>
        </div>
        <h2 className="display-title mt-4 text-3xl">The National Labour Office</h2>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-foreground/75">
          Every post in the Republic pays in bread, and only registered citizens may hold one. Sign
          in with your passport, or apply for citizenship first.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/passport"
            className="rounded-sm bg-primary px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground"
          >
            Sign in
          </Link>
          <Link
            to="/citizenship"
            className="rounded-sm border border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            Apply for citizenship
          </Link>
        </div>
      </Panel>
    );
  }

  const current = jobs?.find((job) => job.id === citizen.job) || null;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <Panel>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="meta-label">Ministry of Labour</span>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">National Jobs</h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-foreground/75">
              Hold one post at a time. Your wage is paid in bread every few seconds for as long as
              this site is open — leave the tab and the pay stops.
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Bread in hand
            </p>
            <p className="font-mono text-xl font-bold text-primary">🍞 {citizen.bread}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Earned all time {citizen.bread_earned ?? 0}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border/60 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {current ? `On shift: ${current.title} · 🍞 ${current.wage} / min` : 'Currently unemployed'}
          </p>
          {current && (
            <button
              type="button"
              onClick={quit}
              disabled={busy === 'quit'}
              className="rounded-sm border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:border-destructive/60 hover:text-foreground disabled:opacity-50"
            >
              {busy === 'quit' ? 'Leaving...' : 'Leave this post'}
            </button>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-3 font-mono text-[11px] text-[#FF6B4A]">
            {error}
          </p>
        )}
        {!error && message && (
          <p className="mt-3 font-mono text-[11px] text-primary">{message}</p>
        )}
      </Panel>

      {jobs === null ? (
        <Panel>
          <p className="font-mono text-[11px] text-muted-foreground">Opening the registry of posts...</p>
        </Panel>
      ) : (
        <div className="grid gap-px border border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              current={citizen.job === job.id}
              busy={busy === job.id}
              earned={citizen.bread_earned ?? 0}
              onTake={() => take(job)}
            />
          ))}
        </div>
      )}
    </div>
  );
}