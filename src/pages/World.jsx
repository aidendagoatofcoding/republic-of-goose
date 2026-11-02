import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import Panel from '@/components/Panel';
import { base44 } from '@/api/base44Client';
import { useCitizen } from '@/hooks/useCitizen';
import WorldScene from '@/components/world/WorldScene';
import CommonsPalette from '@/components/world/CommonsPalette';
import TradePanel from '@/components/world/TradePanel';

export default function World() {
  const { citizen, signedIn, run } = useCitizen();
  const [world, setWorld] = useState(null);
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(null);
  const [offers, setOffers] = useState({ incoming: [], outgoing: [] });
  const [offerBusy, setOfferBusy] = useState('');
  const [offerError, setOfferError] = useState('');
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
    <div className="mx-auto max-w-6xl space-y-4">
      <Panel>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="meta-label">Community Land</span>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">The Honk Commons</h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-foreground/75">
              One meadow, everyone in it. Walk your animal with the arrow keys or by tapping the
              grass, honk at neighbours you meet, knock on their doors, and drag your own house,
              vehicles and pets anywhere on the map. Other citizens appear here live as they wander.
            </p>          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                {signedIn ? 'Bread in hand' : 'Not signed in'}
              </p>
              <p className="font-mono text-xl font-bold text-primary">
                🍞 {signedIn ? citizen.bread : '—'}
              </p>
            </div>
            <button
              type="button"
              onClick={load}
              className="rounded-sm border border-border p-2 text-muted-foreground hover:text-primary"
              aria-label="Refresh the Commons"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!signedIn && (
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <Link to="/passport" className="text-primary underline-offset-4 hover:underline">
              Sign in with your passport
            </Link>{' '}
            to place your own home and pets.
          </p>
        )}

        {error && (
          <p role="alert" className="mt-4 font-mono text-[11px] text-[#FF6B4A]">
            {error}
          </p>
        )}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        {world === null ? (
          <Panel>
            <p className="font-mono text-[11px] text-muted-foreground">Walking out to the meadow...</p>
          </Panel>
        ) : (
          <WorldScene
            residents={world.residents}
            onMove={move}
            placing={placing}
            onPlace={place}
            onCancelPlace={() => setPlacing(null)}
            run={run}
            onOffersChanged={setOffers}
            profile={{
              name: citizen?.goose_name || citizen?.full_name || 'You',
              species: citizen?.species || 'goose',
              worn: citizen?.worn || [],
            }}
          />
        )}

        <div className="space-y-4">
          {signedIn && world?.mine && (
            <CommonsPalette
              items={world.mine.items}
              placingId={placing?.item_id || ''}
              onPlace={setPlacing}
              onCancel={() => setPlacing(null)}
            />
          )}
          {signedIn && (
            <TradePanel
              offers={offers}
              busyId={offerBusy}
              error={offerError}
              onReply={replyOffer}
              onWithdraw={withdrawOffer}
              onRefresh={loadOffers}
            />
          )}
        </div>
      </div>
    </div>
  );
}