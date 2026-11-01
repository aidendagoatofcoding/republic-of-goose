import { useState } from 'react';
import { Save, Trash2, Pencil, Plus } from 'lucide-react';
import { toRoman } from '@/lib/numerals';

export default function LawManager({ laws, run }) {
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
  };

  const persistId = (id) => (id && !String(id).startsWith('default-') ? id : null);

  const save = async () => {
    setBusy(true);
    setStatus('');
    try {
      await run('saveLaw', { law: { id: persistId(editingId), title, description } });
      resetForm();
      setStatus('The constitution has been updated.');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    setBusy(true);
    setStatus('');
    try {
      await run('deleteLaw', { id });
      if (editingId === id) resetForm();
      setStatus('Article removed from the constitution.');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (law) => {
    setEditingId(law.id);
    setTitle(law.title);
    setDescription(law.description);
    setStatus('');
  };

  return (
    <section className="rounded-md border border-[#D4AF37]/40 bg-card p-6 md:p-8">
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#D4AF37]">
        Directive 02 · National Laws
      </span>

      <div className="mt-5 divide-y divide-border/60 border border-border/60">
        {laws.map((law, index) => (
          <div key={law.id || law.title} className="flex flex-wrap items-start justify-between gap-3 p-3">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground">
                Article {toRoman(index + 1)} — {law.title}
              </p>
              <p className="mt-1 font-mono text-[10.5px] leading-relaxed text-muted-foreground">
                {law.description}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(law)}
                className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button
                onClick={() => remove(law.id)}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-sm border border-[#FF6B4A]/50 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#FF6B4A] disabled:opacity-50"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </div>
        ))}
        {laws.length === 0 && (
          <p className="p-3 font-mono text-[11px] text-muted-foreground">
            No laws have been added yet.
          </p>
        )}
      </div>

      <h4 className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-[#D4AF37]">
        {editingId ? 'Edit article' : 'Add an article'}
      </h4>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Law title (e.g. Bread Protection Act)"
        className="mt-3 w-full rounded-sm border border-input bg-background/80 px-4 py-3 font-mono text-[13px] text-foreground placeholder:text-muted-foreground/60"
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        rows={3}
        placeholder="Describe the law..."
        className="mt-2 w-full resize-y rounded-sm border border-input bg-background/80 px-4 py-3 font-mono text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground/60"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          onClick={save}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-sm bg-[#D4AF37] px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#0A0F0D] disabled:opacity-50"
        >
          {editingId ? <Save className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          {busy ? 'Transmitting...' : editingId ? 'Save Changes' : 'Add Law'}
        </button>
        {editingId && (
          <button
            onClick={resetForm}
            className="rounded-sm border border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
          >
            Cancel Edit
          </button>
        )}
        {status && <span className="font-mono text-[11px] text-muted-foreground">{status}</span>}
      </div>
    </section>
  );
}