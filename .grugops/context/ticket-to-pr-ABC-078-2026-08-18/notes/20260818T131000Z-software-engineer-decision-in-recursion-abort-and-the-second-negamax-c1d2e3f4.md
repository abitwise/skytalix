---
id: 20260818T131000Z-software-engineer-decision-in-recursion-abort-and-the-second-negamax-c1d2e3f4
kind: decision
by: software-engineer
at: 2026-08-18T13:10:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - RISK-002
  - NFR-004
  - src/engine.ts
  - src/search.ts
  - src/turn-loop.ts
supersedes:
---

# The four decisions `src/engine.ts` is made of, and the one that costs something

## 1. The clock is consulted INSIDE the recursion, every 1 024 nodes

`negamax` increments a shared node counter and, when it crosses `NODES_PER_CLOCK_CHECK`,
consults the injected clock and throws a module-private `ABORTED` symbol if the deadline has
passed. The interval is a NODE count, not a depth: abort granularity is work done, which is the
quantity a wall clock is actually spent on.

**Why not at the iteration boundary, which is the cheaper implementation.** A clock checked only
between iterations honours the budget on every position where it did not matter and overruns by a
whole iteration on the one where it did — depth 4 finishes in 2.9 s, so depth 5 is entered, and
depth 5 costs 12 s. `A2` is the criterion that exists to catch it and the subtask brief named it
as the single defect this ticket exists to avoid.

**Every made move is unmade in a `finally`**, so an abort thrown anywhere in the subtree still
leaves the caller's position byte-identical. `runTurnLoop` BORROWS `history.position`
(`history.ts:39-44`); a search that unwound without unmaking would hand the loop a board several
plies into a line nobody played. `A7` asserts the byte-identity over 209 positions.

## 2. The FIRST iteration is unabortable

`nextCheck` starts at `Infinity` and is armed only after depth 1 completes. This is what makes
"never `null`, never a throw" true at any budget, including one already spent: depth 1 is one
`legalMoves` call plus one evaluation per move. `A7`'s fixture is a clock that reads 0 once and
then a value far past the deadline — the shape of every real timeout.

## 3. An aborted iteration is discarded by CONSTRUCTION, not by a rule someone must remember

The best-so-far register is a local that is assigned from `runIteration`'s RETURN VALUE. An abort
throws, so the assignment never happens and there is no partial state to forget to discard. `A3`
is asserted on `position-6`, whose best move CHANGES between depth 2 (`g5f6`) and depth 3
(`c3d5`) — on a fixture whose best move is stable, a build that kept the partial iteration's
best-so-far is indistinguishable from one that discarded it, which is the trap this fixture
avoids.

## 4. THE ONE THAT COSTS SOMETHING — a second negamax, and why it is not a refactor of `src/search.ts`

`src/engine.ts` carries its own alpha-beta negamax and its own `leafScore`, ~55 lines that are
`src/search.ts`'s with the abort check added. That is duplication and it is deliberate.

**`ABC-077`'s `A6` forbids the alternative.** `src/search.test.ts:433-465` asserts against
`src/search.ts` BY NAME that (a) its exports are exactly `MATE_SCORE`, `search`,
`searchWithoutPruning`, (b) `search.length === 2`, and (c) the source matches no
`Date.now|performance.now|hrtime|setTimeout`. An abortable search added there breaks a merged
criterion whichever way it is done: a fourth export fails (a), an optional `shouldAbort` parameter
fails (b), and a clock in that module fails (c). The abortable copy therefore lives in the module
that owns the clock.

**What holds the two together is a test, not shared code.** `A3` asserts this module's completed
iteration returns the move `search(position, depth)` returns — identical move order, identical
window, identical tie-breaking — so a drift between the two recursions is RED rather than silent.

**Named, not smoothed:** if `ABC-079` (quiescence), `ABC-080` (move ordering) or `ABC-081` (the
transposition table) land in `src/search.ts` and not here, the two recursions diverge in strength
and `A3`'s identity assertion is what will report it. Unifying them needs `ABC-077`'s `A6`
renegotiated, which is a criterion change on a merged ticket and is NOT taken here.

## What was deliberately NOT built

- **No budget clamp.** `NFR-004`'s 5 s ceiling is a promise about the budget a caller CHOOSES,
  and choosing is `EPIC-006`'s. `budgetMs` is REQUIRED — there is no default budget parameter,
  only an exported `DEFAULT_BUDGET_MS = 3_000` value for a caller to pass in.
- **No aspiration windows, no null-move pruning, no late-move reductions, no threading.** Not
  requested (coding rule 5); threading is `ADR-0005` F6's and Architect/Design's.
- **No hook for the `EPIC-004`/`EPIC-005` composition point.** The subtask brief forbade
  designing for it or widening the seam in anticipation. `createEngine` returns an `EngineSeam`
  exactly as merged, and `src/turn-loop.ts` is byte-identical.
