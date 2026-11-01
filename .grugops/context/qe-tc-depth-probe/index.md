<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-tc-depth-probe

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-01T13:03:29Z | decision | qe-e2e | high (written and sealed before any timed run; positions drawn and validated, tools pinned; estimates named as estimates) |  | # qe-tc-depth-probe pre-registration: what skytalix reaches at `go movetime` 100 / 250 / 500 / 1 000 / 4 000 ms on `main`'s tip, the JIT warm-up at 100 ms, two 20-game self-play sanity blocks (100 ms, 500 ms), Stockfish 19's time to its pick depth at E 1 910…2 600, and the SPRT arithmetic. A reading for ADR-0056 C2, not graded. |
| 2026-11-01T15:08:24Z | observation | qe-e2e | high for R4 as run (36 games, debug-log timings committed); R6 is an estimate (Wald ASN, Monte Carlo checked), not a reading |  | # qe-tc-depth-probe reading R4 + R6: two self-play sanity blocks (100 ms: 20 games, 0 time losses, 259 games/h; 500 ms: 16 games CAPPED, 0 time losses, 44 games/h) and the SPRT expected-game arithmetic at those rates |
| 2026-11-01T15:08:24Z | observation | qe-e2e | high for the numbers as run (125+50+15 searches, raw rows committed); admissibility per PREREG section 5 marked |  | # qe-tc-depth-probe reading R1–R3: skytalix at `go movetime` 100 / 250 / 500 / 1 000 / 4 000 ms — completed depth, nodes, nps, overshoot; the JIT warm-up at 100 ms; the noise at 100 ms |
| 2026-11-01T15:08:24Z | observation | qe-e2e | high for the numbers as run (320 searches, all reached the pick depth); E above 2600 not covered |  | # qe-tc-depth-probe reading R5: Stockfish 19 reaches its pick depth in ≤ 30 ms at every E from 1 910 to 2 600 on this host; p95 ≤ 19.1 ms |
| 2026-11-01T15:08:24Z | observation | qe-e2e | high (each item read from the committed logs) |  | # qe-tc-depth-probe observations QE-TCP-a…i: host shared in every block, the 500 ms block capped at 16 games, one driver fix after the PREREG, the build moved docs-only, and what the readings do not cover |
| 2026-11-01T15:08:24Z | observation | qe-e2e | high (hashes in raw/SHA256SUMS) |  | # qe-tc-depth-probe artifacts: scripts, positions, per-search rows, sanity PGNs and per-move timings, host logs, readout and SPRT table, with hashes |
| 2026-11-01T15:08:34Z | decision | qe-e2e | high for the readings as run (host SHARED in blocks 2-4, marked); the SPRT and fixed-N figures are estimates; no grading |  | # qe-tc-depth-probe readout: at 100 ms skytalix completes depth 6 (median; 5 cold, 6 warm), 2 plies under 500 ms and 4 under 4 s; overshoot ≤ 4 ms and 0 time losses at 100 and 500 ms; 259 / 44 self-play games an hour; Stockfish needs ≤ 20 ms for its pick depth up to E 2 600. READ, not graded |
