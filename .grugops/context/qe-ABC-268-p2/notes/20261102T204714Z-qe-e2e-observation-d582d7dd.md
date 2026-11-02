---
id: 20261102T204714Z-qe-e2e-observation-d582d7dd
kind: observation
by: qe-e2e
at: 2026-11-02T20:47:14Z
verified_by: 
confidence: high: every run as stated under the lock; figures from cutechess-cli's own lines and the vitest summary; raw under raw/
refs:
  - qe-ABC-268-p2
  - ABC-268
  - ADR-0061
  - ADR-0056
  - EPIC-011
  - QE-268-a
  - QE-268-b
  - QE-268-c
  - QE-268-p2-a
  - QE-268-p2-b
  - QE-268-p2-c
  - QE-268-p2-d
  - QE-268-p2-e
  - QE-264-p2-b
  - grugops/qe-ABC-268-p2
  - grugops/ABC-268-fix
  - 1169c024
  - df984484
  - ca6e8506
  - bf3588ba
  - src/search.futility.test.ts
  - src/engine.test.ts
  - src/levels.test.ts
  - tools/rating/rating.ts
  - 20261102T200226Z-qe-e2e-decision-e2d24e3d
  - orch-2026-10-30a/20261102T191000Z-orchestrator-decision-773be7de
  - qe-ABC-268/20261102T185311Z-qe-e2e-decision-b58a6a29
  - qe-ABC-268/20261102T185311Z-qe-e2e-observation-aa73c424
  - se-ABC-268-fix/20261102T190150Z-software-engineer-decision-f4a8852b
  - se-ABC-268-fix/20261102T190150Z-software-engineer-observation-fad302fd
supersedes: 
seal: sha256:eb402e076a57db4c2fe883e957c5fe4f5b53fba9ac125bfd0835b874a1ec3cea
---

# qe-ABC-268-p2 per row (part 2): QE-268-a/b/c CLOSED (QP2-QP6 red, head 270/270); A6 58.0 / 100 MET (W/D/L 41/34/25, Elo +56.1 +/- 56.1, 0 time losses, 0 faults); smoke 8.0 / 10 MET; Levels 57 / 57 MET; gates green

QE/E2E, task `qe-ABC-268-p2`, PREREG `…e2d24e3d`. Every run under `flock host-test.lock`, one at a time. Raw under `raw/`.

## Step 1: re-check of QE-268-a/b/c (before the PREREG, recorded in it)
- QE's `qe-ABC-268` `qe-plant.py`, unchanged, on a `git archive 1169c024` scratch copy, QE's five-file default lane (270 tests, heap 128). Started 20:00:3xZ.
  - head: **270 passed**.
  - QP2 (en passant as quiet): **red**, 1 row: "en passant: false, at any index — it captures".
  - QP3 (fail-hard, `src/search.ts`): **red**, 1 row: the `search()` at depth 3 QE-268-b row (entry not -554).
  - QP4 (fail-hard, `src/engine.ts`): **red**, 1 row: the `chooseMove` deepened to 3 QE-268-b row.
  - QP5 (new engine door without `priorKeys`): **red**, 4 rows: the four QE-268-a third-occurrence rows.
  - QP6 (king moves never skipped): **red**, 4 rows: the QE-268-c quiet-move row and the three QE-268-b rows (its fixture's skipped moves are king moves).
  - Copy diffed equal to head at the end.
- Rows reviewed against `…aa73c424`'s wording: QE-268-a pins the door with prior keys (and non-vacuity without); QE-268-b pins the stored upper bound -554 < alpha 1010 equal to the best searched child, in both recursions, with a fixture-bites row; QE-268-c covers en passant (false at 1 and 9), a quiet pawn push, a quiet king move and castling (false at 0, true at 1 and 9). **QE-268-a, -b, -c CLOSED.**
- Gates (worktree, 20:01Z): lint 0, typecheck 0, build 0 (`dist/` removed), `npm test` **64 files, 2 417 passed**, 0 skipped, 8.61 s.

## A6 C2′, the 100-game read (20:02:42-20:27:48Z)
- `node tools/rating/rating.ts d 1169c024 ca6e8506 <out> --budget-ms 100 --rounds 50 --concurrency 1`; exit 0.
- cutechess-cli, verbatim: `Score of skytalix vs base: 41 - 25 - 34  [0.580] 100`; `Elo difference: 56.1 +/- 56.1, LOS: 97.6 %, DrawRatio: 34.0 %`.
- **W/D/L 41/34/25 (candidate), 58.0 / 100.** 100 of 100 complete. Faults 0, unclassified 0, move-cap draws 0. Both stderr 0 bytes.
- **Time losses: 0 for either side** (no "on time" line in 100 results). Latency go -> bestmove: candidate 7 486 moves, median 101 ms, max 106, 0 above 150 ms; base 7 478, median 101, max 104, 0 above 150 ms.
- Opening-pair scores for the candidate (0, 0.5, 1, 1.5, 2): 1, 11, 15, 17, 6 (sum 58.0). By colour: as White 32.0 / 50, as Black 26.0 / 50. Terminations: mates 66, threefold 15, fifty-move 12, insufficient material 6, stalemate 1.
- Harness `state: NEUTRAL` printed; not applicable (`QE-264-p2-b`; `QE-268-p2-b`).
- Builds: candidate `dist/` tree sha256 `a979f16a…`; base `9d16d518…` (equal to `qe-ABC-264-p2`'s base `0b73f51d` build, same `src/`).
- Cited, not re-measured: the firing figure (at depth 6 on the 190: 30 272 firing nodes, 901 655 skipped moves, 0.803× the door's nodes; reproduced exactly in part 1) and `G11` (part 1 `…b1cfbfc1`, same move at all five).

## S′ smoke (20:28:19-20:35:53Z)
- `node tools/rating/rating.ts r 1169c024 <out> --budget-ms 500 --rounds 5 --concurrency 1` vs Stockfish 19 `UCI_LimitStrength` E 1 650; exit 0.
- **W/D/L 8/0/2, 8.0 / 10** (as White 4.0 / 5, as Black 4.0 / 5; all 10 by mate). 10 of 10, faults 0, **time losses 0**, both stderr 0 bytes, Stockfish depth guard 0 of 463 below depth 3. cutechess-cli: `Elo difference: 240.8 +/- nan` (`QE-268-p2-c`). Latency: candidate median 500 ms, max 502.
- S′ pool: merged builds only, prior **18 / 20**; this read is not pooled until the merge. **If merged: 26.0 / 30 = 86.7 %, above 85 %, so the upward re-pin trigger fires** (`QE-268-p2-d`; reported, not acted on).

## Levels deep lane (20:36:17-20:45:54Z)
- `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/levels.test.ts --reporter=verbose` in the worktree, `src/` equal to `1169c024`: exit 0, **57 passed (57)**, 0 skipped, 577.1 s.
