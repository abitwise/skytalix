---
id: 20260821T013000Z-ba-pm-decision-the-cpu-clause-is-re-derived-per-child-because-i-derived-it-from-a-wall-figure-e2a75c14
kind: decision
by: ba-pm
at: 2026-08-21T01:30:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - N8-SPAWN
  - NFR-008
  - ABC-108
  - A3
  - A9
supersedes: 20260820T232000Z-ba-pm-decision-n8-spawn-ceiling-raised-to-plus-six-and-re-expressed-in-time-9a8b7c6d
---

# `N8-SPAWN`'s CPU CLAUSE IS **RE-DERIVED**, NOT RELAXED — AND I AM SAYING WHICH ONE THAT IS BEFORE I SAY THE NUMBER

**RE-DERIVING A BUDGET AND EXCUSING AN OVERRUN ARE DIFFERENT ACTS AND THE PAGE MUST NOT BLUR THEM.**

- **Excusing an overrun** is what happens when a bar was meetable and a build exceeded it, and the
  bar moves to where the build landed.
- **Re-deriving** is what happens when a bar was arithmetically impossible from the day it was
  written, so no build could ever have met it, and the bar is rebuilt from a measurement of the
  right quantity.

**This is the second, and three measurements say so rather than my say-so:**

1. **No build could have met it.** Six of the CHEAPEST children that exist on this product — with
   `ABC-115`'s harness removed entirely — cost **+0.91 s CPU** against the 0.5 s ceiling.
2. **The delivered build is not the problem.** It lands at **+1.19 s**, which is **1.3x that floor**.
   There is no overrun sitting on top of the impossibility to excuse.
3. **The new number was derived BEFORE the delivered number was consulted, on a tree that contains
   none of `ABC-115`'s code.** The coefficient comes from a synthetic probe on `badf6c3`. It is not
   fitted to `+1.19`.

## WHY THE FIRST DERIVATION WAS WRONG — WRITTEN OUT SO THE ERROR IS NOT REPEATED

**I applied a WALL figure to a CPU clause, and the evidence is in my own words.**

`ABC-043` measured **64-72 ms per child**. That is `real`. At the cut I wrote into `ABC-115`'s trace
row *"≈ 0.35 s at the 64-72 ms per child"* for five children — **0.07 s x 5**, and correct, because
`N8-SPAWN` was then a WALL-shaped account. At the `amend-ABC-115-2026-08-20` hop I raised the ceiling
to +6 and re-expressed it in time. **The count clause was the right thing to fix and the fix was
right. What I did next was not:** I carried the same 0.07 s per child across into the new CPU clause
— **0.07 x 6 = 0.42, written as `<= 0.5 s CPU`** — without ever measuring a child's CPU.

**The category error is on the page in that hop's own note**, which reads: *"`A9`'s child measured
real 1.04 s, user 0.14 s, sys 0.02 s against 64-72 ms for a normal child — ~15x in wall, ~2x in
CPU"*. **The "~2x in CPU" divides a CPU numerator (0.16 s) by a WALL denominator (0.07 s).** I had
one real CPU measurement in my hand — `A9`'s 0.16 s — and instead of reading it as *"so a child
costs about 0.16 s of CPU, and six cost about a second"*, I used it to manufacture a ratio against a
wall figure. **The number that would have prevented all of this was already written in the note that
created the defect.**

**Three compounding faults, all mine:**

1. **A wall coefficient used as a CPU coefficient.** They are not close on this product: a child is
   **~0.07 s of wall and ~0.15 s of CPU** at the shell — node's startup is multi-threaded, and
   `/usr/bin/time` totals reaped children.
2. **Parallelism ignored.** In the lane the gap is far worse than 2x: six children add **+0.08 s of
   wall and +0.91 s of CPU**, about **11x**, because 8 workers on 8 cores absorb child CPU into
   otherwise-idle cores without moving the clock. **Any CPU budget derived from a wall figure is
   wrong by a factor that depends on the parallelism of the lane** — there is no safe conversion
   constant, which is why the only honest fix is to measure the quantity the clause names.
3. **"CPU" left unqualified.** `user` and `user+sys` differ by 0.27 s on this delta — over half the
   original budget — so the clause could be argued either way. That ambiguity was a defect in a
   criterion, which is exactly the thing I am not allowed to let out of `Ready`.

**And the sentence contradicted itself.** At 0.15 s per child, `<= 0.5 s CPU` admits **3.3 children**
while `<= 6 added children` sits in the same sentence admitting six. **The two halves of one clause
could not both be satisfied by any build.** A clause that cannot be satisfied is not a strict clause;
it is a broken one, and a broken clause protects nothing — it just stops good work at the last hop,
which is precisely what it did.

**Worse than unmeetable: unmeasurable.** Ten runs of an UNCHANGED tree spanned **0.62 s of
`user+sys`** — a drift larger than the whole 0.5 s budget. Only paired interleaving makes a delta
this size legible at all.

## THE RE-DERIVED CLAUSE

`N8-SPAWN` on `ABC-115` is now, in full:

> **<= 6 added children** AND **<= 2.0 s added wall** AND **<= 0.30 s added CPU (`user` + `sys`) PER
> ADDED CHILD** on `npx vitest run --dir src`, measured as the **median of >= 5 interleaved paired
> runs** against the immediate base commit, with the sign of the delta agreeing on **>= 4 of 5**.

**The count clause is UNCHANGED at +6. The wall clause is UNCHANGED at 2.0 s.** Only the CPU clause
moves, and it changes SHAPE as well as size.

**Why per-child and not a lump.** The lump form is what let a wall coefficient hide inside a CPU
number. Per-child, the coefficient IS the clause and cannot be inherited from a different quantity
without someone noticing. It also makes the three clauses do three different jobs instead of two of
them doing the same one badly: **the count clause caps HOW MANY children, the per-child CPU clause
caps HOW EXPENSIVE each one is, and the wall clause caps what a human waiting for the lane FEELS.**
The old lump did the count clause's job a second time, in the wrong unit.

**Where 0.30 comes from, every term measured at this hop:**

| term | value | source |
|---|---|---|
| cheapest child that exists on this product | **0.152 s** | synthetic probe, 6 children, 5 paired runs, on `badf6c3` |
| same, cross-checked at a different N | **0.147 s** | same probe at 3 children — linear |
| widest single paired sample seen at 6 children | **0.223 s** | worst of 10 paired runs across two experiments |
| run-to-run spread of the instrument | **~0.06 s per child** | the 0.108-0.223 range those 10 runs span |
| **ceiling** | **0.223 + one spread, rounded = 0.30 s** | |

**It has teeth, and here is the number that proves it: 0.30 is 1.97x the measured floor**, so a child
about twice as expensive as a bare `node src/cli.ts` fails this clause. A child that runs an engine
ply (`DEFAULT_BUDGET_MS` is 3 s) fails it by an order of magnitude. **The clause I am replacing could
not fail anything, because it failed everything.**

**It is not set where the build landed.** Delivered is **0.198 s per child** (mine) / **0.170 s**
(the engineer's). The bar sits **50%-75% above the delivered build**, and that headroom is the
instrument's spread, not a courtesy.

## WHAT THIS DOES NOT DO

- **It does not touch `plans/nfr-catalog.md`.** `N8-SPAWN` is a number `ABC-115` derives for itself,
  not a catalog bar — same posture as the cut and the amendment. No NFR row seeded, that file not
  opened for writing.
- **It does not grade `NFR-008` and does not rule `ABC-108`'s budget.** See the separate note.
- **It does not drop, weaken or re-word any criterion.** See the separate note.
- **It does not re-open the exit code** (`ADR-0016`), and `ADR-0016`, `AGENTS.md` and `src/` are
  untouched.
- **It does not re-score the ticket.** `S` / `P1` stand; the delivery is +13 production lines.
- **It does not move `ABC-115` on the board.**
