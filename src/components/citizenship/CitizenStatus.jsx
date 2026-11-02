import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Panel from '@/components/Panel';
import SpeciesAvatar from '@/components/SpeciesAvatar';
import { speciesInfo } from '@/lib/species';

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

export default function CitizenStatus({ citizen }) {
  const info = speciesInfo(citizen.species);
  const job = citizen.job ? citizen.job.replace(/-/g, ' ') : '';

  const stats = [
    ['Species', info.label],
    ['District', citizen.district],
    ['HONKISH', citizen.honkish_level],
    ['Status', job ? `Working · ${job}` : 'In good standing'],
    ['Bread in hand', citizen.bread],
    ['Bread earned', citizen.bread_earned],
    ['Joined', formatDate(citizen.created_date)],
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <Panel className="border-primary/40">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <SpeciesAvatar
              species={citizen.species}
              src={citizen.avatar_url}
              worn={citizen.worn}
              size="lg"
            />
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-primary/50 bg-primary/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
                <CheckCircle2 className="h-3 w-3" /> Registered citizen
              </span>
              <h2 className="display-title mt-2 text-3xl">
                {citizen.goose_name || citizen.full_name}
              </h2>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {info.label} · {info.note}
              </p>
            </div>
          </div>
          <Link
            to="/passport"
            className="rounded-sm border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:border-primary/60 hover:text-primary"
          >
            My passport
          </Link>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-px border border-border/70 bg-border/70 sm:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="bg-card px-4 py-3">
              <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </dt>
              <dd className="mt-1 text-[14px] capitalize text-foreground">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-foreground/80">
          You are already on the National Register as the {info.label.toLowerCase()} of{' '}
          {citizen.district} — {info.note.toLowerCase()}. Your species is fixed at registration and
          travels with you onto your passport, your walk through the Honk Commons and every Champion
          Isle event.
        </p>

        <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
          To register someone else, sign out on your passport page first.
        </p>
      </Panel>
    </div>
  );
}