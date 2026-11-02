import { Link } from 'react-router-dom';

const CATEGORY = { home: 'Home', vehicle: 'Vehicle', pet: 'Pet' };

function OfferRow({ offer, tone, children }) {
  return (
    <li className="flex items-start justify-between gap-2 border-b border-border/50 pb-2 last:border-0">
      <span className="flex min-w-0 items-start gap-2">
        <span className="text-lg leading-none" aria-hidden="true">
          {offer.item_emoji}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-mono text-[11px] text-foreground">
            {offer.item_name}
          </span>
          <span className="block font-mono text-[8.5px] uppercase tracking-[0.12em] text-muted-foreground">
            {CATEGORY[offer.item_category] || 'Item'} · 🍞 {offer.amount} · {tone}
          </span>
        </span>
      </span>
      <span className="flex shrink-0 gap-1.5">{children}</span>
    </li>
  );
}

export default function TradePanel({
  offers,
  busyId,
  error,
  onReply,
  onWithdraw,
  onRefresh,
}) {
  const incoming = offers?.incoming ?? [];
  const outgoing = offers?.outgoing ?? [];
  const empty = incoming.length === 0 && outgoing.length === 0;

  return (
    <section className="rounded-md border border-border/80 bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="meta-label">Trading post</span>
          <h3 className="display-title mt-2 text-xl">Item offers</h3>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-sm border border-border px-2 py-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
        >
          Refresh
        </button>
      </div>

      <p className="mt-2 text-[14px] leading-relaxed text-foreground/70">
        Tap a neighbour's house, pet or vehicle in the meadow to offer bread for it. Sellers answer
        here.
      </p>

      {error && (
        <p role="alert" className="mt-3 font-mono text-[10.5px] text-[#FF6B4A]">
          {error}
        </p>
      )}

      {empty ? (
        <p className="mt-3 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.12em] text-muted-foreground">
          No open offers. Visit the meadow and make one.
        </p>
      ) : (
        <div className="mt-3 space-y-4">
          {incoming.length > 0 && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
                Offers for your items
              </p>
              <ul className="mt-2 space-y-2">
                {incoming.map((offer) => (
                  <OfferRow key={offer.id} offer={offer} tone={`from ${offer.from_name}`}>
                    <button
                      type="button"
                      onClick={() => onReply(offer, true)}
                      disabled={busyId === offer.id}
                      className="rounded-sm bg-primary px-2 py-1 font-mono text-[8.5px] font-bold uppercase tracking-[0.12em] text-primary-foreground disabled:opacity-50"
                    >
                      {busyId === offer.id ? '...' : 'Accept'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onReply(offer, false)}
                      disabled={busyId === offer.id}
                      className="rounded-sm border border-border px-2 py-1 font-mono text-[8.5px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      No
                    </button>
                  </OfferRow>
                ))}
              </ul>
            </div>
          )}

          {outgoing.length > 0 && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#D4AF37]">
                Offers you sent
              </p>
              <ul className="mt-2 space-y-2">
                {outgoing.map((offer) => (
                  <OfferRow key={offer.id} offer={offer} tone={`to ${offer.to_name}`}>
                    <button
                      type="button"
                      onClick={() => onWithdraw(offer)}
                      disabled={busyId === offer.id}
                      className="rounded-sm border border-border px-2 py-1 font-mono text-[8.5px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      {busyId === offer.id ? '...' : 'Withdraw'}
                    </button>
                  </OfferRow>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <p className="mt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-muted-foreground">
        Decorations stay with their wearer and cannot be traded.{' '}
        <Link to="/shop" className="text-primary underline-offset-4 hover:underline">
          E-Shop
        </Link>
      </p>
    </section>
  );
}