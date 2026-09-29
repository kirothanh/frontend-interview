import { test } from "node:test";
import assert from "node:assert/strict";
import { deepClone } from "./deepClone.js";

test("clones nested objects and arrays without sharing references", () => {
  const src = { a: 1, b: { c: [1, 2, { d: 3 }] } };
  const out = deepClone(src);
  assert.deepEqual(out, src);
  assert.notEqual(out.b, src.b);
  assert.notEqual(out.b.c[2], src.b.c[2]);
});

test("handles Date, RegExp, Map, Set", () => {
  const src = { d: new Date(0), r: /x/gi, m: new Map([["k", { v: 1 }]]), s: new Set([1, 2]) };
  const out = deepClone(src);
  assert.ok(out.d instanceof Date && out.d !== src.d && +out.d === 0);
  assert.ok(out.r instanceof RegExp && out.r.flags === "gi" && out.r !== src.r);
  assert.notEqual(out.m.get("k"), src.m.get("k"));
  assert.deepEqual([...out.s], [1, 2]);
});

test("handles circular references", () => {
  const src = { name: "a" };
  src.self = src;
  const out = deepClone(src);
  assert.equal(out.self, out);
  assert.notEqual(out, src);
});

test("keeps the prototype and preserves undefined values", () => {
  class P { constructor() { this.x = undefined; } hi() { return "hi"; } }
  const out = deepClone(new P());
  assert.equal(out.hi(), "hi");
  assert.ok("x" in out);
});
