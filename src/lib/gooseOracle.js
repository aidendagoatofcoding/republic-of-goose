import { base44 } from '@/api/base44Client';

// The Goose AI, as the app talks to it: a keeper answering a citizen, and the newsroom desk
// drafting a story for the Gazette.
export async function askKeeper({ question, npc, goose, history }) {
  try {
    const response = await base44.functions.invoke('gooseOracle', {
      action: 'say',
      question,
      npc,
      goose,
      history,
    });
    const data = response?.data || {};
    if (data.error) throw new Error(data.error);
    return { line: data.line, gesture: data.gesture };
  } catch (error) {
    throw new Error(
      error?.response?.data?.error || 'The goose went quiet. Ask again in a moment.'
    );
  }
}