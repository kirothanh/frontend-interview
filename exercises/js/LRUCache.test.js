import { test } from "node:test";
import assert from "node:assert/strict";
import { LRUCache } from "./LRUCache.js";

test("evicts the least recently used key", () => {
  const c = new LRUCache(2);
  c.set("a", 1);
  c.set("b", 2);
  c.set("c", 3);
  assert.equal(c.get("a"), undefined);
  assert.equal(c.get("b"), 2);
  assert.equal(c.get("c"), 3);
});

test("get() refreshes recency", () => {
  const c = new LRUCache(2);
  c.set("a", 1);
  c.set("b", 2);
  c.get("a");
  c.set("c", 3);
  assert.equal(c.get("b"), undefined);
  assert.equal(c.get("a"), 1);
});

test("set() on an existing key updates the value and refreshes recency", () => {
  const c = new LRUCache(2);
  c.set("a", 1);
  c.set("b", 2);
  c.set("a", 10);
  c.set("c", 3);
  assert.equal(c.get("a"), 10);
  assert.equal(c.get("b"), undefined);
});

test("stores falsy values", () => {
  const c = new LRUCache(1);
  c.set("z", 0);
  assert.equal(c.get("z"), 0);
});
