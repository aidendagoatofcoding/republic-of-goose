import { createContext, useContext } from 'react';

// Carries the live Commons room down to the arena so fighters can see and strike each other.
export const ArenaBusContext = createContext(null);

export const useArenaBus = () => useContext(ArenaBusContext);