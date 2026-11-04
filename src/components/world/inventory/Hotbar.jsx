import { Backpack } from 'lucide-react';
import Slot from '@/components/world/inventory/Slot';

// The quick bar lifted clear of the bottom of the meadow, with the pack behind it.
export default function Hotbar({ slots, selected, onSelect, onOpen }) {
  const current = slots[selected] && !slots[selected].empty ? slots[selected] : null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[5rem] z-[38] flex flex-col items-center gap-1.5">
      {current && (
        <span className="whitespace-nowrap border border-[#0f120e] bg-[#14180f]/92 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#eef2e6] shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
          {current.title}
          {current.count ? ` · ${current.count}` : ''}
        </span>
      )}

      <div className="pointer-events-auto flex items-center gap-1 border-2 border-[#0b0e09] bg-[#22261f]/95 p-1 shadow-[0_12px_28px_rgba(0,0,0,0.65),inset_2px_2px_0_#3b4235,inset_-2px_-2px_0_#11140f]">
        {slots.map((slot, index) => (
          <span key={slot.key} className="relative">
            <Slot
              emoji={slot.emoji}
              count={slot.count}
              title={`${index + 1} · ${slot.title}`}
              selected={index === selected}
              empty={slot.empty}
              onClick={slot.empty ? undefined : () => onSelect(index)}
            />
            <span className="pointer-events-none absolute -top-1 left-0.5 font-mono text-[7px] text-[#c9d3bd] opacity-70">
              {index + 1}
            </span>
          </span>
        ))}

        <button
          type="button"
          onClick={onOpen}
          title="Open your pack · E"
          className="ml-0.5 flex h-11 w-11 flex-col items-center justify-center gap-0.5 border-2 border-[#0b0e09] bg-[#3d4636] shadow-[inset_2px_2px_0_#606b52,inset_-2px_-2px_0_#1a1e15] hover:bg-[#4d5744] sm:h-12 sm:w-12"
        >
          <Backpack className="h-4 w-4 text-[#f2d68b]" />
          <span className="font-mono text-[8px] leading-none text-[#dfe6d5]">E</span>
        </button>
      </div>
    </div>
  );
}