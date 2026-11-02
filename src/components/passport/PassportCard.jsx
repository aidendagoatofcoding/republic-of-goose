import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, LogOut, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useCitizen } from '@/hooks/useCitizen';
import { speciesInfo } from '@/lib/species';
import CitizenBadge from '@/components/CitizenBadge';
import SpeciesAvatar from '@/components/SpeciesAvatar';
import OwnedDecorations from '@/components/passport/OwnedDecorations';

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : '—';

export default function PassportCard({ citizen }) {
  const { run, signOut } = useCitizen();
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef(null);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      await run({ action: 'setAvatar', avatar_url: file_url });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(citizen.passport_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Copy the code by hand — your browser blocked the clipboard.');
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <section className="rounded-md border border-primary/40 bg-card p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <SpeciesAvatar species={citizen.species} src={citizen.avatar_url} size="lg" />
            <div>
              <CitizenBadge species={citizen.species} />
              <h2 className="display-title mt-2 text-3xl">
                {citizen.goose_name || citizen.full_name}
              </h2>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {citizen.full_name} · {speciesInfo(citizen.species).label}
              </p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-px border border-border/70 bg-border/70 sm:grid-cols-4">
          {[
            ['Bread', citizen.bread],
            ['District', citizen.district],
            ['HONKISH', citizen.honkish_level],
            ['Joined', formatDate(citizen.created_date)],
          ].map(([label, value]) => (
            <div key={label} className="bg-card px-4 py-3">
              <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </dt>
              <dd className="mt-1 text-[14px] text-foreground">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <input ref={fileRef} type="file" accept="image/*" onChange={upload} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:border-primary/60 hover:text-primary disabled:opacity-50"
          >
            <Upload className="h-3 w-3" /> {uploading ? 'Uploading' : 'Set my portrait'}
          </button>
          <button
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:border-primary/60 hover:text-primary"
          >
            <Copy className="h-3 w-3" /> {copied ? 'Copied' : 'Copy passport code'}
          </button>
          <span className="font-mono text-[10px] text-muted-foreground">
            {citizen.passport_code}
          </span>
        </div>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
          Keep the code private · portrait stored publicly — anyone with the link can open it
        </p>

        {error && (
          <p role="alert" className="mt-3 font-mono text-[11px] text-[#FF6B4A]">
            {error}
          </p>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <OwnedDecorations owned={citizen.decorations} />

        <section className="rounded-md border border-border/80 bg-card p-6">
          <span className="meta-label">Portfolio</span>
          {citizen.holdings?.length ? (
            <ul className="mt-4 divide-y divide-border/60">
              {citizen.holdings.map((holding) => (
                <li key={holding.symbol} className="flex items-baseline justify-between py-2">
                  <span className="font-mono text-[12px] text-foreground">{holding.symbol}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {holding.shares} shares
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/70">
              No shares yet. The{' '}
              <Link to="/market" className="text-primary underline-offset-4 hover:underline">
                goose stock market
              </Link>{' '}
              is open every minute of the day.
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/games"
              className="rounded-sm border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:border-primary/60 hover:text-primary"
            >
              Bake bread
            </Link>
            <Link
              to="/shop"
              className="rounded-sm border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:border-primary/60 hover:text-primary"
            >
              E-Shop
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}