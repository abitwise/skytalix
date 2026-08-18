---
id: 20260818T214500Z-software-engineer-observation-g1-and-g2-closed-one-was-a-step-size-the-other-needed-a-different-kind-of-test-b2d3f4a5
kind: observation
by: software-engineer
at: 2026-08-18T21:45:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - RISK-002
  - src/engine.test.ts
supersedes:
---

# `G1` and `G2` closed. One was a **step size**; the other needed a **different kind of test**

Both are HIGH, both were mine, and QE was right about both. Neither needed a production line.

## `G1` — `A2` was pointed at the right property and the wrong run

QE's finding: `A2`'s fixture (`kiwipete`, `budgetMs: 50`, `tickingClock(25)`) is **byte-identically
insensitive** to the between-iterations build — same depth, same 360 nodes, same 4 consultations
either way. The bound was right; the run was wrong. The in-recursion check **was never executed on
that fixture**, because `nextCheck` after iteration 1 sits at 1 072 nodes and iteration 2 costs 360.

**The fix is one number: the clock step, 25 ms → 10 ms.** Nothing else about `A2` moved — same
position, same 50 ms budget, same bound of `10 * NODES_PER_CLOCK_CHECK`, same three assertions,
same describe titles. A 10 ms step buys five consultations against the same budget, so the
deepening enters depth 3 (~9 000 nodes, far more than one 1 024-node interval) and **the abort has
to come from inside the recursion**.

**Measured at the repair tip, on `A2`'s own fixture:**

| build | depth | nodes | `A2`'s bound (≤ 10 240) |
|---|---|---|---|
| delivered / repaired | 2 | **3 120** | PASSES |
| in-recursion check DELETED (QE's `M1`) | 5 | **1 280 509** | **FAILS — 125x the bound** |

I swept the step before choosing it, so 10 ms is a measurement and not a guess: 25 ms → 360 nodes
(blind), **10 ms → 3 120**, 5 ms → 8 240, 2 ms → 22 576 (depth 3, over the bound — the criterion
would have to change, not just its fixture), 1 ms → 47 397. **10 ms is the coarsest step at which
the criterion bites**, which keeps the lane cost at zero: `A2`'s three tests still run in ~1 ms.

**The comment's false numbers are gone.** It quoted depth 3 / 9 016 / depth 4 / 38 023 for a build
that ran depth 2 / 360, and cited *"Measured on the delivered build: 3 120"* — which was **`A3`'s
fixture's number, not `A2`'s** (QE measures 3 118 for `position-6` at `budgetMs: 5`; the two were
transposed). The replacement carries only numbers measured **on this fixture at this tip**, for
both the delivered build and the mutant, and the file header's description of the mechanism now
says out loud that the bound only works if the step is fine enough.

**The curiosity worth recording:** the false *3 120* is the number `A2`'s fixture produces **at a
10 ms step**. The comment appears to describe a fixture that was tuned correctly at some point and
then coarsened, with the prose left behind. That is a better argument for measuring comments than
any rule about them.

## `G2` — `A4` was four textual checks, and a `break` is not text

QE slipped a hard depth-4 cap past all four checks with two lines in the loop BODY: the header is
untouched, so the loop-header regex passes; the constant is an anonymous `4`, so the `depth…=` and
`max_?depth` regexes pass; and `A5` never observes a depth above 4, so it cannot see a ceiling at
4. **1 016/1 016 green, `ENGINE_DEEP` 23/23 green, `tsc` and lint clean.** And the capped build's
`A1` looked *better* — 5/30 over 3 s instead of 29/30 — so the change that destroys `RISK-002` was
the change that made the criterion I honestly reported as unmet look closer to met.

**A fifth textual check would have been the wrong answer.** The guard added is behavioural: it RUNS
a search and looks at the depth that comes back.

```ts
const shallow = depthAt(5);   // budgetMs 5  on the K+P endgame
const deep = depthAt(10);     // budgetMs 10 on the same position
expect(deep).toBeGreaterThan(shallow);
expect(deep).toBeGreaterThanOrEqual(6);
```

**Delivered: 4 then 6. With `if (iteration > 4) break;`: 4 then 4 — both assertions red.**

**Why this does not violate ticket test note 4** (*no absolute depth may be asserted, it is
hardware*). The clock is **injected**, and virtual time advances per CONSULTATION, so the depth
reached is a function of node counts alone — identical on every machine, and reproducible from the
FEN. The bound is also one-sided: `ABC-079` / `ABC-080` / `ABC-081` can only make this position go
deeper, never shallower, so a lower bound cannot become brittle as the engine improves.

**Fixture choice, measured.** `position-3` — QE's suggestion — reaches depth 5 at 30 ms of virtual
budget and costs 67 ms of wall clock, and never reached 6 cheaply. A bare K+P vs K endgame reaches
**depth 6 in 8 ms** and depth 7 in 44 ms, so it is the one in the default lane; the 4 / 6 / 7
ladder is the `ENGINE_DEEP` repetition.

**What this guard does NOT catch, stated so nobody over-reads it:** a cap at 7 or above. It reds
any ceiling at or below 5 in the default lane and at or below 6 in the deep lane. A cap that high
would be caught by nothing here — but it also would not be a plausible optimisation against `A1`,
which is the failure mode `G2` is about.
