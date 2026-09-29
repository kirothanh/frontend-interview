import { test } from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "./EventEmitter.js";

test("on / emit passes arguments to all handlers in order", () => {
  const e = new EventEmitter();
  const log = [];
  e.on("x", (a, b) => log.push(["1", a, b]));
  e.on("x", (a) => log.push(["2", a]));
  e.emit("x", 1, 2);
  assert.deepEqual(log, [["1", 1, 2], ["2", 1]]);
});

test("on() returns an unsubscribe function", () => {
  const e = new EventEmitter();
  let n = 0;
  const off = e.on("x", () => n++);
  e.emit("x");
  off();
  e.emit("x");
  assert.equal(n, 1);
});

test("once fires a single time, and off(fn) can remove it before it fires", () => {
  const e = new EventEmitter();
  let a = 0, b = 0;
  e.once("x", () => a++);
  const h = () => b++;
  e.once("x", h);
  e.off("x", h);
  e.emit("x");
  e.emit("x");
  assert.equal(a, 1);
  assert.equal(b, 0);
});

test("a handler unsubscribing itself does not skip the next handler", () => {
  const e = new EventEmitter();
  const log = [];
  const self = () => { log.push("self"); e.off("x", self); };
  e.on("x", self);
  e.on("x", () => log.push("next"));
  e.emit("x");
  assert.deepEqual(log, ["self", "next"]);
});

test("emitting an event with no handlers is a no-op", () => {
  assert.doesNotThrow(() => new EventEmitter().emit("nothing"));
});
