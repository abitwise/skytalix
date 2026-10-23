---
id: ABC-206
title: "The search runs faster with identical answers: one legal-move generation per leaf, captures-only generation in quiescence, a gives-check test without make/unmake"
status: ready
column: Ready
size: M
priority: P2
epic: EPIC-008
feature: —
---

# ABC-206: the same search, node for node, in less time

> **Cut 2026-10-23 by BA/PM** (task `bapm-cut-engine-strength`, records only, at `main` `55a8f4ef`). Proposal 3 of
> `…f1771bb3`; owner word `…7feb0553`. **No ADR is expected:** the change is value-identical, so `ADR-0026` (which
> governs value-changing heuristics) does not apply. If the design needs a new test-only door or export, the Architect
> rules whether an ADR is needed. Under the owner delegation, the owner STOP fires only if an accepted ADR is reversed.

## Problem

- **User:** the owner at level 5, where every move is a fixed 3 000 ms.
- **Pain:** 8.e5? and 10.Ne4? were depth-limited. `skytalix` finds Stockfish's move at depth 7 and depth 8, but on
  this host those depths took about 3.9 s and 5.8 s. Three costs sit on the hot path:
  - **(i)** Every leaf generates legal moves twice: `gameStatus` (`src/engine.ts:245` → `src/gameend.ts:137`), then
    `quiesce` (`src/quiescence.ts:108`).
  - **(ii)** Quiescence generates every legal move and keeps only the captures (`src/quiescence.ts:107-110`).
  - **(iii)** The late-move-reduction rule makes and unmakes each candidate move to test whether it gives check
    (`src/search.ts:262-264`).
- **Value:** more depth inside the same budget, without changing a single answer the search gives at a fixed depth.

## Scope

1. Remove the double generation at the leaf (i).
2. Generate only legal captures in quiescence (ii), **in the same order** the filter produces today. The stable
   MVV-LVA sort keeps generation order for equal keys (`src/quiescence.ts:111`), so the order is load-bearing.
3. Answer "gives check" without make/unmake (iii).
4. Any one of the three may be dropped if its oracle cannot be met. Each lands as its own value-identical commit.

## Out of scope

- Any change to a score, a move choice at a fixed depth, the move ordering, pruning, the evaluation or the budgets.
- `NFR-001`'s perft half (`src/perft.ts`) and the perft counts.

## Acceptance criteria

- **`A1` (identical answers: the oracle this ticket exists to keep).** **Given** the `ABC-078` `A3` identity-sweep
  corpus, at every depth that sweep reads, **when** the branch and the base search it on the virtual clock, **then**
  the best move, the score **and the node count** are equal for every position and every depth. The clock is also
  consulted the same number of times, so `NFR-004`'s abort points are unchanged.
  - If the design rules that a node-count definition must change, the Architect records the reason, and `A1` then
    reads move and score only.
- **`A2` (each piece is equal to what it replaces).** Over every position of `src/perft.test.ts`'s six FENs, expanded
  to depth 3:
  - the captures-only generator returns exactly `legalMoves(p).filter(capture)`, **as the same list in the same
    order**;
  - the gives-check answer equals make → `isInCheck` → unmake for every legal move;
  - the leaf's game-end status equals `gameStatus(p)` for every position. The corpus includes checkmate, stalemate,
    the fifty-move rule, repetition and insufficient-material cases.
- **`A3` (existing gates).**
  - `G4`: the identity sweep, the `ADR-0026` bounded oracle, and every existing test-only door reproduces node for
    node.
  - `src/search.ts`'s pinned exports (`ABC-077` `A6`) are unchanged, unless the Architect rules a door.
  - `G1`: puzzles at 54/58, with the **same per-row move, depth and nodes** as the baseline run.
  - `G9`.
  - `npm run perft` counts are unchanged, and its rate is ≥ 1 000 000 nodes/s (`NFR-001`).
- **`A4` (faster: the mechanical bar).** **Given** `kiwipete` and `position-6`, a fixed depth of 8, plain `node`, base
  and branch interleaved, n ≥ 7 runs each, in one session, **then** the branch's median wall time to complete depth 8
  is **≤ 0.85 × base** on **both** positions. That is at least 15 % faster.
  - **Under the bar:** NOT MET. The numbers go to BA/PM, who rules: keep at the measured gain, or drop.
- **`A5` (depth and budget).**
  - `G6`: `NFR-005`'s completed depth at 3 s is **≥ base** on both positions. The new depth is reported.
  - `G5`: `NFR-004` holds.
  - `G8`: `NFR-008` is reported; this change may make the lane faster.
- **`A6` (the reading).** **Given** `ABC-204` is Done, **then** D on this branch is **not LOSS** (ship rule S2).
  - **Reported:** X ± Y, and `G11`'s choices. 8.e5 and 10.Ne4 are expected to move with depth, but they are not
    graded.

## NFR triggers

- **`NFR-001` leaf clause:** `legalMoves` exactly 1 per `gameStatus`, and `gameStatus(startpos)` within 1.5x of its
  2.52 µs.
  - `gameStatus`'s own contract does not change, so no bound moves.
  - If the leaf stops calling `gameStatus`, the row's "every search leaf calls" text goes stale. Security/NFR records
    that as a dated note, and the bound is unchanged.
  - **If the design needs `gameStatus`'s contract changed, that is a bound move, and it goes to the owner.**
- **`NFR-004`:** the clock consultation count is equal (`A1`).
- **`NFR-005`:** expected to improve, read by `G6`.
- **`NFR-008`:** reported.
- **Security:** no limb. No Security/NFR hop is owed.

## Test notes

1. `A1` and `A2` are lane rows where they are cheap. A deep sweep that is too slow for the lane goes behind an opt-in
   variable, on the `PUZZLE_DEEP` precedent, and is run at review.
2. `A4` runs in plain `node`, not vitest (`NFR-005` runner rule).
3. Leaf terminal detection is the subtle part: mate and stalemate at the leaf (`…f1771bb3` § 6 item 3).
4. UAT: production lines change, so UAT is owed. The QE verdict signs it. The answers are identical, so the play-test
   value is in the depth.

## Dependencies

- `ABC-204` Done, for `A6` only.
- No other open ticket touches `src/engine.ts`, `src/search.ts`, `src/quiescence.ts` or `src/gameend.ts`. `ABC-208`,
  `209` and `210` wait for this one.
- **Builders:** the Software Engineer, after a short Architect/Design ruling on the leaf's shape and any door.

## Size and priority

- **`M`:** three hot spots, each with an exact oracle, plus one timing reading.
- **`P2`:** about +0.5 to 1 ply at the same budget, by the analysis (`UNKNOWN - verify`, which `A4` measures).

## Definition of Ready

BA/PM, 2026-10-23, at `main` `55a8f4ef`. **Result: 10 of 10. `Ready`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ three cited hot spots; two game-1 errors fixed one and two plies deeper |
| 2 | scope and out-of-scope clear | ✅ three pieces, each droppable; every value change fenced |
| 3 | INVEST-shaped | ✅ independent (disjoint from `ABC-205`); valuable alone; `M`; testable |
| 4 | acceptance testable and measurable | ✅ node-equal identity; list equality; ≤ 0.85 × base at n ≥ 7; depth ≥ base; not LOSS |
| 5 | dependencies known | ✅ `ABC-204` for `A6`; the successors named |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-001` leaf clause handled; `NFR-004` clock count equal; `NFR-005` ≥ base |
| 7 | test notes present | ✅ four |
| 8 | size assigned | ✅ `M` |
| 9 | priority assigned | ✅ `P2` |
| 10 | no major unresolved blocker | ✅ none |
