// Lightweight pub-sub for global loading state to avoid circular deps
let count = 0;
const listeners = new Set();

export function getCount() {
  return count;
}

export function inc() {
  count += 1;
  for (const cb of listeners) cb(count);
}

export function dec() {
  count = Math.max(0, count - 1);
  for (const cb of listeners) cb(count);
}

export function reset() {
  count = 0;
  for (const cb of listeners) cb(count);
}

export function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
