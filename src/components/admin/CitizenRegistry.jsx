import { useEffect, useState } from 'react';
import { Coins, RefreshCw, Trash2 } from 'lucide-react';
import { speciesInfo } from '@/lib/species';

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

export default function CitizenRegistry({ run }) {
  const [citizens, setCitizens] = useState(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [amounts, setAmounts] = useState({});

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

  const adjustBread = async (citizen, sign) => {
    const amount = Math.abs(Math.round(Number(amounts[citizen.id] || 0)));
    if (!amount) {
      setError('Enter how much bread to give or take.');
      return;
    }
    setBusyId(citizen.id);
    setError('');
    try {
      await run('adjustBread', { id: citizen.id, amount: amount * sign });
      setAmounts((current) => ({ ...current, [citizen.id]: '' }));
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

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
                {speciesInfo(citizen.species).label} · {citizen.district} · {citizen.honkish_level} · joined {formatDate(citizen.created_date)}
                {` · 🍞 ${citizen.bread ?? 0}`}
                {citizen.email ? ` · ${citizen.email}` : ''}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1.5">
                <input
                  value={amounts[citizen.id] ?? ''}
                  onChange={(event) =>
                    setAmounts((current) => ({ ...current, [citizen.id]: event.target.value }))
                  }
                  inputMode="numeric"
                  placeholder="10"
                  aria-label={`Bread amount for ${citizen.full_name}`}
                  className="w-16 rounded-sm border border-border bg-transparent px-2 py-1.5 text-center font-mono text-[11px] tabular-nums text-foreground"
                />
                <button
                  onClick={() => adjustBread(citizen, 1)}
                  disabled={busyId === citizen.id}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-primary/50 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-primary disabled:opacity-50"
                >
                  <Coins className="h-3 w-3" /> Give
                </button>
                <button
                  onClick={() => adjustBread(citizen, -1)}
                  disabled={busyId === citizen.id}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-[#D4AF37]/50 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#D4AF37] disabled:opacity-50"
                >
                  <Coins className="h-3 w-3" /> Take
                </button>
              </div>
              <button
                onClick={() => remove(citizen.id)}
                disabled={busyId === citizen.id}
                className="inline-flex items-center gap-1.5 rounded-sm border border-[#FF6B4A]/50 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#FF6B4A] disabled:opacity-50"
              >
                <Trash2 className="h-3 w-3" /> Revoke
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}