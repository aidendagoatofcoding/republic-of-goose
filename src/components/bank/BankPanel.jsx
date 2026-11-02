import { X } from 'lucide-react';

export default function BankPanel({ title, onClose, children }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-40 max-h-[76%] overflow-y-auto border-t border-primary/35 bg-background/97 px-3 py-4 backdrop-blur-sm sm:px-5">
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
            {title}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
          >
            <X className="h-3 w-3" /> Step back
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}