import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import { useCitizen } from '@/hooks/useCitizen';
import LoanCard from '@/components/bank/LoanCard';

function FrontDoor() {
  return (
    <section>
      <div className="flex items-center gap-3">
        <Landmark className="h-4 w-4 text-primary" />
        <span className="meta-label">Citizens only</span>
      </div>
      <h3 className="display-title mt-3 text-2xl">The National Bank of Goose</h3>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-foreground/75">
        Loans are written against your national work record, so only registered citizens may
        borrow. Sign in with your passport to open a file.
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

export default function BankCounter() {
  const { citizen, signedIn, run } = useCitizen();
  const [loan, setLoan] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!signedIn) {
      setLoan(null);
      return undefined;
    }
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

  if (!signedIn) return <FrontDoor />;
  if (error && !loan) {
    return <p className="font-mono text-[11px] text-[#FF6B4A]">{error}</p>;
  }
  if (!loan) {
    return <p className="font-mono text-[11px] text-muted-foreground">Opening your file with the bank...</p>;
  }

  return (
    <LoanCard
      loan={loan}
      bread={citizen?.bread ?? 0}
      busy={busy}
      error={error}
      onTake={(amount) => act({ action: 'takeLoan', amount })}
      onRepay={(amount) => act({ action: 'repayLoan', amount })}
    />
  );
}