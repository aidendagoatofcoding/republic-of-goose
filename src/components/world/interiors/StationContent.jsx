import BankCounter from '@/components/bank/BankCounter';
import VaultStation from '@/components/bank/VaultStation';
import CapitalDoors from '@/components/world/interiors/CapitalDoors';
import Country from '@/pages/Country';
import Games from '@/pages/Games';
import Jobs from '@/pages/Jobs';
import JobBoard from '@/pages/JobBoard';
import Laws from '@/pages/Laws';
import Market from '@/pages/Market';
import News from '@/pages/News';
import ShopShelf from '@/components/shop/ShopShelf';
import KitchenStation from '@/components/world/interiors/KitchenStation';
import Citizenship from '@/pages/Citizenship';

const ShopCatalogue = () => <ShopShelf category="all" />;

const CONTENT = {
  'bank-loans': BankCounter,
  'bank-vault': VaultStation,
  parliament: Laws,
  government: Country,
  exchange: Market,
  guild: ShopCatalogue,
  granary: Jobs,
  'job-board': JobBoard,
  herald: News,
  bakery: Games,
  registry: Citizenship,
};

export default function StationContent({ station, place, onEnterPlace, onExit, onPlay }) {
  if (station.content === 'capital') {
    return <CapitalDoors onEnter={onEnterPlace} onExit={onExit} />;
  }
  if (station.content === 'kitchen') {
    return <KitchenStation station={station} onPlay={onPlay} />;
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