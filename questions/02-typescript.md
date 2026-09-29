# TypeScript – 4+ year interview question bank

Same method as the JS bank: answer aloud first, then check. Pair each section with the matching file in `exercises/ts/`.

---

## 1. Fundamentals interviewers still ask

**Q1. `type` vs `interface`?**
Both describe object shapes. `interface`: declaration merging, `extends`, better error messages, the default for public object/class contracts. `type`: unions, intersections, tuples, mapped/conditional types, primitives aliases. Rule of thumb: `interface` for extendable object shapes, `type` for everything else. Be consistent in a codebase.

**Q2. `any` vs `unknown` vs `never`?**
`any` turns the type checker off (infects everything it touches). `unknown` = "some value, must narrow before use" – the safe top type (use for `catch (e)`, JSON, third-party input). `never` = no possible value: functions that throw/never return, exhausted unions, impossible branches.

**Q3. What does `strict` enable, and which flags matter most?**
`strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, `strictPropertyInitialization`, `useUnknownInCatchVariables`, … Also know `noUncheckedIndexedAccess` (arrays/records return `T | undefined`), `exactOptionalPropertyTypes`, `verbatimModuleSyntax`.

**Q4. Type assertion (`as`) vs type guard vs `satisfies`?**
`as` overrides the compiler (no runtime check → can lie). Type guards (`typeof`, `instanceof`, `in`, user-defined `x is T`, assertion functions `asserts x is T`) actually narrow, with runtime evidence. `satisfies` (TS 4.9) *validates* a value against a type **without widening** it, so you keep literal/specific types.
```ts
const a = { home: "/" } satisfies Record<string, string>;
a.home; // string  (checked against the shape, but literal is widened)
const b = { home: "/" } as const satisfies Record<string, string>;
b.home; // "/"     (checked AND literal preserved)
```

**Q5. `readonly`, `as const`, `Readonly<T>`, `ReadonlyArray`?**
Compile-time only; not `Object.freeze`. `as const` freezes literal types deeply (tuples become `readonly ["a","b"]`, strings stay literal) – use it to derive union types from arrays:
```ts
const ROLES = ["admin", "user"] as const;
type Role = (typeof ROLES)[number]; // "admin" | "user"
```

**Q6. Enums vs union of literals?**
Prefer string-literal unions or `as const` objects: no runtime code, tree-shakeable, no numeric-enum reverse-mapping surprises. `const enum` is problematic with `isolatedModules`.

---

## 2. Generics (must be fluent)

**Q7. Why generics? Constraints? Defaults?**
Reuse logic while preserving the relationship between input and output types.
```ts
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] { return items.map(i => i[key]); }
type ApiResponse<T = unknown> = { data: T; error?: string };
```
*Follow-up:* Why is `function f<T>(x: T): T` different from `function f(x: any): any`? (The former links output to input.)

**Q8. Inference: when does TS widen, when does it keep literals?**
`let x = "a"` → `string`; `const x = "a"` → `"a"`. Generic `T extends string` keeps literals. Use `as const` / `const T` type params (TS 5.0) to keep them.

**Q9. Covariance / contravariance / bivariance, in practice.**
Function *return* types are covariant, *parameter* types are contravariant under `strictFunctionTypes`. Method-shorthand params stay bivariant (historic unsoundness). This is why `UnionToIntersection` works (see `02-conditional-and-infer.ts`).

**Q10. Overloads vs generics vs union parameters?**
Prefer a generic or union first. Use overloads only when the *return type depends on which argument shape* was passed. Overload order matters: most specific first. The implementation signature isn't visible to callers.

---

## 3. Narrowing & safety (the day-to-day)

**Q11. Discriminated unions + exhaustiveness.**
Give each variant a literal `kind`; `switch` on it; add `default: assertNever(x)` so a new variant fails to compile. See `03-real-world-typing.ts §1`. Model UI state this way instead of many booleans:
```ts
type Fetch<T> = { status: "idle" } | { status: "loading" } | { status: "error"; error: Error } | { status: "success"; data: T };
```

**Q12. How do you narrow?** `typeof`, `instanceof`, `in`, equality, truthiness, discriminant property, custom guards. Watch out: narrowing is lost across callbacks and after mutation; `filter(Boolean)` doesn't narrow (write `isNonNull` – see exercise).

**Q13. Non-null assertion `!` and definite assignment `!:`?** Escape hatches – acceptable only when you can prove it (and comment why). Prefer early returns / guards / optional chaining.

**Q14. Branded (nominal) types – why?** TS is structural: `UserId` and `OrderId` (both `string`) are interchangeable. Brand: `type UserId = string & { readonly __brand: "UserId" }`; create via a validating constructor.

**Q15. Typing `catch`, JSON, and API data.**
`catch (e: unknown)` → narrow with `e instanceof Error`. Types don't validate runtime data – use a schema library (**Zod/Valibot**) at the boundary and `z.infer` to derive the type. "Parse, don't validate."

---

## 4. Advanced types (differentiates 4+ from mid)

**Q16. Utility types you should use without thinking.**
`Partial Required Readonly Pick Omit Record Exclude Extract NonNullable ReturnType Parameters Awaited InstanceType ThisType`. Know how to write each yourself (`01-mapped-types.ts`).
*Follow-up:* `Omit<Union, K>` doesn't distribute – why? (`keyof (A|B)` is only the common keys.) Write a distributive `DistributiveOmit`.

**Q17. Mapped types & key remapping.**
`{ [K in keyof T as \`get${Capitalize<K & string>}\`]: () => T[K] }`; modifiers `+readonly`, `-?`.

**Q18. Conditional types + `infer` + distribution.**
`T extends U ? X : Y` distributes over naked union `T`. Stop with `[T] extends [U]`. `infer` captures a type in the `extends` clause: `T extends Promise<infer R> ? R : T`. `IsNever` is the standard gotcha.

**Q19. Template literal types.** `` type Route = `/${string}` ``; parse strings at the type level (`Split`, `TrimLeft`); typed event names like `` `on${Capitalize<E>}` ``.

**Q20. `keyof typeof obj`, indexed access, `typeof` in type position, `T[number]`.** Derive types from *values* so there's one source of truth.

**Q21. `declare module`, `.d.ts`, `@types/*`, declaration merging, module augmentation, `global`.** How to type a library that ships no types; how to extend `Window` or Express `Request`.

**Q22. Recursion limits & performance.** Deep conditional types hit "excessively deep" errors (~50 nested for non-tail-recursive; tail-recursive conditional types allow ~1000). Prefer simpler types; large unions/intersections slow `tsc` (use `tsc --extendedDiagnostics`, project references, `skipLibCheck`).

---

## 5. TS in React / frontend projects

**Q23. Typing props, children, events, refs, hooks.**
`React.ComponentProps<"button">`, `PropsWithChildren`, `React.ReactNode`, `React.ChangeEvent<HTMLInputElement>`, `useRef<HTMLDivElement>(null)`, `useState<User | null>(null)`, typed `useReducer` with a discriminated union action type, generic components `function List<T>(props: { items: T[]; render: (t: T) => ReactNode })`.

**Q24. Polymorphic `as` prop / extending native element props without conflicts?**
`type Props<C extends React.ElementType> = { as?: C } & Omit<React.ComponentPropsWithoutRef<C>, "as">`.

**Q25. tsconfig for a modern app?**
`"target": "ES2022"`, `"module": "ESNext"`, `"moduleResolution": "Bundler"`, `"strict": true`, `"isolatedModules": true`, `"noUncheckedIndexedAccess": true`, `"skipLibCheck": true`, `paths` aliases (and mirror them in the bundler). TS doesn't emit/transpile in Vite/esbuild/SWC – type-check separately with `tsc --noEmit` in CI.

---

## 6. Explain-the-output drills

```ts
// A: what is T?
type T1 = string extends "a" ? 1 : 2;                       // 2
// B: distributive
type ToArr<T> = T extends any ? T[] : never;
type T2 = ToArr<string | number>;                           // string[] | number[]
type ToArr2<T> = [T] extends [any] ? T[] : never;
type T3 = ToArr2<string | number>;                          // (string | number)[]
// C: excess property check
const p: { a: number } = { a: 1, b: 2 };                    // error (fresh literal)
const tmp = { a: 1, b: 2 }; const q: { a: number } = tmp;   // OK (not fresh)
// D: array index
const arr: number[] = []; const v = arr[0];                 // number (unless noUncheckedIndexedAccess)
// E: keyof
type K = keyof { a: 1; b: 2 } | keyof any[];                // "a" | "b" | number | "length" | "push" | ...
```

---

## 7. How to talk about TS in a behavioural round

- "I use the compiler to make illegal states unrepresentable" → discriminated unions, branded IDs, exhaustive switches.
- "Types stop at the network boundary, so I validate with a schema" → Zod + `z.infer`.
- "I avoid clever types when a simple one is readable" → shows judgement, the thing a 4+ dev is hired for.
- "I migrate incrementally": `allowJs` + `checkJs`, strict per-directory, ban new `any` with lint (`@typescript-eslint/no-explicit-any`), track `// @ts-expect-error` (not `@ts-ignore`) count.
