---
id: 20261025T045829Z-architect-design-observation-cbbb9a63
kind: observation
by: architect-design
at: 2026-10-25T04:58:29Z
verified_by: 
confidence: high (deterministic: frozen clock, fixed depth, virtual clock; base tree reproduces qe-ABC-205 counts exactly); throughput is UNKNOWN - verify
refs:
  - ABC-215
  - EPIC-008
  - ABC-214
  - ABC-205
  - ABC-207
  - ABC-216
  - ADR-0048
  - ADR-0031
  - ADR-0028
  - ADR-0026
  - ADR-0034
  - ADR-0036
  - NFR-005
  - NFR-008
  - G1
  - G6
  - S3
  - LIC-PUB-1
  - OQ-214-4
  - QE-205-c
  - plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
  - arch-rule-ABC-205-g6/20261025T042840Z-architect-design-decision-912bcb0d
  - arch-rule-ABC-205-g6/20261025T042840Z-architect-design-observation-00c6a18d
  - arch-rule-ABC-205-g6/20261025T043100Z-orchestrator-decision-154f2ced
  - qe-ABC-205/20261025T041540Z-qe-e2e-observation-35de132c
  - grugops/arch-design-ABC-215
  - 15f42dd2
  - d5690c5c
supersedes: 
seal: sha256:a96a3bb1184347b7582dbb2842db0fbaeb4808e0ae1b62140346cf91e9f7a74a
---

# Architect/Design: ABC-215 design probes. Default and deep lanes, frozen-clock nodes d7/d8, the oracle, and relation margins on four scratch trees. No real-clock timing

Task `arch-design-ABC-215`, records only. The trees are `git clone`s of `main` `15f42dd2` in `<scratchpad>/arch215/trees/`,
one per variant: `base`, `c2` (the candidate), `pv` (`PIECE_VALUE` alone) and `tb` (the six tables alone). The
arrays were rewritten by `probe/patch.mjs` from `probe/rules.mjs`, never in `src/`. Plain node v26.11.1. The scripts
are `rules.mjs`, `patch.mjs`, `nodes.mts`, `values.mts`, `oracle.mts`, `deep.sh` and `fails.sh` in
`<scratchpad>/arch215/probe/`. They are not committed.
- **Identity:** `src/` at `15f42dd2` is byte-identical to `d5690c5c`. The base tree's frozen-clock counts equal
  `qe-ABC-205` `…35de132c` exactly.

## Lanes
- **Default lane** (`vitest run`, heap 128): base 2 075/2 075; `c2` 2 062/2 075 (13 reds, 4 files); `pv` 2 072
  (3 reds: ordering `A4` position-6 d2 8 887 → 8 925, transposition `A1` knight-g1 ×2 894 → 899); `tb` 2 062 (the same 13
  as `c2`, with different values).
- **Deep lanes** (`PUZZLE_DEEP`; `SEARCH_DEEP` search, ordering, transposition, quiescence and pvs-lmr; `ENGINE_DEEP` engine
  and levels, with `-t` excluding `real clock|REAL clock|wall clock|NFR-005`). `ENGINE_DEEP` transposition `A7` and
  pvs-lmr `A2` were not run, because they are all real-clock. Base: all green (6 + 4 rows filtered). `c2`: the
  default-lane rows again, plus `quiescence` `A4` position-6 d3 bare leaf 2 355 → 2 398, and `A5` `ORACLE_AT_DEPTH_3`
  kiwipete 70/e2a6 → 8 and position-6 84/c3d5 → 85.
- **`c2` default reds:** `engine` `A3` ×2 (budget 3 completes d3; −64 → −2); `ordering` Scope tie (unordered g5e3);
  `ordering` `A4` 8 887 → 10 371, promotion-capture 262 → 232; `ordering` `G1` 354 → 342; `pvs-lmr` `A4` ×2 (score 4 against 19;
  0 re-searches); `transposition` `A1` 894 → 939 ×2, 1 325 → 1 377; `A5` 7 832 → 7 295, −488 → −485. **No relation, no level.**

## Readings on `c2` (deterministic)
- Multiplier cells, base → `c2` (level): kiwipete d1 12.31 → 17.92 (180), d2 15.11 → 20.48 (50), d3 4.09 → 3.51 (70);
  position-6 d1 9.19 → 8.96 (10), d2 28.46 → 23.36 (42), d3 4.86 → 5.20 (13).
- `ABC-121` `A1` d5 drift on the 190: base 97.33 % / 97.86 %, max 51 (position-6/e2d2). `c2`: 97.86 % / 97.86 %, max 63
  (position-6/f3h4: 566 → 629). 0 mate flips.
- `G1` puzzle suite (virtual clock): base 54/58; `c2` 54/58. The same 4 mate-in-3 rows miss.
- Oracle (`searchWithoutPruning(p, 3)` against `searchWithoutPvsOrReductions` and `search()`, no timing): position-6 85/c3d5 on all three (12 929 308 oracle nodes); kiwipete 8/e2a6 on all three (68 705 431). `equal: true` on both, so the oracle rule permits the re-pin: kiwipete 70 → 8 and position-6 84 → 85, with the moves unchanged.
- Relation margins, base → `c2`: `ABC-076` `A3` 284 → 309; `A4` 80 → 70. `ABC-083` `A2` g2 removed 151 → 141; g6 11 → 3;
  `A3` 131 → 121; e5/f5 5 → 14; `A4` 0/60 → 0/60. `QE-G2` −556 → −556; `QE-G3` 851 → 858 (d2 and d3).

## Frozen-clock nodes to complete depth k (`chooseMove`, `now: () => 0`, `maxDepth: k`)
| tree | kiwipete d6 / d7 / d8 | position-6 d6 / d7 / d8 |
|---|---|---|
| base | 231 536 / 566 233 / 1 638 196 | 169 685 / 644 469 / 1 451 759 |
| `c2` | 248 056 / 609 900 / 1 735 339 | 180 658 / 586 333 / 1 355 149 |
| `pv` | — / 573 147 / 1 655 163 | — / 648 480 / 1 483 000 |
| `tb` | — / 593 030 / 1 694 996 | — / 631 127 / 1 438 596 |
- Against base's 3-s runs (`…35de132c`): position-6 searched 1 444 505–1 457 817 nodes (3 of 5 reached d8). Kiwipete
  searched 1.22–1.29 M (always d7).
- `c2` position-6 d8 is −6.65 % against base's need, and 6.2 % below base's lowest run. `pv` is +2.15 %: a predicted
  miss on its own.

## Cells equal to base (provenance, not a licence ruling)
- `c2` against base, cells that differ: `PIECE_VALUE` 2/7, pawn 46/64, knight 64/64, bishop 18/64, rook 20/64, queen
  27/64, king 50/64.

## Not run
- Any real-clock search, `G2`, `G5`, `G6`, `G8`, `G9`, `G11`, D, `N8-LANE`, and the real-clock rows named above.
