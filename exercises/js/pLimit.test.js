import { test } from "node:test";
import assert from "node:assert/strict";
import { pLimit } from "./pLimit.js";

test("never exceeds the concurrency limit and keeps order", async () => {
  let running = 0;
  let peak = 0;
  const task = (v, ms) => async () => {
    running++;
    peak = Math.max(peak, running);
    await new Promise((r) => setTimeout(r, ms));
    running--;
    return v;
  };
  const out = await pLimit([task("a", 20), task("b", 5), task("c", 5), task("d", 5), task("e", 5)], 2);
  assert.deepEqual(out, ["a", "b", "c", "d", "e"]);
  assert.equal(peak, 2);
});

test("limit larger than task count works", async () => {
  assert.deepEqual(await pLimit([async () => 1, async () => 2], 10), [1, 2]);
});

test("rejects when a task rejects", async () => {
  await assert.rejects(pLimit([async () => { throw new Error("x"); }], 1), /x/);
});
