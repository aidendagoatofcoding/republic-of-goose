import { useCallback, useEffect, useRef, useState } from 'react';

const KEYS = {
  arrowleft: 'left',
  a: 'left',
  arrowright: 'right',
  d: 'right',
  arrowup: 'up',
  w: 'up',
  arrowdown: 'down',
  s: 'down',
};

const SPEED = 170;
const DEFAULT_BOUNDS = { x: [6, 94], y: [68, 92] };
const STEP = 4;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function useInteriorWalk({
  roomRef,
  start = { x: 50, y: 90, face: 1 },
  paused = false,
  bounds = DEFAULT_BOUNDS,
}) {
  const [pos, setPos] = useState(start);
  const posRef = useRef(start);
  const keysRef = useRef(new Set());
  const pausedRef = useRef(paused);
  const boundsRef = useRef(bounds);
  pausedRef.current = paused;
  boundsRef.current = bounds;

  const apply = useCallback((next) => {
    posRef.current = next;
    setPos(next);
  }, []);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (pausedRef.current) return;
      const box = roomRef.current;
      if (!box || !box.offsetWidth) return;
      const keys = keysRef.current;
      const vx = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
      const vy = (keys.has('down') ? 1 : 0) - (keys.has('up') ? 1 : 0);
      if (!vx && !vy) return;
      const length = Math.hypot(vx, vy) || 1;
      const current = posRef.current;
      const [minX, maxX] = boundsRef.current.x;
      const [minY, maxY] = boundsRef.current.y;
      apply({
        x: clamp(current.x + (((vx / length) * SPEED * dt) / box.offsetWidth) * 100, minX, maxX),
        y: clamp(current.y + (((vy / length) * SPEED * dt) / box.offsetHeight) * 100, minY, maxY),
        face: vx < 0 ? -1 : vx > 0 ? 1 : current.face,
      });
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [roomRef, apply]);

  useEffect(() => {
    if (!paused) return;
    keysRef.current.clear();
  }, [paused]);

  useEffect(() => {
    const onDown = (event) => {
      if (pausedRef.current) return;
      const tag = event.target?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      const direction = KEYS[event.key?.toLowerCase()];
      if (!direction) return;
      event.preventDefault();
      if (!event.repeat) keysRef.current.add(direction);
    };
    const onUp = (event) => {
      const direction = KEYS[event.key?.toLowerCase()];
      if (direction) keysRef.current.delete(direction);
    };
    const clear = () => keysRef.current.clear();
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', clear);
    };
  }, []);

  const nudge = useCallback(
    (dx, dy) => {
      const current = posRef.current;
      const [minX, maxX] = boundsRef.current.x;
      const [minY, maxY] = boundsRef.current.y;
      apply({
        x: clamp(current.x + dx * STEP, minX, maxX),
        y: clamp(current.y + dy * STEP, minY, maxY),
        face: dx < 0 ? -1 : dx > 0 ? 1 : current.face,
      });
    },
    [apply]
  );

  return { pos, nudge };
}