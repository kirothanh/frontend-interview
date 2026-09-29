import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { throttle } from "./throttle.js";

test("runs immediately, drops calls inside the window, runs again after", () => {
  mock.timers.enable({ apis: ["Date"] });
  const fn = mock.fn();
  const t = throttle(fn, 100);
  t("a");
  t("b");
  mock.timers.tick(99);
  t("c");
  assert.equal(fn.mock.callCount(), 1);
  mock.timers.tick(1);
  t("d");
  assert.equal(fn.mock.callCount(), 2);
  assert.deepEqual(fn.mock.calls.map((c) => c.arguments[0]), ["a", "d"]);
  mock.timers.reset();
});
