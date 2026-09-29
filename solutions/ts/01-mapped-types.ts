import type { Equal, Expect } from "./utils";

type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyReadonly<T> = { readonly [P in keyof T]: T[P] };
type MyPartial<T> = { [P in keyof T]?: T[P] };
type MyRequired<T> = { [P in keyof T]-?: T[P] };
type MyOmit<T, K extends keyof any> = { [P in keyof T as P extends K ? never : P]: T[P] };
type DeepReadonly<T> = T extends (...args: any[]) => any
  ? T
  : T extends object
    ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
    : T;
type PickByType<T, U> = { [P in keyof T as T[P] extends U ? P : never]: T[P] };
type Getters<T> = { [P in keyof T & string as `get${Capitalize<P>}`]: () => T[P] };

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
