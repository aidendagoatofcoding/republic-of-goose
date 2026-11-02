import { Building2, MapPin, ShieldQuestion, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Sparkline from './Sparkline';
import { profileFor } from '@/lib/stockProfiles';

const pct = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

export default function StockProfile({
  stock,
  open,
  onClose,
  shares = 0,
  avgPrice = 0,
  qty,
  onQty,
  onTrade,
  busy,
  signedIn,
}) {
  if (!stock) return null;
  const profile = profileFor(stock.symbol);
  const positive = stock.change >= 0;
  const high = Math.max(...stock.history);
  const low = Math.min(...stock.history);
  const marketCap = stock.price * profile.sharesOutstanding;
  const positionValue = shares * stock.price;
  const profit = shares > 0 ? positionValue - shares * avgPrice : 0;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto border-border bg-card">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
                {stock.symbol} · {profile.sector}
              </p>
              <DialogTitle className="display-title mt-2 text-2xl">{stock.name}</DialogTitle>
              <DialogDescription className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Listed on the Honkton Exchange
              </DialogDescription>
            </div>
            <div className="text-right">
              <p className="font-mono text-xl font-bold text-foreground">🍞 {stock.price}</p>
              <p
                className="font-mono text-[11px]"
                style={{ color: positive ? 'hsl(var(--primary))' : '#FF6B4A' }}
              >
                {pct(stock.changePct)} this tick
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-2 flex items-center gap-4 rounded-sm border border-border/70 bg-background/40 px-3 py-2">
          <Sparkline points={stock.history} positive={positive} />
          <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>20-tick high <span className="text-foreground/80">{high}</span></span>
            <span>20-tick low <span className="text-foreground/80">{low}</span></span>
            <span>Dividend <span className="text-foreground/80">{profile.dividend}</span></span>
            <span>Risk <span className="text-foreground/80">{profile.risk}</span></span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-[14.5px] leading-relaxed text-foreground/80">{profile.summary}</p>
          {profile.highlights.length > 0 && (
            <ul className="space-y-1.5">
              {profile.highlights.map((line) => (
                <li
                  key={line}
                  className="flex gap-2 font-mono text-[10.5px] leading-relaxed text-muted-foreground"
                >
                  <span className="text-primary">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:grid-cols-4">
          <span className="flex items-center gap-1.5">
            <Building2 className="h-3 w-3 text-primary" /> {profile.founded}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-primary" /> {profile.hq}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3 w-3 text-primary" /> {profile.employees.toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldQuestion className="h-3 w-3 text-primary" /> {profile.ceo}
          </span>
        </div>

        <p className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground">
          Market value 🍞 {marketCap.toLocaleString()} · {profile.sharesOutstanding.toLocaleString()}{' '}
          shares issued
        </p>

        <div className="mt-5 rounded-sm border border-border/70 bg-background/40 p-4">
          <p className="meta-label">Your position</p>
          {shares > 0 ? (
            <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[11px] text-foreground/80 sm:grid-cols-3">
              <span>{shares} shares</span>
              <span>Worth 🍞 {positionValue.toLocaleString()}</span>
              <span style={{ color: profit >= 0 ? 'hsl(var(--primary))' : '#FF6B4A' }}>
                {profit >= 0 ? 'Up' : 'Down'} 🍞 {Math.abs(Math.round(profit)).toLocaleString()}
              </span>
            </div>
          ) : (
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">
              No shares of {stock.symbol} held.
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              type="number"
              min="1"
              max="5000"
              value={qty}
              onChange={(event) => onQty(stock.symbol, event.target.value)}
              aria-label={`Shares of ${stock.symbol}`}
              className="w-20 rounded-sm border border-input bg-background/80 px-2 py-2 font-mono text-[11px] text-foreground"
            />
            <button
              type="button"
              onClick={() => onTrade(stock.symbol, 'buy')}
              disabled={!signedIn || busy}
              className="rounded-sm bg-primary px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-40"
            >
              {busy === `${stock.symbol}:buy` ? '...' : 'Buy'}
            </button>
            <button
              type="button"
              onClick={() => onTrade(stock.symbol, 'sell')}
              disabled={!signedIn || busy || shares < 1}
              className="rounded-sm border border-border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground disabled:opacity-40"
            >
              {busy === `${stock.symbol}:sell` ? '...' : 'Sell'}
            </button>
            {!signedIn && (
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Sign in to trade
              </span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}