import { test } from "node:test";
import assert from "node:assert/strict";
import { promiseAll } from "./promiseAll.js";

const delay = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));

test("keeps input order, not completion order", async () => {
  assert.deepEqual(await promiseAll([delay(30, "a"), delay(1, "b"), "c"]), ["a", "b", "c"]);
});

test("empty input resolves to []", async () => {
  assert.deepEqual(await promiseAll([]), []);
});

test("rejects with the first rejection", async () => {
  await assert.rejects(
    promiseAll([delay(20, 1), Promise.reject(new Error("boom")), delay(5, 2)]),
    /boom/,
  );
});

test("accepts any iterable", async () => {
  assert.deepEqual(await promiseAll(new Set([1, 2])), [1, 2]);
});
