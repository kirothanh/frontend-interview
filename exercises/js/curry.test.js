import { test } from "node:test";
import assert from "node:assert/strict";
import { curry } from "./curry.js";

const add3 = (a, b, c) => a + b + c;

test("supports every grouping of arguments", () => {
  const c = curry(add3);
  assert.equal(c(1)(2)(3), 6);
  assert.equal(c(1, 2)(3), 6);
  assert.equal(c(1)(2, 3), 6);
  assert.equal(c(1, 2, 3), 6);
});

test("partial applications are reusable", () => {
  const add1 = curry(add3)(1);
  assert.equal(add1(1, 1), 3);
  assert.equal(add1(2, 2), 5);
});
