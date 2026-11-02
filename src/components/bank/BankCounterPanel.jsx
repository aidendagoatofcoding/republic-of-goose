import { Link } from 'react-router-dom';
import { Landmark, X } from 'lucide-react';
import LoanCard from '@/components/bank/LoanCard';

function HouseRules() {
  return (
    <section className="rounded-md border border-border/80 bg-card p-5">
      <span className="meta-label">House rules</span>
      <ul className="mt-3 space-y-2 text-[14.5px] leading-relaxed text-foreground/70">
        <li>· Every loan carries a 20% arrangement fee, added to what you owe.</li>
        <li>· Your ceiling is 100 bread plus 2 for every loaf you have earned.</li>
        <li>· Only one loan may be open at a time, and the bank never forgets a debt.</li>
        <li>· Wages, baking and honking all count towards your ceiling at the Labour Office.</li>
      </ul>
    </section>
  );
}

function FrontDoor() {
  return (
    <section className="rounded-md border border-border/80 bg-card p-5">
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

export default function BankCounterPanel({ desk, onClose, signedIn, citizen, loan, error, busy, onTake, onRepay }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-40 max-h-[76%] overflow-y-auto border-t border-primary/35 bg-background/97 px-3 py-4 backdrop-blur-sm sm:px-5">
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
            {desk === 'vault' ? 'At the vault' : 'At the loans desk'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
          >
            <X className="h-3 w-3" /> Step back
          </button>
        </div>

        {desk === 'vault' ? (
          <div className="space-y-3">
            <HouseRules />
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {citizen ? `Reserves held here · your balance ${citizen.bread} bread` : 'The vault stays locked for visitors'}
            </p>
          </div>
        ) : !signedIn ? (
          <FrontDoor />
        ) : !loan ? (
          <p className="font-mono text-[11px] text-muted-foreground">
            Opening your file with the bank...
          </p>
        ) : (
          <LoanCard
            loan={loan}
            bread={citizen?.bread ?? 0}
            busy={busy}
            error={error}
            onTake={onTake}
            onRepay={onRepay}
          />
        )}
      </div>
    </div>
  );
}