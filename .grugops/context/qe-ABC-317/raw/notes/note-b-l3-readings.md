# qe-ABC-317 stage B, L3 readings: L3 at E 1 890 ran once, as sealed in PREREG `…e6cf1088`, under one hold of the host lock (20:58:04Z–23:01:22Z). **200 / 200, 103 / 5 / 92, 105.5 (52.75 %), Elo +19.1 ± 47.9 at E 1 890.** Valid: 0 faults, 0 time losses, depth guard 0 of 11 449 at depth 4. The host was ALONE for the SHARED classes: 0 foreign `vitest` and `cutechess-cli` in all 732 samples

QE/E2E, task `qe-ABC-317`, stage B, branch `grugops/qe-ABC-317` at `a44dc556` (harness `tools/` `6272e8d2`, worktree `src/` `21f3b304`). Read sha `b6366a79` (`src/` `21f3b304`). Authority: the brief's `## Stage B — go (L3, then L4)` block (orch, 20:57:15Z, citing the owner's W, orch note `…4a94110f`). The verdict is the decision note sealed just after this one.

## Before the launch
- The PREREG `…e6cf1088` was sealed and committed (`f9460ce9`) before any graded game.
- Just before the launch (20:58:04Z), `raw/scripts/SHA256SUMS` checked OK for all three sealed scripts (`session.sh`, `hostcheck.sh`, `read.mjs`), unedited; the launch was gated on that check (`&&`). A first, mistyped check in the same command ran from the wrong directory, could not open the files, and gated nothing; it is in the console record.
- Trees: `HEAD:tools` `6272e8d2`, `HEAD:src` `21f3b304`, `b6366a79:src` `21f3b304`. The worktree was clean.
- A standalone `hostcheck.sh` at 20:57:57Z read 0 / 0 / 0 / 0 foreign, load1 0.24.

## The command, as run
`CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/host-test.lock bash .grugops/context/qe-ABC-317/raw/scripts/session.sh 3 1890 <out-root>/l3-e1890 <repo>`
- From the worktree root, with `<out-root>` a new empty directory under `<scratch>`, as one background job. The session exited 0.

## L3 at E 1 890 (`r b6366a79 <out> --skill 3 --elo 1890 --rounds 100 --concurrency 1`)
- Gates 1–3 passed: pins, trees, disk.
- Gate 4, the W-check, at 20:58:04Z: load1 0.20, Tctl 32.5 °C, 0 / 0 / 0 / 0 foreign. It was not a WAIT.
- `r` ran from 20:58:04Z to 23:01:22Z (**123 min 18 s**), tool exit 0, stop none. That is about 97 games an hour.
- Record check: the `machine.txt` control line equals the sealed one (`control: skytalix Skill Level=3 st=0.33 timemargin=50, stockfish st=0.33 timemargin=2000`). `cmd.txt` holds all four tokens, including `option.UCI_Elo=1890`. Both tool lines read `= pin`. `read.mjs` ran as `<out> 3 1890 330`, rc 0.
- The tool's state line: `rating E + X ± Y = 1890 + 19.1 ± 47.9 = 1909.1 ± 47.9`. `W/L/D: 103/92/5`, score 0.527, LOS 78.5 %, draw ratio 2.5 %.
  - `faults: 0  unclassified: 0  move-cap draws: 0`. Both stderr files are 0 bytes.
  - Depth guard: `0 of 11449 moves below depth 4`.
- `read.mjs`:
  - 200 games and 200 results in the PGN (109 `1-0`, 86 `0-1`, 5 draws). Points 105.5 = 52.75 %. As White 58.5 / 100, as Black 47.0 / 100.
  - 100 openings with both colours, FEN mismatches 0.
  - Intervals: iid ± 47.7 Elo. Opening-cluster ± 46.5 (deff 0.950, 210 effective games).
  - Terminations, skytalix's view: won 103 by mate; lost 92 by mate; drew 3 by the fifty-move rule, 1 by threefold repetition, 1 by insufficient material.
  - Time losses: 0 in the PGN result text, and 0 "loses on time" lines in `r.out`.
  - Plies a game: median 93, mean 114.5. Game seconds: mean 36.2, max 124.
  - Latency, skytalix: 11 454 moves, median 331 ms, p95 332, p99 332, max 335. 0 moves over 340 ms; 0 at 380 ms (the margin) or more.
  - Latency, Stockfish: 11 449 moves, median 330, max 332, 0 over 340.
  - `Skill Level 3`: 200 processes with a `go`, 200 got 3, 0 missing or other. `UCI_Elo 1890`: 200 / 200, 0 missing or other.
- Sampler: 732 samples. **0 foreign `vitest` and `cutechess-cli` in every one.** One sample (21:49:46Z, between games 91 and 92) counted 1 `stockfish` and 1 `node`; the samples either side read 0. This is the same single game-boundary pattern ABC-316's L2 at E 1 450 showed; likely the tool's own engine restart racing the sampler's process-tree snapshot (UNKNOWN - verify). load1 median 1.18, max 2.78. Tctl median 70.2 °C, max 73.8. Free space at least 5 642 MB.

## Host label and stops
- **ALONE** for the SHARED classes: foreign `vitest` and `cutechess-cli` were in 0 % of samples, against the 20 % bar. Under FL the one game-boundary sample changes nothing. No foreign process was touched. Nothing is recorded beyond class and count.
- **Neither stop fired.** The Tctl max of 73.8 °C stayed under the 85 °C THERMAL median. The run's 123.3 min stayed under RUNAWAY's 225 min.
- The lock was free after the run.

## Wall time against the estimate
- 123 min 18 s, inside the sealed 94–165 min and just above the central 121 min. Mean plies 114.5 against the 110 central.

## Records (redacted to placeholders with `raw/redact.sh`, a one-line-header copy of qe-ABC-316's, written after the seal)
- `raw/out/l3-e1890/`: the tool's records without the build clone (deleted, 793 MB). `r.out` is kept as `r.summary.out` (non-debug lines only); its full sha256 `c08bafec…` is in `SHA256SUMS.unredacted-originals`.
- `raw/out/session-l3-e1890/`: the read and run outputs and the console. The session and sampler logs are redacted there too but are `*.log`, which `.gitignore` excludes, as in ABC-316; their figures are above.
- The unredacted originals stay in the session scratch directory. A scan of both folders for host paths and the user name found none (the engine's own `id author` line is product output).
