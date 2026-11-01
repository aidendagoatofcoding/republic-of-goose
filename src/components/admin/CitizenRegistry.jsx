import { useEffect, useState } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

export default function CitizenRegistry({ run }) {
  const [citizens, setCitizens] = useState(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setError('');
    try {
      const data = await run('listCitizens');
      setCitizens(data?.citizens ?? []);
    } catch (err) {
      setError(err.message);
      setCitizens([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    setBusyId(id);
    setError('');
    try {
      await run('deleteCitizen', { id });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="rounded-md border border-[#D4AF37]/40 bg-card p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#D4AF37]">
            Directive 04 · National Register
          </span>
          <h3 className="mt-3 font-display text-2xl font-bold">Registered Citizens</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {citizens === null ? 'Counting...' : `${citizens.length} on the register`}
          </span>
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
          >
            <RefreshCw className="h-3 w-3" /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 font-mono text-[11px] text-[#FF6B4A]">
          {error}
        </p>
      )}

      <div className="mt-5 divide-y divide-border/60 border border-border/60">
        {citizens === null && (
          <p className="p-3 font-mono text-[11px] text-muted-foreground">Opening the register...</p>
        )}

        {citizens?.length === 0 && (
          <p className="p-3 font-mono text-[11px] text-muted-foreground">
            No citizens have registered yet.
          </p>
        )}

        {citizens?.map((citizen) => (
          <div
            key={citizen.id}
            className="flex flex-wrap items-start justify-between gap-3 p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground">
                {citizen.full_name}
                {citizen.goose_name ? (
                  <span className="text-muted-foreground"> · “{citizen.goose_name}”</span>
                ) : null}
              </p>
              <p className="mt-1 font-mono text-[10.5px] leading-relaxed text-muted-foreground">
                {citizen.district} · {citizen.honkish_level} · joined {formatDate(citizen.created_date)}
                {citizen.email ? ` · ${citizen.email}` : ''}
              </p>
            </div>
            <button
              onClick={() => remove(citizen.id)}
              disabled={busyId === citizen.id}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#FF6B4A]/50 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#FF6B4A] disabled:opacity-50"
            >
              <Trash2 className="h-3 w-3" /> Revoke
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}