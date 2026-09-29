import type { Equal, Expect } from "./utils";

type MyReturnType<F> = F extends (...args: any[]) => infer R ? R : never;
type MyParameters<F> = F extends (...args: infer P) => any ? P : never;
type MyAwaited<T> = T extends PromiseLike<infer U> ? MyAwaited<U> : T;
type IsNever<T> = [T] extends [never] ? true : false;
type Flatten<T extends readonly unknown[]> = T extends readonly [infer H, ...infer R]
  ? H extends readonly unknown[]
    ? [...H, ...Flatten<R>]
    : [H, ...Flatten<R>]
  : [];
type TupleToUnion<T extends readonly unknown[]> = T[number];
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;
type Includes<T extends readonly unknown[], U> = T extends readonly [infer H, ...infer R]
  ? Equal<H, U> extends true
    ? true
    : Includes<R, U>
  : false;
type TrimLeft<S extends string> = S extends `${" " | "\n" | "\t"}${infer R}` ? TrimLeft<R> : S;
type Split<S extends string, Sep extends string> = S extends `${infer H}${Sep}${infer R}`
  ? [H, ...Split<R, Sep>]
  : S extends ""
    ? []
    : [S];

type cases = [
  Expect<Equal<MyReturnType<(a: number) => string>, string>>,
  Expect<Equal<MyParameters<(a: number, b?: boolean) => void>, [a: number, b?: boolean]>>,
  Expect<Equal<MyAwaited<Promise<Promise<string>>>, string>>,
  Expect<Equal<IsNever<never>, true>>,
  Expect<Equal<IsNever<string>, false>>,
  Expect<Equal<Flatten<[1, [2, 3], [[4]]]>, [1, 2, 3, [4]]>>,
  Expect<Equal<TupleToUnion<["a", "b"]>, "a" | "b">>,
  Expect<Equal<UnionToIntersection<{ a: 1 } | { b: 2 }>, { a: 1 } & { b: 2 }>>,
  Expect<Equal<Includes<[1, 2, 3], 2>, true>>,
  Expect<Equal<Includes<[1, 2, 3], "2">, false>>,
  Expect<Equal<TrimLeft<"   hi ">, "hi ">>,
  Expect<Equal<Split<"a,b,c", ",">, ["a", "b", "c"]>>,
];
