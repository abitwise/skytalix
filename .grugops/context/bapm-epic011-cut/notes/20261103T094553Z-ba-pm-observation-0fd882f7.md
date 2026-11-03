---
id: 20261103T094553Z-ba-pm-observation-0fd882f7
kind: observation
by: ba-pm
at: 2026-11-03T09:45:53Z
verified_by: 
confidence: high on the counts (deterministic re-read of committed probe outputs; duplicates found by FEN); medium on what an error class means (a correlation on 123 positions from one control)
refs:
  - bapm-epic011-cut
  - grugops/bapm-epic011-cut
  - EPIC-011
  - ABC-270
  - ABC-271
  - ABC-272
  - ABC-273
  - E3
  - E3a
  - E3b
  - E4
  - E4a
  - E5
  - E6
  - E7
  - E7a
  - R1
  - G2
  - Q2
  - X2
  - W1
  - P4
  - O1-e
  - ABC-269
  - ABC-239
  - ABC-234
  - ABC-236
  - ABC-263
  - ABC-205
  - ABC-207
  - ABC-232
  - ADR-0064
  - ADR-0056
  - ADR-0057
  - ADR-0031
  - ADR-0061
  - ADR-0024
  - Q-3K-4
  - QE-269-a
  - NFR-005
  - NFR-001
  - NFR-008
  - NFR-009
  - RISK-EPIC011-04
  - RISK-EPIC011-10
  - RISK-EPIC011-11
  - 17725732
  - 53c286cc
  - b5d5cea5
  - orch-2026-10-30a/20261102T221500Z-orchestrator-decision-cc7db847
  - arch-next-pull/20261102T213500Z-architect-design-decision-7e3ace66
  - arch-next-pull/20261102T213500Z-architect-design-observation-d0f1a5fc
  - arch-E1/20261102T215541Z-architect-design-observation-c524a01d
  - arch-E1/20261102T215541Z-architect-design-decision-d8150777
  - qe-ABC-269-freeze/20261102T222129Z-qe-e2e-observation-34cbabaf
  - qe-ABC-263/20261101T225320Z-qe-e2e-decision-f9116735
supersedes: 
seal: sha256:6cc515adf7eccdb1548e3a0995d05cc0b15f07e754b468156b8ced7380caa1d6
---

# bapm-epic011-cut re-classification of the evaluation-lever probe (records only): 22 of the 145 positions are duplicates; on the 123 unique, 25 of 38 errors persist through two doublings (65.8 %, the headline holds); E1's chosen form fixes 1 of the 25; 22 of the 25 sit at phase ≥ 7, 14 with queens on, 8 with a passer, 3 at phase ≤ 6

BA/PM, task `bapm-epic011-cut`. No engine run: `raw/classify.py` reads `arch-next-pull/raw/probe/` (`positions.jsonl`, `out/sf16.jsonl`, `out/play{47000,94000,188000}.jsonl`) and `arch-E1/raw/probe/out/` (`play-L.jsonl`, `play-BASE.jsonl`, `sf16-LP.jsonl`), run once under `flock <host-test.lock> python3 -I`. Output: `raw/classify.out`. Error = Stockfish 19 depth-16 loss ≥ 50 cp for the move played; phase = N 1, B 1, R 2, Q 4, clamped to 24; passer = no enemy pawn ahead on the same or adjacent files.

## Duplicates
- 145 positions, **123 unique** (board, side, castling, en passant). 22 duplicate groups of two: games n and n + 200 of the 400-game C3″ PGN replay the same opening (both builds deterministic), e.g. g49/g249, g153/g353, g193/g393, g17/g217, g177/g377.
- The full-set figures (48 → 31) re-read on unique positions: **38 errors at 47 000 nodes, 25 persist at 188 000 (65.8 %)**. The pre-registered reading (≥ 50 % → evaluation is the bigger lever) is unchanged.
- By ply, unique: 20 plies 7 of 13 persist; 40 plies 10 of 15; 60 plies **8 of 10** (the full set read 11 of 13).

## Where the 25 persistent errors sit (unique positions)
| class | positions | errors 1× | persist 4× |
|---|---|---|---|
| phase 0–6 | 17 | 4 | 3 |
| phase 7–15 | 54 | 14 | 11 |
| phase 16–24 | 52 | 20 | 11 |
| queens on | 64 | 24 | 14 |
| no queens | 59 | 14 | 11 |
| passer on rank 5–7 | 8 | 2 | 2 |
| any passer (of the 25) | — | — | 8 |
| queens on and phase ≥ 7 (of the 25) | — | — | 14 |

## E1 (ADR-0064 form L) against the persistent errors
- E1-L at 47 000 nodes: 39 errors on the unique set against base's 38 (the ADR's "level with `main`").
- **Of the 25 persistent errors, 24 are still errors under E1-L.** E1 does not act where the persistent errors sit on this corpus.

## Limits
- A small corpus from one control; an error class is a correlation, not a cause; a residual can be a horizon miss.
- Duplicates affect only counts, not any bar: every PREREG fixed this instrument as information only.
