---
id: 20261030T202320Z-qe-e2e-observation-cfb537cf
kind: observation
by: qe-e2e
at: 2026-10-30T20:23:20Z
verified_by: 
confidence: high: read from the committed raw records under .grugops/context/qe-ABC-229/raw/; an observation, because no §14-gate verdict stamps this run
refs:
  - qe-ABC-229
  - ABC-229
  - EPIC-010
  - ADR-0053
  - grugops/ABC-229
  - grugops/qe-ABC-229
  - e196a281
  - f6ff1c4a
  - b92a3394
  - Q-SET
  - A1
  - A2
  - A3
  - A4
  - A5
  - G1
  - G5
  - G6
  - G8
  - G9
  - G11
  - S-1
  - S-2
  - S-3
  - S-4
  - NFR-004
  - NFR-005
  - NFR-008
  - qe-ABC-229/20261030T162159Z-qe-e2e-decision-8ecd4ea6
supersedes: 
seal: sha256:4dde6d1e5a1f1b2cd754da8f8bd8fc57df4548f0474fafea35dec5b12e984275
---

# qe-ABC-229 A5 smokes, ALONE at width 1: D 2/3/5 = 4.5 / 10, R 9/1/0 = 9.0 / 10 at 4 000 ms (recorded, not pooled). S-1..S-4 MET. The first R run was killed externally in game 1 (VOID) and re-run once

QE/E2E, task `qe-ABC-229`. These are PREREG § 6 (`20261030T162159Z-qe-e2e-decision-8ecd4ea6`). The candidate is `e196a281` and the base is `b92a3394`. Both smokes ran from the QE worktree through `driver.mjs`. Tool paths came from an env file outside the repo (mode 600). The pins read `= pin` in both `machine` headers (`cutechess-cli` 1.5.1 `dc776901…`, Stockfish 19 `c78c22a9…`, openings `0d7f7a72…`). Before each smoke, `git diff b92a3394 main -- src data tools package.json package-lock.json` was empty: `main` was `461a013b` before D and `f27d7886` before R and again after it.

## D: `d e196a281 b92a3394 <out> --budget-ms 1500 --rounds 5 --concurrency 1` (`raw/a6/d/`)
- Ran 17:05:08Z–17:41:55Z (first QE run). Harness end code 0. 10 of 10 games.
- **Candidate W/L/D 2/3/5, score 4.5 / 10.** `cutechess-cli` Elo −34.9 ± 163.5. `state: NEUTRAL`.
- Endings: White mates 2, Black mates 3, threefold repetition 2, fifty-move rule 3. Both repetition endings had the repeating move played by base. No game hit the move cap.
- Faults 0, unclassified 0. `skytalix.stderr` and `base.stderr` are both 0 bytes. 0 losses on time.
- Host: 220 samples, Tctl median 74.75 °C, max 83.0 °C. Busiest-core MHz fell 0.10 %. No thermal stop. A foreign vitest (another project's suite, not QE's) was present for 25 of the 220 samples. The PREREG records that and does not void the run for it, because no stop fired.

## R, first run: VOID (`raw/a6/r-void/`)
- Started 17:42:23Z with the preconditions met. It was killed at 17:43:44Z, about 80 s into game 1. `cutechess-cli`, the sampler and the thermal watcher all stopped in the same second, with no `harness end` line.
- No thermal stop: the running median was 74.0 °C over 8 samples. No foreign vitest was present. `r.out` ends mid-game, on `go movetime 4000` (`r.out-tail.txt`).
- This was an external kill of the session, not a product or harness fault. The run is VOID. No game result from it is read or counted.

## R, the re-run: `r e196a281 <out> --elo 1910 --rounds 5 --concurrency 1` (`raw/a6/r/`)
- Driver launched 19:41:08Z. The wait-clear found a foreign vitest (two PIDs), waited on it with `kill -0` for 510 s, then cleared at load1 1.18 and Tctl 58.5 °C. The harness ran 19:49:38Z–20:21:04Z, end code 0, 10 of 10 games.
- The R command reads `st=4` for Skytalix, from the worktree's `tools/rating/rating.ts` (`mode === "r" ? 4000`, unchanged by this ticket). `r.out` holds 424 `go movetime 4000` lines. Stockfish ran `UCI_Elo=1910`, `st=0.5`, Threads 1, Hash 16. The depth guard read 0 of 420 Stockfish moves below depth 4.
- **Candidate W/L/D 9/1/0, score 9.0 / 10.** `cutechess-cli` Elo +381.7 ± nan (no draws, so the interval is undefined). LOS 99.4 %.
  - The one loss was game 1, Skytalix as White, mated at ply 138. Every other game was won by the candidate's mate: 4 as White, 5 as Black, in 49–182 plies.
  - Endings: mate 10 of 10. Repetition 0, fifty-move rule 0, move cap 0.
- Faults 0, unclassified 0. `skytalix.stderr` and `stockfish.stderr` are both 0 bytes. 0 losses on time.
- Host: 188 samples, **Tctl median 78.44 °C, max 87.5 °C**, with 8 samples above 85 °C. Busiest-core MHz: first six 5 031, median 4 989.5, **fall 0.82 %** (bar 5 %). No thermal stop: the running median never went above 85 °C.
- **A foreign vitest was present from 20:00:00Z to the end** (127 of 188 samples, games 2–10). It was another project's suite on this host, outside QE's control, and it raised load1 to 1.8–3.5. Under the PREREG it is recorded. It would void the run only if the thermal stop had fired while it was present, and the stop did not fire. The clock did not fall (0.82 %). Contention can only slow a candidate searching on a fixed movetime, and the candidate scored 9.0 anyway, so it cannot have produced the S-4 pass.

## The S rows (20 games)
| row | bar | read | result |
|---|---|---|---|
| S-1 | 0 candidate faults (illegal move, crash, disconnect, stall) | 0 in D, 0 in R; stderr 0 bytes on every engine | MET |
| S-2 | 0 candidate losses on time | 0 in D, 0 in R | MET |
| S-3 | D score ≥ 3.0 / 10 | 4.5 (2/3/5) | MET |
| S-4 | R score ≥ 3.0 / 10 | 9.0 (9/1/0) | MET |

No re-run was needed for UNRESOLVED (no base or Stockfish fault, frequency fall ≤ 0.82 %). The one R re-run replaced the VOID run, as the Orchestrator's resume brief directs.

## Ledger
- R: `e196a281`, 4 000 ms, Elo 1910, 10 games, 9/1/0, 9.0 / 10, +381.7 ± nan. **Recorded at 4 000 ms and NOT pooled.** The 3 000 ms pool closed at `e42b637b`, and no flag is evaluable until milestone 1's batch sets the 4 000 ms reference (`EPIC-010` § The smoke ledger). It is not compared with any 3 000 ms reading.
- D: `e196a281` vs `b92a3394` at 1 500 ms, 2/3/5, 4.5 / 10, NEUTRAL.
