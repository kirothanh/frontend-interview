# frontend-interview

A practice workspace for **JavaScript + TypeScript interviews at the 4+ years level**.

```
questions/     Q&A banks – answer aloud first, then check           (01-javascript.md, 02-typescript.md)
exercises/js/  10 live-coding tasks: stub + tests. YOU implement    (npm run test:js)
exercises/ts/  27 type-level & real-world typing tasks              (npm run test:ts)
solutions/     Reference answers – peek only after a real attempt
MISSION.md     Why we're learning this (drives what the teacher picks next)
.agents/skills Skills installed from mattpocock/skills (see below)
```

## Setup

```bash
npm install
npm test          # everything starts RED – that's the point
```

Requires Node ≥ 22.18 (runs tests with the built-in runner, no framework needed).

## The loop (30–45 min a day)

1. **Recall** – pick 5 questions from `questions/`, answer out loud, mark misses ❌.
2. **Build** – open one exercise in `exercises/js/`, read the comment, implement until `npm run test:js` is green for it. Set a 20-minute timer, like a real round.
3. **Types** – one file from `exercises/ts/` every other day; `npm run test:ts` until it compiles.
4. **Compare** – only then read `solutions/`. Note *what you missed*, not just what differs.
5. **Re-do** the ones you failed after 2 days and again after 7 (spaced retrieval).

Run a single JS exercise: `node --test exercises/js/debounce.test.js`.

## Skills installed (from `npx skills add mattpocock/skills`)

Installed into `.agents/skills/` (symlinked for Claude Code in `.claude/skills/`). Chosen for interview prep:

| Skill | Use it for |
|---|---|
| `/teach` | Stateful tutor: builds lessons/cheat-sheets around `MISSION.md`, tracks what you've learned. Start: `/teach event loop and promises` |
| `/grill-me` (`/grilling`) | **Mock interviewer.** "Grill me on closures and the event loop." Asks rounds of hard questions with follow-ups. |
| `/tdd` | Do the exercises test-first with Claude as pair: red → green, tests through public behaviour, no tautological tests. |
| `/scaffold-exercises` | Generate more exercise folders (sections/problems/solutions) in the same style. |
| `/research` | Investigate a topic from primary sources (MDN, spec, TS handbook) into a Markdown note. |
| `/wait-what` | When an explanation doesn't land: "re-pitch it." |
| `/ask-matt` | Router: which skill fits what I'm doing now. |

Not installed on purpose (engineering-team workflow, not learning): `triage`, `to-spec`, `to-tickets`, `wayfinder`, `implement*`, `pr`, `retro`, `handoff`, etc. Add any with `npx skills add mattpocock/skills --skill <name>`.

## Suggested 2-week plan

| Days | JS | TS |
|---|---|---|
| 1–2 | Q1–Q5 (scope/closure/this) · `debounce`, `throttle`, `myBind` | Q1–Q6 fundamentals |
| 3–4 | Q9–Q13 (event loop/async) · `promiseAll`, `pLimit` | Q7–Q10 generics · `03-real-world-typing.ts` §3–4 |
| 5–6 | Q6–Q8 (prototypes) · `EventEmitter`, `curry`, `memoize` | Q11–Q15 narrowing · `03-real-world-typing.ts` §1–2, 5–7 |
| 7 | Mock interview with `/grill-me` (JS) | Mock interview with `/grill-me` (TS) |
| 8–10 | Q14–Q22 · `deepClone`, `LRUCache` | `01-mapped-types.ts` (Q16–17) |
| 11–12 | Q23–Q29 browser/perf · output-prediction drills daily | `02-conditional-and-infer.ts` (Q18–Q19) |
| 13–14 | Redo every ❌ · timed live-coding (two exercises back-to-back) | Redo ❌ · Q23–Q25 (React + TS) |

Next topics once JS/TS feel solid: React (hooks, rendering, state), browser performance, CSS layout, frontend system design, web security, behavioural stories.
