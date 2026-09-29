# JavaScript – 4+ year interview question bank

Method: cover the answer, say it out loud in ≤60 seconds, then check. Mark ❌ the ones you stumble on and revisit in 2 days (spaced retrieval).
Each question has the **short answer**, then the **follow-up a senior interviewer will ask**.

---

## 1. Scope, closures, `this`

**Q1. What is a closure? Give a real use case.**
A function that keeps access to variables of the scope it was created in, even after that scope has returned. Uses: private state, `debounce`/`memoize`, event handlers in loops, React hooks (`useState` is closure state).
*Follow-up:* What is the stale-closure bug in `useEffect`/`setInterval`, and how do you fix it? (Callback captured old value → use functional update, a ref, or correct deps.)

**Q2. `var` vs `let` vs `const`. What is the TDZ?**
`var`: function-scoped, hoisted and initialised to `undefined`. `let`/`const`: block-scoped, hoisted but uninitialised until the declaration line (temporal dead zone → `ReferenceError`). `const` prevents rebinding, not mutation.
*Predict:*
```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));   // 3 3 3
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i));   // 0 1 2 (fresh binding per iteration)
```

**Q3. How is `this` determined?** (priority order)
1. `new` → the new object. 2. `call/apply/bind` → explicit. 3. Method call `obj.fn()` → `obj`. 4. Plain call → `undefined` (strict/modules) or global. Arrow functions have **no own `this`**; they use the enclosing lexical one and can't be rebound.
*Predict:*
```js
const o = { n: 1, get() { return this.n; } };
const g = o.get;
g();            // TypeError in strict mode/modules (this is undefined); `undefined` in sloppy scripts (global.n)
o.get();        // 1
setTimeout(o.get, 0); // this lost again
```
*Follow-up:* Why are arrow functions bad as object methods or prototype methods?

**Q4. `call`, `apply`, `bind` differences?** `call(thisArg, a, b)`, `apply(thisArg, [a, b])`, `bind(thisArg, a)` returns a new function and doesn't invoke. A bound function ignores a later `call`'s `this`, but `new` overrides bind (see the `myBind` exercise).

**Q5. Hoisting: function declaration vs function expression vs class?**
Declarations are hoisted with their body. `var fn = function(){}` hoists only `undefined`. `class` and `let/const` are in the TDZ.

---

## 2. Prototypes & OOP

**Q6. Explain the prototype chain. What does `new` do?**
Property lookup walks `obj → obj.__proto__ → … → null`. `new F(...)`: create object with `__proto__ = F.prototype`, run `F` with `this` = that object, return it unless `F` returns an object.
*Follow-up:* Implement `myNew` and `instanceof` from scratch.
```js
const myInstanceOf = (o, C) => { for (let p = Object.getPrototypeOf(o); p; p = Object.getPrototypeOf(p)) if (p === C.prototype) return true; return false; };
```

**Q7. `class` vs constructor function?** Syntax sugar over prototypes, but: not hoisted-usable, always strict, must be called with `new`, methods non-enumerable, supports `#private` fields (truly private), `static`, `extends`/`super`.

**Q8. `Object.create(null)` – why use it?** No prototype → safe dictionary, no `toString`/`__proto__` key collisions. Prefer `Map` when keys aren't strings or you need order/size.

---

## 3. Async & event loop (asked in almost every interview)

**Q9. Explain the event loop.** Call stack runs sync code. When empty: run **all microtasks** (promise `.then`, `queueMicrotask`, `await` continuations, `MutationObserver`), then take **one macrotask** (`setTimeout`, I/O, UI events, `MessageChannel`), then the browser may render, repeat.
*Predict — the classic:*
```js
console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
(async () => { console.log(4); await null; console.log(5); })();
console.log(6);
// 1 4 6 3 5 2
```
*Why:* `await null` schedules the rest as a microtask queued after the `.then(3)`. Sync first, then microtasks in FIFO order, then the timer.

**Q10. Promise combinators?**
- `all`: all fulfil, or first rejection. - `allSettled`: never rejects, gives `{status,value|reason}`. - `race`: first to settle. - `any`: first to **fulfil** (`AggregateError` if all reject).
*Follow-up:* How would you add a timeout to a fetch? (`Promise.race` with a timer, or `AbortSignal.timeout(ms)`.) Why is aborting better than racing? (Race leaves the request running.)

**Q11. `async/await` pitfalls.**
- `forEach(async …)` does not wait. Use `for…of` (sequential) or `Promise.all(arr.map(...))` (parallel).
- Sequential `await`s of independent calls are slow → start them together, then `await Promise.all`.
- Unhandled rejections: always `try/catch` or `.catch`.
- `return await` matters only inside `try/catch`.

**Q12. Race conditions in UI data fetching (search-as-you-type).** Older response arrives after newer one. Fixes: `AbortController` on the previous request, or ignore stale results with a request-id / `ignore` flag in the effect cleanup. Plus debounce input.

**Q13. Implement `sleep`, `retry(fn, n, delay)`, `promisify`.** (Practice cold, whiteboard style.)
```js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function retry(fn, n = 3, delay = 200) {
  for (let i = 0; ; i++) {
    try { return await fn(); }
    catch (e) { if (i >= n - 1) throw e; await sleep(delay * 2 ** i); } // exponential backoff
  }
}
```

---

## 4. Types, coercion, equality

**Q14. Data types & how to check them?** 7 primitives (`string number bigint boolean undefined null symbol`) + object. `typeof null === "object"` (historic bug). Arrays: `Array.isArray`. Precise type: `Object.prototype.toString.call(x)`.

**Q15. `==` vs `===`; tricky results?**
`===` no coercion. `null == undefined` is true (and only equal to each other under `==`). `NaN !== NaN` → use `Number.isNaN` / `Object.is`. `[] + {} === "[object Object]"`, `[] == false` is true, `0.1 + 0.2 !== 0.3` (use epsilon or integer cents).

**Q16. Truthy/falsy, `||` vs `??` vs `?.`**
Falsy: `false 0 -0 0n "" null undefined NaN`. `??` only skips `null/undefined` (keeps `0` and `""`); `||` skips all falsy. `a ||= b`, `a ??= b` are short-circuit assignments.

**Q17. Value vs reference; shallow vs deep copy.** Objects assigned by reference. Shallow: spread, `Object.assign`, `slice`. Deep: `structuredClone` (handles Date/Map/Set/cycles; **not** functions, DOM nodes, class prototypes). `JSON.parse(JSON.stringify())` drops `undefined`, functions, `Symbol`, turns `Date` into strings, throws on cycles, mangles `NaN`/`Infinity`.

---

## 5. Modern language features

**Q18. `Map`/`Set`/`WeakMap`/`WeakRef`?** `Map` keeps insertion order and allows any key type. `WeakMap` keys must be objects and don't prevent GC → private metadata, caches, DOM node data without leaks.

**Q19. Iterators, generators, `for…of` vs `for…in`?** `for…in` = enumerable **keys** incl. inherited (avoid for arrays). `for…of` = values from `[Symbol.iterator]`. Generators (`function*`, `yield`) are lazy, pausable iterators; async generators + `for await` for streams.

**Q20. Destructuring, spread, rest — gotchas?** Spread is shallow. Default values apply only for `undefined`, not `null`. Renaming: `const { a: x = 1 } = obj`.

**Q21. ES modules vs CommonJS?** ESM: static `import/export`, live bindings, async loading, tree-shakeable, strict mode, top-level `await`. CJS: dynamic `require`, copies of exports, sync. Circular imports behave differently.

**Q22. Symbol, Proxy, Reflect — when?** `Proxy` for validation, reactivity (Vue 3), observable stores. `Symbol` for unique keys and well-known protocols (`Symbol.iterator`).

---

## 6. Browser & performance (frontend-specific JS)

**Q23. Event delegation, bubbling, capturing?** Events go capture (root→target) → target → bubble (target→root). Delegate on a parent with `e.target.closest(selector)`: fewer listeners, works for dynamic children. `stopPropagation` vs `preventDefault` vs `stopImmediatePropagation`. `{ once, passive, capture }` options.

**Q24. Debounce vs throttle, and where to use each?** Debounce: after inactivity (search input, resize end, autosave). Throttle: at most once per interval (scroll, mousemove, drag). `requestAnimationFrame` for visual updates.

**Q25. What causes layout thrashing / reflow, and how do you avoid it?** Interleaving DOM reads (`offsetHeight`) and writes forces synchronous layout. Batch reads then writes; use `transform/opacity` (compositor-only); `requestAnimationFrame`; `IntersectionObserver` instead of scroll handlers.

**Q26. Memory leaks in JS SPAs — top causes?** Un-removed listeners, timers/intervals, subscriptions never cleaned up, detached DOM nodes held in variables, closures retaining big objects, unbounded caches (use LRU / `WeakMap`). Find with DevTools heap snapshots (compare two).

**Q27. `localStorage` vs `sessionStorage` vs cookies vs IndexedDB?** Sizes/lifetime/sent-with-requests/sync-vs-async. Cookies: `HttpOnly`, `Secure`, `SameSite` for auth tokens; never keep JWTs in `localStorage` if XSS is a concern.

**Q28. XSS / CSRF / CORS in one line each.** XSS: attacker's script runs on your origin → escape output, CSP, avoid `innerHTML`. CSRF: forged cross-site request using ambient cookies → `SameSite`, CSRF tokens. CORS: browser rule about *reading* cross-origin responses; preflight `OPTIONS` for non-simple requests; it's not a server-side security control.

**Q29. `defer` vs `async` script? Critical rendering path?** `async`: download parallel, run ASAP (order not guaranteed). `defer`: download parallel, run in order after HTML parse. Modules are deferred by default.

---

## 7. Output-prediction drills (do 5 a day)

```js
// A
console.log([1, 2, 3].map(parseInt));            // [1, NaN, NaN]  (index is the radix)
// B
console.log(typeof typeof 1);                    // "string"
// C
var a = 1; function f() { console.log(a); var a = 2; } f();   // undefined (local var hoisted)
// D
console.log(0.1 + 0.2 === 0.3, [10, 9, 1].sort()); // false [1, 10, 9] (default sort is lexicographic)
// E
const obj = { a: 1, b: { c: 2 } }; const copy = { ...obj }; copy.b.c = 99; console.log(obj.b.c); // 99
// F
console.log([..."hi"].length, "b" + "a" + +"a" + "a"); // 2 "baNaNa"
// G
Promise.reject(1).catch(() => 2).then((v) => console.log(v)); // 2
// H
const o = { f() { return () => this; } }; console.log(o.f()() === o); // true
```

---

## 8. Live-coding shortlist (implement from memory, no docs)

Done in `exercises/js/`: `debounce`, `throttle`, `curry`, `memoize`, `deepClone`, `promiseAll`, `pLimit`, `EventEmitter`, `LRUCache`, `myBind`.
Do next (write your own tests): `Array.prototype.flat/reduce/map` polyfills · `promiseAllSettled/race/any` · `retry` · `compose/pipe` · `once` · `groupBy` · `chunk` · `uniqueBy` · `deepEqual` · `get(obj, "a.b[0].c")` · `flattenObject` · `debounce` with `leading/trailing` · `Observable` · `parseQueryString` · `binarySearch` · `isBalancedBrackets` · `twoSum`.
