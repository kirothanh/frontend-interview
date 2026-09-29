import { test } from "node:test";
import assert from "node:assert/strict";
import { memoize } from "./memoize.js";

test("calls the underlying fn once per distinct args", () => {
  let calls = 0;
  const sq = memoize((n) => (calls++, n * n));
  assert.equal(sq(4), 16);
  assert.equal(sq(4), 16);
  assert.equal(sq(5), 25);
  assert.equal(calls, 2);
});

test("caches falsy results", () => {
  let calls = 0;
  const zero = memoize(() => (calls++, 0));
  zero();
  zero();
  assert.equal(calls, 1);
});

test("custom resolver controls the cache key", () => {
  let calls = 0;
  const f = memoize((obj) => (calls++, obj.id), (obj) => obj.id);
  f({ id: 1, extra: "a" });
  f({ id: 1, extra: "b" });
  assert.equal(calls, 1);
});
