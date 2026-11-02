export const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

export function normaliseUsername(value) {
  return String(value ?? '').trim().toLowerCase();
}

export function newSalt() {
  return crypto.randomUUID().replace(/-/g, '');
}

export async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100000, hash: 'SHA-256' },
    key,
    256
  );
  return Array.from(new Uint8Array(bits))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}