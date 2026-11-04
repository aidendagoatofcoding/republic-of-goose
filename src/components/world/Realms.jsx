import { REALMS } from '@/lib/realms';

export default function Realms({ onEnter, activeId = '' }) {
  return (
    <>
      {REALMS.map((realm) => {
        const active = activeId === realm.id;
        return (
          <button
            key={realm.id}
            type="button"
            title={`${realm.name} — press Enter to step through`}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onEnter(realm.id);
            }}
            style={{ left: `${realm.portal.x}%`, top: `${realm.portal.y}%` }}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <span
              className={`block text-2xl leading-none transition-transform ${
                active ? 'scale-110 drop-shadow-[0_0_10px_rgba(194,255,133,0.55)]' : 'opacity-90'
              }`}
              aria-hidden="true"
            >
              {realm.glyph}
            </span>
            <span
              className={`mt-1 block whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.12em] ${
                active ? 'text-primary' : 'text-primary/75'
              }`}
            >
              {active ? `⏎ Enter ${realm.portalLabel}` : realm.portalLabel}
            </span>
          </button>
        );
      })}
    </>
  );
}