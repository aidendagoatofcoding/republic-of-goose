import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import { ARTICLES } from '@/lib/news';

const Headlines = () => (
  <div className="flex shrink-0 items-center gap-10 pr-10">
    {ARTICLES.map((article) => (
      <Link
        key={article.id}
        to="/news"
        className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/75 transition-colors hover:text-primary"
      >
        <span className="text-primary/70">{article.category}</span>
        <span className="mx-1.5 text-muted-foreground/60">·</span>
        {article.headline}
      </Link>
    ))}
  </div>
);

export default function NewsTicker() {
  return (
    <div className="flex items-stretch overflow-hidden border-b border-border/70 bg-card/50">
      <Link
        to="/news"
        className="relative z-10 flex shrink-0 items-center gap-1.5 border-r border-border/70 bg-primary/15 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-primary"
      >
        <Newspaper className="h-3 w-3" />
        <span className="hidden sm:inline">Honk Herald</span>
      </Link>
      <div className="relative flex-1 overflow-hidden">
        <div className="news-ticker flex w-max items-center py-1.5">
          <Headlines />
          <Headlines />
        </div>
      </div>
    </div>
  );
}