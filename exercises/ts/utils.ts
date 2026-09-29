// Type-test helpers. A line like `Expect<Equal<A, B>>` only compiles when A and B are identical.
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
export type Expect<T extends true> = T;
export type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true;
