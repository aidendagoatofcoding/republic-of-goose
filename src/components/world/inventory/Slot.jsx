// One inventory socket, drawn with the raised bevel of a game pack slot.
export default function Slot({ emoji, count, title, selected = false, empty = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={empty || !onClick}
      title={title}
      className={`relative flex h-11 w-11 items-center justify-center border-2 transition-colors sm:h-12 sm:w-12 ${
        selected
          ? 'border-[#f2f6ef] bg-[#59634f] shadow-[inset_2px_2px_0_#7b8669,inset_-2px_-2px_0_#252a20]'
          : 'border-[#0f120e] bg-[#39402f] shadow-[inset_2px_2px_0_#5a6250,inset_-2px_-2px_0_#1c2017]'
      } ${onClick && !empty ? 'hover:bg-[#4b5442]' : ''}`}
    >
      {!empty && <span className="text-[19px] leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">{emoji}</span>}
      {!empty && count > 1 && (
        <span className="pointer-events-none absolute bottom-0 right-0.5 font-mono text-[11px] font-bold text-[#f6f8f3] drop-shadow-[1px_1px_0_#000000]">
          {count}
        </span>
      )}
    </button>
  );
}