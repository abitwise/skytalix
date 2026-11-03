---
id: 20261103T104753Z-software-engineer-observation-ec89c8c3
kind: observation
by: software-engineer
at: 2026-11-03T10:47:53Z
verified_by: 
confidence: high (each row's old and new figure read from a run; classes per ADR-0064 d7; no zugzwang depth moved)
refs:
  - se-ABC-269
  - grugops/ABC-269
  - ABC-269
  - EPIC-011
  - E1
  - E3
  - ADR-0064
  - ADR-0061
  - ADR-0028
  - ADR-0056
  - ABC-231
  - ABC-232
  - ABC-215
  - ABC-268
  - ABC-228
  - ABC-229
  - ABC-230
  - ABC-249
  - ABC-170
  - ABC-208
  - B0
  - B1
  - B2
  - B3
  - B4
  - B6
  - F3
  - G1
  - G2
  - G3
  - G4
  - NFR-009
  - NFR-008
  - QE-269-a
  - QE-269-b
  - 58fa3eb4
  - b7a8fc3a
  - 8470d3f0
  - src/evaluate-params.ts
  - src/evaluate.ts
  - src/search.ts
  - src/engine.ts
  - src/quiescence.ts
  - src/evaluate.taper.test.ts
  - src/evaluate.taper-corpus.ts
  - arch-ABC-269-rule/20261103T093305Z-architect-design-decision-8ccb561f
  - qe-ABC-269-freeze/20261102T222017Z-qe-e2e-decision-1b856350
  - qe-ABC-269-freeze/20261102T222129Z-qe-e2e-observation-aea4ceba
  - arch-E1/20261102T215541Z-architect-design-decision-d8150777
supersedes: 
seal: sha256:8d6c987bfce8ce14a0d96c42296db8d3d4e2a0e046493bab7813950e30aff843
---

# se-ABC-269 migration rows, classed by ADR-0064 d7. 0 values tuned, 0 zugzwang depths re-pinned. 16 shipped-side rows re-pointed to the new doors with figures unchanged, plus 13 `evaluate` readings in quiescence re-pointed to `evaluateWithoutTaper`. Re-pinned (old → new below): 4 `ABC-230` fixtures (6 rows), `ABC-249`, transposition A5, and 2 byte rows at 384 → 448 KiB. 1 fixture re-found (ADR-0028 d2). 2 source pins re-written. Export lists and switch-literal maps grown. npm test 2 519 / 2 519 (base 2 429; +90 new rows, all in `src/evaluate.taper.test.ts`)

Software Engineer, task `se-ABC-269`. The probe's upper bound was 40 reds in 7 files with every path tapered. The build's first lane run read **55 reds in 8 files**. The extra reds are export lists, switch maps, source pins, the memo byte rows and the two `QuiescenceRules`-literal readings. The 40 are a subset. Every red is classed below. None is a defect: the cross-build and B0 hold.

## Re-pointed: the shipped side of a row whose other side is an older door → the new door of its recursion; figures unchanged
- `src/quiescence.test.ts`:
  - Every `evaluate(…)` reading (13 calls) → `evaluateWithoutTaper(…)`. These are rows that read `quiesce` under a pre-`ABC-269` rules record ("static", "pre-ticket", the brute force), so they keep their figures.
  - `ABC-228` "Q2 through the depth-0 seam" → `searchWithoutTaper` −536 (`search()` reads −524).
  - `ABC-229` "Q3 through the depth-0 seam" → `searchWithoutTaper` 977 (`search()` 957).
  - `ABC-229` kpk-b6c6 at d8 → `searchWithoutTaper` 902 (`search()` 917), and → `chooseMoveWithoutTaper` 902 (`chooseMove` 917).
- `src/search.futility.test.ts`:
  - "depth 1 … IS its door" → `searchWithoutTaper`.
  - The `QE-268-b` block (3 rows) → `searchWithoutTaper` / `chooseMoveWithoutTaper` / `futilityNode(…, false)`, still −554 / −544.
    - On the tapered scale the fixture no longer bites: the searched Ke2 and the full-width node both read −532.
  - Deep A3 (a) ×2 → 100.00 % / max 10 and 100.00 % / max 0.
  - Deep A4 (a) ×4 → 0.7958 / 0.7876 / 0.8295 / 0.8220.
  - Deep A4 (b) → +0.279.
  - A3 (b) (the mate floor) and A3 (c) (zugzwang) stay on the shipped path and pass.
- `src/search.null-move.test.ts`:
  - `QE-208-a`'s sweep → `chooseMoveWithoutTaper`, still ≥ 3 aborts inside a null subtree.
    - The tapered tree lands 2 of the 11 there. The shipped `chooseMove` is swept beside it for byte-identity only: 0 mutated roots, ≥ 1 inside null.

## Re-pinned: pinned values on the shipped path that moved (old → new)
- **`src/engine.test.ts` `ABC-230` A1 / A8 `base`** (chooseMove d4, no prior keys):
  - KQ v K: d8c8 −1006 → **d8e7 −1010**.
  - K v KQ: d1c1 −1006 → **d1e2 −1010**.
  - KR v K: d8c7 −556 → **d8d7 −564**.
  - K v KR: d1c1 −556 → **d1d2 −564**.
  - In each row the base move still differs from the repeat move, and with the keys the move is still the repeat at 0.
- **`src/engine.test.ts` `ABC-249`:** with keys f1e1 404 → **441**; without keys f1g1 497 → **520**. The moves are unchanged.
- **`src/transposition.test.ts` A5:** chooseMove at 6 ticks reaches depth 4 → **5**. The perpetual f7f8 and its exact 0 are unchanged.
- **`src/evaluate.pawns.test.ts` and `src/transposition.test.ts` A7:** pawn memo 384 → **448 KiB** (ADR-0064 d5, NFR-009; G7's growth is +64 KiB fixed).

## Re-found (ADR-0028 d2): a fixture property lost on the shipped path
- **`src/engine.test.ts` `ABC-170` A1:** "maxDepth 3 reads `search(position, 3)`'s move and score".
  - On `kp-vs-k` the tapered recursions tie at 107 and break the tie differently (e2e3 / e1d2).
  - Re-found with the same theme and the white king one step up: `8/8/8/4k3/8/3K4/4P3/8 w - - 0 1`.
  - Both recursions read e2e4 163 there (doors d3d2 137). Unlimited, it completes depth 7 (doors 6), so the "real stop" row still bites.

## Source pins re-written (the new argument and the new record)
- `ABC-268`: `futilityNode.length` 5 → 6. The call-site string gains `, X.taper`. Direct calls pass `true` (9 calls).
- `ABC-228`: the rules-record regex now reads `const rules = X.taper ? RULES_TAPERED : …the old ternary…`, plus a `RULES_TAPERED` literal row. The four old record literals are byte-identical.

## Grown lists (a new door, as each earlier door ticket did)
- Export lists: `searchWithoutTaper` (`src/search.test.ts` A6) and `chooseMoveWithoutTaper` (`src/engine.test.ts` A4, plus its `.length`).
- Switch-literal maps that now include the taper door (its literal is the shipped one with `taper: false`):
  - `QE-208-c` `nullMove`;
  - `ABC-228` `quiescenceEvasions`;
  - `ABC-229` `quietPromotions`;
  - `ABC-268` `futility`.
- `VALUE_TABLES_FOR_TEST` key row: +3 names.

## Deep lanes run (all green after the re-points above; the counts are the final runs)
- `SEARCH_DEEP=1`: taper 99, null-move 44, futility 53, search 57, quiescence 116 (the depth-3 oracle pins included), transposition 40, pvs-lmr 29, ordering 43.
- `ENGINE_DEEP=1`: engine 82, transposition 26, evaluate.pawns 44.
- `PUZZLE_DEEP=1`: 18.
- The Levels deep lane is B8's (QE).
