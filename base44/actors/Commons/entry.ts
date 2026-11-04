import { Actor } from 'base44:runtime/actors';

const MAX_USERS = 24;
const SAVE_INTERVAL_MS = 2500;

const PONG_TYPES = new Set([
  'pong_invite',
  'pong_accept',
  'pong_decline',
  'pong_state',
  'pong_paddle',
  'pong_end',
]);

export default class Commons extends Actor {
  users = new Map();
  nextSeat = 1;
  lastSave = 0;

  async handleStart() {
    const saved = await this.storage.get('seats');
    if (saved) this.users = new Map(saved);
    const live = new Set(this.getConnections().map((conn) => conn.id));
    for (const id of [...this.users.keys()]) {
      if (!live.has(id)) this.users.delete(id);
    }
    this.nextSeat = Math.max(0, ...[...this.users.values()].map((user) => user.seat)) + 1;
    if (this.users.size > 0) this.pushPeople();
  }

  async handleConnect(conn) {
    if (!this.users.has(conn.id) && this.users.size >= MAX_USERS) {
      conn.reject(4001, 'the meadow is full');
      return;
    }

    if (!this.users.has(conn.id)) {
      this.users.set(conn.id, {
        seat: this.nextSeat++,
        name: 'A wanderer',
        species: 'goose',
        worn: [],
        x: 44 + Math.random() * 12,
        y: 58 + Math.random() * 10,
        face: 1,
      });
      await this.save();
    }

    const mine = this.users.get(conn.id);
    conn.send({ type: 'you', seat: mine.seat });
    this.pushPeople();
  }

  async handleMessage(conn, msg) {
    if (typeof msg !== 'object' || msg === null) return;
    const user = this.users.get(conn.id);
    if (!user) return;

    if (msg.type === 'hello') {
      user.name = String(msg.name ?? '').slice(0, 40) || 'A wanderer';
      user.species = String(msg.species ?? 'goose').slice(0, 20);
      user.worn = Array.isArray(msg.worn)
        ? msg.worn.slice(0, 3).map((emoji) => String(emoji).slice(0, 8))
        : [];
      this.pushPeople();
      return;
    }

    if (msg.type === 'move') {
      const x = Number(msg.x);
      const y = Number(msg.y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      user.x = Math.min(97, Math.max(3, x));
      user.y = Math.min(95, Math.max(8, y));
      user.face = msg.face === -1 ? -1 : 1;
      this.pushPeople();
      if (Date.now() - this.lastSave > SAVE_INTERVAL_MS) this.save();
      return;
    }

    if (msg.type === 'honk') {
      const target = Number(msg.target);
      if (!Number.isFinite(target)) return;
      this.broadcast({ type: 'honk', from: user.seat, target, name: user.name });
      return;
    }

    if (msg.type === 'arena_pos') {
      const x = Number(msg.x);
      const y = Number(msg.y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      this.broadcast({
        type: 'arena_pos',
        from: user.seat,
        name: user.name,
        x: Math.min(100, Math.max(0, x)),
        y: Math.min(100, Math.max(0, y)),
        hp: Math.min(100, Math.max(0, Number(msg.hp) || 0)),
      });
      return;
    }

    if (msg.type === 'arena_leave') {
      this.broadcast({ type: 'arena_leave', from: user.seat });
      return;
    }

    if (msg.type === 'arena_hit') {
      const to = Number(msg.to);
      if (!Number.isFinite(to) || to === user.seat) return;
      this.broadcast({
        type: 'arena_hit',
        from: user.seat,
        to,
        name: user.name,
        kind: String(msg.kind ?? '').slice(0, 12),
        damage: Math.min(60, Math.max(0, Number(msg.damage) || 0)),
      });
      return;
    }

    if (PONG_TYPES.has(msg.type)) {
      const num = (key) => {
        const value = Number(msg[key]);
        return Number.isFinite(value) ? value : 0;
      };
      const relay = {
        type: msg.type,
        from: user.seat,
        name: user.name,
        to: num('to'),
      };
      if (msg.type === 'pong_state') {
        relay.ballX = num('ballX');
        relay.ballY = num('ballY');
        relay.hostY = num('hostY');
        relay.guestY = num('guestY');
        relay.scoreHost = num('scoreHost');
        relay.scoreGuest = num('scoreGuest');
      }
      if (msg.type === 'pong_paddle') relay.y = num('y');
      if (msg.type === 'pong_end') relay.winnerSeat = num('winnerSeat');
      this.broadcast(relay);
    }
  }

  async handleClose(conn) {
    this.users.delete(conn.id);
    await this.save();
    this.pushPeople();
  }

  save() {
    this.lastSave = Date.now();
    return this.storage.put('seats', [...this.users.entries()]);
  }

  pushPeople() {
    this.broadcast({
      type: 'people',
      people: [...this.users.values()].map((user) => ({
        seat: user.seat,
        name: user.name,
        species: user.species,
        worn: user.worn,
        x: user.x,
        y: user.y,
        face: user.face,
      })),
    });
  }
}