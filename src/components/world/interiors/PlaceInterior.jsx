import InteriorScene from '@/components/world/interiors/InteriorScene';

export default function PlaceInterior({ place, onEnterPlace, onExit, onPlay, arenaBus }) {
  if (!place) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#070b08]">
      <InteriorScene
        place={place}
        onEnterPlace={onEnterPlace}
        onExit={onExit}
        onPlay={onPlay}
        arenaBus={arenaBus}
      />
    </div>
  );
}