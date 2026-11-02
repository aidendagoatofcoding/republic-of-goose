import AreaZone from '@/components/world/areas/AreaZone';
import { AREAS } from '@/lib/commonsAreas';

export default function Areas({ activeId = '' }) {
  return (
    <>
      {AREAS.map((area) => (
        <AreaZone key={area.id} area={area} active={area.id === activeId} />
      ))}
    </>
  );
}