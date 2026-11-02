import InteriorScene from '@/components/world/interiors/InteriorScene';
import { PLACES } from '@/lib/places';

export default function BankRoom() {
  return (
    <div className="relative -mx-4 -mb-24 -mt-8 h-[calc(100dvh-8rem)] min-h-[540px] overflow-hidden border-y border-border md:-mx-10 md:-mt-10">
      <InteriorScene place={PLACES.bank} exitLink="/world" />
    </div>
  );
}