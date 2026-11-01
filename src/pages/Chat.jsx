import { useState } from 'react';
import Panel from '@/components/Panel';
import useGooseName from '@/hooks/useGooseName';
import NamePrompt from '@/components/chat/NamePrompt';
import ChatRoom from '@/components/chat/ChatRoom';

export default function Chat() {
  const { name, save } = useGooseName();
  const [editing, setEditing] = useState(false);
  const showPrompt = !name || editing;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Panel>
        <span className="meta-label">Live from the Republic</span>
        <h2 className="display-title mt-4 text-3xl md:text-4xl">The Honk Hall</h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-foreground/75">
          An open channel for every goose and visitor of the Republic. Messages appear instantly for
          everyone in the hall and remain in the national record.
        </p>
      </Panel>

      {showPrompt ? (
        <NamePrompt
          initial={editing ? name : ''}
          onSubmit={(value) => {
            save(value);
            setEditing(false);
          }}
        />
      ) : (
        <ChatRoom name={name} onChangeName={() => setEditing(true)} />
      )}
    </div>
  );
}