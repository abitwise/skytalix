---
id: 20260925T084500Z-software-engineer-decision-abc080-one-comparator-both-recursions-killers-per-call-hash-arm-dormant-3c1e7a52
kind: decision
by: software-engineer
at: 2026-09-25T08:45:00Z
verified_by:
confidence: high
refs:
  - ABC-080
  - ADR-0024
  - NFR-005
  - N8-LANE
  - 20260925T080616Z-architect-design-decision-r1-abc080-a3-bar-releveled-to-4pct-a4-at-depth5-f7e66060
  - src/search.ts
  - src/engine.ts
  - src/search.ordering.test.ts
supersedes:
---

# ABC-080 built: one comparator in `src/search.ts`, consumed by both recursions; killers per call; hash arm dormant

Hand-authored per `agent-factory/contracts/context-note.md`, no `seal`. This is the degraded
posture `AGENTS.md` records, not re-derived here. Branch `grugops/ABC-080-move-ordering`, code at
`a437b11` + `ac5215c`, off `grugops/wave-2026-09-24` @ `4f74acc`. NOT merged, NOT pushed.

## Decisions taken at the build, each a judgment a reviewer may overturn

1. **The comparator lives in `src/search.ts` and is exported** (`orderMoves`, `KillerTable`). It
   is not in a new module. The ticket's Scope names `search.ts` + `engine.ts` only, and `engine.ts`
   already imports `MATE_SCORE` from `search.ts`, so this adds no new edge. `ABC-077`'s `A6`
   export list was widened by four (`KillerTable`, `orderMoves`, `searchWithoutKillers`,
   `searchWithoutOrdering`). None of them picks a move: `orderMoves` orders a list it is handed.
2. **Tiers:** hash move 3 000 000; every capture or promotion 1 000 000 + `mvvLvaKey`; killer
   slot 0 = 2, slot 1 = 1; everything else 0. The sort is stable (generation order within a
   tier). A killer or hash move absent from the list is ignored, never added (`A2`). Moves are
   matched on from/to/promotion, because a killer comes from a sibling position's list.
3. **Killers: two quiet moves per ply, newest first, recorded on a main-tree beta cutoff.**
   Captures and promotions are never recorded. There is one `KillerTable` per `search()` call.
   There is one per `chooseMove()` call, **kept across its iterations and never across calls**.
   The root never cuts off, so ply 0 never holds a killer.
4. **The hash-move arm is DORMANT.** `orderMoves` takes `hashMove`, and both recursions pass
   `null` until `ABC-081` builds a table (`A5`). It is exercised only by `A2`'s variants and one
   comparator unit test.
5. **Every existing test-only door is ordered like `search`.** Only the two new doors turn it
   off. I tried the alternative (old doors stay in generation order). It broke four
   `ABC-079` `A4` rows, which compare `search` and `searchWithoutQuiescence` node for node. So
   the doors must stay one algorithm apart from their own switch. Consequence:
   `quiescence.test.ts`'s pre-quiescence fingerprint re-pinned 562 → 136 (d2) and 14 565 → 2 273
   (d3 deep). **The moves are unchanged** (g5f6, c3d5). This is a test edit in a file outside the
   two named test companions, flagged here rather than hidden.
6. **`engine.test.ts` `A3`'s fixture budget 8 → 4.** Ordering made depth 3 cheaper (2 551 nodes,
   was 9 871). Only budgets 3–4 now complete depth 2 and abort inside depth 3. The premise is
   unchanged: e2e3 at d1/d2, g4g5 at d3.
7. **Lanes.** The default lane holds a cheap standing guard per criterion. The criteria's own
   positions and depths run under `SEARCH_DEEP=1`, and absent cases are not defined, so the
   skip count stays 0. **The UNORDERED depth-5 search is not run in any lane.** Kiwipete alone
   is 35 538 933 nodes / 85.6 s under plain node. `A4`'s d5 "none" column is taken by
   `probe/a3a4.mjs` and recorded in the sibling observation. The in-suite delete rule is judged
   on d5 for the killers (+killers < MVV-LVA) and on d4 for MVV-LVA (< none).
8. **One new test file, `src/search.ordering.test.ts`.** It carries `A1`–`A6` in one place and
   costs the 160 ms per-file floor (floor account, netted under `N8-LANE`). `A6` is an
   instrumented run: `vi.mock` wraps `makeMove`/`unmakeMove` to count the true ply, and spies on
   `KillerTable.prototype.at`/`record`. It asserts every offer came from a record at the same ply
   of the same table, at the node's real ply, one table per call.
9. **`A7` is not a test.** It compares two builds, and the tree holds one. `probe/a7.mjs` imports the
   git-archived `4f74acc` engine and this build's engine into one node process.
