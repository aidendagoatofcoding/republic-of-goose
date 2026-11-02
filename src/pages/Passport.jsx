import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import Panel from '@/components/Panel';
import { useCitizen } from '@/hooks/useCitizen';
import { takeGoogleSignIn } from '@/lib/citizenSession';
import PassportLogin from '@/components/passport/PassportLogin';
import PassportCard from '@/components/passport/PassportCard';

export default function Passport() {
  const { citizen, loading, signInWithGoogle } = useCitizen();
  const [googleError, setGoogleError] = useState('');

  useEffect(() => {
    if (!takeGoogleSignIn()) return undefined;
    let active = true;
    signInWithGoogle().catch((error) => {
      if (active) setGoogleError(error.message);
    });
    return () => {
      active = false;
    };
  }, [signInWithGoogle]);

  if (loading) {
    return (
      <Panel>
        <p className="font-mono text-[11px] text-muted-foreground">Opening your passport...</p>
      </Panel>
    );
  }

  if (citizen) return <PassportCard citizen={citizen} />;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <Panel>
        <div className="flex items-center gap-3">
          <BadgeCheck className="h-4 w-4 text-primary" />
          <span className="meta-label">Citizen Access</span>
        </div>
        <h2 className="display-title mt-4 text-3xl md:text-4xl">Your Passport</h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-foreground/75">
          Every registered citizen receives a username, a password and a passport code at the
          Citizenship Office. Sign in with Google, your username and password, or your passport
          code to carry your badge, earn bread for honking in the chat, trade on the national
          exchange and wear your decorations.
        </p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Not registered yet?{' '}
          <Link to="/citizenship" className="text-primary underline-offset-4 hover:underline">
            Apply for citizenship
          </Link>
        </p>

        {googleError && (
          <p role="alert" className="mt-4 border border-destructive/40 bg-destructive/5 p-3 font-mono text-[11px] leading-relaxed text-[#FF6B4A]">
            {googleError}
          </p>
        )}
      </Panel>

      <PassportLogin />
    </div>
  );
}