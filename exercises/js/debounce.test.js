import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { debounce } from "./debounce.js";

test("calls once after the wait, with the last arguments", () => {
  mock.timers.enable({ apis: ["setTimeout"] });
  const fn = mock.fn();
  const d = debounce(fn, 100);
  d(1);
  mock.timers.tick(50);
  d(2);
  mock.timers.tick(99);
  assert.equal(fn.mock.callCount(), 0);
  mock.timers.tick(1);
  assert.equal(fn.mock.callCount(), 1);
  assert.deepEqual(fn.mock.calls[0].arguments, [2]);
  mock.timers.reset();
});

test("preserves `this`", () => {
  mock.timers.enable({ apis: ["setTimeout"] });
  let seen;
  const obj = { d: debounce(function () { seen = this; }, 10) };
  obj.d();
  mock.timers.tick(10);
  assert.equal(seen, obj);
  mock.timers.reset();
});

test("cancel() prevents the pending call", () => {
  mock.timers.enable({ apis: ["setTimeout"] });
  const fn = mock.fn();
  const d = debounce(fn, 100);
  d();
  d.cancel();
  mock.timers.tick(200);
  assert.equal(fn.mock.callCount(), 0);
  mock.timers.reset();
});
