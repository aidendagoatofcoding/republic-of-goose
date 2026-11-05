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
  if (muted) stopRiver();
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

let river = null;

// The Odder, heard from the bank: rounded brown noise under a slow swell.
export const startRiver = () => {
  if (muted || river) return;
  const ctx = audio();
  if (!ctx) return;
  const frames = Math.floor(ctx.sampleRate * 3);
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < frames; i += 1) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = last * 3.2;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 760;
  band.Q.value = 0.7;
  const env = ctx.createGain();
  env.gain.value = 0.0001;
  const lfo = ctx.createOscillator();
  const swell = ctx.createGain();
  lfo.frequency.value = 0.13;
  swell.gain.value = 0.014;
  lfo.connect(swell);
  swell.connect(env.gain);
  source.connect(band);
  band.connect(env);
  env.connect(master);
  env.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.8);
  source.start();
  lfo.start();
  river = { source, env, lfo };
};

export const stopRiver = () => {
  if (!river) return;
  const { source, env, lfo } = river;
  river = null;
  const ctx = context;
  if (!ctx) return;
  env.gain.cancelScheduledValues(ctx.currentTime);
  env.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.16);
  setTimeout(() => {
    try {
      source.stop();
      lfo.stop();
    } catch (err) {
      /* already stopped */
    }
  }, 700);
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
  // A beast waking up: low, wide and unpleasant.
  roar: () => {
    tone({ freq: 96, to: 58, type: 'sawtooth', length: 0.7, gain: 0.28 });
    tone({ freq: 148, to: 92, type: 'square', length: 0.55, gain: 0.12, delay: 0.08 });
    noise({ length: 0.5, gain: 0.16, filter: 420, delay: 0.05 });
  },
  // A blow landing on feathers.
  hit: () => {
    noise({ length: 0.14, gain: 0.26, filter: 1000 });
    tone({ freq: 210, to: 120, type: 'triangle', length: 0.14, gain: 0.2 });
  },
  // A mend: soft, rising, slightly warm.
  heal: () => {
    tone({ freq: 420, to: 660, type: 'sine', length: 0.26, gain: 0.22 });
    tone({ freq: 630, to: 840, type: 'sine', length: 0.2, gain: 0.12, delay: 0.1 });
  },
  // A guard going up: a short wooden knock.
  guard: () => {
    noise({ length: 0.1, gain: 0.2, filter: 620 });
    tone({ freq: 300, length: 0.12, type: 'square', gain: 0.12 });
  },
  // A gull or a distant bird, for the harbour and the high places.
  gull: () => {
    tone({ freq: 1500, to: 900, type: 'sine', length: 0.2, gain: 0.12 });
    tone({ freq: 1250, to: 780, type: 'sine', length: 0.16, gain: 0.09, delay: 0.14 });
  },
  // A page turning, a ledger closing.
  paper: () => noise({ length: 0.16, gain: 0.14, filter: 2600 }),
};