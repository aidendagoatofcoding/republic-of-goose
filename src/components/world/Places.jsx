import HonkLake from '@/components/world/places/HonkLake';
import WheatReserve from '@/components/world/places/WheatReserve';
import PineGrove from '@/components/world/places/PineGrove';
import StoneQuarry from '@/components/world/places/StoneQuarry';
import OldTown from '@/components/world/places/OldTown';

export default function Places() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <HonkLake />
      <WheatReserve />
      <PineGrove />
      <StoneQuarry />
      <OldTown />
    </div>
  );
}