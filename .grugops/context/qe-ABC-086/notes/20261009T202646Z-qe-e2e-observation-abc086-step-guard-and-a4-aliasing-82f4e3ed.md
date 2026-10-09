---
id: 20261009T202646Z-qe-e2e-observation-abc086-step-guard-and-a4-aliasing-82f4e3ed
kind: observation
by: qe-e2e
at: 2026-10-09T20:26:46Z
verified_by:
confidence: high
refs:
  - ABC-086
  - ABC-084
  - ABC-085
  - ABC-087
  - ADR-0027
  - src/virtual-clock.ts
  - src/engine.ts
  - src/engine.test.ts
supersedes:
---

# `ABC-086` focus 2 and 4: the step guard stops the five named steps but not a small one; the `A4` grep misses aliased clock reads

Hand-authored, no seal. Reported, not widened: `A7` and `A4` are met as written. Probes in
`../probe/`: `guard.mts` + `guard-child.mts` (`guard.out.txt`), `slow-step.mts`
(`slow-step.out.txt`), `a4-alias.mjs` (`a4-alias.out.jsonl`). Every input ran in its own child
process under a bound (SIGTERM), so no probe could hang the session.

## Focus 2 — the step guard (`A7`)

**Thrown at the factory (loud):**

- `0`, `-0`, `-1`, `NaN`, `Infinity`, `-Infinity` throw `RangeError`.
- Non-numbers throw too, because `Number.isFinite` does not coerce: `"1"`, `"abc"`, `undefined`,
  `null`, `true`, `1n`, `new Number(1)`, `{ valueOf: () => 1 }` and `[1]`.
- `Symbol()` and `Object.create(null)` throw **`TypeError`**, not `RangeError`. The message
  template cannot stringify them. Still loud.
- The message is ambiguous for some of these: `"1"`, `1n`, `new Number(1)` and `[1]` all read
  `got 1`. Info only.

**Accepted, then the shipped engine on that clock** (kiwipete, budget 2):

| step | outcome |
|---|---|
| huge (`2**53`, `1e300`, `Number.MAX_VALUE`) | terminates at depth 1 in 16 ms, which is correct. **Silently odd `elapsedMs`:** `2e+300`, or `Infinity` and then **`NaN`** on a second search on the same clock (`MAX_VALUE` overflows to `Infinity`, and `Infinity − Infinity`). Info: nothing on the shipped path reads it |
| `0.1` | d3, 18 002 nodes, 0.15 s |
| `0.01` | d5, 200 274 nodes, 1.9 s |
| `0.001` | d8, 2 041 426 nodes, **13.8 s per search** (the guard probe's 20 s bound killed it at two searches; `slow-step.out.txt` is the single-search reading) |
| `1e-4` | killed at 20 s; ≈ 20 M nodes by the arithmetic, ≈ 140 s |
| `1e-9`, `Number.EPSILON` | killed; ≈ 2·10⁹ to 9·10¹⁵ readings, **effectively never** |
| `1e-17`, `Number.MIN_VALUE` | killed. Worse: the reading **freezes** before it reaches 2 (float absorption, checked in `node`: `0.125 + 1e-17 === 0.125`, while `0.124 + 1e-17` still advances; for `MIN_VALUE`, `2**-1021 + Number.MIN_VALUE === 2**-1021`). That is **the frozen clock the guard exists to prevent, admitted by it** |

**The cost law:** a search costs about 1 020 × budget / step nodes. The guard cannot know the
budget, and `HARD_CEILING_MS` clamps the budget but not the number of readings. `ADR-0027`
decision 6 makes a small step the sanctioned dial. So **a units slip in a harness (seconds for
milliseconds, `virtualClock(0.001)`) is a 14 s search at budget 2 and hours at the ceiling,
silently.** The ticket's sentence "a harness typo fails loudly instead of hanging" holds for the
five named steps only. → **G-QE-2 (LOW)**, carried to the `ABC-084`/`ABC-085`/`ABC-087` harness
authors. QE does not propose widening this ticket.

## Focus 4 — `A4`'s grep against aliasing

Each variant was planted in a scratch copy of the module (never the worktree), and its clock was
called to confirm the read executes ("live"). Two checks ran on each: the shipped `A4` row,
actually run, and the ticket's three-token grep over the variant's added lines.

| planted read | `A4` row | ticket grep |
|---|---|---|
| `Date.now()` / `performance.now()` / `Math.random()` (controls) | caught | caught |
| `globalThis.Date.now()` | caught | caught |
| `const n = Date.now; n()` | caught | caught |
| `process.hrtime.bigint()` | caught | **missed** |
| `const { now } = Date; now()` | **missed** | **missed** |
| `Date["now"]()`, `performance["now"]()`, `Math["random"]()` | **missed** | **missed** |
| `new Date().getTime()`, `+new Date()` | **missed** | **missed** |
| `import { performance as p } from "node:perf_hooks"; p.now()` | **missed** | **missed** |
| `const { now: pn } = performance` (imported) | **missed** | **missed** |
| `process.uptime()` | **missed** | **missed** |
| `crypto.getRandomValues(…)`, `import { randomInt } from "node:crypto"` | **missed** | **missed** |
| `Temporal.Now.instant()` (present in Node 26) | **missed** | **missed** |

All variants were live. So the grep is a **spelling** guard: it catches the obvious form and the
two aliases the brief named, but not destructuring, bracket access, `new Date()`, an aliased
import, `uptime`, `crypto` or `Temporal`. The row is strictly stronger than the ticket's grep by
`hrtime` only. **Mitigation in place:** the module is 37 lines and reviewed by eye here (it reads
no clock). Any planted read that changed the readings would also break `A7`'s exact readings and
the cross-process identity (`…1e512aa1`). → **G-QE-3 (LOW)**, report only. The ticket's own test
note 1 calls `A4` "the strongest criterion on this page", and against aliasing it is the weakest.
