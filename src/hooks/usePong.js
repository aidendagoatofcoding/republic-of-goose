import { useCallback, useEffect, useRef, useState } from 'react';

const MATCH_POINTS = 5;
const PADDLE_HALF = 0.11;
const BROADCAST_MS = 70;
const PADDLE_SEND_MS = 55;

const clamp01 = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0.5;
  return Math.min(0.9, Math.max(0.1, number));
};

const blankTable = () => ({
  ballX: 0.5,
  ballY: 0.5,
  hostY: 0.5,
  guestY: 0.5,
  scoreHost: 0,
  scoreGuest: 0,
});

export default function usePong({ seat, send }) {
  const [incoming, setIncoming] = useState(null);
  const [game, setGame] = useState(null);
  const [table, setTable] = useState(blankTable);
  const [notice, setNotice] = useState('');
  const [result, setResult] = useState('');

  const sendRef = useRef(send);
  sendRef.current = send;
  const seatRef = useRef(seat);
  seatRef.current = seat;

  const gameRef = useRef(null);
  const simRef = useRef({ ...blankTable(), vx: 0.55, vy: 0.26 });
  const pendingRef = useRef(null);
  const overRef = useRef(false);
  const lastPaddleSent = useRef(0);

  const startGame = useCallback((role, opponentSeat, opponentName) => {
    overRef.current = false;
    simRef.current = {
      ...blankTable(),
      vx: role === 'host' ? 0.55 : -0.55,
      vy: 0.26,
    };
    setTable(blankTable());
    setResult('');
    setNotice('');
    setIncoming(null);
    const next = { role, opponentSeat, opponentName };
    gameRef.current = next;
    setGame(next);
  }, []);

  const finishMatch = useCallback((winnerSeat) => {
    const current = gameRef.current;
    if (!current || overRef.current) return;
    overRef.current = true;
    sendRef.current?.({ type: 'pong_end', to: current.opponentSeat, winnerSeat });
    setResult(
      winnerSeat === seatRef.current
        ? 'You win the pond!'
        : `${current.opponentName} takes the pond.`
    );
  }, []);

  useEffect(() => {
    if (!game || game.role !== 'host') return undefined;

    let frame = 0;
    let last = performance.now();
    let lastBroadcast = 0;

    const step = (now) => {
      const dt = Math.min(0.045, Math.max(0, (now - last) / 1000));
      last = now;
      const sim = simRef.current;

      sim.x += sim.vx * dt;
      sim.y += sim.vy * dt;

      if (sim.y < 0.04) {
        sim.y = 0.04;
        sim.vy = Math.abs(sim.vy);
      }
      if (sim.y > 0.96) {
        sim.y = 0.96;
        sim.vy = -Math.abs(sim.vy);
      }

      if (sim.x <= 0.075 && sim.vx < 0 && Math.abs(sim.y - sim.hostY) < PADDLE_HALF) {
        sim.x = 0.075;
        sim.vx = Math.abs(sim.vx) * 1.04;
        sim.vy = Math.max(-0.8, Math.min(0.8, sim.vy + (sim.y - sim.hostY) * 1.5));
      }
      if (sim.x >= 0.925 && sim.vx > 0 && Math.abs(sim.y - sim.guestY) < PADDLE_HALF) {
        sim.x = 0.925;
        sim.vx = -Math.abs(sim.vx) * 1.04;
        sim.vy = Math.max(-0.8, Math.min(0.8, sim.vy + (sim.y - sim.guestY) * 1.5));
      }

      let finished = false;
      if (sim.x < -0.03) {
        sim.scoreGuest += 1;
        finished = sim.scoreGuest >= MATCH_POINTS;
        if (!finished) {
          sim.x = 0.5;
          sim.y = 0.5;
          sim.vx = 0.5;
          sim.vy = Math.random() > 0.5 ? 0.26 : -0.26;
        }
      } else if (sim.x > 1.03) {
        sim.scoreHost += 1;
        finished = sim.scoreHost >= MATCH_POINTS;
        if (!finished) {
          sim.x = 0.5;
          sim.y = 0.5;
          sim.vx = -0.5;
          sim.vy = Math.random() > 0.5 ? 0.26 : -0.26;
        }
      }

      setTable({
        ballX: sim.x,
        ballY: sim.y,
        hostY: sim.hostY,
        guestY: sim.guestY,
        scoreHost: sim.scoreHost,
        scoreGuest: sim.scoreGuest,
      });

      if (finished) {
        finishMatch(sim.scoreHost >= MATCH_POINTS ? seatRef.current : game.opponentSeat);
        return;
      }

      if (now - lastBroadcast > BROADCAST_MS) {
        lastBroadcast = now;
        sendRef.current?.({
          type: 'pong_state',
          to: game.opponentSeat,
          ballX: sim.x,
          ballY: sim.y,
          hostY: sim.hostY,
          guestY: sim.guestY,
          scoreHost: sim.scoreHost,
          scoreGuest: sim.scoreGuest,
        });
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [game, finishMatch]);

  const handlePong = useCallback(
    (msg) => {
      const me = seatRef.current;
      if (!msg || !me || msg.from === me) return;

      if (msg.type === 'pong_invite') {
        if (msg.to === me && !gameRef.current) {
          setIncoming({ seat: msg.from, name: msg.name || 'A citizen' });
        }
        return;
      }

      if (msg.type === 'pong_decline') {
        const pending = pendingRef.current;
        if (pending && msg.from === pending.seat) {
          pendingRef.current = null;
          setNotice(`${msg.name || pending.name} is not up for a match.`);
        }
        return;
      }

      if (msg.type === 'pong_accept') {
        const pending = pendingRef.current;
        if (pending && msg.from === pending.seat) {
          pendingRef.current = null;
          startGame('host', pending.seat, pending.name);
        }
        return;
      }

      const current = gameRef.current;
      if (!current || msg.from !== current.opponentSeat) return;

      if (msg.type === 'pong_state' && current.role === 'guest') {
        const next = {
          ballX: msg.ballX,
          ballY: msg.ballY,
          hostY: msg.hostY,
          guestY: msg.guestY,
          scoreHost: msg.scoreHost,
          scoreGuest: msg.scoreGuest,
        };
        simRef.current = { ...simRef.current, ...next, x: msg.ballX, y: msg.ballY };
        setTable(next);
      } else if (msg.type === 'pong_paddle' && current.role === 'host') {
        simRef.current.guestY = clamp01(msg.y);
      } else if (msg.type === 'pong_end') {
        overRef.current = true;
        setResult(
          Number(msg.winnerSeat) === 0
            ? 'Your opponent left the pond.'
            : msg.winnerSeat === me
              ? 'You win the pond!'
              : `${current.opponentName} takes the pond.`
        );
      }
    },
    [startGame]
  );

  const challenge = useCallback((person) => {
    if (!person?.seat || !seatRef.current || gameRef.current) return;
    pendingRef.current = { seat: person.seat, name: person.name };
    setNotice(`Challenge sent to ${person.name}.`);
    sendRef.current?.({ type: 'pong_invite', to: person.seat });
  }, []);

  const accept = useCallback(() => {
    if (!incoming) return;
    sendRef.current?.({ type: 'pong_accept', to: incoming.seat });
    startGame('guest', incoming.seat, incoming.name);
  }, [incoming, startGame]);

  const decline = useCallback(() => {
    if (!incoming) return;
    sendRef.current?.({ type: 'pong_decline', to: incoming.seat });
    setIncoming(null);
  }, [incoming]);

  const quit = useCallback(() => {
    const current = gameRef.current;
    if (current) {
      sendRef.current?.({ type: 'pong_end', to: current.opponentSeat, winnerSeat: 0 });
    }
    gameRef.current = null;
    overRef.current = false;
    setGame(null);
    setResult('');
    setTable(blankTable());
  }, []);

  const setPaddle = useCallback((y) => {
    const value = clamp01(y);
    const current = gameRef.current;
    if (!current) return;
    if (current.role === 'host') {
      simRef.current.hostY = value;
      setTable((prev) => ({ ...prev, hostY: value }));
      return;
    }
    simRef.current.guestY = value;
    setTable((prev) => ({ ...prev, guestY: value }));
    const now = Date.now();
    if (now - lastPaddleSent.current > PADDLE_SEND_MS) {
      lastPaddleSent.current = now;
      sendRef.current?.({ type: 'pong_paddle', to: current.opponentSeat, y: value });
    }
  }, []);

  return {
    incoming,
    game,
    table,
    notice,
    result,
    challenge,
    accept,
    decline,
    quit,
    setPaddle,
    handlePong,
  };
}