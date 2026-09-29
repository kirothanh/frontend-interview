// Implement memoize(fn, resolver?): cache results by argument key.
// Default key: JSON.stringify(args). A custom `resolver(...args)` overrides it.
// Cache falsy results too (0, "", undefined) - don't use `if (cache[key])`.
export function memoize(fn, resolver) {
  throw new Error("not implemented");
}
