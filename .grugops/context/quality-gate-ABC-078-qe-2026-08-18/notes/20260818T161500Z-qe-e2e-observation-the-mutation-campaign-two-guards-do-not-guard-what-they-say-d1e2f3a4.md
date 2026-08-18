---
id: 20260818T161500Z-qe-e2e-observation-the-mutation-campaign-two-guards-do-not-guard-what-they-say-d1e2f3a4
kind: observation
by: qe-e2e
at: 2026-08-18T16:15:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - RISK-002
  - src/engine.ts
  - src/engine.test.ts
supersedes:
---

# The mutation campaign: nine mutants against the delivered suite. Seven die. **Two survive, and both survive on the criterion whose stated job is to kill them**

Method: apply one mutation to `src/engine.ts` in place, run **the whole default suite**
(`npx vitest run`, 36 files / 1 016 tests) plus `tsc --noEmit`, restore with `git checkout --`,
and confirm the restored blob hash is `04d8eb114ddfb021fcf21f9b3a196d29d465d3dd` every time. It
was. **No production file leaves this hop modified.**

| # | mutant | what it does | suite result | killed by |
|---|---|---|---|---|
| **M1** | between-iterations | deletes the in-recursion clock check entirely; the loop condition is the only clock | **2 failed** | **`A3` — NOT `A2`** |
| **M2** | keep-partial | smuggles the aborted iteration's best-so-far out and returns it | **2 failed** | **`A3`** (+ `A4`'s export guard, on the smuggling export) |
| **M3** | depth default parameter | `chooseMove(position, options, maxDepth = 4)` | **3 failed** | `A4` (all three of its checks) |
| **M3b** | hidden depth constant | `const PLY_CEILING = 4` + `iteration <= PLY_CEILING` in the loop header | **1 failed** | `A4`'s loop-header check |
| **M3c** | **cap in the loop BODY** | `if (iteration > 4) break;` as the loop's first statement | **1 016 PASSED** | **NOTHING — SURVIVES** |
| **M4** | drift: stalemate = loss | `engine.ts`'s negamax only; `search.ts` untouched | see the duplication note | — |
| **M4b** | drift: leaf sign | `engine.ts`'s `leafScore` only | see the duplication note | — |
| **M4c** | drift: mate distance | `leafScore(position, 0)` instead of `ply` | see the duplication note | — |
| **M5** | illegal move | returns `move.to + 1` | **5 failed** | `A7`, `A6` (x2), `A2`, `A3` |
| **M6** | pinned depth 1 | the deepening loop never runs | **3 failed** | `A5`, `A4`, `A3` |

## FINDING 1 (HIGH) — `A2` is not sensitive to the defect it exists to catch, and its own comment states a measurement that is false

The ticket calls `A2` *"the criterion that proves the clock is checked inside the recursion and not
only between iterations"*, and `AGENTS.md`'s test note 1 calls it *"the one that catches the common
bug"*. The test carries this comment at `src/engine.test.ts:206-212`:

> *"THIS is the assertion that fails an engine which consults the clock only between iterations.
> Such a build, on this fixture, sees time remaining at every boundary … so it runs depth 3
> (9 016 nodes), depth 4 (38 023) and depth 5 — hundreds of thousands of nodes against the bound
> below. Measured on the delivered build: 3 120."*

**I built that build (M1) and ran `A2`'s exact fixture against it.** `kiwipete`, `budgetMs: 50`,
`tickingClock(25)` — copied verbatim from the test:

| build | depth | nodes | `elapsedMs` | clock consultations | `A2`'s bound (≤ 10 240) |
|---|---|---|---|---|---|
| delivered | 2 | **360** | 75 | 4 | **PASSES** |
| M1 between-iterations | 2 | **360** | 75 | 4 | **PASSES** |

**The two builds are byte-identical in observable behaviour on `A2`'s fixture.** Not "close" —
the same depth, the same node count, the same elapsed reading, the same number of clock
consultations.

**The mechanism.** `tickingClock(25)` advances virtual time only when consulted. With
`budgetMs: 50` the deepening loop consults at each boundary: `0` (start), `25` (enter iteration
2), `50` (exit). Iteration 2 on `kiwipete` costs **360 nodes** — and `nextCheck` after iteration 1
is `48 + 1024 = 1072`. **The in-recursion check is never reached on this fixture at all.** `A2`
cannot be sensitive to code it does not execute.

**Two factual corrections follow, and neither is a code defect:**

1. The comment's *"runs depth 3 (9 016 nodes), depth 4 (38 023) and depth 5"* describes nothing
   that happens. The mutant runs **depth 2, 360 nodes.**
2. *"Measured on the delivered build: 3 120"* — `A2`'s fixture measures **360**. The engineer's
   criterion-verdicts note repeats 3 120 as `A2`'s evidence. **3 120 is `A3`'s fixture's number**
   (I measure 3 118 for `position-6` at `budgetMs: 5, tickingClock(1)`). The two fixtures'
   figures were transposed.

Even on a **real** clock `A2`'s fixture does not separate them: delivered depth 2 / 7 216 nodes,
mutant depth 3 / 9 375 nodes — **both under the 10 240 bound, both pass.**

**The in-recursion check IS covered — by `A3`.** On `A3`'s fixture the two builds diverge
enormously: delivered depth 2 / **3 118** nodes, mutant depth 5 / **5 559 616** nodes. `A3`'s
`expect(choice.depth).toBe(2)` is what reds. So M1 does not escape the suite — **it escapes the
criterion that was written to stop it**, and `A3` is silently carrying `A2`'s job as well as its
own.

**Why this matters beyond bookkeeping.** `A3`'s fixture is `position-6` and its purpose is the
*discard* property. If `A3`'s fixture is ever retuned — a different position, a different budget,
a stable-best-move fixture — the in-recursion coverage disappears **with no test named `A2` going
red to say so.** The suite's only defence against the ticket's headline defect is an undeclared
side effect of another test.

**What would make `A2` bite.** Its bound is right; its fixture is wrong. It needs a fixture in
which the delivered build actually reaches the in-recursion check and the between-iterations build
actually overruns — either `A3`'s shape (a small budget with a fine clock step, so an iteration
that costs far more than `NODES_PER_CLOCK_CHECK` nodes is entered) or a clock that advances on
elapsed work rather than per consultation. The assertion `nodes <= 10 * NODES_PER_CLOCK_CHECK` is
a good assertion pointed at the wrong run.

## FINDING 2 (HIGH) — a fixed depth ceiling slips past `A4`, and past the deep lane too

`A4` is `RISK-002` as a criterion — the ticket's **non-negotiable inherited constraint**, the one
whose survival paragraph says a fixed depth *"would blow `NFR-004`'s 3-second ceiling on exactly
the machines least able to absorb it"*. The brief asked me to try to slip a depth default past it.
**I did, on the third attempt, with two lines.**

`A4` is implemented as an export-shape check plus **three source-text regexes**:

```
expect(source).not.toMatch(/depth\s*\??\s*(:\s*[\w<>[\]| ]+)?\s*=[^=>]/i);
expect(source).not.toMatch(/default_?depth|max_?depth|fixed_?depth/i);
expect(source).toMatch(/for \(let iteration = 2; now\(\) < budget\.deadline; iteration\+\+\)/);
```

The third pins the deepening loop's **header**. M3 (a `maxDepth = 4` parameter) and M3b (a named
`PLY_CEILING` in the header) both die on it. **M3c puts the cap in the loop BODY and leaves the
header untouched:**

```ts
  for (let iteration = 2; now() < budget.deadline; iteration++) {
    if (iteration > 4) break;          // <- the whole mutation
    let deeper: Iteration;
```

**Results:**

| lane | result |
|---|---|
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0 |
| `npx vitest run` (default) | **36 files, 1 016 passed, 0 failed** |
| `ENGINE_DEEP=1 npx vitest run src/engine.test.ts` | **23 passed** |

**Every gate is green on an engine with a hard depth-4 ceiling.**

Three reasons it escapes, and all three are structural:

- **The constant is anonymous.** A bare `4` matches neither `depth…=` nor `max_?depth`. `A4`'s
  criterion text — *"grep of the delivered `src/` diff finds no depth constant"* — is a grep for a
  *name*, and a depth constant does not have to be called one.
- **`A4` is entirely textual.** All four of its checks read `src/engine.ts` as a string or inspect
  `Object.keys` / `.length`. **Not one of them runs a search.** A source-text guard cannot see
  behaviour that a `break` statement produces.
- **`A5` cannot see it either, because the cap is above `A5`'s range.** `A5` asserts monotonic
  non-decreasing depth at 100 / 1 000 / 3 000 ms and gets **1 / 2 / 3**; the deep repetition gets
  **1 / 3 / 4**. A ceiling at 4 is invisible to every depth this suite ever observes.

**The sharpest part, and the reason this is HIGH rather than MEDIUM.** The capped build's
*reported* `A1` numbers are **better** than the delivered build's:

| | delivered | M3c (depth-4 ceiling) |
|---|---|---|
| `A1` worst case | 3 030 ms | **3 024 ms** |
| `A1` over 3 s | **29/30** | **5/30** |
| deep-lane duration | 98.4 s | **36.1 s** |

So the one change that destroys the ticket's non-negotiable constraint is also the change that
makes `A1` — the criterion the engineer honestly reported as not literally met — **look much
closer to met**. A future hop under pressure to close `A1`'s 27 ms could add exactly this line,
watch 29/30 become 5/30, and ship with 1 016 tests green and `RISK-002` silently violated.
**That is the precise failure mode this ticket's criteria exist to prevent, and the suite does not
prevent it.**

**What would make `A4` bite.** It needs one **behavioural** assertion to sit beside the textual
ones: at a budget generous enough on this hardware, the completed depth must **exceed** any
plausible hard-coded ceiling — e.g. on a sparse endgame (`position-3` reaches depth 6+ cheaply)
assert `depth >= 6` in the opt-in lane, or assert in the default lane that depth keeps rising
across four budgets rather than three. It does not need a fixed depth asserted (ticket test note 4
forbids that): asserting that depth **keeps moving past the point a cap would hold it** is enough,
and it is hardware-robust because it is still a comparison.

## The seven that died, for completeness

- **M5 (illegal move)** — `chooseMove` returns `{...best.move, to: (to + 1) & 0x7f}`. **5 tests
  red across four criteria**: `A7`'s 209-position legality sweep, **both** of `A6`'s (including
  `runTurnLoop`'s own `wasGenerated` membership test, so the seam rejects it end to end), `A2`'s
  legality assertion and `A3`'s identity assertion. The always-legal guard is real and it is
  defended in depth. I could not find a null, a throw or an illegal move anywhere in `A7`'s
  corpus at any budget I tried, including 0, negative and `NaN` (see the `A1` note § 6).
- **M6 (pinned depth 1)** — the deepening loop never runs. **3 tests red**: `A5`'s *"actually goes
  deeper somewhere across the three budgets"*, plus `A4`'s loop-header check and `A3`'s
  did-it-enter-depth-3 node assertion. The monotonicity guard is not satisfiable by a stopped
  engine, which is what `A5` was written for and it does that job.
- **M1, M2, M3, M3b** — as tabulated above.
- **M4 / M4b / M4c** — the scoring-drift mutants; their results are the subject of the duplication
  note in this folder.

Restored blob hash after every run: `04d8eb114ddfb021fcf21f9b3a196d29d465d3dd`.
