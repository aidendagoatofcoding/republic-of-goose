import { useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const DISTRICTS = [
  'Honkton',
  'Bread Valley',
  'Great Goose Forest',
  'Lake HONK',
  'Feather Mountains',
  'Outside the Republic',
];

const LEVELS = ['Not yet honking', 'Apprentice honker', 'Fluent honker', 'Native honker'];

const INPUT_CLASS =
  'w-full rounded-sm border border-input bg-background/80 px-4 py-3 font-mono text-[13px] text-foreground placeholder:text-muted-foreground/60';

const SELECT_CLASS = `${INPUT_CLASS} appearance-none`;

const FIELD_LABEL = 'block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground';

export default function CitizenshipForm() {
  const [fullName, setFullName] = useState('');
  const [gooseName, setGooseName] = useState('');
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [level, setLevel] = useState(LEVELS[1]);
  const [email, setEmail] = useState('');
  const [oath, setOath] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [granted, setGranted] = useState(null);

  const apply = async (event) => {
    event.preventDefault();
    const name = fullName.trim();

    if (name.length < 2) {
      setError('Enter your full name as it should appear on the national register.');
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('That email address does not look valid.');
      return;
    }
    if (!oath) {
      setError("You must take the Citizen's Oath before joining.");
      return;
    }

    setBusy(true);
    setError('');
    try {
      const record = await base44.entities.Citizen.create({
        full_name: name.slice(0, 120),
        goose_name: gooseName.trim().slice(0, 60),
        district,
        honkish_level: level,
        email: email.trim().slice(0, 160),
        oath_accepted: true,
      });
      setGranted(record);
    } catch (err) {
      setError('The registry office could not process that application. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setGranted(null);
    setFullName('');
    setGooseName('');
    setEmail('');
    setOath(false);
    setError('');
    setDistrict(DISTRICTS[0]);
    setLevel(LEVELS[1]);
  };

  if (granted) {
    return (
      <section className="rounded-md border border-primary/50 bg-card p-6 md:p-8">
        <div className="flex items-center gap-3">
          <BadgeCheck className="h-4 w-4 text-primary" />
          <span className="meta-label text-primary">Citizenship Granted</span>
        </div>

        <h3 className="display-title mt-4 text-3xl md:text-4xl">{granted.full_name}</h3>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Entered into the National Register of Citizens
        </p>

        <dl className="mt-6 grid grid-cols-1 gap-px border border-border/70 bg-border/70 sm:grid-cols-2">
          {[
            ['Goose Name', granted.goose_name || 'Not yet declared'],
            ['District', granted.district],
            ['HONKISH Level', granted.honkish_level],
            ['Date of Entry', new Date(granted.created_date).toLocaleDateString()],
          ].map(([label, value]) => (
            <div key={label} className="bg-card px-4 py-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </dt>
              <dd className="mt-1 text-[15px] text-foreground">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-[15px] leading-relaxed text-foreground/70">
          Welcome to the Republic of Goose. Honk loudly, protect the bread reserves, and report any
          suspicious behaviour to the nearest goose.
        </p>

        <button
          onClick={reset}
          className="mt-6 rounded-sm border border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
        >
          Register another citizen
        </button>
      </section>
    );
  }

  return (
    <form onSubmit={apply} className="rounded-md border border-border/80 bg-card p-6 md:p-8">
      <span className="meta-label">Application for Citizenship</span>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="full-name" className={FIELD_LABEL}>
            Full name
          </label>
          <input
            id="full-name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="e.g. Margaret Featherstone"
            className={`mt-2 ${INPUT_CLASS}`}
          />
        </div>

        <div>
          <label htmlFor="goose-name" className={FIELD_LABEL}>
            Chosen goose name (optional)
          </label>
          <input
            id="goose-name"
            value={gooseName}
            onChange={(event) => setGooseName(event.target.value)}
            placeholder="e.g. Sir Honksalot"
            className={`mt-2 ${INPUT_CLASS}`}
          />
        </div>

        <div>
          <label htmlFor="district" className={FIELD_LABEL}>
            District of residence
          </label>
          <select
            id="district"
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
            className={`mt-2 ${SELECT_CLASS}`}
          >
            {DISTRICTS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="honkish-level" className={FIELD_LABEL}>
            HONKISH proficiency
          </label>
          <select
            id="honkish-level"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            className={`mt-2 ${SELECT_CLASS}`}
          >
            {LEVELS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="citizen-email" className={FIELD_LABEL}>
            Email (optional, for official correspondence)
          </label>
          <input
            id="citizen-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={`mt-2 ${INPUT_CLASS}`}
          />
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 border border-border/70 bg-secondary/40 p-4">
        <input
          type="checkbox"
          checked={oath}
          onChange={(event) => setOath(event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--primary))]"
        />
        <span className="text-[14.5px] leading-relaxed text-foreground/80">
          I swear the Citizen's Oath: to honk with integrity, to defend the bread reserves, and to
          respect the Great Goose Forest and all who migrate through it.
        </span>
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-50"
        >
          {busy ? 'Registering...' : 'Join the Republic'}
        </button>
        {error && (
          <p role="alert" className="font-mono text-[11px] text-[#FF6B4A]">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}