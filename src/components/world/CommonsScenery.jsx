import { memo } from 'react';
import MeadowGround from '@/components/world/MeadowGround';
import AbandonedRailway from '@/components/world/AbandonedRailway';
import SpawnCircle from '@/components/world/SpawnCircle';
import Roads from '@/components/world/Roads';
import NeighbourHouses from '@/components/world/NeighbourHouses';

// The fixed furniture of the Commons. None of it changes, so it is drawn once and
// never re-rendered while somebody walks across the meadow.
const CommonsScenery = memo(function CommonsScenery() {
  return (
    <>
      <MeadowGround />
      <AbandonedRailway />
      <SpawnCircle />
      <Roads />
      <NeighbourHouses />
    </>
  );
});

export default CommonsScenery;