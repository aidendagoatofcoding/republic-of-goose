import { cn } from '@/lib/utils';

export default function JobCard({ job, current, busy, onTake, earned }) {
  const locked = earned < job.unlock_bread;

  return (
    <article
      className={cn(
        'flex flex-col gap-3 bg-card p-5',
        current && 'bg-primary/5',
        locked && 'opacity-70'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">
            {locked ? '🔒' : job.emoji}
          </span>
          <div>
            <h3 className="font-display text-lg font-bold leading-tight">{job.title}</h3>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              {locked ? 'Locked for now' : 'Paid while you are on the site'}
            </p>
          </div>
        </div>
        {current && (
          <span className="shrink-0 rounded-sm border border-primary/50 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
            On shift
          </span>
        )}
      </div>

      <p className="text-[14.5px] leading-relaxed text-foreground/70">{job.description}</p>

      {locked && (
        <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
          Earn {job.unlock_bread} bread to unlock · you have {earned}
        </p>
      )}

      <div className="mt-auto flex items-baseline justify-between gap-3">
        <span className="font-mono text-[13px] font-bold text-primary">🍞 {job.wage} / min</span>
        <button
          type="button"
          onClick={onTake}
          disabled={current || busy || locked}
          className="rounded-sm border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:border-primary/60 hover:text-primary disabled:opacity-40"
        >
          {current ? 'Taken' : locked ? 'Locked' : busy ? 'Signing on...' : 'Take this post'}
        </button>
      </div>
    </article>
  );
}