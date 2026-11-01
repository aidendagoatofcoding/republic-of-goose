import Panel from '@/components/Panel';
import { Image } from '@/components/ui/image';

const FEATHER_IMAGE =
  'https://media.base44.com/images/public/6ae766fbcbe3be5aae821aa7/a9a55fa29_generated_4c2fbbf6.png';

const NATIONAL_INFO = [
  ['Official Name', 'Republic of Goose'],
  ['Capital', 'Honkton'],
  ['Location', 'Between Canada and Alaska (fictional)'],
  ['Official Language', 'HONKISH'],
  ['Currency', 'Goose Dollar (G$)'],
  ['National Animal', 'Canada Goose'],
  ['Government', 'Federal Goose Republic'],
  ['National Food', 'Bread'],
  ['National Bird', 'Goose'],
  ['National Motto', 'United We Honk'],
];

const BORDERS = ['North — Arctic Ocean', 'West — Alaska', 'East — Canada', 'South — Great Goose Forest'];

const REGIONS = [
  ['Honkton', 'National Capital'],
  ['Bread Valley', 'Agricultural Region'],
  ['Great Goose Forest', 'Wildlife Region'],
  ['Lake HONK', 'Largest National Lake'],
  ['Feather Mountains', 'Northern Highlands'],
];

export default function Country() {
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <span className="meta-label">National Profile</span>
          <h2 className="display-title mt-4 text-3xl md:text-4xl">About the Republic of Goose</h2>
          <p className="mt-5 text-[17px] leading-relaxed text-foreground/80">
            The Republic of Goose is a fictional sovereign nation located in the imagined territory
            between Canada and Alaska. It is a northern country known for its vast forests, frozen
            lakes, enormous goose populations, and abundant bread reserves.
          </p>
          <p className="mt-4 text-[17px] leading-relaxed text-foreground/60">
            The state is governed from Honkton by the Goose Parliament, which convenes whenever the
            lake thaws. Citizenship is granted on sight to anyone able to produce a convincing honk.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-px border border-border/70 bg-border/70 sm:grid-cols-2">
            {NATIONAL_INFO.map(([label, value]) => (
              <div key={label} className="bg-card px-4 py-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {label}
                </div>
                <div className="mt-1 text-[15px] text-foreground">{value}</div>
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
            {BORDERS.map((border) => (
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
            {REGIONS.map(([name, note]) => (
              <div key={name} className="flex items-baseline justify-between gap-4 py-3">
                <span className="font-display text-lg font-bold">{name}</span>
                <span className="text-right font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {note}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}