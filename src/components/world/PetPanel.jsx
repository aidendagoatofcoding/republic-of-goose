const ACTIONS = [
  { id: 'feed', label: 'Feed', reply: 'Nom nom nom. The bowl is empty again already.' },
  { id: 'pat', label: 'Pat', reply: 'A happy little rumble, then a honk.' },
  { id: 'fetch', label: 'Fetch', reply: 'Off it goes and back it comes, twice as muddy.' },
];

export default function PetPanel({ pet, onAction, onClose }) {
  if (!pet) return null;

  return (
    <div className="absolute bottom-3 left-1/2 z-50 w-[268px] max-w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-sm border border-primary/45 bg-card/95 p-3 shadow-xl">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-primary">Your companion</p>
          <p className="font-display text-base leading-tight text-foreground">
            {pet.emoji} {pet.name}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[9px] uppercase text-muted-foreground hover:text-primary"
        >
          Close
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => onAction(action.reply)}
            className="rounded-sm border border-primary/40 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-primary hover:bg-primary/10"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}