import { useState } from 'react';

const STORAGE_KEY = 'goose-chat-name';

export default function useGooseName() {
  const [name, setName] = useState(() => localStorage.getItem(STORAGE_KEY) || '');

  const save = (value) => {
    const clean = value.trim().slice(0, 40);
    if (!clean) return '';
    localStorage.setItem(STORAGE_KEY, clean);
    setName(clean);
    return clean;
  };

  return { name, save };
}