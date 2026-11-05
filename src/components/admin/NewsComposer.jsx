import { useEffect, useState } from 'react';
import { Newspaper, Sparkles, Trash2 } from 'lucide-react';
import Panel from '@/components/Panel';
import { base44 } from '@/api/base44Client';

const BLANK = {
  headline: '',
  category: 'Front Page',
  standfirst: '',
  byline: 'By THE HONK HERALD',
  body: '',
};

const DESKS = ['Front Page', 'Economy', 'Politics', 'Society', 'Sport', 'Weather'];

// Master Goose desk of the Goose Gazette: file a story and it leads the paper at once.
export default function NewsComposer({ run }) {
  const [stories, setStories] = useState([]);
  const [draft, setDraft] = useState(BLANK);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [topic, setTopic] = useState('');
  const [drafting, setDrafting] = useState(false);

  const load = async () => {
    const page = await base44.entities.NewsStory.list({ sort: '-created_date', limit: 40 });
    setStories(page?.items ?? []);
  };

  useEffect(() => {
    load().catch(() => setError('The archive could not be reached.'));
  }, []);

  const set = (key) => (event) => setDraft((current) => ({ ...current, [key]: event.target.value }));

  const publish = async (event) => {
    event.preventDefault();
    if (!draft.headline.trim() || !draft.standfirst.trim()) {
      setError('A story needs a headline and a standfirst.');
      return;
    }
    setBusy(true);
    setError('');
    setNote('');
    try {
      await run('saveNews', {
        story: {
          headline: draft.headline,
          standfirst: draft.standfirst,
          category: draft.category,
          byline: draft.byline,
          body: draft.body.split('\n\n').map((line) => line.trim()).filter(Boolean),
        },
      });
      setDraft(BLANK);
      await load();
      setNote('Filed. The story now leads the Gazette.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  // The Goose AI drafts a story into the form; nothing is filed until Master Goose publishes.
  const draftWithAi = async () => {
    setDrafting(true);
    setError('');
    setNote('');
    try {
      const data = await run('draftNews', { topic: topic.trim(), desk: draft.category });
      const story = data.draft || {};
      setDraft((current) => ({
        ...current,
        headline: story.headline || current.headline,
        standfirst: story.standfirst || current.standfirst,
        category: DESKS.includes(story.category) ? story.category : current.category,
        body: (story.body || []).join('\n\n'),
      }));
      setNote('Drafted. Read it over, change what you like, then publish.');
    } catch (err) {
      setError(err.message);
    } finally {
      setDrafting(false);
    }
  };

  const remove = async (id) => {
    setError('');
    setNote('');
    try {
      await run('deleteNews', { id });
      await load();
      setNote('The story has been pulled from the paper.');
    } catch (err) {
      setError(err.message);
    }
  };

  const field =
    'w-full rounded-sm border border-input bg-background/80 px-3 py-2 text-[15px] text-foreground placeholder:text-muted-foreground/60';

  return (
    <Panel>
      <div className="flex items-center gap-3">
        <Newspaper className="h-4 w-4 text-[#D4AF37]" />
        <span className="meta-label">The Goose Gazette</span>
      </div>
      <h3 className="display-title mt-3 text-2xl">File a news story</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-foreground/70">
        Stories filed here appear in the Gazette the moment you publish them. Leave a blank line
        between paragraphs.
      </p>

      <div className="mt-4 rounded-sm border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
          <span className="meta-label">The Goose AI newsroom desk</span>
        </div>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="What is the story about? Leave blank to be told what the news is."
            className={`${field} flex-1`}
          />
          <button
            type="button"
            onClick={draftWithAi}
            disabled={drafting}
            className="shrink-0 rounded-sm border border-[#D4AF37]/60 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#D4AF37] hover:bg-[#D4AF37]/10 disabled:opacity-50"
          >
            {drafting ? 'Writing…' : 'Draft story'}
          </button>
        </div>
        <p className="mt-1.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-muted-foreground">
          It fills the form below. Nothing is filed until you publish it.
        </p>
      </div>

      <form onSubmit={publish} className="mt-5 space-y-3">
        <input
          value={draft.headline}
          onChange={set('headline')}
          placeholder="Headline"
          className={field}
        />
        <textarea
          value={draft.standfirst}
          onChange={set('standfirst')}
          rows={2}
          placeholder="Standfirst — one sentence under the headline"
          className={field}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <select value={draft.category} onChange={set('category')} className={field}>
            {DESKS.map((desk) => (
              <option key={desk} value={desk}>
                {desk}
              </option>
            ))}
          </select>
          <input value={draft.byline} onChange={set('byline')} placeholder="Byline" className={field} />
        </div>
        <textarea
          value={draft.body}
          onChange={set('body')}
          rows={6}
          placeholder="The story itself"
          className={field}
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-sm bg-[#D4AF37] px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#0A0F0D] disabled:opacity-50"
        >
          {busy ? 'Filing...' : 'Publish story'}
        </button>
        {note && <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">{note}</p>}
        {error && (
          <p role="alert" className="font-mono text-[11px] text-[#FF6B4A]">
            {error}
          </p>
        )}
      </form>

      <div className="mt-6 space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Filed stories ({stories.length})
        </p>
        {stories.length === 0 && (
          <p className="text-[14px] text-foreground/60">Nothing filed yet. The paper is your oyster.</p>
        )}
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex items-start justify-between gap-3 rounded-sm border border-border/70 px-3 py-2"
          >
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#D4AF37]">
                {story.category} · {story.date}
              </p>
              <p className="mt-1 text-[15px] font-semibold leading-snug">{story.headline}</p>
            </div>
            <button
              type="button"
              onClick={() => remove(story.id)}
              aria-label={`Pull ${story.headline}`}
              className="rounded-sm border border-border p-1.5 text-muted-foreground hover:text-[#FF6B4A]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}