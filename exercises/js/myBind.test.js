import { test } from "node:test";
import assert from "node:assert/strict";
import { myBind } from "./myBind.js";

test("binds `this`", () => {
  function who() { return this.name; }
  assert.equal(myBind(who, { name: "ann" })(), "ann");
});

test("supports partial application", () => {
  function add(a, b, c) { return a + b + c; }
  assert.equal(myBind(add, null, 1, 2)(3), 6);
});

test("`new bound()` ignores thisArg and constructs the original", () => {
  function Point(x, y) { this.x = x; this.y = y; }
  const B = myBind(Point, { ignored: true }, 1);
  const p = new B(2);
  assert.equal(p.x, 1);
  assert.equal(p.y, 2);
  assert.ok(p instanceof Point);
});
