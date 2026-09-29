export function myBind(fn, thisArg, ...preset) {
  return function bound(...args) {
    if (new.target) return new fn(...preset, ...args);
    return fn.apply(thisArg, [...preset, ...args]);
  };
}
