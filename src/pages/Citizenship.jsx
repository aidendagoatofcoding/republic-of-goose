import Panel from '@/components/Panel';
import CitizenshipForm from '@/components/citizenship/CitizenshipForm';
import CitizenStatus from '@/components/citizenship/CitizenStatus';
import { useCitizen } from '@/hooks/useCitizen';

const REQUIREMENTS = [
  'Be able to produce at least one convincing honk',
  'Declare a district of residence',
  'Accept the Citizen’s Oath in full',
  'Never disturb the bread reserves',
  'One citizen per network address',
];

export default function Citizenship() {
  const { citizen, signedIn, loading } = useCitizen();

  if (loading) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        Checking the national register...
      </p>
    );
  }

  if (signedIn) return <CitizenStatus citizen={citizen} />;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <Panel>
        <span className="meta-label">Citizenship Office · Honkton</span>
        <h2 className="display-title mt-4 text-3xl md:text-5xl">Become a Citizen</h2>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-foreground/80">
          Citizenship of the Republic of Goose is granted on sight to anyone able to produce a
          convincing honk. Register below and your name is entered into the National Register of
          Citizens, held by the Goose Parliament in Honkton.
        </p>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <CitizenshipForm />

        <div className="space-y-4">
          <Panel>
            <span className="meta-label">Requirements</span>
            <ul className="mt-4 space-y-3">
              {REQUIREMENTS.map((item) => (
                <li key={item} className="flex gap-3 font-mono text-[12px] leading-relaxed text-muted-foreground">
                  <span className="text-primary">/</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <span className="meta-label">The Citizen’s Oath</span>
            <p className="mt-4 font-display text-lg leading-relaxed text-foreground/85">
              “I swear to honk with integrity, to defend the bread reserves, and to respect the
              Great Goose Forest and all who migrate through it.”
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Recorded at every registration
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}