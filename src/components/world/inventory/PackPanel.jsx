import { useState } from 'react';
import { Coins, MapPin, X } from 'lucide-react';
import Slot from '@/components/world/inventory/Slot';

const GRID = 27;
// Homes, vehicles, pets and furniture can be set down out in the Commons.
const PLACEABLE = ['home', 'vehicle', 'pet', 'furniture'];

// The pack itself, laid out like a survival inventory: sockets, a quick bar and a
// detail panel for whatever is selected.
export default function PackPanel({ citizen, stats, owned, busy, note, onClose, onRig, onSell }) {
  const [picked, setPicked] = useState(null);
  const item = owned.find((entry) => entry.id === picked) || null;
  const rigged = item ? (citizen.gear ?? []).includes(item.id) : false;
  const empty = Array.from({ length: Math.max(0, GRID - owned.length) });

  return (
    <div className="fixed inset-0 z-[62] flex items-center justify-center bg-black/75 p-3">
      <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto border-2 border-[#0b0e09] bg-[#2c3129] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.7),inset_2px_2px_0_#4a5340,inset_-2px_-2px_0_#12150f] sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-xl font-bold text-[#f2f6ef]">Your pack</p>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#b9c4ac]">
              {citizen.goose_name || citizen.full_name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 border-2 border-[#0b0e09] bg-[#39402f] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#dfe6d5] shadow-[inset_2px_2px_0_#5a6250] hover:bg-[#4b5442]"
          >
            <X className="h-3 w-3" /> E
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-1 border-t-2 border-[#12150f] pt-3">
          {stats.map((stat) => (
            <span key={stat.key} className="relative">
              <Slot emoji={stat.emoji} count={stat.count} title={stat.title} />
            </span>
          ))}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_216px]">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#b9c4ac]">
              Things you own · {owned.length}/{GRID}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {owned.map((entry) => (
                <Slot
                  key={entry.id}
                  emoji={entry.emoji}
                  count={1}
                  title={entry.name}
                  selected={picked === entry.id}
                  onClick={() => setPicked(entry.id)}
                />
              ))}
              {empty.map((_, index) => (
                <Slot key={`empty-${index}`} empty />
              ))}
            </div>
            {owned.length === 0 && (
              <p className="mt-2 text-[13px] text-[#c8d2bd]">
                Nothing yet. The e-shop sells homes, boats, pets and decorations.
              </p>
            )}
          </div>

          <div className="border-2 border-[#0b0e09] bg-[#23281f] p-2.5 shadow-[inset_2px_2px_0_#3d4536]">
            {item ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-[#f2f6ef]">{item.name}</p>
                    <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#a9b59c]">
                      {item.worn ? 'worn' : item.slot ? `${item.slot} tackle` : 'in the meadow'}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.slot && (
                    <button
                      type="button"
                      disabled={busy === item.id}
                      onClick={() => onRig(item, rigged)}
                      className={`border-2 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] disabled:opacity-50 ${
                        rigged
                          ? 'border-[#c2ff85] bg-[#c2ff85]/20 text-[#c2ff85] shadow-[inset_2px_2px_0_rgba(255,255,255,0.15)]'
                          : 'border-[#0b0e09] bg-[#39402f] text-[#dfe6d5] shadow-[inset_2px_2px_0_#5a6250]'
                      }`}
                    >
                      {rigged ? 'Rigged' : 'Rig on the line'}
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busy === item.id}
                    onClick={() => onSell(item)}
                    className="flex items-center gap-1 border-2 border-[#0b0e09] bg-[#39402f] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#f2d68b] shadow-[inset_2px_2px_0_#5a6250] hover:bg-[#4b5442] disabled:opacity-50"
                  >
                    <Coins className="h-3 w-3" /> {item.refund}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-[12px] leading-relaxed text-[#a9b59c]">
                Pick something from your pack to rig it or sell it back for four fifths of its price.
              </p>
            )}

            {note && (
              <p className="mt-2 border border-[#c2ff85]/40 bg-[#c2ff85]/10 px-2 py-1 font-mono text-[9px] leading-snug text-[#d8ffb0]">
                {note}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}