---
id: 20261030T161118Z-software-engineer-observation-292fc055
kind: observation
by: software-engineer
at: 2026-10-30T16:11:18Z
verified_by: 
confidence: high: deterministic cross-build and fixed-depth readings; planted faults applied and restored
refs:
  - se-ABC-229
  - ABC-229
  - EPIC-010
  - ADR-0053
  - grugops/ABC-229
  - f6ff1c4a
  - 01c37946
  - Q-SET
  - G4
  - A1
  - A2
  - A3
  - src/quiescence.test.ts
  - src/gameend.nfr.test.ts
supersedes: 
seal: sha256:df584a5661d06721f6654ed09ebf24a5aa1e8f48ca8e2089a8432e85044585e6
---

# Software Engineer observation, se-ABC-229: A1 identity, A2 Q-SET placed and holding, A3 and the oracle, the planted faults

At `grugops/ABC-229` `f6ff1c4a` (code) against `main` `01c37946`. Every reading is deterministic, at a fixed depth or on a frozen clock, and ran in plain `node` or in the lanes. Raw files are in `raw/`.

## A1 (`G4`): cross-build, out of tree (`raw/a1.txt`, `raw/scripts/a1.mjs`, adapted from se-ABC-228's)
- **Corpus:** 276 positions, from the `ABC-078` `A3` and `ABC-121` sources (the six roots, the six endgames, and every in-progress child of each).
- **The new pair:**
  - head `searchWithoutQuietPromotions` against base `search()` at depths 1–4: 1 104 rows, 0 differ, sha `477fbd2e070c21db` on both sides;
  - head `chooseMoveWithoutQuietPromotions` against base `chooseMove`, frozen clock to depth 4: 276 rows, 0 differ, sha `32a44406418cfd09`.
- **Every older door against its pre-ticket self: 0 differ.**
  - `ABC-228`'s pair: `7a5924b5bf81f303` and `aa3b9cfae2b2631b`, the same shas `se-ABC-228` recorded.
  - NullMove, Reductions, PvsOrReductions, Table, Ordering, Killers and Quiescence at d3; Pruning and PruningOrQuiescence at d2; the three older engine doors to depth 4.
- **Non-vacuity:** head `search()` differs from base `search()` on 236 of 1 104 rows.

## A2: `Q-SET` QP-1..QP-9 placed at QE's frozen values, none changed, all hold (`src/quiescence.test.ts`)
- **Per row:** the static score, the shipped value, the pre-`ABC-229` value (evasions on, quiet promotions off), and the brute-force twin under both rules, each equal to the frozen figure.
- **The safe rows** (QP-1 977, QP-6 947, QP-7 29 999, QP-9 977) read ≥ static + 600, and the pre-`ABC-229` rules read the static score.
- **Separation:** exactly QP-1, QP-6, QP-7, QP-8 and QP-9 separate the rules, as frozen. QP-2, QP-3, QP-4 and QP-5 do not move.
- **Distance:** QP-7 from a leaf 5 plies down reads 29 994.
- **Also pinned:** no node past qply 8; every row's position byte-identical.
- **The INFO row** `kpk-b6c6` is pinned through `search()` at d8: 902 shipped, 186 on the door (and on `searchWithoutQuiescenceEvasions`), b6c6 on both. `chooseMove` and its door read the same at d8.
- **Disagreements with the freeze: none.**

## A3 and the oracle (`SEARCH_DEEP=1` rows green; numbers from `raw/oracle.txt`)
- **A3, `search(…, 6).nodes` against `searchWithoutQuietPromotions`:** kiwipete 330 314 / 324 162 = **1.019×**, position-6 154 466 / 154 464 = **1.000×**. That is ≤ 1.2×, and equal to `ADR-0053` d9's reference.
- **d5 drift on the 190 against `ABC-229`'s doors** (bars ≥ 95 % within 25 cp, none beyond 12 cp):
  - `search()`: **100 %** of 187, max **8 cp**; 3 of 190 scores moved; 0 mate flips.
  - `chooseMove`: **100 %**, max **8 cp**; 3 moved; 0 flips.
  - The max is on kiwipete after Be3, 350 → 358.
- **`ABC-228`'s re-pointed rows read exactly what `se-ABC-228` recorded:**
  - A4: 1.3677× and 1.4053×;
  - drift: 89.30 % / 118 cp (`search`) and 88.77 % / 118 cp (`chooseMove`);
  - mate floor: 0 of 189 violated.
  - Report: `search()` against the `ABC-229` door on the 287 violates 0 of 189.

## The one-pass row
- At a quiescence node out of check one ply below the cap, with the shipped rules: `generateCaptures` ×1, `generateMoves` ×0, `legalMoves` ×0, `legalCaptures` ×0, and `legalCapturesAndQueenPromotions` ×1.
- Boards: QP-1, QP-9, QP-5 and kiwipete (`src/gameend.nfr.test.ts`).

## Planted faults (`raw/plant.txt`; each restored, and the suite green after)
| fault | reds |
|---|---|
| P1 the generator scans white's rank only | QP-9, the separation and safe rows, the list-shape row, the spy row, and 9 more |
| P2 quiet promotions at qply 0 only | QP-8, the separation row, the spy row |
| P3 a second `legalMoves` pass | the one-pass spy row |
| P4 no legality test on the promotion | the pinned-pawn row, the list-shape row |
| P5 quiet under-promotions included | QP-4, the separation row, the list-shape row |
| P6 the search door's switch on | the Q3 seam row, the INFO row, the literal row |
| P7 `chooseMove`'s switch off | the engine INFO row, the literal row |
| P8 the list unsorted with promotions on | 4 engine abort/maxNodes rows (node-count readers) |
