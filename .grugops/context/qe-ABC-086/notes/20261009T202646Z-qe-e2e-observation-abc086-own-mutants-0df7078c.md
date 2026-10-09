---
id: 20261009T202646Z-qe-e2e-observation-abc086-own-mutants-0df7078c
kind: observation
by: qe-e2e
at: 2026-10-09T20:26:46Z
verified_by:
confidence: high
refs:
  - ABC-086
  - ABC-085
  - src/virtual-clock.ts
  - src/engine.test.ts
  - src/transposition.ts
supersedes:
---

# `ABC-086` focus 5: twelve QE mutants. Nine killed, two equivalent, and one survives every row: a module-level step

Hand-authored, no seal. Runner `../probe/mutants.mjs`, raw `mutants.out.jsonl` and
`mutants-r2*.{jsonl,txt}`, 20:24–20:28Z. Each mutant was planted in a **scratch copy** of the tree,
never in the worktree's `src/`. Each patch was asserted to apply and recorded as a diff in the
JSON. The runner ran the `ABC-086` default rows, plus the named deep rows under `ENGINE_DEEP=1`,
then restored the copy and checked it byte-identical to the worktree's `src/` at the end. Baseline:
the 8 `ABC-086` default rows are green.

## In `src/virtual-clock.ts`

| id | mutant | default lane (`ABC-086` rows) | deep rows | verdict |
|---|---|---|---|---|
| M1 | first reading is `step`, not 0 | red: `A6` state, `A7` ×2 | — | killed |
| M2 | guard `>= 0` (admits a frozen clock) | red: `A7` 5/5 | — | killed |
| M3 | guard drops `Number.isFinite` | red: `A7` 5/5 (`Infinity`) | — | killed |
| M4 | the reading is module state, shared by every clock | red: `A6` state, `A7` ×2 | **`A6` 10/10 interleaved: green** | killed (default only) |
| **M5** | **the step is module state: the last factory call's step wins** | **green 8/8** | **`A6` 10/10 interleaved: green** | **SURVIVES** |
| M6 | step doubled | red: `A1` slice floor, `A6` state, `A7` ×2 | — | killed |
| M7 | normal for three reads, then jumps 10⁶ | **green 8/8** | red: depth-4 floor (300/300 itself green) | killed (deep only) |
| M8 | a stray `Date.now()` that changes no reading | red: `A4` | — | killed |

## In the `A1` / `A6` rows, and the state they must see

| id | mutant | result | verdict |
|---|---|---|---|
| R1 | `A1` slice: a clock that jumps the whole budget in one read | red, **on the depth floor only**; identity stays 30/30 | killed (focus 3) |
| R2 | the transposition table is not wiped between calls (`words.fill(0)` removed; v1 removed `clearTable()` itself and only crashed collection, because that call also allocates; discarded, recorded) | `ABC-086` default rows **green 8/8**; deep **300/300 red and `A6` interleaved red**; the whole default lane is red on 15 other rows (`transposition`, `quiescence`, `search.ordering`, `search.pvs-lmr`) | killed |
| R3 | the two `A6` engines share ONE clock | `A6` interleaved green | **equivalent** |
| R4 | `A1` slice reuses one clock for both runs (not fresh) | green | **equivalent** at step 1 |

## What the survivors and equivalents say

- **The `A6` interleaved row is blind to clock state by construction** (M4, M5, R3). The engine
  takes its deadline relative to its own entry reading, and calls run synchronously to
  completion. So two engines that share a clock's reading still see the same relative readings.
  The row guards transposition-table and killer state, which it does catch (R2). It cannot guard
  clock state. Only the default per-instance row sees a shared reading (M4).
- **M5 survives everything.** Every row that builds two clocks gives them the same step: the
  state row uses 1 and 1, `A6` uses 1 and 1 at different *budgets*. Yet `A6`'s text says
  "different budgets or steps", and `ABC-085`'s ladder is the configuration that could use
  different steps. **→ G-QE-1 (LOW–MEDIUM, test gap; the code is correct, a closure).**
  Remedy, verified: one ≈ 0 ms default row with two live clocks at different steps and
  interleaved reads, `a = virtualClock(1)`, `b = virtualClock(0.5)`, `[a(), b(), a(), b(), a(), b()]`
  equal to `[0, 0, 1, 0.5, 2, 1]`. It is green on the shipped module and red on M5
  (`../probe/m5-remedy/remedy.out.txt`).
- **R4's equivalence holds only for an exact step.** A follow-up probe (`../probe/reused-clock*.txt`)
  pre-advanced the clock by k reads and searched the 30 at budget 24.
  - Steps 1 and 0.5: 0/30 differ at every k.
  - Steps 0.1 (k = 1 000) and 1/3 (k = 123 457): **30/30 differ in node count**, by exactly one
    clock interval (±1 024). Rounding moves the abort point by one reading. The move and the
    depth were identical 60/60 there, because the shift lands inside the aborted iteration.
  - So determinism is a property of (position, budget, step, **the clock's starting reading**).
    `A1` specifies a fresh clock and is met. A harness that reuses one `createEngine` clock across
    a game with a non-dyadic step will not reproduce node counts move by move. Info, carried to
    G-QE-2's harness note: use a fresh clock per move, or a dyadic step (1, 0.5, 0.25).
- **M7 is the price of the re-cut**, recorded in `…1e512aa1`: a clock that misbehaves only after
  its third read is invisible to the default lane.
