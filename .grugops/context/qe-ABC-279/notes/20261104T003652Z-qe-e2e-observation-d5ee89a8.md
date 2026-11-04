---
id: 20261104T003652Z-qe-e2e-observation-d5ee89a8
kind: observation
by: qe-e2e
at: 2026-11-04T00:36:52Z
verified_by: 
confidence: high: each read taken once exactly per the sealed PREREG, whole match under one host lock; pins verified by the harness; candidate dist differs from base only by see.js and the changed modules
refs:
  - qe-ABC-279
  - grugops/ABC-279
  - ABC-279
  - EPIC-011
  - Q1
  - ADR-0069
  - ADR-0056
  - ADR-0024
  - ADR-0050
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - C2-prime
  - S-prime
  - G1
  - G2
  - G4
  - G6
  - G11
  - F5
  - F9
  - NFR-005
  - NFR-008
  - NFR-009
  - N8-LANE
  - UAT
  - 1feb7560
  - cd9ccd10
  - d00d00a8
  - 00e99db8
  - 31c8cac4
  - fe6a0975
  - 4cb84035
  - 109ecc25
  - src/see.ts
  - src/see.test.ts
  - src/quiescence.ts
  - src/search.ts
  - src/engine.ts
  - src/levels.test.ts
  - src/search.capacity.test.ts
  - src/engine.test.ts
  - src/search.ordering.test.ts
  - src/evaluate.taper.test.ts
  - qe-ABC-279/20261103T230358Z-qe-e2e-decision-0ea488ab
  - se-ABC-279/20261103T225737Z-software-engineer-decision-821f0628
  - se-ABC-279/20261103T225737Z-software-engineer-observation-a2b9d7c5
  - se-ABC-279/20261103T225737Z-software-engineer-observation-f4c7c263
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
supersedes: 
seal: sha256:5dbb1f5ed5bb8eecd977403eb631dc0c459ed8172ad60ac929fb7ae3e83e371d
---

# qe-ABC-279 A6, read once per the sealed PREREG (`…0ea488ab`): C2′ MET at 54.0 / 100 (W/L/D 42 / 34 / 24, Elo +27.9 ± 60.0); S′ MET at 5.5 / 10 against Stockfish E 1 810 (5 / 4 / 1); the Levels deep lane exit 0, 57 / 57. Intent GAIN is met. Nothing was re-played

QE/E2E, task `qe-ABC-279`. Candidate `1feb7560` (`src/` `fe6a0975`), base the merge-base `00e99db8` (`src/` `4cb84035`, equal to `main` `31c8cac4`'s `src/`). Harness `tools/rating/` at `109ecc25` (no diff against `main`). Every run went alone under `flock <scratch>/host-test.lock`, one whole match per lock. Records under `raw/out/` (`c2/`, `s1/`, `levels/`). The debug logs (`d.out` 9.1 MB, `r.out`) were read by `raw/scripts/analyze.py` and not committed. Every other file listed in each `SHA256SUMS` verifies (`sha256sum -c`).

## C2′: MET
- `node tools/rating/rating.ts d 1feb7560 00e99db8 <out> --budget-ms 100 --rounds 50 --concurrency 1`.
- Session 2026-11-03 23:13:28Z → 23:36:06Z (22 min 38 s). load1 1.82 at the start, 2.05 at the end. The lock was held throughout, so no other job ran.
- Pins: `cutechess-cli` 1.5.1 and Stockfish 19 both `= pin`, and the openings sha256 `0d7f7a72…2666`.
- Builds (`artifacts.txt`): skytalix `1feb7560` `dist/` 24 files, tree sha256 `987624d6…4e69`; base `00e99db8` 23 files, tree sha256 `eccdb955…80a2`. The extra file is `see.js`.
- **100 of 100 complete. W/L/D 42 / 34 / 24, score 54.0 / 100 (0.540).** `cutechess-cli`: Elo difference **+27.9 ± 60.0**, LOS 82.1 %, draw ratio 24.0 %.
- **0 faults, 0 unclassified, 0 move-cap draws, 0 losses on time.** Both stderr files are 0 bytes.
- go → bestmove latency (cutechess clock): skytalix median 101 ms and max 105 over 6 755 moves; base median 101 and max 103 over 6 749. 0 moves over 150 ms.
- By colour: 25.0 / 50 as white and 29.0 / 50 as black. Opening pairs (0, ½, 1, 1½, 2 for the candidate): 4, 7, 22, 11, 6.
- Terminations: mate 76, threefold 11, insufficient material 7, fifty moves 6.
- The harness prints `state: NEUTRAL`. Per the PREREG, that label is not the verdict: NEUTRAL is closed, and the bar is ≥ 50.0 of 100. **54.0 ≥ 50.0: MET.**
- The interval spans 0 (−32.1 to +87.9). GAIN as written is a point-estimate bar (the ticket: "C2′ resolves about ± 56 Elo, so GAIN means a point estimate ≥ 0"). Recorded, not re-graded.

## S′: MET
- `node tools/rating/rating.ts r 1feb7560 <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`.
- Session 23:36:09Z → 23:44:36Z, load1 2.05 → 2.49.
- **10 of 10 complete. W/L/D 5 / 4 / 1, score 5.5 / 10.** E + X ± Y = 1 810 + 34.9 ± 237.0 = 1 844.9 ± 237.0.
- **0 faults, 0 losses on time.** Stockfish depth guard: 0 of 515 moves below depth 4. skytalix latency median 501 ms, max 503.
- **5.5 ≥ 3.0: MET.** The written second ten was not owed and was not played. S′ is pooled only if the ticket merges.

## Levels deep lane: MET
- `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, on the worktree at `109ecc25`.
- `src/` was `fe6a0975`, the frozen tree, with 0 dirty `src/` files.
- 23:51:56Z → 00:01:33Z. **exit 0, 57 / 57 passed** (QE counted its own run: 57 ✓, 0 failed, 0 skipped). Duration 576.65 s.

## Reported beside it (not graded)
- **`G11`** (game-1's five positions at each build's `LEVELS[5]` 4 000 ms, base then head, one run each, inside the ALONE `G6` session):

  | before | base | head |
  |---|---|---|
  | 4.Qa4 | d3, d11, +56 | d3, d11, +50 |
  | 8.e5 | Be2, d10, +51 | g3, d10, +48 |
  | 10.Ne4 | exd6, d10, +10 | exd6, d11, +2 |
  | 13.d4 | d4, d11, −122 | Ng4, d12, −165 |
  | 17.Kc1 | Kc1, d11, −209 | Kc1, d11, −206 |

  The head moves differently at 8.e5 and 13.d4. At 13 it no longer plays game 1's d4.
- R-TC part 1, item 2: the diff reads no budget, deadline, `movetime`, test flag or environment. The rule is keyed on the position, the move and the check state (QE read the diff, in the offline note).
