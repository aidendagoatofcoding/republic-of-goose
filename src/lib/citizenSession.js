const KEY = 'goose-passport-code';

export function readPassport() {
  try {
    return localStorage.getItem(KEY) || '';
  } catch (err) {
    return '';
  }
}

export function savePassport(code) {
  try {
    localStorage.setItem(KEY, code);
  } catch (err) {
    // private browsing: the code still works for this session
  }
}

export function clearPassport() {
  try {
    localStorage.removeItem(KEY);
  } catch (err) {
    // nothing to clear
  }
}

const GOOGLE_KEY = 'goose-google-signin';

export function markGoogleSignIn() {
  try {
    localStorage.setItem(GOOGLE_KEY, '1');
  } catch (err) {
    // the redirect still works, only the return trip is lost
  }
}

export function takeGoogleSignIn() {
  try {
    const pending = localStorage.getItem(GOOGLE_KEY) === '1';
    if (pending) localStorage.removeItem(GOOGLE_KEY);
    return pending;
  } catch (err) {
    return false;
  }
}

export function clearGoogleSignIn() {
  try {
    localStorage.removeItem(GOOGLE_KEY);
  } catch (err) {
    // nothing to clear
  }
}