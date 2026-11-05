import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ScrollText, Sparkles } from 'lucide-react';
import HeroBlock from '@/components/HeroBlock';
import Panel from '@/components/Panel';
import useNation from '@/hooks/useNation';

const HERO_IMAGE =
  'https://media.base44.com/images/public/6ae766fbcbe3be5aae821aa7/d76e1af98_generated_image.png';

// The national reel: the capital, the lake and the pine road, filmed at dusk.
const HERO_VIDEO =
  'https://media.base44.com/videos/public/6ae766fbcbe3be5aae821aa7/439f3a899_Front_page_hero.mp4';

const STATS = [
  { value: '🪿', label: 'Goose', note: 'National Animal' },
  { value: 'HONK', label: 'Honkish', note: 'Official Language' },
  { value: '2026', label: 'Founded', note: 'Year of Establishment' },
  { value: '🍞', label: 'Bread', note: 'National Food' },
];

const COMMONS = [
  { icon: Compass, label: 'Nine realms on the ring', note: 'Capital, harbour, mines, deep forest' },
  { icon: ScrollText, label: 'Quests out in the field', note: 'Search the boulders and hollow trees' },
  { icon: Sparkles, label: 'Sports on Champion Isle', note: 'Sprint, tossing, racing and the choir' },
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
        video={HERO_VIDEO}
        imageAlt="Pine forests, mountains and the lamplit capital of the Republic of Goose at dusk"
        actions={[
          { to: '/world', label: 'Enter the Commons' },
          { to: '/country', label: 'Explore the Country', variant: 'ghost' },
        ]}
      />

      <Link
        to="/world"
        className="group relative block overflow-hidden rounded-md border border-primary/35 bg-card transition-colors hover:border-primary/70"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_50%,rgba(194,255,133,0.14),transparent_62%)]" />
        <div className="relative grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-primary" />
              <span className="meta-label">The National Commons</span>
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              Step outside and walk the Republic
            </h3>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-foreground/70">
              Your goose walks the meadow in real time — through the portals, past the neighbours&apos;
              doors and out to the lake. Hold Shift to sprint, and keep an eye on the sky.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {COMMONS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-sm border border-border/70 bg-secondary/50 px-3 py-2"
                >
                  <item.icon className="h-3.5 w-3.5 text-primary" />
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/85">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <span className="inline-flex items-center gap-2 justify-self-start rounded-sm bg-primary px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-primary-foreground transition-transform duration-200 group-hover:-translate-y-0.5 md:justify-self-end">
            Enter the Commons
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-md border border-border/80 bg-card px-4 py-6 text-center transition-colors hover:border-primary/50"
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
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