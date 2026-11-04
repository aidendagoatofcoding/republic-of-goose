import Panel from '@/components/Panel';
import { Image } from '@/components/ui/image';
import useNation from '@/hooks/useNation';

const FEATHER_IMAGE =
  'https://media.base44.com/images/public/6ae766fbcbe3be5aae821aa7/a9a55fa29_generated_4c2fbbf6.png';

export default function Country() {
  const { about } = useNation();

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <span className="meta-label">National Profile</span>
          <h2 className="display-title mt-4 text-3xl md:text-4xl">About the Republic of Goose</h2>
          {about.intro.map((paragraph, index) => (
            <p
              key={`intro-${index}`}
              className={`${index === 0 ? 'mt-5' : 'mt-4'} text-[17px] leading-relaxed ${
                index === 0 ? 'text-foreground/80' : 'text-foreground/60'
              }`}
            >
              {paragraph}
            </p>
          ))}

          <div className="mt-8 grid grid-cols-1 gap-px border border-border/70 bg-border/70 sm:grid-cols-2">
            {about.facts.map((fact) => (
              <div key={fact.label} className="bg-card px-4 py-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {fact.label}
                </div>
                <div className="mt-1 text-[15px] text-foreground">{fact.value}</div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <span className="meta-label">Official Standard</span>
            <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-sm border border-primary/50">
              <div className="absolute inset-0 bg-[#274d34]" />
              <div className="absolute inset-x-0 top-1/3 h-1/3 bg-[#e9e9d5]" />
              <span className="relative flex h-full items-center justify-center text-5xl">🪿</span>
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Flag of the Republic of Goose
            </p>
          </Panel>

          <div className="overflow-hidden rounded-md border border-border/80">
            <Image
              src={FEATHER_IMAGE}
              alt="Macro photograph of a goose feather covered in frost"
              className="h-48 w-full"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <span className="meta-label">Geography</span>
          <p className="mt-4 text-[16px] leading-relaxed text-foreground/75">
            The country occupies an imaginary northern territory along the Alaska–Canada border.
          </p>
          <ul className="mt-5 space-y-2">
            {about.borders.map((border) => (
              <li key={border} className="flex gap-3 font-mono text-[12px] text-muted-foreground">
                <span className="text-primary">/</span>
                <span>{border}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <span className="meta-label">Major Regions</span>
          <div className="mt-4 divide-y divide-border/60">
            {about.regions.map((region) => (
              <div key={region.name} className="flex items-baseline justify-between gap-4 py-3">
                <span className="font-display text-lg font-bold">{region.name}</span>
                <span className="text-right font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {region.note}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}