import { useEffect, useState } from 'react';
import { useCitizen } from '@/hooks/useCitizen';
import BankRoom from '@/components/bank/BankRoom';

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

  return (
    <BankRoom
      signedIn={signedIn}
      citizen={citizen}
      loan={loan}
      error={error}
      busy={busy}
      onTake={(amount) => act({ action: 'takeLoan', amount })}
      onRepay={(amount) => act({ action: 'repayLoan', amount })}
    />
  );
}