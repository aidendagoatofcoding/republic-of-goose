import BankCounter from '@/components/bank/BankCounter';
import VaultStation from '@/components/bank/VaultStation';
import CapitalDoors from '@/components/world/interiors/CapitalDoors';
import Country from '@/pages/Country';
import Games from '@/pages/Games';
import Jobs from '@/pages/Jobs';
import Laws from '@/pages/Laws';
import Market from '@/pages/Market';
import News from '@/pages/News';
import ShopShelf from '@/components/shop/ShopShelf';

const ShopCatalogue = () => <ShopShelf category="all" />;

const CONTENT = {
  'bank-loans': BankCounter,
  'bank-vault': VaultStation,
  parliament: Laws,
  government: Country,
  exchange: Market,
  guild: ShopCatalogue,
  granary: Jobs,
  herald: News,
  bakery: Games,
};

export default function StationContent({ station, place, onEnterPlace, onExit }) {
  if (station.content === 'capital') {
    return <CapitalDoors onEnter={onEnterPlace} onExit={onExit} />;
  }
  if (station.content.startsWith('shop-')) {
    return <ShopShelf category={station.content.slice(5)} />;
  }
  const Piece = CONTENT[station.content];
  if (!Piece) {
    return <p className="text-[15px] leading-relaxed text-foreground/75">{place.blurb}</p>;
  }
  return <Piece />;
}