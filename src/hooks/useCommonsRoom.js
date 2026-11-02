import { useCallback, useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';

const ROOM = 'honk-commons';
const CONN_KEY = 'honk-commons-conn';
const SEND_INTERVAL_MS = 140;

export default function useCommonsRoom({ profile, onHonk }) {
  const [people, setPeople] = useState([]);
  const [seat, setSeat] = useState(null);
  const [connected, setConnected] = useState(false);
  const roomRef = useRef(null);
  const profileRef = useRef(profile);
  const honkRef = useRef(onHonk);
  const lastSent = useRef(0);

  profileRef.current = profile;
  honkRef.current = onHonk;

  useEffect(() => {
    const factory = base44.actors?.Commons;
    if (!factory) return undefined;

    let connId = sessionStorage.getItem(CONN_KEY);
    if (!connId) {
      connId =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `conn-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(CONN_KEY, connId);
    }

    let room;
    try {
      room = factory(ROOM).connect({ id: connId });
    } catch (err) {
      return undefined;
    }
    if (!room || typeof room.subscribe !== 'function') return undefined;
    roomRef.current = room;

    const sub = room.subscribe((msg) => {
      if (!msg || typeof msg !== 'object') return;
      if (msg.type === 'you') {
        setSeat(msg.seat);
        setConnected(true);
      } else if (msg.type === 'people') {
        setPeople(Array.isArray(msg.people) ? msg.people : []);
      } else if (msg.type === 'honk') {
        honkRef.current?.(msg);
      }
    });

    return () => {
      try {
        sub.unsubscribe();
        room.close();
      } catch (err) {
        /* socket already gone */
      }
      roomRef.current = null;
      setConnected(false);
    };
  }, []);

  useEffect(() => {
    if (!connected) return;
    const current = profileRef.current;
    roomRef.current?.send({
      type: 'hello',
      name: current?.name || 'A wanderer',
      species: current?.species || 'goose',
      worn: current?.worn || [],
    });
  }, [connected, profile?.name, profile?.species, profile?.worn?.join('')]);

  const move = useCallback((x, y, face) => {
    const room = roomRef.current;
    if (!room || typeof room.send !== 'function') return;
    const now = Date.now();
    if (now - lastSent.current < SEND_INTERVAL_MS) return;
    lastSent.current = now;
    room.send({ type: 'move', x, y, face });
  }, []);

  const honk = useCallback((target) => {
    const room = roomRef.current;
    if (!room || typeof room.send !== 'function') return;
    room.send({ type: 'honk', target: Number(target) || 0 });
  }, []);

  return { people, seat, connected, move, honk };
}