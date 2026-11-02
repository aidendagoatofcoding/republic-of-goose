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