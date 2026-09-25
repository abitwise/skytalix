---
id: 20260925T090300Z-qe-e2e-observation-abc080-mutants-3-new-1-survivor-e4577130
kind: observation
by: qe-e2e
at: 2026-09-25T09:03:00Z
verified_by:
confidence: high
refs:
  - ABC-080
  - src/search.ts
  - src/engine.ts
  - src/search.ordering.test.ts
supersedes:
---

# ABC-080 QE mutants: 2 new mutants on the comparator/killer rule KILLED, 1 SURVIVED (a real gap)

Hand-authored, no `seal` (degraded posture, `AGENTS.md`). Every mutant below was applied by a
single string replacement, run against the default lane (`npx vitest run
src/search.ordering.test.ts src/search.test.ts src/engine.test.ts src/quiescence.test.ts
src/search.qe.test.ts`), then reverted from a saved copy of the original file. `git status
--porcelain -- src` was asserted empty after every revert (all clean).

## Extending the named thin spots (M7–M10, M15–M17)

The build's own note names M7–M10 (the engine's interior ordering/killer table) as dying on
**one row each** (`A6`'s `chooseMove` case), and M15–M17 (hash arm, killer duplicate check,
killer slot count) as dying on one unit row each. I did not re-run those ten mutants — the note's
own accounting is plausible on inspection (each targets code with no other consumer in the
default-lane's node-count pins) — and instead tried mutants **not on the ledger**, on the same
two axes the subtask names: comparator ordering and the killer update rule.

## N1 — comparator: killer bonus raised above the tactical tier

`src/search.ts` `orderKey`: changed the killer return from `killers.length - killer` to
`2_000_000 - killer` (above `TACTICAL_KEY + mvvLvaKey(...)` for any real capture). **KILLED**:
`src/search.ordering.test.ts`'s `A4` default-lane pin (`position-6` d2 `full` nodes, expected
2 467, got 3 781) and the promotion-capture `G4` fixture (expected 275, got 448) both red.

## N2 — killer update rule, `src/search.ts`: record on every move tried, not only on a beta cutoff

Moved `killers.record(ply, move)` out of the `if (alpha >= beta)` block so every move at a
full-width node is recorded as a killer, cutoff or not. **KILLED**: `src/quiescence.test.ts`'s
`A4` bare-leaf fingerprint (expected 111, got 114) and `search.ordering.test.ts`'s `A4` default
pin (expected 2 467, got 2 634) both red.

## N3 — killer update rule, `src/engine.ts`: SAME mutant as N2, applied to the abortable recursion — SURVIVED

The exact same edit (`budget.killers.record(ply, move)` moved out of the cutoff guard, into the
unconditional path) applied to `src/engine.ts`'s `negamax` instead of `src/search.ts`'s.
**Survived the full default lane (112/112 passed, all 5 files) AND `ENGINE_DEEP=1 npx vitest run
src/engine.test.ts` (33/33 passed, 117.3 s).** Nothing in either lane catches an engine that
records a killer on every quiet move tried at a ply, rather than only the one that caused the
cutoff.

**Why it survives.** `src/search.ordering.test.ts`'s `A6` instrumentation (`"chooseMove(): one
table per call..."`) asserts every *offered* killer traces to a record at the *same ply of the
same table* — self-consistency, not correctness of *which* move got recorded. It does not check
that a recorded killer actually caused a cutoff. The engine's identity sweep (`A3` in
`engine.test.ts`, `ENGINE_DEEP`-gated) compares `chooseMove`'s move and score against `search()`
over corpora; recording extra, non-cutoff killers changes which quiet move is tried first at a
ply but not, on any position in the current corpus, the returned move or score — so the identity
sweep is blind to it, same as the build's own note says of M7–M10. No exact node-count pin exists
for `chooseMove` (it runs on wall-clock budgets, not a fixed depth), so there is no node-count
assertion, pinned or ratio, that this mutant could disturb either.

**This is a gap, named as one, not a defect.** The delivered `src/engine.ts` code IS correct —
`budget.killers.record(ply, move)` sits inside `if (alpha >= beta) { ... }` exactly as
`src/search.ts`'s does (confirmed by direct reading, and reproduced in the companion observation
note). What is missing is a test that would catch a regression of that one line in
`src/engine.ts` specifically — the equivalent of the node-count pins that catch it in
`src/search.ts` (N2, above). `src/search.ordering.test.ts`'s `A6` chooseMove row and
`engine.test.ts`'s `A3` identity sweep are both real coverage, and both are blind to this one
specific mutation. Reported for QE's own mutant ledger extension, per the subtask's instruction
("add your own on the comparator ordering and the killer update rule; any survivor is a gap").
