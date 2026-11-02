import AreaZone from '@/components/world/areas/AreaZone';
import CivicBuilding from '@/components/world/areas/CivicBuilding';
import { AREAS } from '@/lib/commonsAreas';

export default function Areas({ activeId = '' }) {
  return (
    <>
      {AREAS.map((area) => (
        <AreaZone key={area.id} area={area} active={area.id === activeId} />
      ))}
      {AREAS.flatMap((area) =>
        area.buildings.map((building) => (
          <CivicBuilding key={building.id} building={building} />
        ))
      )}
    </>
  );
}