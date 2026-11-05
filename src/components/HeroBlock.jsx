import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function HeroBlock({
  eyebrow,
  title,
  description,
  motto,
  image,
  imageAlt,
  video,
  actions = [],
}) {
  return (
    <section className="relative overflow-hidden rounded-md border border-border/80 bg-secondary">
      {video ? (
        <video
          src={video}
          poster={image}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image src={image} alt={imageAlt} className="absolute inset-0 h-full w-full" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

      <div className="relative max-w-3xl px-6 py-16 md:px-12 md:py-24">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-primary" />
          <span className="meta-label text-primary">{eyebrow}</span>
        </div>

        <h2 className="display-title mt-5 text-4xl sm:text-5xl md:text-7xl">{title}</h2>

        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-foreground/75">{description}</p>

        {motto && (
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.28em] text-primary/90">
            {motto}
          </p>
        )}

        {actions.length > 0 && (
          <div className="mt-9 flex flex-wrap gap-3">
            {actions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className={
                  action.variant === 'ghost'
                    ? 'inline-flex items-center gap-2 rounded-sm border border-border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/70 hover:text-primary'
                    : 'inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5'
                }
              >
                {action.label}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}