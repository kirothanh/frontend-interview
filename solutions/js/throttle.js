// Leading-edge throttle: run immediately, then ignore calls until `wait` has passed.
export function throttle(fn, wait) {
  let last = -Infinity;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      return fn.apply(this, args);
    }
  };
}
