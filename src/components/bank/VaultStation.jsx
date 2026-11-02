import { useEffect, useState } from 'react';
import HouseRules from '@/components/bank/HouseRules';
import { useCitizen } from '@/hooks/useCitizen';

export default function VaultStation() {
  const { citizen, signedIn, run } = useCitizen();
  const [loan, setLoan] = useState(null);

  useEffect(() => {
    if (!signedIn) {
      setLoan(null);
      return undefined;
    }
    let live = true;
    run({ action: 'loan' })
      .then((data) => {
        if (live) setLoan(data.loan);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [signedIn, run]);

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-sm border border-border/70 bg-card px-3 py-2">
          <span className="meta-label">In your purse</span>
          <p className="mt-1 font-mono text-lg font-bold text-primary">
            🍞 {signedIn ? (citizen?.bread ?? 0) : '—'}
          </p>
        </div>
        <div className="rounded-sm border border-border/70 bg-card px-3 py-2">
          <span className="meta-label">You owe the bank</span>
          <p className="mt-1 font-mono text-lg font-bold text-foreground">
            🍞 {signedIn ? (loan?.outstanding ?? 0) : '—'}
          </p>
        </div>
        <div className="rounded-sm border border-border/70 bg-card px-3 py-2">
          <span className="meta-label">Loan status</span>
          <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
            {!signedIn ? 'No file' : loan?.status === 'active' ? 'Open' : 'Clear'}
          </p>
        </div>
      </div>

      <div>
        <span className="meta-label">House rules</span>
        <div className="mt-2">
          <HouseRules />
        </div>
      </div>

      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        {signedIn
          ? 'Step to the loans desk to borrow or repay.'
          : 'The vault stays locked for visitors. Sign in at the loans desk.'}
      </p>
    </div>
  );
}