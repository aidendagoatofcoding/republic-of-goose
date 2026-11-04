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
            <span className="relative mx-auto flex h-16 w-16 items-center justify-center">
              <span
                className={`relative flex h-11 w-11 items-center justify-center rounded-full border text-xl ${
                  active
                    ? 'border-primary bg-primary/20 shadow-[0_0_20px_rgba(190,242,100,0.3)]'
                    : 'border-primary/60 bg-background/85'
                }`}
              >
                <span aria-hidden="true">{realm.glyph}</span>
              </span>
            </span>
            <span
              className={`mt-1 block whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.12em] ${
                active ? 'text-primary' : 'text-primary/80'
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