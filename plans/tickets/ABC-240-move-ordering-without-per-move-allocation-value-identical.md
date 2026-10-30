---
id: ABC-240
title: "Move ordering without per-move allocation, value-identical: the same order, the same nodes, more nodes a second"
status: done
column: Done
size: S
priority: P3
epic: EPIC-010
---

# ABC-240: move ordering without per-move allocation

> **Cut 2026-10-29 by BA/PM** (task `bapm-ABC-235-split`, records only, at `main` `a37f1d87`). Split out of `ABC-235`:
> it is cut 6 of `ABC-227`'s six (SE `se-ABC-227` `…7175ebdf`). The Architect ruled it value-identical under four
> conditions and recommended this split (`arch-ABC-235` `…7fc1b90c` § Cut 6, `…eebca902` § The split). Those notes
> govern the form. This page sets the bar and says what happens if the bar is missed. Value-identical, so it plays no
> smoke (`EPIC-010` § The merge rule).

## Problem

- **User:** the owner at level 5.
- **Pain:** `orderMoves` (`src/search.ts:188-197`) builds a wrapper object per move and three arrays per call
  (map, sort, map), at every full-width node. Quiescence also re-computes `mvvLvaKey` inside its sort comparator
  (`src/quiescence.ts:110`). `ABC-227` measured `orderMoves` at 8.6–12.8 % of the bytes allocated.
- **Value:** more nodes in the same 3 s with **identical** answers at any fixed node count (the `ABC-206` and
  `ABC-235` shape).
- **The bound, not a speed-up** (the Architect's re-cut of `ABC-227`'s profile, % of self time, kiwipete / position-6 /
  start): `orderMoves` inclusive 5.6 / 6.7 / 6.6, plus quiescence's sort 1.1 / 0.9 / 0.2. `orderKey`'s own work stays,
  and GC is only 1.6–1.9 % of time. So the real gain is smaller than the bound, and it may miss A3's 3 % bar.
  § What happens if A3 is missed says what follows.

## Scope

1. `orderMoves` in `src/search.ts` without the per-move wrapper objects, under the Architect's four conditions:
   - **C1, ties keep generation order.** The sort is stable by construction (for example an insertion sort that moves
     only on a strict `<`), or it breaks ties on the index explicitly.
   - **C2, keys stay float64.** `mvvLvaKey` subtracts attacker ÷ 1000. An `Int32Array` would merge QxP with NxP, and a
     `Float32Array` would merge the knight's 0.32 with the bishop's 0.33 near 1 000 000.
   - **C3, the input is never mutated.** `chooseMove` re-orders the same `rootMoves` every iteration, and both
     recursions read `moves[0]` and `entryMove(slot, moves)` from the unsorted list.
   - **C4, no output shared between plies.** Keys and indices may live in one module scratch, because the sort ends
     before anything recurses. The returned `Move[]` is one fresh array, as the documented "returns a NEW array"
     contract says.
2. Quiescence's capture sort in `src/quiescence.ts`: each `mvvLvaKey` computed once, then `captures` sorted in place
   (that array is the frame's own). C1 and C2 apply.
3. One commit per item (1, then 2). A3 judges the ticket as a whole, at the tip. Item 2's own bound (≤ 1.1 %) is
   too small for a bar of its own, so A3 sets none per item.

## Out of scope

- **Any change to `orderKey`, its tiers or its keys.** A different order is value-changing. Those changes are
  `ABC-233` (history) and `ABC-234` (SEE).
- An in-place sort of `orderMoves`' input (C3 forbids it). Keys cached across nodes. Typed keys narrower than float64.
- Generation order, legality and evaluation (`ABC-235`). Cuts 2 and 4 (out per `…7fc1b90c`).

## Acceptance criteria

- **A1 (identity).** **Given** the `ABC-078` `A3` corpus and `ABC-121`'s 190, **when** searched at fixed depth 5 on
  base and head, out of tree, in plain `node`, with `search`, every `ADR-0026` test-only door (`searchWithoutOrdering`
  and `searchWithoutKillers` included), and `chooseMove` at budgets 3 and 5 on `tickingClock(1)`, **then** move,
  score, completed depth, nodes and clock reads are byte-equal on every position (`G4`). No golden file is
  committed. Base is the ticket's merge base on `main`.
- **A2 (the oracle, per condition).** In the existing test files (`src/search.ordering.test.ts`,
  `src/quiescence.test.ts`). Depth-1 rows run in the lane, and the walk runs under `ENGINE_DEEP=1`:
  - **(P1)** **Given** every node's legal list on the walk the Architect names (the six perft FENs at depth 1;
    `ABC-206`'s 285 074 positions under `ENGINE_DEEP=1`), with killers and hash moves drawn from the list plus absent
    ones, **then** the new `orderMoves` equals a reference copy of today's map/sort/map, compared by `Move` identity,
    and the input array is unchanged after the call.
  - **(P2)** **Given** the same walk, **then** quiescence's order equals today's stable sort, element by element.
  - **(C1–C4 rows)** At least one targeted row each: equal keys keep input order (C1); a QxP against NxP pair and a
    knight-against-bishop capture of one victim keep today's order (C2); the input is deep- and identity-equal
    after the call (C3); two calls in a row return two distinct arrays, and the first is unchanged by the second (C4).
- **A3 (speed, the 3 % bar).** **Given** `kiwipete`, `position-6` and the start position, 5 interleaved runs per board
  per build at 3 000 ms, with no `cutechess-cli` running and load1 recorded, **then** head's median nodes per second
  is **≥ 1.03 ×** base's on at least two boards and **≥ 1.00 ×** on the third. QE's interleaved reading at the tip
  decides. The Engineer's figures are indicative.
- **A4 (gates).** The mandatory `npm run lint`, `typecheck`, `test` and `build` are green at every commit. `G1` is
  54/58 with every row's move, depth and nodes equal to base (`PUZZLE_DEEP=1`). `G4` (A1), `G5`, and `G6` "≥ base"
  (floor 6, any run below depth 6 FAILs). `G7`: a scratch, if any, is fixed-size and counted in (a), and growth is 0.
  `G8`, and `G9` (`git diff` of `src/levels.ts` empty). `G2` and `G3` are not owed, because `evaluate` is untouched.
- **A5 (the reading).** **S2** (`EPIC-008`): the mechanical bar A1–A4, and **no smoke** (`EPIC-010` § The merge rule:
  value-identical tickets stay on S2). There is no playing reading.

## What happens if A3 is missed

- **A1 or A2 red:** that is a defect. The ticket goes back to the Software Engineer, and A3 is read again after the
  fix.
- **A1 and A2 green, A3 missed:** NOT MET. The branch is **not merged**. QE records a `failed-attempt` note with the
  three medians, the ratios and load1. The ticket comes back to BA/PM, which closes it as **dropped**. There is no
  re-tune round, because a value-identical change has nothing to tune.
- **What the drop changes:** nothing waits on it. `ABC-233` and `ABC-234` build on today's `orderMoves`, and their
  pull order loses only this ticket. The `failed-attempt` note is the record that stops a blind retry. The cut is
  re-opened only with a different form, or after a fresh profile ranks ordering higher (for example after `ABC-233`
  or `ABC-234` adds work to `orderKey`).

## NFR triggers

- **`NFR-005` (depth at 3 s):** `G6` "≥ base", floor 6. Expected to hold or rise.
- **`NFR-009` (≤ 16 MiB, ≤ 1 MiB growth):** a module scratch, if any, is fixed-size. It is counted in `G7` (a), with
  growth 0. Fewer bytes per node are expected. The figure is reported as INFO, not as a bar.
- **`NFR-004`:** clock reads are equal (A1). **`NFR-008`:** lane rows at depth 1 only, and the walk runs under
  `ENGINE_DEEP=1`.
- **Security:** none. No input path.

## Test notes

1. A1 is the `ABC-206` and `ABC-235` identity sweep, run out of tree for the cross-build half.
2. The reference copy of today's `orderMoves` lives in the test file, not in `src/`.
3. UAT is owed (production lines). The QE verdict signs it.

## Size and priority

- **Size: S.** Two functions in two files, one oracle, one speed bar. No ADR (value-identical, as `ABC-235`).
- **Priority: P3.** It has the smallest bound of the four confirmed cuts. Its order matters more than its rank: it
  goes in before `ABC-233` and `ABC-234`.

## Dependencies

- **Pull order:** after `ABC-235` merges, and before `ABC-233` and `ABC-234`, which edit the same `orderKey` and
  `orderMoves` (the Architect's order, `…eebca902` § Merge coupling). There is no shared file with `ABC-235`. The
  order exists so that A1 and A3 read against a base that already holds `ABC-235`, and so that two nps readings do
  not share the host.
- **`src/quiescence.ts` is shared with `ABC-228` and `ABC-229`** (item 2 only: the capture sort, `:110`). Whichever
  merges second rebases. If `ABC-228` or `ABC-229` has merged first, item 2 keeps C1 and C2 on the new capture list,
  and A1 and A2 (P2) are read against the new base.
- **No ADR.** `ADR-0024`'s `mvvLvaKey` and `ABC-080`'s comparator contract are kept exactly (C1–C4).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `ABC-227` A5 cut 6; bound 5.6–6.7 % |
| 2 | scope and out-of-scope | ✅ C1–C4 from `…7fc1b90c`; `orderKey` out |
| 3 | INVEST | ✅ S; independent of `ABC-235` (no shared file); ahead of `ABC-233`/`234` |
| 4 | testable, measurable acceptance | ✅ A1–A5; the miss rule is stated |
| 5 | dependencies known | ✅ pull order; `src/quiescence.ts` shared with `ABC-228`/`229` |
| 6 | NFR triggers with targets | ✅ ≥ 1.03 × nps on two boards; identity; `G7` growth 0 |
| 7 | test notes | ✅ 3 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ✅ none |

**DoR 10/10. Ready.** The Orchestrator pulls it after `ABC-235` merges.

> **Result 2026-10-30, Software Engineer** (task `se-ABC-240`, branch `grugops/ABC-240` from `main` `0e0ef856`): item 1
> (`69e19fc4`, `orderMoves`) and item 2 (`7913499d`, quiescence's `orderCaptures`) built to `arch-ABC-235` cut 6
> (C1–C4). A1 byte-equal to the merge base at both commits (6 021 rows, plain `node`, out of tree, no golden file
> committed), plus a depth-5 sample of the unpruned doors (264 rows), equal. A2 (P1, P2, C1–C4) green, with the
> 285 074-position walk under `ENGINE_DEEP=1`; each condition planted red. SE nps, indicative, 5 interleaved per board,
> tip against base: kiwipete 1.117x, position-6 1.109x, start 1.076x (load1 1.7–2.9, Tctl 75–81 °C). QE's interleaved
> A3 reading and G6's 5 runs decide. Notes: `se-ABC-240`.
