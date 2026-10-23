---
id: ABC-206
title: "The search runs faster with identical answers: one legal-move generation per leaf, captures-only generation in quiescence, a gives-check test without make/unmake"
status: in-development
column: In Development
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

## Design ruling

> **Architect/Design, 2026-10-24** (task `arch-design-ABC-206`, records plus light probes, at `main` `c735577f`; `main`
> moved to `f47b3429` during the hop, with no `src/` change). Notes: `.grugops/context/arch-design-ABC-206/notes/`.
> **No ADR is opened or changed, and no `NFR-001` bound moves, so the owner STOP does not fire.** One reading of
> `ADR-0003` clause 1 is stated below for the owner to veto if he wants to (`OD-206-1`). It is not a blocker.
> The probes ran on a scratch copy of `src/` in the session scratchpad (`design206/`), never `src/`. The host was at
> load1 about 8.7, with other hops running. **So no timing figure here is a reading.** Every identity and equality
> result below is deterministic.

### The shape: three pieces, three new production functions, no door

| piece | new function (home) | contract (its own `A2` oracle) | caller change |
|---|---|---|---|
| (i) the leaf | `leafEndReason(position): EndReason \| null` (`src/gameend.ts`) | `=== gameStatus(position).reason` for every position, with no counts map | both `leafScore`s (`src/engine.ts`, `src/search.ts`) read it in place of `gameStatus` |
| (i) helper | `hasLegalMove(position): boolean` (`src/legal.ts`) | `=== legalMoves(position).length > 0` | none outside `leafEndReason` |
| (ii) quiescence | `legalCaptures(position): Move[]` (`src/legal.ts`) | the same list **in the same order** as `legalMoves(position).filter((m) => m.captured !== EMPTY)` | `quiesce` builds `captures` from it. The stable MVV-LVA sort is untouched |
| (iii) LMR | `givesCheck(position, move): boolean` (`src/legal.ts`) | `===` make → `isInCheck` → unmake, for every legal move | `lateMoveReduction`'s make/`isInCheck`/unmake lines only |

1. **The leaf (i): no full generation at all.**
   - `leafEndReason` keeps `gameStatus`'s order exactly. First, no legal move: `"checkmate"` if in check, else
     `"stalemate"`. Then `"insufficient-material"` by the same private `isInsufficientMaterial`. Then
     `"seventy-five-move"` at a halfmove clock of 150. Otherwise `null`.
   - The fifty-move claim and repetition are never terminal at a leaf, as today. Repetition stays on
     `repeatsInPath`.
   - It calls `hasLegalMove`, which stops at the first legal move. It never calls `legalMoves` or `zobristKey`.
   - **The rejected shape: one `legalMoves` at the leaf, handed to `quiesce` at `qply` 0.** It still plays and takes
     back every move at every leaf, including the leaves where stand-pat cuts and quiescence generates nothing. It
     would also change `quiesce`'s exported signature.
2. **Quiescence (ii): legality is tested on captures only.** `legalCaptures` walks `generateMoves` once, skips
   non-captures, and runs the same make/test/unmake check on each capture.
   - **The order is identical by construction.** Two order-preserving filters with independent predicates commute,
     so the list is the same one `src/quiescence.ts:107-110` builds today. `A2` asserts it as list equality, not as
     set equality.
   - **No captures-only pseudo-legal generator in `src/moves.ts`.** That touches the perft generator, which is out
     of scope (`NFR-001`'s perft half). It is not needed for the bar (probe below).
3. **LMR (iii): the attack question, without `makeMove`.**
   - For a `FLAG_NONE` move: place the mover on `to`, empty `from`, ask `isSquareAttackedBy(enemy king, mover)`,
     and put both bytes back.
   - For a flagged move (castle, en passant, promotion), fall back to make → `isInCheck` → unmake. That fallback is
     exact by definition. LMR never reaches en passant or a promotion, and castling is rare.
   - **The geometric version (direct ray plus discovered ray) is not built.** The probe cannot resolve (iii)'s gain
     from noise even in the simple form. A cleverer form would add subtle code for a gain nobody can see.
   - `lateMoveReduction`'s signature, its 0/1 contract and its condition order are unchanged. It still derives
     "gives check" itself (`ADR-0026` decision 6). Only the derivation is cheaper.
4. **Unchanged byte for byte:**
   - `legalMoves`, `isInCheck` and `hasLegalEnPassant` (`src/legal.ts`);
   - `gameStatus` (`src/gameend.ts`), which stays `NFR-001`'s subject and the `A2` oracle;
   - `quiesce`'s signature;
   - `src/moves.ts`, `src/apply.ts`, `src/perft.ts` and `src/evaluate.ts`;
   - the node definition: `countNode` and `visit` sit where they sit.
5. **Doors and exports.**
   - **No test-only door.** The change is value-identical, so `ADR-0026` does not apply. The old leaf survives as
     the `A2` oracles (`gameStatus`, `legalMoves`, make/`isInCheck`/unmake), all of which stay in production code.
   - **No new export in `src/search.ts` or `src/engine.ts`.** `ABC-077` `A6`'s list and `src/engine.test.ts:490`'s
     list are unchanged.
   - **The four new exports are production functions, not doors,** so no ADR is owed for them.
6. **`ADR-0003` clause 1 (`OD-206-1`, a reading, not a STOP).**
   - Clause 1 reads *"`src/legal.ts` is not changed. Make/test/unmake stays the legality strategy."* This ruling
     adds three functions to `src/legal.ts`.
   - **The reading:** the clause keeps the strategy. It is not a byte freeze of the file. Make/test/unmake stays the
     only legality test, through the same private `kingSquareOf`. `legalMoves` is byte-identical, so `ADR-0002`'s
     4.13x and `ADR-0003`'s measurements still describe it.
   - None of clause 3's menu is taken: no (c1) pseudo-legal search, no (c2) lazy legality, no (b) pin-aware
     generation.
   - **The precedent:** `ADR-0005` decision 2 (accepted 2026-08-03, after `ADR-0003`) homed `hasLegalEnPassant` in
     `src/legal.ts` as *"the module that already owns 'is this legal'"*.
   - **The counter-reading is on record.** `ADR-0020` cites clause 1 for holding `src/legal.ts` byte-identical
     within `ABC-075`. So the Orchestrator reports this reading to the owner, with the veto open.
   - **If the owner vetoes,** (ii) and (iii) are dropped under Scope item 4, and (i) is built as the rejected shape
     above, with no `src/legal.ts` edit. A second private legality test in another module is not an option: that is
     the duplication `ADR-0005` rejected.

### How identity is kept and proven

- **By construction.** Each leaf returns the value it returns today. `quiesce` searches the same captures in the same
  order. `lateMoveReduction` returns the same 0 or 1. So the tree is the same tree, `countNode` and `visit` fire at
  the same nodes, and the clock is consulted at the same counts (`NFR-004`).
- **`A1`'s node-count definition does not change,** so `A1` reads move, score **and** nodes, plus completed depth
  and the number of clock reads.
- **`A2` (lane, cheap).**
  - Rows go into the existing files: `legalCaptures`, `hasLegalMove` and `givesCheck` in `src/legal.test.ts`;
    `leafEndReason` in `src/gameend.test.ts`. No new test file is added (`NFR-008`, `NFR-010`'s per-file heap row).
  - The lane runs each perft FEN to depth 1, plus the terminal FENs: checkmate, stalemate (thin and queen),
    insufficient material, 75-move, and the fifty-move claim in progress. Each row also asserts the position is
    unchanged.
  - **The full depth-3 expansion runs behind `ENGINE_DEEP=1`.** Plain node takes about 11 s, and vitest costs about
    5x that (`ADR-0041`).
- **The count guards (lane, spied), the `NFR-001` "count, not time" precedent.** All three go in
  `src/gameend.nfr.test.ts`, beside its `legal.ts` spies, plus a pass-through `apply.ts` spy:
  - `leafEndReason` calls `legalMoves` 0 times, `hasLegalMove` exactly once, and `zobristKey` 0 times;
  - `quiesce` calls `legalMoves` 0 times;
  - `lateMoveReduction` calls `makeMove` 0 times on a `FLAG_NONE` move.
  - They sit in one file so that this ticket never edits a file `ABC-205` re-pins (merge order, below).
  - A reintroduced generation is invisible to every value row. These rows are what catch it.
- **`A1` (review time, two trees, not a lane row).** This is a differential run in plain `node` over the branch and
  **its merge base on `main`**, outside the repository (the `NFR-001` gate precedent).
  - **Corpus:** `ABC-078` `A3`'s deep corpus (the six endgames plus their children, and the six benchmark roots plus
    the `broadCorpus`).
  - **Searches:** the shipped `chooseMove`, with LMR on, at budgets 3 and 5 on `tickingClock(1)`. **This is the only
    row that exercises (iii).** `A3`'s own sweep runs with reductions off. Also `chooseMoveWithoutReductions`, and
    `search` / `searchWithoutReductions` / `searchWithoutPvsOrReductions` at depths 1–3.
  - **Compared:** move, score, completed depth, nodes, and clock reads. The diff must be byte-equal.
  - The Engineer runs it at each of the three piece commits. QE runs it at the tip.
  - **No golden file is committed.** It would pin values that `ABC-205`, `207`, `208` and `210` change on purpose.
- **Existing gates (`A3`):** every node pin and door row stays byte-identical. Also the `ENGINE_DEEP` sweep, and
  `PUZZLE_DEEP` (virtual clock, so the per-row depth and nodes are comparable), `G9` and `npm run perft`.
- **Instrument note.** The capacity rows' `vi.mock` (`legalMoves` → its first move, in
  `src/engine.capacity.test.ts` and `src/search.capacity.test.ts`) no longer narrows the leaf or quiescence. It
  narrows the full-width lists it was written for. Both rows compute their oracle with the same `quiesce`, so they
  stay self-consistent and green (probed). Do not widen the mock.

### Probe results (scratch, deterministic unless marked)

- **`A1` shape, a cut-down corpus:** 13 roots plus their children, the shipped `chooseMove` and the door at budgets
  3 and 12, and `search` / `searchWithoutReductions` at depths 1–3. **2 920 rows, byte-identical** (move, score,
  depth, nodes, clock reads) between base and the prototype with all three pieces.
- **`A2` at full depth 3:** six perft FENs plus six terminal or clock FENs, **285 074 positions and 11 137 359 moves,
  0 mismatches.** The positions included 68 mates, 2 stalemates, 202 insufficient-material positions and 3 409
  75-move positions. Every position was unchanged.
- **The existing lane on the prototype:** `engine`, `search`, `search.ordering`, `search.pvs-lmr`, `quiescence`,
  `gameend`, `gameend.nfr`, `legal` and both capacity files. **229 of 229 green**, including both export pins and
  the LMR source assertion.
- **Timing (INDICATIVE ONLY, load1 about 8.7).** `chooseMove` to a 400 k-node cap on a frozen clock, with the same
  nodes, depth 6 and score at every stage, n = 3 interleaved:
  - kiwipete, base 2.4–2.8 s: (i) 1.32–1.43, (i)+(ii) 1.01–1.33, all three 1.02–1.32;
  - position-6, base 2.14–2.38 s: (i) 1.37–1.43, (i)+(ii) 0.94–1.15, all three 0.92–1.03.
  - Read at most as "the bar looks reachable, and (i) carries most of it". **`A4` is QE's reading, at width 1.**

### Commits, in order (each value-identical, each with `A1` and `A2` green)

1. (i): `hasLegalMove` and `leafEndReason`, and both `leafScore`s. This includes their doc comments, which today say
   the leaf calls `gameStatus`.
2. (ii): `legalCaptures`, and `quiesce`'s `captures`.
3. (iii): `givesCheck`, and `lateMoveReduction`. Its doc line *"It plays `move` … and takes it back"* is updated.
- Any one piece may be dropped under Scope item 4. The others stand alone.

### `NFR` impact

- **`NFR-001`:** no bound moves, and `gameStatus`'s contract is unchanged. The leaf stops calling `gameStatus`, so the
  row's *"which every search leaf … calls"* goes stale. Security/NFR records a dated note at the merge, as the page
  says. The new spied rows are test guards, not catalog bounds. Making them a clause would be a bound change, which
  is the owner's call. Not proposed.
- **`NFR-001` perft half:** `generateMoves` and `legalMoves` are untouched, so counts and rate are unchanged by
  construction. QE confirms with `npm run perft`.
- **`NFR-004`:** the clock-read count is equal (probed, and asserted by `A1`).
- **`NFR-005` / `G6`:** expected to improve; read by QE.
- **`NFR-008`:** two to three spied rows and depth-1 rows, with no new file. The deep rows go behind `ENGINE_DEEP`.
- **Security:** no limb.

### Merge order and conflicts with `ABC-212` and `ABC-205`

- **The files.**
  - `ABC-212` (In Development) edits `src/engine.ts` at `HARD_CEILING_MS` (`:129`) and its comments, plus
    `levels`, `cli-options`, `cli`, `uci-session` and their tests.
  - `ABC-205` (build claimed) edits `src/evaluate.ts` and `src/evaluate.king-mobility.test.ts`. It also re-pins 11
    lane rows in `transposition`, `search.ordering`, `search.pvs-lmr`, `engine` and `quiescence` `.test.ts` (its
    § Design ruling).
  - This ticket edits `src/engine.ts` at its `gameend` import (`:75`) and `leafScore` (`:238–249`). It also edits
    `search`, `quiescence`, `legal`, `gameend` and their tests. **It does not edit `src/engine.test.ts`**, which
    `ABC-212`'s pins edit.
  - **This ticket's test edits stay out of all five files `ABC-205` re-pins, and out of `engine.test.ts`.** Its rows
    go only into `legal.test.ts`, `gameend.test.ts` and `gameend.nfr.test.ts`.
  - The only shared file is `src/engine.ts` with `ABC-212`, in disjoint hunks, so a three-way merge takes it with no
    conflict. **No file is shared with `ABC-205`.**
  - **Semantic coupling with `ABC-205` remains.** Its re-pinned node counts are read on its own base. If this ticket
    lands first, `ABC-205`'s re-pins still hold, because this change is value-identical and node-identical. The
    reverse also holds: `A1` is read against whichever base is merged into.
- **The order: `ABC-212` → `ABC-206` → `ABC-205`.**
  - `ABC-212` is furthest along.
  - `ABC-205` waits on `OD-205-1`.
  - Landing value-identical speed before a value change means `ABC-205`'s depth-sensitive readings are read once,
    on the faster base.
- **If `main` moves under this branch,** the Orchestrator merges `main` in (no rebase). The Engineer then:
  - re-runs `A1` against the **new** merge base. Identity is always relative to the base being merged into;
  - re-runs the lane;
  - takes `G1`'s per-row baseline from that base.
  - If `ABC-205` lands first, the committed puzzle baseline is whatever `ABC-205` left.
- **Timing readings run one at a time.** `ABC-206` `A4`, `A5`/`G6` and `G8` never overlap `ABC-212`'s `ENGINE_DEEP`
  `A4`, `ABC-205`'s `A5` eval bar, or any `EPIC-008` reading. A reading under load is void.

### Recommended next move

- **Orchestrator:**
  - merge these records;
  - report `OD-206-1` (the `ADR-0003` clause 1 reading) to the owner as INFO, with the veto open, not as a gate;
  - move `ABC-206` `In Design` → `Ready for Dev`.
- **Software Engineer:** build the three commits above on a branch from `main` after `ABC-212` merges, or from today's
  `main` with `main` merged in later. Run `A1` and `A2` at each commit.
- **QE at the gate:** `A1` at the tip, `A4` (n ≥ 7, interleaved, plain `node`, width 1), `G6`, `G1`, perft, and `A6`
  (`ABC-204` Done).
- **Security/NFR:** the `NFR-001` dated note only. No hop is owed.
