import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import Panel from '@/components/Panel';
import { base44 } from '@/api/base44Client';
import { useCitizen } from '@/hooks/useCitizen';
import StockRow from '@/components/market/StockRow';
import StockProfile from '@/components/market/StockProfile';

export default function Market() {
  const { citizen, signedIn, run } = useCitizen();
  const [market, setMarket] = useState(null);
  const [qty, setQty] = useState({});
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [profileSymbol, setProfileSymbol] = useState('');

  const loadMarket = async () => {
    try {
      const response = await base44.functions.invoke('citizen', { action: 'market' });
      setMarket(response?.data?.market ?? null);
    } catch (err) {
      setError('The exchange could not be reached.');
    }
  };

  useEffect(() => {
    loadMarket();
    const timer = setInterval(loadMarket, 30000);
    return () => clearInterval(timer);
  }, []);

  const setQuantity = (symbol, value) => {
    setQty((current) => ({ ...current, [symbol]: value }));
  };

  const trade = async (symbol, side) => {
    setBusy(`${symbol}:${side}`);
    setError('');
    setNote('');
    try {
      const shares = Math.floor(Number(qty[symbol] ?? 1)) || 1;
      const data = await run({ action: 'trade', symbol, shares, side });
      setNote(
        `${side === 'buy' ? 'Bought' : 'Sold'} ${shares} ${symbol} at 🍞 ${data.price} per share.`
      );
      await loadMarket();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const holdings = citizen?.holdings ?? [];
  const sharesOf = (symbol) =>
    holdings.find((holding) => holding.symbol === symbol)?.shares ?? 0;
  const avgOf = (symbol) =>
    holdings.find((holding) => holding.symbol === symbol)?.avg_price ?? 0;
  const profiled = market?.stocks.find((stock) => stock.symbol === profileSymbol) ?? null;

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <Panel>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="meta-label">Honkton Exchange</span>
            </div>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">The Goose Stock Market</h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-foreground/75">
              {market ? market.stocks.filter((stock) => stock.kind !== 'crypto').length : 'Eighteen'} goose
              listings and{' '}
              {market ? market.stocks.filter((stock) => stock.kind === 'crypto').length : 'six'} coins.
              Prices move once a minute for every citizen at the same time, so what you see is what
              the whole Republic sees.
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              {signedIn ? 'Bread in hand' : 'Not signed in'}
            </p>
            <p className="font-mono text-xl font-bold text-primary">
              🍞 {signedIn ? citizen.bread : '—'}
            </p>
            {market && (
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Next tick in {market.secondsToNextTick}s
              </p>
            )}
          </div>
        </div>

        {!signedIn && (
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <Link to="/passport" className="text-primary underline-offset-4 hover:underline">
              Sign in with your passport
            </Link>{' '}
            to trade.
          </p>
        )}

        {error && (
          <p role="alert" className="mt-4 font-mono text-[11px] text-[#FF6B4A]">
            {error}
          </p>
        )}
        {note && (
          <p className="mt-4 font-mono text-[11px] text-primary">{note}</p>
        )}
      </Panel>

      {market === null ? (
        <Panel>
          <p className="font-mono text-[11px] text-muted-foreground">Opening the exchange...</p>
        </Panel>
      ) : (
        <div className="space-y-4">
          {[
            { key: 'stock', title: 'Listed houses' },
            { key: 'crypto', title: 'Honkton coins' },
          ].map((group) => {
            const rows = market.stocks.filter((stock) =>
              group.key === 'crypto' ? stock.kind === 'crypto' : stock.kind !== 'crypto'
            );
            if (rows.length === 0) return null;
            return (
              <div
                key={group.key}
                className="overflow-hidden rounded-md border border-border/80 bg-card"
              >
                <p className="border-b border-border/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                  {group.title}
                </p>
                <div className="divide-y divide-border/60">
                  {rows.map((stock) => (
                    <StockRow
                      key={stock.symbol}
                      stock={stock}
                      shares={sharesOf(stock.symbol)}
                      qty={qty[stock.symbol] ?? 1}
                      onQty={setQuantity}
                      onTrade={trade}
                      busy={busy}
                      signedIn={signedIn}
                      onProfile={setProfileSymbol}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <StockProfile
        stock={profiled}
        open={Boolean(profiled)}
        onClose={() => setProfileSymbol('')}
        shares={profiled ? sharesOf(profiled.symbol) : 0}
        avgPrice={profiled ? avgOf(profiled.symbol) : 0}
        qty={profiled ? qty[profiled.symbol] ?? 1 : 1}
        onQty={setQuantity}
        onTrade={trade}
        busy={busy}
        signedIn={signedIn}
      />
    </div>
  );
}