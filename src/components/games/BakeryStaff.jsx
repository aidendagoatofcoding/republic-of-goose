import { Users } from 'lucide-react';
import Panel from '@/components/Panel';

export default function BakeryStaff({ citizen, onHire, hiring }) {
  const workers = citizen.workers ?? 0;
  const cost = citizen.next_worker_cost ?? 0;

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-primary" />
            <span className="meta-label">Kitchen Staff</span>
          </div>
          <h3 className="display-title mt-3 text-2xl">Hire bakery hands</h3>
        </div>
        <div className="text-right">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Hands on the ovens
          </p>
          <p className="font-mono text-xl font-bold text-primary">{workers}</p>
        </div>
      </div>

      <p className="mt-4 text-[16px] leading-relaxed text-foreground/75">
        Every hired hand bakes a loaf every four seconds without a single honk from you — and keeps
        baking while you are away, with up to six hours of loaves waiting when you return.
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-px border border-border/70 bg-border/70 sm:grid-cols-3">
        {[
          ['Loaves per minute', `${workers * 15}`],
          ['Next hire', `🍞 ${cost}`],
          ['Kitchen capacity', '200 hands'],
        ].map(([label, value]) => (
          <div key={label} className="bg-card px-4 py-3">
            <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              {label}
            </dt>
            <dd className="mt-1 font-mono text-[13px] text-foreground">{value}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={onHire}
        disabled={hiring}
        className="mt-5 rounded-sm bg-primary px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-50"
      >
        {hiring ? 'Hiring...' : workers > 0 ? 'Hire another hand' : 'Hire your first hand'}
      </button>
    </Panel>
  );
}