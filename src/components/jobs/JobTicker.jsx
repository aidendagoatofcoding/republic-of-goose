import { useEffect } from 'react';
import { useCitizen } from '@/hooks/useCitizen';

// Pays the citizen's wage every few seconds for as long as they are on the site.
export default function JobTicker() {
  const { signedIn, citizen, run } = useCitizen();
  const job = citizen?.job || '';

  useEffect(() => {
    if (!signedIn || !job) return undefined;
    const timer = setInterval(() => {
      run({ action: 'workShift' }).catch(() => {});
    }, 15000);
    return () => clearInterval(timer);
  }, [signedIn, job, run]);

  return null;
}