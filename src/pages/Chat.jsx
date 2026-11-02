import { useState } from 'react';
import Panel from '@/components/Panel';
import useGooseName from '@/hooks/useGooseName';
import { useCitizen } from '@/hooks/useCitizen';
import NamePrompt from '@/components/chat/NamePrompt';
import ChatRoom from '@/components/chat/ChatRoom';

export default function Chat() {
  const { name, save } = useGooseName();
  const { citizen } = useCitizen();
  const [editing, setEditing] = useState(false);

  const displayName = citizen ? citizen.goose_name || citizen.full_name : name;
  const showPrompt = !citizen && (!name || editing);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Panel>
        <span className="meta-label">Live from the Republic</span>
        <h2 className="display-title mt-4 text-3xl md:text-4xl">The Honk Hall</h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-foreground/75">
          An open channel for every citizen and visitor of the Republic. Citizens carry their badge,
          their portrait and earn bread for honking. Visitors may speak as a guest.
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
        <ChatRoom
          name={displayName}
          citizen={citizen}
          onChangeName={citizen ? null : () => setEditing(true)}
        />
      )}
    </div>
  );
}