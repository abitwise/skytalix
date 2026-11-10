# qe-ABC-316 stage B2 readings: L2 at E′ 1 720 ran once, as sealed in the addendum `…033b0e15` to PREREG `…c80a1080`, under one hold of the host lock (17:56:57Z–19:00:35Z). **200 / 200, 87 / 2 / 111, 88.0 (44.00 %), Elo −41.9 ± 48.5 at E′ 1 720.** Valid: 0 faults, 0 time losses, depth guard 0 of 10 720 at depth 3. The host was ALONE: 0 foreign of any class in all 377 samples

QE/E2E, task `qe-ABC-316`, stage B2, branch `grugops/qe-ABC-316` at `7c152a01` (harness `tools/` `6272e8d2`, worktree `src/` `21f3b304`). Read sha `main` `b6366a79` (`src/` `21f3b304`). Authority: the brief's `## Stage B2 — L2 band step, go` block (orch, 17:54:51Z, citing the owner's W, orch note `…f8be2b11`). The verdict is the decision note sealed just after this one.

## Before the launch
- The addendum `…033b0e15` was sealed at 17:56:37Z and committed (`7c152a01`) before any game.
- At 17:56:52Z, just before the launch, both lists checked OK: `raw/scripts/SHA256SUMS` (the four sealed scripts, unedited) and `raw/scripts-b2/SHA256SUMS` (`session.sh` `09d9966d…`, the one-token copy; `hostcheck.sh` and `read.mjs` byte-equal to the sealed ones).
- Trees: `HEAD:tools` `6272e8d2`, `HEAD:src` `21f3b304`, `b6366a79:src` `21f3b304`. `tools/` and `src/` were clean. The lock was free.
- A standalone `hostcheck.sh` at 17:56:52Z read 0 / 0 / 0 / 0 foreign, with load1 0.22.

## The command, as run
`CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/host-test.lock bash .grugops/context/qe-ABC-316/raw/scripts-b2/session.sh 2 <out-root>/l2-e1720 <repo>`
- It ran from the worktree root, with `<out-root>` a new empty directory under `<scratch>`, as one background job. The session exited 0.

## L2 at E′ 1 720 (`r b6366a79 <out> --skill 2 --elo 1720 --rounds 100 --concurrency 1`)
- Gates 1–3 passed: pins, trees, disk.
- Gate 4, the W-check, at 17:56:57Z: load1 0.26, Tctl 32.6 °C, 0 / 0 / 0 / 0 foreign. It was not a WAIT.
- `r` ran from 17:56:57Z to 19:00:34Z (**63 min 37 s**), tool exit 0, stop none. That is about 189 games an hour.
- Record check: the `machine.txt` control line equals the sealed one (`control: skytalix Skill Level=2 st=0.18 timemargin=50, stockfish st=0.18 timemargin=2000`). `cmd.txt` holds all four tokens, including `option.UCI_Elo=1720`. Both tool lines read `= pin`. `read.mjs` ran as `<out> 2 1720 180`, rc 0.
- The tool's state line: `rating E + X ± Y = 1720 + -41.9 ± 48.5 = 1678.1 ± 48.5`. `W/L/D: 87/111/2`, score 0.440, LOS 4.4 %, draw ratio 1.0 %.
  - `faults: 0  unclassified: 0  move-cap draws: 0`. Both stderr files are 0 bytes.
  - Depth guard: `0 of 10720 moves below depth 3`.
- `read.mjs`:
  - 200 games and 200 results in the PGN. Points 88.0 = 44.00 %. As White 45.5 / 100, as Black 42.5 / 100.
  - 100 openings with both colours, FEN mismatches 0.
  - Intervals: iid ± 48.4 Elo. Opening-cluster ± 50.3 (deff 1.083, 185 effective games).
  - Terminations, skytalix's view: won 87 by mate, lost 111 by mate, drew 2 by the fifty-move rule.
  - Time losses: 0 in the PGN result text, and 0 "loses on time" lines in `r.out`.
  - Plies a game: median 89, mean 107.1. Game seconds: mean 18.3, max 54.
  - Latency, skytalix: 10 709 moves, median 181 ms, p95 182, p99 182, max 185. 0 moves over 190 ms; 0 at 230 ms (the margin) or more.
  - Latency, Stockfish: 10 720 moves, median 180, max 182, 0 over 190.
  - `Skill Level 2`: 200 processes with a `go`, 200 got 2, 0 missing or other. `UCI_Elo 1720`: 200 / 200, 0 missing or other.
- Sampler: 377 samples. **0 foreign `vitest`, `cutechess-cli`, `stockfish` and `node` in every one.** load1 median 1.20, max 1.85. Tctl median 70.6 °C, max 74.2. Free space at least 6 518 MB.

## Host label and stops
- **ALONE**: foreign load was 0 % of samples in every class, against the 20 % bar for SHARED. No foreign process was touched. Nothing is recorded beyond class and count.
- **Neither stop fired.** The Tctl max of 74.2 °C stayed under the 85 °C THERMAL median. The run's 63.6 min stayed far under RUNAWAY's 185 min.
- The lock was free again after the run.

## Wall time against the estimate
- 63 min 37 s, inside the sealed 45–90 min and above the central 50 min. Games were longer than at E 1 450: 107.1 plies against 83.9 mean, as the addendum allowed.

## Records (redacted to placeholders with `raw/redact.sh`, as in stage B)
- `raw/out/l2-e1720/`: the tool's records without the build clone. `r.out` is kept as `r.summary.out` (non-debug lines only). Its full sha256 `0c02d295…` is in `SHA256SUMS.unredacted-originals`.
- `raw/out/session-l2-e1720/`: the session, sampler, read and run logs, and the console.
- The unredacted originals and the clone stay in the session scratch directory. A scan of both folders for host paths, the user name and the host name found none.
- Log quirk, as in stage B and harmless: the sampler's first line reads `games=0`, then `0` on the next line.
