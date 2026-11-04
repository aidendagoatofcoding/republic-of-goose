import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useCitizen } from '@/hooks/useCitizen';
import WorldScene from '@/components/world/WorldScene';
import CommonsPalette from '@/components/world/CommonsPalette';
import CommonsMenu from '@/components/world/CommonsMenu';
import { levelFromXp } from '@/lib/swords';

export default function World() {
  const { citizen, signedIn, run } = useCitizen();
  const [world, setWorld] = useState(null);
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(null);
  const [offers, setOffers] = useState({ incoming: [], outgoing: [] });
  const [offerBusy, setOfferBusy] = useState('');
  const [offerError, setOfferError] = useState('');
  const [boards, setBoards] = useState({});
  const [personal, setPersonal] = useState({});
  const [boardsLoading, setBoardsLoading] = useState(true);
  const [boardsError, setBoardsError] = useState('');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const code = citizen?.passport_code || '';

  const load = useCallback(async () => {
    try {
      const response = await base44.functions.invoke('citizen', { action: 'world', code });
      setWorld(response?.data || { residents: [], mine: null });
    } catch (err) {
      setError(err?.response?.data?.error || 'The Commons could not be opened.');
      setWorld({ residents: [], mine: null });
    }
  }, [code]);

  useEffect(() => {
    load();
  }, [load]);

  const loadOffers = useCallback(async () => {
    if (!signedIn) {
      setOffers({ incoming: [], outgoing: [] });
      return;
    }
    try {
      const data = await run({ action: 'offers' });
      setOffers(data.offers || { incoming: [], outgoing: [] });
    } catch (err) {
      setOffers({ incoming: [], outgoing: [] });
    }
  }, [signedIn, run]);

  useEffect(() => {
    loadOffers();
    if (!signedIn) return undefined;
    const timer = setInterval(loadOffers, 20000);
    return () => clearInterval(timer);
  }, [loadOffers, signedIn]);

  const loadBoards = useCallback(async () => {
    setBoardsLoading(true);
    try {
      const response = await base44.functions.invoke('citizen', { action: 'leaderboard', code });
      setBoards(response?.data?.boards || {});
      setPersonal(response?.data?.personal || {});
      setBoardsError('');
    } catch (err) {
      setBoardsError('The standings could not be read.');
    } finally {
      setBoardsLoading(false);
    }
  }, [code]);

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  const replyOffer = async (offer, accept) => {
    setOfferBusy(offer.id);
    setOfferError('');
    try {
      const data = await run({ action: 'replyOffer', offer_id: offer.id, accept });
      setOffers(data.offers || { incoming: [], outgoing: [] });
      await load();
    } catch (err) {
      setOfferError(err.message);
    } finally {
      setOfferBusy('');
    }
  };

  const withdrawOffer = async (offer) => {
    setOfferBusy(offer.id);
    setOfferError('');
    try {
      const data = await run({ action: 'withdrawOffer', offer_id: offer.id });
      setOffers(data.offers || { incoming: [], outgoing: [] });
    } catch (err) {
      setOfferError(err.message);
    } finally {
      setOfferBusy('');
    }
  };

  const move = async (itemId, x, y) => {
    if (!signedIn) return;
    setError('');
    try {
      await run({ action: 'placeSpot', item_id: itemId, x, y });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const place = async (x, y) => {
    if (!placing) return;
    const item = placing;
    setPlacing(null);
    await move(item.item_id, x, y);
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-background">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-card/95 px-3 py-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground sm:inline">
            Community Land
          </span>
          <h1 className="truncate font-display text-lg font-bold">The Honk Commons</h1>
          {world && (
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground md:inline">
              walk with W A S D or the arrow keys
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {error && (
            <span role="alert" className="font-mono text-[10px] text-[#FF6B4A]">
              {error}
            </span>
          )}
          {!signedIn && (
            <Link
              to="/passport"
              className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          )}
          <CommonsMenu
            offerCount={offers.incoming.length}
            offers={offers}
            busyId={offerBusy}
            tradeError={offerError}
            onReply={replyOffer}
            onWithdraw={withdrawOffer}
            onRefreshTrades={loadOffers}
            boards={boards}
            personal={personal}
            myKey={citizen?.id || ''}
            boardsLoading={boardsLoading}
            boardsError={boardsError}
            onRefreshBoards={loadBoards}
          />
          <span className="font-mono text-[11px] font-bold text-primary">
            🍞 {signedIn ? citizen.bread : '—'}
          </span>
          {signedIn && (
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              Lv {levelFromXp(citizen.xp)} · {citizen.xp ?? 0} xp
            </span>
          )}
          {signedIn && world?.mine && (
            <button
              type="button"
              onClick={() => setPaletteOpen((value) => !value)}
              className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] ${
                paletteOpen
                  ? 'border-primary/60 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Package className="h-3 w-3" />
              <span className="hidden sm:inline">My items</span>
            </button>
          )}
          <button
            type="button"
            onClick={load}
            className="rounded-sm border border-border p-1.5 text-muted-foreground hover:text-primary"
            aria-label="Refresh the Commons"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <Link
            to="/"
            className="rounded-sm border border-border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            Leave
          </Link>
        </div>
      </header>

      <div className="relative flex-1 overflow-hidden">
        {world === null ? (
          <div className="flex h-full items-center justify-center">
            <p className="font-mono text-[11px] text-muted-foreground">
              Walking out to the meadow...
            </p>
          </div>
        ) : (
          <WorldScene
            residents={world.residents}
            placing={placing}
            onPlace={place}
            run={run}
            onOffersChanged={setOffers}
            onBoards={setBoards}
            boards={boards}
            profile={{
              name: citizen?.goose_name || citizen?.full_name || 'You',
              species: citizen?.species || 'goose',
              worn: citizen?.worn || [],
              finds: citizen?.finds || [],
              quests: citizen?.quests || [],
            }}
          />
        )}

        {signedIn && paletteOpen && world?.mine && (
          <div className="absolute right-2 top-2 z-40 w-[268px] max-w-[calc(100%-1rem)]">
            <CommonsPalette
              items={world.mine.items}
              placingId={placing?.item_id || ''}
              onPlace={setPlacing}
              onCancel={() => setPlacing(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}