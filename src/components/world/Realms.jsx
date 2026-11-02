import { useNavigate } from 'react-router-dom';

const REALMS = [
  { name: 'Deep Forest', path: '/country', glyph: '🌲', x: 7, y: 58 },
  { name: 'Capital of Honkton', path: '/', glyph: '🏛️', x: 30, y: 58 },
  { name: 'Bread Bakery', path: '/games', glyph: '🍞', x: 52, y: 58 },
  { name: 'The Exchange', path: '/market', glyph: '📈', x: 74, y: 58 },
];

export default function Realms() {
  const navigate = useNavigate();

  return (
    <>
      {REALMS.map((realm) => (
        <button
          key={realm.path}
          type="button"
          title={`Portal to ${realm.name}`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            navigate(realm.path);
          }}
          style={{ left: `${realm.x}%`, top: `${realm.y}%` }}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <span className="relative mx-auto flex h-16 w-16 items-center justify-center">
            <span className="portal-ring absolute inset-0 rounded-full" aria-hidden="true" />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/60 bg-background/85 text-xl">
              <span aria-hidden="true">{realm.glyph}</span>
            </span>
          </span>
          <span className="mt-1 block whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.12em] text-primary/80">
            {realm.name}
          </span>
        </button>
      ))}
    </>
  );
}