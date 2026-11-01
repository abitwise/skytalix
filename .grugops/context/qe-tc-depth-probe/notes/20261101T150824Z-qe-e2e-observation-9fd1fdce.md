---
id: 20261101T150824Z-qe-e2e-observation-9fd1fdce
kind: observation
by: qe-e2e
at: 2026-11-01T15:08:24Z
verified_by: 
confidence: high for the numbers as run (320 searches, all reached the pick depth); E above 2600 not covered
refs:
  - qe-tc-depth-probe
  - ADR-0056
  - EPIC-011
  - ABC-255
  - ABC-204
  - ADR-0049
  - 8efbb827
  - grugops/qe-tc-depth-probe
  - qe-tc-depth-probe/20261101T130329Z-qe-e2e-decision-70a22605
  - orch-2026-10-30a/20261101T131000Z-orchestrator-decision-f7a50e95
  - orch-2026-10-30a/20261101T125800Z-orchestrator-decision-2896c6eb
  - qe-EPIC-010-m1-batch-2
supersedes: 
seal: sha256:583c41c49f99d0a9489912e54aad2b74c8e7a7d3414e99843f48613dea913d52
---

# qe-tc-depth-probe reading R5: Stockfish 19 reaches its pick depth in ≤ 30 ms at every E from 1 910 to 2 600 on this host; p95 ≤ 19.1 ms

QE/E2E, task `qe-tc-depth-probe`, under PREREG `…70a22605`. Block 2, 2026-11-01 13:37:19Z → 13:38:52Z (93 s).
Stockfish 19 (sha256 `c78c22a9…` = `rating.ts` pin), a fresh process per search, `Threads 1`, `Hash 16`,
`UCI_LimitStrength true`, `UCI_Elo E` (as `rating.ts`), `ucinewgame`, then `go depth D` with D = 1 + int(level) (ADR-0056
D5's `sf_19` formula). Wall = `go` → `bestmove`. 40 positions with Stockfish to move, seeded from the milestone-1
batch (stratified 14/14/12 by ply). Raw: `raw/run/b2-sf/sf.jsonl`.

| E | level | pick depth D | wall p50 | **p95** | max | move time for ≥ 95 % (p95 up to 10 ms) | ADR C1 rule max(4 × p95, 500 ms) | > 100 ms |
|---|---|---|---|---|---|---|---|---|
| 1 910 | 3.826 | 4 | 1.8 | 3.9 | 4.3 | 10 ms | 500 ms | 0/40 |
| 2 000 | 4.185 | 5 | 2.2 | 5.5 | 7.3 | 10 ms | 500 ms | 0/40 |
| 2 100 | 4.583 | 5 | 2.1 | 4.5 | 6.3 | 10 ms | 500 ms | 0/40 |
| 2 200 | 5.015 | 6 | 2.7 | 6.0 | 8.9 | 10 ms | 500 ms | 0/40 |
| 2 300 | 5.513 | 6 | 3.2 | 7.3 | 9.6 | 10 ms | 500 ms | 0/40 |
| 2 400 | 6.113 | 7 | 4.4 | 10.1 | 13.5 | 20 ms | 500 ms | 0/40 |
| 2 500 | 6.849 | 7 | 4.5 | 13.3 | 16.1 | 20 ms | 500 ms | 0/40 |
| 2 600 | 7.754 | 8 | 7.1 | 19.1 | 29.2 | 20 ms | 500 ms | 0/40 |
- Every search reached D (320/320). The levels reproduce ADR-0056's table (D 6 at 2 200/2 300, 7 at 2 400, 8 at 2 600)
  and `ABC-204`'s depth 5 at E 2 000.
- **The move time Stockfish needs for its pick depth in ≥ 95 % of moves is 10–20 ms at E 1 910…2 600.** A 100 ms
  Stockfish move time is ≥ 5 × the slowest p95 (19.1 ms at E 2 600) and > 3 × the slowest single search (29.2 ms), so
  `st=0.1` holds the pick depth with headroom across the band. It also meets C1's "≥ 4 × p95" multiplier; only C1's
  0.5 s floor asks for more. Whether to keep that floor at a 100 ms routine control is the Architect's call (ADR-0056
  C2/C3 fold).
- What these numbers do not cover: E above 2 600 (not in this brief; ADR-0056 has D 11 at 2 800 and 14 at 3 000,
  `UNKNOWN - verify` on this host), and cutechess's own per-move overhead around Stockfish (the skytalix side reads
  1–4 ms, R4).
- With skill on, Stockfish printed `multipv 1` lines only; whether it searches MultiPV 4 internally (sf source) is not
  visible from the output and does not change the reading, which is the wall time as played.

## Admissibility (PREREG § 5)
Wait-clear CLEAR after 1 606 s; a foreign `vitest` then reappeared (2 of 9 samples; 257 of 320 rows read 0 at
`go`) and one foreign busy minute (13:37, a `node` at 68 %); by the PREREG rule 138/320 rows CLEAN (E 1 910–2 100: 0/40, 2 200:
10/40, 2 300 and 2 400: 40/40, 2 500: 30/40, 2 600: 18/40; cells under 50 % are SHARED). The times are milliseconds against a 100 ms candidate budget; a shared
core can only lengthen them, so the headroom stands as an upper bound on the need.
