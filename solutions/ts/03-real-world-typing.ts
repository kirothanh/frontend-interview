import type { Equal, Expect } from "./utils";

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; w: number; h: number }
  | { kind: "tri"; base: number; height: number };

function assertNever(x: never): never {
  throw new Error(`Unexpected: ${JSON.stringify(x)}`);
}
function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.radius ** 2;
    case "rect": return s.w * s.h;
    case "tri": return (s.base * s.height) / 2;
    default: return assertNever(s);
  }
}

function isString(x: unknown): x is string {
  return typeof x === "string";
}
function isNonNull<T>(x: T): x is NonNullable<T> {
  return x != null;
}
const cleaned = [1, null, 2, undefined].filter(isNonNull);
type _c1 = Expect<Equal<typeof cleaned, number[]>>;

function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((i) => i[key]);
}
const users = [{ name: "a", age: 1 }];
type _c2 = Expect<Equal<ReturnType<typeof pluck<{ name: string; age: number }, "name">>, string[]>>;
// @ts-expect-error - "nope" is not a key of the item type
pluck(users, "nope");

type Events = { login: { user: string }; logout: undefined; resize: { w: number; h: number } };
class Emitter<E extends Record<string, unknown>> {
  on<K extends keyof E>(event: K, handler: (payload: E[K]) => void) {}
  emit<K extends keyof E>(event: K, payload: E[K]) {}
}
const bus = new Emitter<Events>();
bus.on("login", (p) => {
  type _ = Expect<Equal<typeof p, { user: string }>>;
});
// @ts-expect-error - wrong payload shape
bus.emit("resize", { w: 1 });

type Route = { path: string };
const routes = {
  home: { path: "/" },
  about: { path: "/about" },
} as const satisfies Record<string, Route>;
type _c5 = Expect<Equal<typeof routes.home.path, "/">>;

type Brand<T, B extends string> = T & { readonly __brand: B };
type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;
declare function getUser(id: UserId): void;
declare const orderId: OrderId;
// @ts-expect-error - an OrderId must not be accepted as a UserId
getUser(orderId);

function first<T>(arr: readonly T[]): T | undefined {
  return arr[0];
}
type _c7 = Expect<Equal<ReturnType<typeof first<number>>, number | undefined>>;
