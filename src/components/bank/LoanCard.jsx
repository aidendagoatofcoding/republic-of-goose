import { useState } from 'react';

const FIELD =
  'mt-2 w-full rounded-sm border border-input bg-background/80 px-3 py-2 font-mono text-[13px] text-foreground';

export default function LoanCard({ loan, bread, busy, error, onTake, onRepay }) {
  const [amount, setAmount] = useState(50);
  const [repay, setRepay] = useState('');

  const limit = loan.limit ?? 0;

  if (loan.active) {
    const owed = loan.outstanding;
    const suggested = Math.min(owed, bread);
    return (
      <section className="rounded-md border border-border/80 bg-card p-6">
        <span className="meta-label">Loan on the books</span>
        <h3 className="display-title mt-3 text-2xl">You owe the bank {owed} bread</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-foreground/70">
          Borrowed {loan.principal} bread with a 20% arrangement fee. Repay in instalments of any
          size — a settled loan frees your next one.
        </p>

        <div className="mt-5 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="repay-amount" className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Repay
            </label>
            <input
              id="repay-amount"
              type="number"
              min="1"
              max={owed}
              value={repay}
              onChange={(event) => setRepay(event.target.value)}
              placeholder={String(suggested)}
              className={`${FIELD} max-w-[140px]`}
            />
          </div>
          <button
            type="button"
            onClick={() => onRepay(Math.min(owed, Math.max(1, Math.floor(Number(repay) || suggested))))}
            disabled={busy || bread < 1}
            className="rounded-sm bg-primary px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-50"
          >
            {busy ? 'Paying...' : `Pay ${Math.min(owed, Math.max(1, Math.floor(Number(repay) || suggested)))} bread`}
          </button>
          <button
            type="button"
            onClick={() => onRepay(Math.min(owed, bread))}
            disabled={busy || bread < 1}
            className="rounded-sm border border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            Pay everything I have
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-3 font-mono text-[11px] text-[#FF6B4A]">
            {error}
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="rounded-md border border-border/80 bg-card p-6">
      <span className="meta-label">New loan</span>
      <h3 className="display-title mt-3 text-2xl">The bank will lend up to {limit} bread</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-foreground/70">
        Your ceiling grows with every loaf you earn. A 20% arrangement fee is added to the balance
        the moment the loan leaves the vault.
      </p>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="borrow-amount" className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Amount
          </label>
          <input
            id="borrow-amount"
            type="number"
            min="10"
            max={limit}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className={`${FIELD} max-w-[140px]`}
          />
        </div>
        <button
          type="button"
          onClick={() => onTake(Math.floor(Number(amount) || 0))}
          disabled={busy || limit < 10}
          className="rounded-sm bg-primary px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-50"
        >
          {busy ? 'Signing...' : 'Sign the loan'}
        </button>
        {[50, 200, limit].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount(preset)}
            className="rounded-sm border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:border-primary/60 hover:text-primary"
          >
            {preset}
          </button>
        ))}
      </div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        Fee 20% · one loan at a time · {bread} bread in hand
      </p>
      {error && (
        <p role="alert" className="mt-3 font-mono text-[11px] text-[#FF6B4A]">
          {error}
        </p>
      )}
    </section>
  );
}