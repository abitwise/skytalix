# qe-ABC-264-p2 per row (part 2): A6 read 44.0 / 100 NOT MET (W/D/L 30/28/42, Elo -41.9 +/- 58.5, 0 time losses, 0 faults); smoke 7.0 / 10 MET (pooled S′ 25.0 / 30 = 83.3 %, re-pin does not fire); Levels 57 / 57 MET; gates green

Every run was wrapped in `flock <host-test.lock>` with concurrency 1. Tool paths came from the environment. Raw summaries are under `raw/` with host paths masked. PGNs, logs and build clones were deleted after the figures were taken.

- **Step 1, the gates (13:43Z):**
  - `npm test` once: rc 0, 64 files, **2 404 / 2 404**, 0 skipped.
  - `lint` rc 0 (132 files); `typecheck` rc 0; `build` rc 0.
  - Raw: `raw/gates/`.
- **Step 2, the A6 per-change read:**
  - Command: `rating.ts d 4d1c0616 0b73f51d <out> --budget-ms 100 --rounds 50 --concurrency 1`.
  - Window: 2026-11-02T13:43:25Z to 14:07:33Z, rc 0.
  - Both pins equal: cutechess-cli 1.5.1 and Stockfish 19. Openings sha256 `0d7f7a72…`.
  - Control: both sides `st=0.1`, `timemargin=50`.
  - **Result, candidate's view:** W/D/L **30 / 28 / 42**, score **44.0 / 100 (0.440)**.
  - cutechess-cli's line, verbatim: `Elo difference: -41.9 +/- 58.5, LOS: 7.9 %, DrawRatio: 28.0 %`.
  - Faults 0, unclassified 0, move-cap draws 0. Both stderr files were 0 bytes.
  - **Losses on time: 0** for either side. Every game ended in mate (72), 3-fold repetition (16), the fifty-move rule (9) or insufficient material (3).
  - go-to-bestmove latency: candidate median 100 ms, max 105 ms, 0 moves > 150 ms (7 192 moves). Base max 104 ms.
  - As White 10-24-16 (0.360); as Black 20-18-12 (0.520).
  - Opening-pair scores (0 / 0.5 / 1 / 1.5 / 2): 8 / 8 / 25 / 6 / 3.
  - **Bar >= 50.0: NOT MET.** Not re-played.
  - The 100 ms firing rate was not re-measured. Part 1's INFO figure stands.
- **Step 3, the smoke S′:**
  - Command: `rating.ts r 4d1c0616 <out> --budget-ms 500 --rounds 5 --concurrency 1` against Stockfish 19 `UCI_LimitStrength` E 1 650.
  - Window: 14:08:42Z to 14:15:51Z, rc 0.
  - **Result:** W/D/L **7 / 0 / 3**, **7.0 / 10**. cutechess-cli line: `Elo difference: 147.2 +/- 385.0, LOS: 89.7 %`.
  - Faults 0; losses on time 0 (every game mated); Stockfish depth guard 0 of 436 moves below depth 3.
  - Candidate latency: median 500 ms, max 503 ms.
  - **Bar >= 3.0: MET.**
  - **Pooled S′:** 18.0 / 20 (`qe-EPIC-010-close`) + 7.0 / 10 = **25.0 / 30 = 83.3 %**. That is not > 85 %, so **the upward re-pin does not fire**.
  - Reported only. Whether a candidate that is not merged counts toward the ledger is BA/PM's call.
- **Step 4, the Levels deep lane:**
  - Command: `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, on head `e32b4745` (`src/`, `tools/` and `package.json` equal to `4d1c0616`).
  - Window: 14:16:14Z to 14:27:19Z. The lock was held elsewhere until 14:17:41Z.
  - **rc 0; 57 passed, 0 failed, 0 skipped** (57 expected). **MET.**
- **Host:** another hop's processes from a different project (grugops vitest) ran at times. They were not mine and were not touched. The 100 ms read is clean of overshoot (max 105 ms).
