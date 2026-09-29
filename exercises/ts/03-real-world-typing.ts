// Practical TS that interviews actually ask: generics, narrowing, discriminated unions,
// exhaustiveness, overload-free typed APIs. Replace each `any` / fill each body.
// `npm run test:ts` must compile. The @ts-expect-error lines must ERROR (unused ones fail the build).
import type { Equal, Expect } from "./utils";

// ---- 1. Discriminated union + exhaustive switch ---------------------------------------
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; w: number; h: number }
  | { kind: "tri"; base: number; height: number };

// Implement area(). Add an `assertNever` default so adding a new Shape breaks the build.
function assertNever(x: never): never {
  throw new Error(`Unexpected: ${JSON.stringify(x)}`);
}
function area(s: Shape): number {
  return 0 as any;
}

// ---- 2. Type guards ---------------------------------------------------------------------
// isString must narrow. `isNonNull` must remove null | undefined so .filter(isNonNull) gives T[].
function isString(x: unknown): x is any {
  return false;
}
function isNonNull<T>(x: T): x is any {
  return false;
}
const cleaned = [1, null, 2, undefined].filter(isNonNull);
type _c1 = Expect<Equal<typeof cleaned, number[]>>;

// ---- 3. Generic constraint: keyof + indexed access ------------------------------------
// pluck(users, "name") must return string[]; a bad key must not compile.
function pluck<T, K extends any>(items: T[], key: K): any[] {
  return items.map((i) => (i as any)[key]);
}
const users = [{ name: "a", age: 1 }];
type _c2 = Expect<Equal<ReturnType<typeof pluck<{ name: string; age: number }, "name">>, string[]>>;
// @ts-expect-error - "nope" is not a key of the item type
pluck(users, "nope");

// ---- 4. Typed event map ---------------------------------------------------------------
// Make `on` infer the payload from the event name.
type Events = { login: { user: string }; logout: undefined; resize: { w: number; h: number } };
class Emitter<E extends Record<string, unknown>> {
  on(event: any, handler: (payload: any) => void) {}
  emit(event: any, payload: any) {}
}
const bus = new Emitter<Events>();
bus.on("login", (p) => {
  type _ = Expect<Equal<typeof p, { user: string }>>;
});
// @ts-expect-error - wrong payload shape
bus.emit("resize", { w: 1 });

// ---- 5. satisfies + as const ---------------------------------------------------------------
// Keep literal types AND check the shape. `routes.home` must be the literal "/" not string.
type Route = { path: string };
const routes = {
  home: { path: "/" },
  about: { path: "/about" },
} as any;
type _c5 = Expect<Equal<typeof routes.home.path, "/">>;

// ---- 6. Branded / opaque types ---------------------------------------------------------
// Make UserId and OrderId incompatible even though both are strings.
type UserId = any;
type OrderId = any;
declare function getUser(id: UserId): void;
declare const orderId: OrderId;
// @ts-expect-error - an OrderId must not be accepted as a UserId
getUser(orderId);

// ---- 7. Function overloads vs generics -------------------------------------------------
// first([]) -> undefined, first([1]) -> number | undefined. Implement with a generic, not `any`.
function first<T>(arr: readonly T[]): any {
  return arr[0];
}
type _c7 = Expect<Equal<ReturnType<typeof first<number>>, number | undefined>>;
