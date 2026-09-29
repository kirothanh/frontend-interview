// Conditional types + `infer` + distributive behaviour. Replace each `any`.
import type { Equal, Expect } from "./utils";

// 1. MyReturnType<F>: the return type of a function type (use infer).
type MyReturnType<F> = any;

// 2. MyParameters<F>: the parameter tuple of a function type.
type MyParameters<F> = any;

// 3. MyAwaited<T>: unwrap Promise recursively. Promise<Promise<string>> -> string.
type MyAwaited<T> = any;

// 4. IsNever<T>: true only for `never`. Careful: `T extends never ? ...` is distributive and breaks.
//    Hint: wrap in a tuple to stop distribution.
type IsNever<T> = any;

// 5. Flatten<T>: one-level tuple flatten. [1, [2, 3], [[4]]] -> [1, 2, 3, [4]]
type Flatten<T extends readonly unknown[]> = any;

// 6. TupleToUnion<T>: ["a", "b"] -> "a" | "b"
type TupleToUnion<T extends readonly unknown[]> = any;

// 7. UnionToIntersection<U>: { a: 1 } | { b: 2 } -> { a: 1 } & { b: 2 }
//    Hint: contravariant position of a function parameter.
type UnionToIntersection<U> = any;

// 8. Includes<T, U>: does tuple T contain U? Use Equal for exact matching (no `1 | 2` vs `1` confusion).
type Includes<T extends readonly unknown[], U> = any;

// 9. TrimLeft<S>: strip leading whitespace from a string literal type. Template-literal `infer`.
type TrimLeft<S extends string> = any;

// 10. Split<S, Sep>: "a,b,c" split by "," -> ["a", "b", "c"]
type Split<S extends string, Sep extends string> = any;

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
