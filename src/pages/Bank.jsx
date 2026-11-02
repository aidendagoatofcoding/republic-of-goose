import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import Panel from '@/components/Panel';
import { useCitizen } from '@/hooks/useCitizen';
import LoanCard from '@/components/bank/LoanCard';

export default function Bank() {
  const { citizen, signedIn, run } = useCitizen();
  const [loan, setLoan] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!signedIn) return undefined;
    let active = true;
    run({ action: 'loan' })
      .then((data) => {
        if (active) setLoan(data.loan);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [signedIn, run]);

  const act = async (payload) => {
    setBusy(true);
    setError('');
    try {
      const data = await run(payload);
      setLoan(data.loan);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!signedIn) {
    return (
      <Panel>
        <div className="flex items-center gap-3">
          <Landmark className="h-4 w-4 text-primary" />
          <span className="meta-label">Citizens Only</span>
        </div>
        <h2 className="display-title mt-4 text-3xl">The National Bank of Goose</h2>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-foreground/75">
          Loans are written against your national work record, so only registered citizens may
          borrow. Sign in with your passport to open a file.
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

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Panel>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="meta-label">Ministry of Finance</span>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">The National Bank</h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-foreground/75">
              Short of bread for a home, a vehicle or a pet? Borrow against your work record and pay
              it back from your wages.
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
      </Panel>

      {!loan ? (
        <Panel>
          <p className="font-mono text-[11px] text-muted-foreground">Opening your file with the bank...</p>
        </Panel>
      ) : (
        <LoanCard
          loan={loan}
          bread={citizen.bread ?? 0}
          busy={busy}
          error={error}
          onTake={(amount) => act({ action: 'takeLoan', amount })}
          onRepay={(amount) => act({ action: 'repayLoan', amount })}
        />
      )}

      <Panel className="text-[14.5px] leading-relaxed text-foreground/70">
        <span className="meta-label">House rules</span>
        <ul className="mt-3 space-y-2">
          <li>· Every loan carries a 20% arrangement fee, added to what you owe.</li>
          <li>· Your ceiling is 100 bread plus 2 for every loaf you have earned.</li>
          <li>· Only one loan may be open at a time, and the bank never forgets a debt.</li>
          <li>· Wages, baking and honking all count towards your ceiling at the Labour Office.</li>
        </ul>
      </Panel>
    </div>
  );
}