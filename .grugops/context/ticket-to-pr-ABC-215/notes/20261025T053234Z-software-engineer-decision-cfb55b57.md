---
id: 20261025T053234Z-software-engineer-decision-cfb55b57
kind: decision
by: software-engineer
at: 2026-10-25T05:32:34Z
verified_by: 
confidence: high on the routes and readings; the three companions are flagged for QE and Architect/Design
refs:
  - ABC-215
  - EPIC-008
  - plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
  - arch-design-ABC-215/20261025T045829Z-architect-design-decision-e04234f4
  - arch-design-ABC-215/20261025T045829Z-architect-design-observation-cbbb9a63
  - bapm-amend-ABC-215/20261025T050544Z-ba-pm-decision-fb4f7c9c
  - grugops/ABC-215
  - ec9331e2
  - c8fc3075
  - ADR-0028
  - ADR-0026
  - ABC-083
  - ABC-082
supersedes: 
seal: sha256:fb9dc713fac3c85474a35523e340ea29b6195779b2ad1bb1469924730dce4bc6
---

# ABC-215 moved pins: the ruling's 16 rows in 5 files, each by its stated route, plus three companions flagged

These are the default-lane reds on the build: 13 in 4 files, exactly the ruling's set. The deep lanes add the ruling's 3 `quiescence.test.ts` rows. No other row went red. No relation row, level or NFR bound moved. `search.qe.test.ts` was not edited.

## Re-pins (from a measurement, base and build)
- `transposition` `A1` knight-g1 ×2: 894 → 939 (table on and off).
- `transposition` `A1` position-3: 1 325 → 1 377 nodes with the table. **The same row's table-off pin moves too: 1 523 → 1 533.**
- `transposition` `A5`: 7 832 → 7 295 nodes; the depth-3 score −488 → −485.
- `ordering` `A4` position-6 d2: none / MVV-LVA / + killers 8 887 / 4 419 / 3 871 → 10 371 / 3 266 / 3 177. `A3`'s guard reads 30.63 % (level 65 %).
- `ordering` `A4` promotion-capture d3: 262 → 232. `M13` re-planted reads 252.
- `ordering` `G1` position-3 at 3 ticks: 354 → 342. `N3` re-planted reads 347.
- `quiescence` `A4` position-6 d3 bare leaf `[deep]`: 2 355 → 2 398, still c3d5.

## Oracle rule (`quiescence` `A5`, `[deep]`)
- `searchWithoutPruning(p, 3)` was re-run on the build in plain node. It equals `searchWithoutPvsOrReductions` and `search()` on score and move. Kiwipete 70 → **8 / e2a6** (68 705 431 oracle nodes). Position-6 84 → **85 / c3d5** (12 929 308). The moves are unchanged.

## Re-finds under `ADR-0028` d2 (same theme, measured on base and build, scans re-run over 6 731 / 467 positions)
- `engine` `A3` ×2: 1. g4 Nf6 → **1. g4 d6** (`rnbqkbnr/ppp1pppp/3p4/8/6P1/8/PPPPPP1P/RNBQKBNR w KQkq - 0 2`). The build reads e2e3 at d1/d2 (53 / 212 nodes) and g4g5 at d3 (1 890). Only budget 3 completes d2 (1 076) and aborts inside d3. Same budget. The deep literal `g4g5` row is unedited and green.
- `ordering` Scope tie: position-6 Rfc1 Bxe3 → **position-4 after 1. Bc5 Nb3** (`r3k2r/Pppp1ppp/1b3nbN/1PB5/B1P1P3/qn3N2/Pp1P2PP/R2Q1RK1 w kq - 2 2`). Bxb3 and Qxb3 tie at −221. No tie at base (both Qxb3, −217). **Companion: the engine row "chooseMove's completed depth-1 iteration returns search()'s move" reads the same `TIE_FEN`, so its literal moves with the fixture, g5e3 → a4b3.** It was not red. It moves only because the fixture moves, as at `ABC-083`. No hit in 6 731 + 2 079 positions keeps g5e3.
- `pvs-lmr` `A4` ×2: no position bites both variants in both shapes on the build. That is `ABC-082`'s split. The `chooseMove` row moves `A4_FEN` to **position-3 after 1. Rb3 Rc5** (`8/2p5/3p4/KPr5/5p1k/1R6/4P1P1/8 w - - 2 2`; deepened d4 −7 / b3f3; the variants −12 / b3h3). The `search()` row keeps 1. Rb3 Rd5 as `A4_SEARCH_FEN`. Its literal moves `[19, b3f3]` → `[4, b3f3]`, and the fixed shape still bites both variants (0 / b3c3).

## Comment-only companion
- The `transposition` knight-g1 docblock now says that depth 5 also reads 939 twice, where `ABC-083` read 928 / 910. The guard is still the key row. No assertion is involved.
