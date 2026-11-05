import { useEffect, useMemo, useRef, useState } from 'react';
import { useCitizen } from '@/hooks/useCitizen';
import { conversationFor } from '@/lib/dialogues';

const TYPE_MS = 22;

// One conversation engine for every goose in the Republic. The overlay chat out in the
// Commons and a keeper standing behind a counter share it, so talking works the same way.
export default function useConversation(target) {
  const { citizen, run } = useCitizen();
  const questId = target?.questId || '';
  const finished = (citizen?.quests ?? []).includes(questId);
  const taken = (citizen?.taken_quests ?? []).includes(questId);
  const questState = !questId ? 'none' : finished ? 'done' : taken ? 'taken' : 'offer';

  // The talk is written once when it opens, so agreeing to a favour never rewrites the script.
  const scriptKey = `${target?.key || ''}|${questId}`;
  const stateRef = useRef({ key: '', questState: 'none' });
  if (stateRef.current.key !== scriptKey) {
    stateRef.current = { key: scriptKey, questState };
  }

  const script = useMemo(
    () =>
      target
        ? conversationFor({ ...target, questState: stateRef.current.questState })
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scriptKey]
  );

  const [beats, setBeats] = useState([]);
  const [pos, setPos] = useState(0);
  const [typed, setTyped] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setBeats(script ? script.beats : []);
    setPos(0);
    setTyped(0);
  }, [script]);

  const beat = beats[pos] || null;
  const text = beat?.prompt || beat?.text || '';
  const typing = typed < text.length;

  useEffect(() => {
    if (!text) {
      setTyped(0);
      return;
    }
    setTyped(0);
    let count = 0;
    const timer = setInterval(() => {
      count += 1;
      setTyped(count);
      if (count >= text.length) clearInterval(timer);
    }, TYPE_MS);
    return () => clearInterval(timer);
  }, [text, pos]);

  const advance = () => {
    if (!beat) return 'end';
    if (typing) {
      setTyped(text.length);
      return 'typing';
    }
    if (beat.options) return 'waiting';
    if (pos >= beats.length - 1) return 'end';
    setPos(pos + 1);
    return 'next';
  };

  const choose = async (option) => {
    if (busy) return;
    let replies = (option.reply || []).map((line) => ({ text: line }));
    if (option.accept) {
      setBusy(true);
      try {
        await run({ action: 'takeQuest', quest_id: option.accept });
      } catch (err) {
        replies = [{ text: err.message }];
      } finally {
        setBusy(false);
      }
    }
    setBeats((current) => [...current.slice(0, pos + 1), ...replies, ...current.slice(pos + 1)]);
    setPos(pos + 1);
  };

  return {
    beat,
    text,
    typed,
    typing,
    advance,
    choose,
    busy,
    atEnd: pos >= beats.length - 1,
  };
}