import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// The Goose AI: it does not replace a keeper's script, it lets them answer anything a citizen asks.
// Everything it is given is bounded, so one caller cannot run up a large prompt.

const MAX_QUESTION = 220;
const MAX_HISTORY = 5;
const MAX_HISTORY_LINE = 240;
const MAX_FIELD = 60;

const GESTURES = [
  'taps the counter',
  'ruffles its feathers',
  'looks off toward the door',
  'honks once, quietly',
  'wipes a glass that is already clean',
  'shuffles a stack of papers',
  'leans over the counter',
  'stamps something that did not need stamping',
  'checks the window',
  'nods slowly',
  'picks at a loose thread',
  'sorts a few coins for no reason',
];

const clean = (value, max) =>
  String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

export default async function (req) {
  try {
    const body = await req.json().catch(() => ({}));
    if (body.action !== 'say') {
      return Response.json({ error: 'Unknown action.' }, { status: 400 });
    }

    const question = clean(body.question, MAX_QUESTION);
    if (!question) {
      return Response.json({ error: 'Ask something first.' }, { status: 400 });
    }

    const npc = body.npc || {};
    const name = clean(npc.name, MAX_FIELD) || 'A keeper';
    const role = clean(npc.role, MAX_FIELD) || 'keeper';
    const place = clean(npc.place, MAX_FIELD) || 'the Republic';
    const species = clean(npc.species, 20) || 'goose';
    const goose = clean(body.goose, MAX_FIELD) || 'a citizen';

    const history = (Array.isArray(body.history) ? body.history : [])
      .slice(-MAX_HISTORY)
      .map((entry) => ({
        ask: clean(entry?.ask, MAX_QUESTION),
        said: clean(entry?.said, MAX_HISTORY_LINE),
      }))
      .filter((entry) => entry.ask && entry.said);

    const pastTalk = history.length
      ? history
          .map((entry) => `The citizen asked: "${entry.ask}"\nYou answered: "${entry.said}"`)
          .join('\n')
      : 'This is the first thing that has been asked.';

    const prompt = `You are ${name}, a ${species} who works as ${role} at ${place}, in the fictional Republic of Goose — a northern nation of pine forests, frozen lakes, honking geese, a national bread economy, a National Bank, a Goose Gazette newspaper and a busy Honk Commons.

You are speaking out loud to a citizen named ${goose}.

WHAT YOU HAVE ALREADY SAID IN THIS CONVERSATION
${pastTalk}

WHAT THE CITIZEN NOW ASKS
"${question}"

HOW TO ANSWER
- Stay completely in character as ${name}. Never mention being an AI, a model, a prompt or a program. Never break the fiction.
- Reply out loud, in the first person, in one or two short sentences and under 45 words.
- Dry, understated British humour. Northern, weather-beaten, practical. Warm rather than rude.
- Small concrete detail beats a grand statement: a smell, a price, a queue, a broken thing, a neighbour.
- If the question is about the Republic's bread, laws, bank, harbour, quarries, market or the Gazette, answer as somebody who lives there and has opinions about it.
- If you do not know, say so in character, or sidestep it the way a busy keeper would.
- Use "HONK" at most once, and only when it is genuinely funny.
- Never give real-world advice, never discuss real companies, politics, or anything outside the Republic.
- No stage directions, no quotation marks around the whole answer, no lists.

Also pick ONE small physical thing you do while answering, as 2 to 8 words in the third person, present tense, fitting ${name} and ${place}.`;

    const base44 = createClientFromRequest(req);
    const draft = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          line: { type: 'string', description: 'What the character says out loud.' },
          gesture: { type: 'string', description: 'One small physical action, third person.' },
        },
        required: ['line', 'gesture'],
      },
    });

    const line = clean(draft?.line, 320);
    if (!line) {
      return Response.json({ error: 'The goose went quiet. Ask again.' }, { status: 502 });
    }
    const gesture =
      clean(draft?.gesture, 70) || GESTURES[Math.floor(Math.random() * GESTURES.length)];

    return Response.json({ line, gesture });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}