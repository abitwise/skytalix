# qe-ABC-316 stage B readings: both levels ran once, as sealed in PREREG `…c80a1080`, under ONE hold of the host lock (15:54:24Z–17:20:58Z, 1 h 26 min 34 s). **L1: 200 / 200, 142 / 11 / 47, 147.5 (73.75 %), Elo +179.5 ± 53.4 at E 1 320. L2: 200 / 200, 164 / 1 / 35, 164.5 (82.25 %), Elo +266.4 ± 64.3 at E 1 450.** Both valid: 0 faults, 0 time losses, depth guard 0. Host ALONE for the SHARED classes

QE/E2E, task `qe-ABC-316`, stage B, branch `grugops/qe-ABC-316` at `befef8d9` (harness `tools/` `6272e8d2`, worktree `src/` `21f3b304`). Read sha `main` `b6366a79` (`src/` `21f3b304`). Authority: the brief's `## Stage B — go` block (orch, 15:53:35Z, citing the owner's W, orch note `…f45053d2`). The verdict is the decision note sealed just after this one.

## Before the launch
- The sealed scripts were checked against `raw/scripts/SHA256SUMS` just before the launch: `session.sh`, `stage-b.sh`, `hostcheck.sh` and `read.mjs` all OK. Their prefixes match the PREREG (`3fc10849`, `e44bc09e`, `7f2843dc`, `740f1658`). No sealed script was edited.
- Trees: `HEAD:tools` `6272e8d2`, `HEAD:src` `21f3b304`, `b6366a79:src` `21f3b304`. The worktree was clean.
- A standalone `hostcheck.sh` at 15:54:16Z read 0 foreign `vitest`, `cutechess-cli`, `stockfish` and `node`, with load1 0.44. The idle vitest-class process that the go block logged at 15:53:35Z did not show in this check or in any later sample.

## The command, as run
`CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/host-test.lock bash .grugops/context/qe-ABC-316/raw/scripts/stage-b.sh <out-root> <repo>`, from the worktree root, with `<out-root>` a new directory under `<scratch>`. It ran as one background job: L1, then L2, because L1's session exited 0. `stage-b.sh` exited 0.

## L1 (`r b6366a79 <out> --skill 1 --elo 1320 --rounds 100 --concurrency 1`)
- Gates 1–3 passed (pins, trees, disk). Gate 4, W-check, at 15:54:24Z: load1 0.49, Tctl 33.1 °C, 0 / 0 / 0 / 0 foreign.
- `r` ran from 15:54:24Z to 16:31:01Z (**36 min 37 s**), tool exit 0, stop none. About 328 games an hour.
- Record check: `machine.txt` control line = sealed (`control: skytalix Skill Level=1 st=0.1 timemargin=50, stockfish st=0.1 timemargin=2000`), and `cmd.txt` holds all four level tokens. Both tool lines read `= pin`. `read.mjs` rc 0.
- The tool's state line: `rating E + X ± Y = 1320 + 179.5 ± 53.4 = 1499.5 ± 53.4`. `W/L/D: 142/47/11`, score 0.738, LOS 100.0 %, draw ratio 5.5 %. `faults: 0  unclassified: 0  move-cap draws: 1`. Both stderr files 0 bytes. Depth guard: `0 of 10813 moves below depth 1`.
- `read.mjs`:
  - 200 games, 200 results in the PGN (91 1-0, 98 0-1, 11 draws). Points 147.5 = 73.75 %. As White 72.0 / 100, as Black 75.5 / 100.
  - 100 openings, both colours, FEN mismatches 0. Intervals: iid ± 52.9 Elo; opening-cluster ± 53.9 (deff 1.039, 192 effective games).
  - Terminations (skytalix's view): won 142 by mate, lost 47 by mate. Drew 8 by the fifty-move rule, 1 by insufficient material, 1 by stalemate, 1 by the move cap.
  - Time losses: 0 in the PGN result text, 0 "loses on time" lines in `r.out`.
  - Plies a game: median 79, mean 108.4. Game seconds: mean 10.2, max 40.
  - Latency, skytalix: 10 860 moves, median 100 ms, p95 102, p99 102, max 105. 0 moves over 110 ms; 0 at 150 ms (the margin) or more.
  - Latency, Stockfish: 10 813 moves, median 100, max 102, 0 over 110.
  - `Skill Level 1`: 200 processes with a `go`, 200 got 1, 0 missing or other. `UCI_Elo 1320`: 200 / 200, 0 missing or other.
- The move-cap draw: round 48, Stockfish White with queen and bishop against skytalix's bare king, no mate in 400 plies (Stockfish showed `+M15`, `+M13` and `+M9` along the way). It gave skytalix 0.5 points it would otherwise have lost. Without it P = 147.0, the same band outcome. It is not a fault.
- Sampler: 217 samples. 0 foreign `vitest`, `cutechess-cli`, `stockfish` and `node` in every one. load1 median 1.22, max 1.66. Tctl median 69.9 °C, max 73.0. Free space at least 8 227 MB.

## L2 (`r b6366a79 <out> --skill 2 --elo 1450 --rounds 100 --concurrency 1`)
- Gates 1–3 passed. Gate 4, W-check, at 16:31:02Z: load1 1.11, Tctl 41.9 °C, 0 / 0 / 0 / 0 foreign.
- `r` ran from 16:31:02Z to 17:20:58Z (**49 min 56 s**), tool exit 0, stop none. About 240 games an hour.
- Record check: `machine.txt` control line = sealed (`control: skytalix Skill Level=2 st=0.18 timemargin=50, stockfish st=0.18 timemargin=2000`), and `cmd.txt` holds all four level tokens. Both tool lines read `= pin`. `read.mjs` rc 0.
- The tool's state line: `rating E + X ± Y = 1450 + 266.4 ± 64.3 = 1716.4 ± 64.3`. `W/L/D: 164/35/1`, score 0.823, LOS 100.0 %, draw ratio 0.5 %. `faults: 0  unclassified: 0  move-cap draws: 0`. Both stderr files 0 bytes. Depth guard: `0 of 8360 moves below depth 2`.
- `read.mjs`:
  - 200 games, 200 results in the PGN (101 1-0, 98 0-1, 1 draw). Points 164.5 = 82.25 %. As White 83.0 / 100, as Black 81.5 / 100.
  - FEN mismatches 0. Intervals: iid ± 62.9 Elo; opening-cluster ± 69.0 (deff 1.203, 166 effective games).
  - Terminations (skytalix's view): won 164 by mate, lost 35 by mate, drew 1 by threefold repetition.
  - Time losses: 0 in the PGN, 0 in `r.out`.
  - Plies a game: median 73, mean 83.9. Game seconds: mean 14.2, max 52.
  - Latency, skytalix: 8 425 moves, median 181 ms, p95 182, p99 182, max 184. 0 over 190 ms; 0 at 230 ms (the margin) or more.
  - Latency, Stockfish: 8 360 moves, median 180, max 182, 0 over 190.
  - `Skill Level 2`: 200 / 200, 0 missing or other. `UCI_Elo 1450`: 200 / 200, 0 missing or other.
- Sampler: 296 samples, 0 foreign `vitest` and 0 foreign `cutechess-cli` in every one. Two single samples each counted one process of another class:
  - `foreign_node=1` at 17:19:06Z, games 190 → 192.
  - `foreign_stockfish=1` at 17:20:38Z, games 198 → 199.
  - Both fell at a game boundary, where the tool restarts both engines (`restart=on`). The likely cause is the tool's own new engine process starting between `hostcheck.sh`'s descendant snapshot and its count (**UNKNOWN - verify**; the count-only log cannot tell).
  - Under FL this changes nothing, and neither class is a SHARED class.
- Host: load1 median 1.20, max 1.60. Tctl median 70.6 °C, max 72.8. Free space at least 7 382 MB.

## Host label and stops
- **Both levels: ALONE** for the SHARED classes: foreign `vitest` and `cutechess-cli` were 0 % of samples, against the 20 % bar. No foreign process was touched. Nothing is recorded beyond class and count.
- **Neither stop fired.** The Tctl max of 73.0 °C stayed under the 85 °C THERMAL median, and the 36.6 and 49.9 min runs stayed far under RUNAWAY's 105 and 185 min.

## Wall time against the estimate
- Session total: 1.44 h (L1 0.61 h, L2 0.83 h), against the sealed 1.6–3.6 h (central 2.2 h).
- L1 fell inside its 35–77 min.
- **L2 fell under its low end of 63 min**: games averaged 83.9 plies, against the 105–230 range that was estimated. That is an estimate miss on the low side and voids nothing.

## Records (redacted to placeholders; `raw/redact.sh`, written after the seal, records handling only)
- `raw/out/l1-e1320/` and `raw/out/l2-e1450/`: the tool's records without the build clone. Each `r.out` is kept as `r.summary.out` (non-debug lines only); its full sha256 is in each folder's `SHA256SUMS.unredacted-originals` (L1 `c92e727f…`, L2 `d8db1f0f…`).
- `raw/out/session-l1-e1320/`, `raw/out/session-l2-e1450/` and `raw/out/session-stage-b/`: the session, sampler and read logs and the console.
- The unredacted originals and the clones stay in the session scratch directory.
- Log quirk, harmless: the sampler's first line at each level reads `games=0` then `0` on the next line, because `grep -c … || echo 0` prints twice when the count is 0. It changes no count.
