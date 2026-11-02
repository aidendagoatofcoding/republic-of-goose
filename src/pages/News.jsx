import Panel from '@/components/Panel';
import { ARTICLES } from '@/lib/news';

export default function News() {
  const [lead, ...rest] = ARTICLES;

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <Panel>
        <span className="meta-label">The Goose Gazette · Honkton</span>
        <h2 className="display-title mt-3 text-3xl md:text-5xl">{lead.headline}</h2>
        <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-foreground/80">
          {lead.standfirst}
        </p>
        <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          {lead.category} · {lead.byline} · {lead.date}
        </p>
        <div className="mt-6 max-w-3xl space-y-3">
          {lead.body.map((paragraph) => (
            <p key={paragraph} className="text-[16px] leading-relaxed text-foreground/70">
              {paragraph}
            </p>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rest.map((article) => (
          <article key={article.id} className="rounded-md border border-border/80 bg-card p-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
              {article.category}
            </span>
            <h3 className="mt-3 font-display text-2xl font-bold leading-tight">
              {article.headline}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground/70">
              {article.standfirst}
            </p>
            <div className="mt-4 space-y-2">
              {article.body.slice(0, 2).map((paragraph) => (
                <p key={paragraph} className="text-[14.5px] leading-relaxed text-foreground/60">
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              {article.byline} · {article.date}
            </p>
          </article>
        ))}
      </div>

      <p className="px-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        The Goose Gazette is a fictional newspaper of the Republic of Goose. Nothing here is real,
        including the war on the ducks.
      </p>
    </div>
  );
}