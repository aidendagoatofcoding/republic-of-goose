import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { readPassport, savePassport, clearPassport } from '@/lib/citizenSession';

const CitizenContext = createContext(null);

const call = async (payload) => {
  try {
    const response = await base44.functions.invoke('citizen', payload);
    return response?.data || {};
  } catch (error) {
    throw new Error(
      error?.response?.data?.error || 'The passport office could not be reached. Try again.'
    );
  }
};

export function CitizenProvider({ children }) {
  const [code, setCode] = useState(() => readPassport());
  const [citizen, setCitizen] = useState(null);
  const [loading, setLoading] = useState(Boolean(readPassport()));

  const load = useCallback(async (value) => {
    if (!value) {
      setCitizen(null);
      setLoading(false);
      return null;
    }
    setLoading(true);
    try {
      const data = await call({ action: 'profile', code: value });
      if (!data.citizen) throw new Error('unknown passport');
      setCitizen(data.citizen);
      return data.citizen;
    } catch (error) {
      clearPassport();
      setCode('');
      setCitizen(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(code);
  }, [code, load]);

  const signIn = useCallback(async (value) => {
    const clean = value.trim().toLowerCase();
    if (!clean) throw new Error('Enter your citizen passport code.');
    const data = await call({ action: 'profile', code: clean });
    if (!data.citizen) throw new Error('That passport code is not on the national register.');
    savePassport(clean);
    setCitizen(data.citizen);
    setCode(clean);
    return data.citizen;
  }, []);

  const signInWithPassword = useCallback(async (username, password) => {
    if (!username.trim() || !password) {
      throw new Error('Enter your citizen username and password.');
    }
    const data = await call({
      action: 'login',
      username: username.trim().toLowerCase(),
      password,
    });
    if (!data.citizen) {
      throw new Error('That username and password do not match a citizen on the register.');
    }
    savePassport(data.citizen.passport_code);
    setCitizen(data.citizen);
    setCode(data.citizen.passport_code);
    return data.citizen;
  }, []);

  const adopt = useCallback((nextCitizen) => {
    if (!nextCitizen?.passport_code) return;
    savePassport(nextCitizen.passport_code);
    setCitizen(nextCitizen);
    setCode(nextCitizen.passport_code);
  }, []);

  const signOut = useCallback(() => {
    clearPassport();
    setCode('');
    setCitizen(null);
  }, []);

  const run = useCallback(
    async (payload) => {
      if (!code) throw new Error('Sign in with your citizen passport first.');
      const data = await call({ ...payload, code });
      if (data.citizen) setCitizen(data.citizen);
      return data;
    },
    [code]
  );

  const value = {
    citizen,
    loading,
    signedIn: Boolean(citizen),
    signIn,
    signInWithPassword,
    signOut,
    adopt,
    run,
    refresh: () => load(code),
  };

  return <CitizenContext.Provider value={value}>{children}</CitizenContext.Provider>;
}

export function useCitizen() {
  const context = useContext(CitizenContext);
  if (!context) throw new Error('useCitizen must be used inside CitizenProvider');
  return context;
}