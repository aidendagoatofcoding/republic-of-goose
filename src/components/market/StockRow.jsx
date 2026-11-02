import Sparkline from './Sparkline';

const formatPct = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

export default function StockRow({ stock, shares, qty, onQty, onTrade, busy, signedIn }) {
  const positive = stock.change >= 0;
  const value = shares * stock.price;

  return (
    <div className="grid gap-3 px-4 py-4 md:grid-cols-[1.6fr_1fr_1fr_auto] md:items-center">
      <div className="flex items-center gap-3">
        <Sparkline points={stock.history} positive={positive} />
        <div>
          <p className="font-mono text-[12px] font-bold tracking-[0.08em] text-foreground">
            {stock.symbol}
          </p>
          <p className="text-[13px] text-muted-foreground">{stock.name}</p>
        </div>
      </div>

      <div>
        <p className="font-mono text-[14px] text-foreground">🍞 {stock.price}</p>
        <p
          className="font-mono text-[10px]"
          style={{ color: positive ? 'hsl(var(--primary))' : '#FF6B4A' }}
        >
          {formatPct(stock.changePct)}
        </p>
      </div>

      <div className="font-mono text-[10.5px] leading-relaxed text-muted-foreground">
        {shares > 0 ? (
          <>
            <div className="text-foreground/80">{shares} shares</div>
            <div>worth 🍞 {value}</div>
          </>
        ) : (
          <div>No position</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          max="5000"
          value={qty}
          onChange={(event) => onQty(stock.symbol, event.target.value)}
          aria-label={`Shares of ${stock.symbol}`}
          className="w-16 rounded-sm border border-input bg-background/80 px-2 py-2 font-mono text-[11px] text-foreground"
        />
        <button
          onClick={() => onTrade(stock.symbol, 'buy')}
          disabled={!signedIn || busy || !stock.price}
          className="rounded-sm bg-primary px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-40"
        >
          {busy === `${stock.symbol}:buy` ? '...' : 'Buy'}
        </button>
        <button
          onClick={() => onTrade(stock.symbol, 'sell')}
          disabled={!signedIn || busy || shares < 1}
          className="rounded-sm border border-border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground disabled:opacity-40"
        >
          {busy === `${stock.symbol}:sell` ? '...' : 'Sell'}
        </button>
      </div>
    </div>
  );
}