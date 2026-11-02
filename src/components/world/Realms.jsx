const REALMS = [
  { name: 'Deep Forest', place: 'forest', glyph: '🌲', x: 7, y: 58 },
  { name: 'Portal to the Capital', place: 'capital', glyph: '🏛️', x: 30, y: 58 },
  { name: 'Bread Bakery', place: 'bakery', glyph: '🍞', x: 52, y: 58 },
  { name: 'The Exchange', place: 'exchange', glyph: '📈', x: 74, y: 58 },
];

export default function Realms({ onEnter }) {
  return (
    <>
      {REALMS.map((realm) => (
        <button
          key={realm.place}
          type="button"
          title={`${realm.name} — step through`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onEnter(realm.place);
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