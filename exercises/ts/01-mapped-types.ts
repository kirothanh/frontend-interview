// Run `npm run test:ts`. Every red squiggle / tsc error is an unsolved exercise.
// Replace each `any` with a real implementation. No built-in Pick/Omit/Readonly/etc.
import type { Equal, Expect } from "./utils";

// 1. MyPick<T, K>: keep only keys K of T.
type MyPick<T, K extends keyof T> = any;

// 2. MyReadonly<T>: make every property readonly.
type MyReadonly<T> = any;

// 3. MyPartial<T>: make every property optional. Then MyRequired<T> does the reverse (-?).
type MyPartial<T> = any;
type MyRequired<T> = any;

// 4. MyOmit<T, K>: drop keys K. Hint: `as` key remapping in a mapped type, or Pick + Exclude.
type MyOmit<T, K extends keyof any> = any;

// 5. DeepReadonly<T>: recursively readonly (objects only; leave functions and primitives alone).
type DeepReadonly<T> = any;

// 6. PickByType<T, U>: keep only the properties of T whose value type extends U.
type PickByType<T, U> = any;

// 7. Getters<T>: { name: string } -> { getName: () => string }. Hint: `as` + Capitalize + template literal.
type Getters<T> = any;

interface Todo { title: string; description: string; done: boolean }

type cases = [
  Expect<Equal<MyPick<Todo, "title" | "done">, { title: string; done: boolean }>>,
  Expect<Equal<MyReadonly<Todo>, { readonly title: string; readonly description: string; readonly done: boolean }>>,
  Expect<Equal<MyPartial<Todo>, { title?: string; description?: string; done?: boolean }>>,
  Expect<Equal<MyRequired<{ a?: 1; b?: 2 }>, { a: 1; b: 2 }>>,
  Expect<Equal<MyOmit<Todo, "description">, { title: string; done: boolean }>>,
  Expect<Equal<DeepReadonly<{ a: { b: { c: string[] } }; f: () => void }>["a"]["b"], { readonly c: readonly string[] }>>,
  Expect<Equal<PickByType<{ a: string; b: number; c: string }, string>, { a: string; c: string }>>,
  Expect<Equal<Getters<{ name: string; age: number }>, { getName: () => string; getAge: () => number }>>,
];
