---
id: 20261009T163130Z-software-engineer-decision-abc082-term-shape-lift-and-a4-search-row-refixtured-7040acad
kind: decision
by: software-engineer
at: 2026-10-09T16:31:30Z
verified_by:
confidence: high
refs:
  - ABC-082
  - ABC-076
  - ABC-121
  - ADR-0026
  - src/evaluate.ts
  - src/evaluate.mirror-corpus.ts
  - src/evaluate.pawns.test.ts
  - src/search.pvs-lmr.test.ts
  - .grugops/context/rescore-abc082/notes/20261009T155200Z-ba-pm-decision-abc082-rescore-10of10-ready-588c17cc.md
supersedes:
---

# `ABC-082`'s implementation decisions: the term's shape, the `A7` lift, and `ABC-121` `A4`'s `search()` row re-fixtured

Hand-authored and unsealed (`AGENTS.md`: no `context-io.ts` on this install). Branch
`grugops/ABC-082-pawn-structure` @ `34c9c02`, off `grugops/wave-2026-09-25` @ `5ebe1d8`.

## 1. The term

- **Where:** inside `evaluate`, added to `whiteMinusBlack`'s return (`src/evaluate.ts`). The two
  callers (bare leaf, quiescence stand-pat) are untouched, as Scope asks.
- **Weights (hand-tuned, relations tested, never totals):** doubled 15 per extra pawn on a file,
  isolated 10 per pawn, passed by own-side rank `[0, 5, 10, 20, 35, 60, 100, 0]`. Doubled + two
  isolated = 35 cp, inside `A2`'s 50 cp cap. Early-rank passed bonuses are kept small for
  `QE-G3` (test note 5), which stays green.
- **Passed = no enemy PAWN ahead on its own or an adjacent file.** A pawn behind, a pawn beside
  on the same rank, and a piece do not stop it. The rear pawn of a doubled pair can be passed.
- **`isPassedPawn(board, square)` is exported.** `A5` needs the classification itself, and
  `evaluate` calls the same function, so `A5` tests the code that scores.
- **No allocation, no state, no cache.** Two passes over ranks 2–7 with file bitmasks. The
  passed check scans forward. A faster mask-based variant was not written: `NFR-005`'s node rate
  did not move (observation `…a00b6aaa`), so rule 7 applies.

## 2. `A7`'s lift

`clonePosition`, `mirrorSquare`, `mirrorPosition`, `buildCorpus`, `PERFT_POSITIONS` and
`START_FEN` moved **unchanged** into `src/evaluate.mirror-corpus.ts`. It is a plain module
(the `search.mate-corpus.ts` precedent), so vitest does not collect it and tsc and Biome check it.
`noExportsInTest` is not relaxed. The advisory docblock in `src/evaluate.test.ts` is replaced by
a pointer. `src/evaluate.test.ts` still reads 21 rows, as before.

## 3. `ABC-121` `A4` (§ Merged bars row 8): the `search()` row gets a re-found fixture

**Measured:** on this build `A4_FEN` at depth 4 gives:
- fixed shape: `noLmrResearch` 95 / h5e5 (= the correct answer), `noResearch` 50 / d6d5;
- deepened shape: both variants 50 / d6d5.

So the fixed shape no longer needs the reduced-move re-search to be right. By `a4scan.ts`'s own
selection rule, the fixture would not be chosen today.

**Probe** (`a4scan.ts` depth 4, 467 positions, 4 hits; `a4engine082.ts` for both shapes): no
position bites both variants in BOTH shapes on this build.

**Two readings:**
- **(a)** Keep `A4_FEN` on both rows. Both variants still red via the re-search-count assertion.
- **(b)** Re-fixture the `search()` row only, with `position-3/b4b1/h5h6`
  (`8/2p5/3p3r/KP6/5p1k/8/4P1P1/1R6 w - - 2 2`). Correct: 10 / b1c1. Both variants, on the
  real `src/`: −20 / b1b4. `A4_FEN` keeps the `chooseMove` row (95 vs 50).

**Taken: (b).** The brief says a fixture that loses its purpose gets a replacement, and (b)
restores the value bite in each shape. Pin `[95, "h5e5"]` → `[10, "b1c1"]` on the `search()` row.
All six re-search variants red (`noLmrResearch`, `noResearch`, and each of them search-only and
engine-only).

**QE or Architect/Design can overrule this to (a)** by reverting the `A4_SEARCH_FEN` hunk. Nothing
else depends on it.
