import HeroBlock from '@/components/HeroBlock';
import Panel from '@/components/Panel';
import useNation from '@/hooks/useNation';

const HERO_IMAGE =
  'https://media.base44.com/images/public/6ae766fbcbe3be5aae821aa7/4a1ba81b9_generated_36adb353.png';

const STATS = [
  { value: '🪿', label: 'Goose', note: 'National Animal' },
  { value: 'HONK', label: 'Honkish', note: 'Official Language' },
  { value: '2026', label: 'Founded', note: 'Year of Establishment' },
  { value: '🍞', label: 'Bread', note: 'National Food' },
];

export default function Home() {
  const { announcement } = useNation();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <HeroBlock
        eyebrow="Official National Portal"
        title="The Republic of Goose"
        description="A fictional sovereign nation in the far north — vast forests, frozen lakes, and the largest recorded bread reserves on earth. Entry is granted to all who honk."
        motto="One Nation · One Language · Infinite Honks"
        image={HERO_IMAGE}
        imageAlt="Arctic fog over a frozen northern lake in the Republic of Goose"
        actions={[
          { to: '/country', label: 'Explore the Country' },
          { to: '/translator', label: 'Learn Honkish', variant: 'ghost' },
        ]}
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-md border border-border/80 bg-card px-4 py-6 text-center"
          >
            <div className="font-display text-3xl font-bold text-primary">{stat.value}</div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground">
              {stat.label}
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {stat.note}
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-primary" />
            <span className="meta-label">National Dispatch</span>
          </div>
          <h3 className="mt-4 font-display text-2xl font-bold">📢 Official Announcement</h3>
          <div className="mt-4 space-y-3 border-l border-primary/40 pl-4">
            {announcement.map((line, index) => (
              <p key={index} className="text-[16px] leading-relaxed text-foreground/80">
                {line}
              </p>
            ))}
          </div>
        </Panel>

        <Panel className="flex flex-col justify-between">
          <div>
            <span className="meta-label">National Motto</span>
            <h3 className="mt-4 font-display text-3xl font-bold leading-tight text-primary">
              HONK HONK
              <br />
              HOOOOONK!
            </h3>
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            “United We Honk.”
          </p>
        </Panel>
      </div>
    </div>
  );
}