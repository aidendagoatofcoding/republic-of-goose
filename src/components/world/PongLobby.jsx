export default function PongLobby({
  people,
  seat,
  incoming,
  notice,
  active,
  onChallenge,
  onAccept,
  onDecline,
}) {
  const others = people.filter((person) => person.seat !== seat);

  return (
    <section className="rounded-md border border-border/80 bg-card p-5">
      <span className="meta-label">Champion Isle</span>
      <h3 className="display-title mt-2 text-xl">Pond Pong</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-foreground/70">
        The island's opening sport. Two paddles, one pond, first to five takes the ribbon. Both
        citizens need the Commons open.
      </p>

      {incoming && (
        <div className="mt-3 rounded-sm border border-primary/50 bg-primary/5 p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
            {incoming.name} challenges you
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={onAccept}
              className="rounded-sm bg-primary px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-primary-foreground"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={onDecline}
              className="rounded-sm border border-border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {notice && (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {notice}
        </p>
      )}

      {active ? (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
          Match in progress against {active.opponentName}
        </p>
      ) : others.length === 0 ? (
        <p className="mt-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-muted-foreground">
          No other citizen is in the meadow right now.
        </p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {others.map((person) => (
            <li key={person.seat} className="flex items-center justify-between gap-2">
              <span className="truncate font-mono text-[11px] text-foreground/85">
                {person.name}
              </span>
              <button
                type="button"
                onClick={() => onChallenge(person)}
                className="shrink-0 rounded-sm border border-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:border-primary/60 hover:text-primary"
              >
                Challenge
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}