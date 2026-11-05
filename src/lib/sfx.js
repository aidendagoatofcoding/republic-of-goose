// The sounds of the Republic, synthesised in the browser so nothing has to be downloaded.
// Every sound is a short shaped tone: a honk, a footstep on grass, a coin, a door.

let context = null;
let master = null;
const MUTE_KEY = 'goose-sfx-muted';

const readMuted = () => {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch (err) {
    return false;
  }
};

let muted = readMuted();

const audio = () => {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!context) {
    context = new Ctor();
    master = context.createGain();
    master.gain.value = 0.18;
    master.connect(context.destination);
  }
  if (context.state === 'suspended') context.resume().catch(() => {});
  return context;
};

export const isMuted = () => muted;

export const setMuted = (value) => {
  muted = Boolean(value);
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch (err) {
    /* a browser with storage turned off still gets the sound */
  }
};

const tone = ({ freq = 440, to = null, type = 'sine', length = 0.16, gain = 0.5, delay = 0 }) => {
  if (muted) return;
  const ctx = audio();
  if (!ctx) return;
  const now = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), now + length);
  env.gain.setValueAtTime(0.0001, now);
  env.gain.exponentialRampToValueAtTime(gain, now + 0.012);
  env.gain.exponentialRampToValueAtTime(0.0001, now + length);
  osc.connect(env);
  env.connect(master);
  osc.start(now);
  osc.stop(now + length + 0.02);
};

const noise = ({ length = 0.12, gain = 0.25, filter = 1200, delay = 0 }) => {
  if (muted) return;
  const ctx = audio();
  if (!ctx) return;
  const now = ctx.currentTime + delay;
  const frames = Math.max(1, Math.floor(ctx.sampleRate * length));
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const band = ctx.createBiquadFilter();
  band.type = 'lowpass';
  band.frequency.value = filter;
  const env = ctx.createGain();
  env.gain.value = gain;
  source.connect(band);
  band.connect(env);
  env.connect(master);
  source.start(now);
};

export const sfx = {
  honk: () => {
    tone({ freq: 320, to: 210, type: 'sawtooth', length: 0.18, gain: 0.32 });
    tone({ freq: 470, to: 300, type: 'square', length: 0.14, gain: 0.12, delay: 0.02 });
  },
  step: () => noise({ length: 0.07, gain: 0.16, filter: 700 }),
  pickup: () => {
    tone({ freq: 620, to: 900, type: 'triangle', length: 0.12, gain: 0.3 });
    tone({ freq: 940, to: 1240, type: 'sine', length: 0.1, gain: 0.18, delay: 0.07 });
  },
  coin: () => {
    tone({ freq: 880, length: 0.09, type: 'square', gain: 0.16 });
    tone({ freq: 1320, length: 0.12, type: 'square', gain: 0.12, delay: 0.06 });
  },
  door: () => {
    noise({ length: 0.24, gain: 0.22, filter: 480 });
    tone({ freq: 180, to: 120, type: 'sine', length: 0.2, gain: 0.18 });
  },
  blip: () => tone({ freq: 720, length: 0.045, type: 'square', gain: 0.08 }),
  choose: () => tone({ freq: 560, to: 760, type: 'triangle', length: 0.1, gain: 0.2 }),
  splash: () => {
    noise({ length: 0.3, gain: 0.24, filter: 2200 });
    tone({ freq: 220, to: 120, type: 'sine', length: 0.22, gain: 0.12 });
  },
  fail: () => tone({ freq: 240, to: 120, type: 'sawtooth', length: 0.26, gain: 0.2 }),
  win: () => {
    [523, 659, 784, 1047].forEach((freq, index) =>
      tone({ freq, length: 0.16, type: 'triangle', gain: 0.2, delay: index * 0.09 })
    );
  },
};