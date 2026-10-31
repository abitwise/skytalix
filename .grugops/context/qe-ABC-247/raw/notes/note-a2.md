# qe-ABC-247 A2, ALONE: block 01's argv through cutechess-cli at `-rounds 1`. Base and head both read 4.0 s on every skytalix search move (84 and 125, none at 3.0 s); the control without the token reads 3.0 s (95, none at 4.0 s)

## Method (as pre-registered)
- **Argv:** block 01 of the batch command's dry run at T (`rpair ca6e675c cec9c252 <out> --elo 1910 --rounds 100 --concurrency 1`):
  the `base` argv for B and the `candidate` argv for H.
  - The placeholders were put back to the real paths. Only `-rounds 10 → 1` and the three output paths changed.
  - Each reconstructed argv was re-redacted and diffed against the print: **4 elements changed** (2× `stderr=`, `-rounds`, `-pgnout`).
  - The control is B's argv with only the `option.Skill Level=6` element removed (41 elements). See `raw/a2/argv-*.txt` and `run-*/argv.json`.
- **Builds:** at the printed clone paths `<out>/base/clone-skytalix` (`ca6e675c`) and `<out>/candidate/clone-skytalix` (`cec9c252`).
  - Each tree is a `git archive` of `src data package.json package-lock.json tsconfig*.json`.
  - `node_modules` is one symlink to the main checkout's (lock files equal). `npm run build` returned rc 0 on both.
  - Both builds answer `uci` with `option name Skill Level type spin default 5 min 1 max 7` (`raw/a2/build.txt`).
  - This is the method of `qe-EPIC-010-m1-batch`'s probe, not the tool's `git clone && npm ci` (QE-247-d).
- **Binaries:** `cutechess-cli` 1.5.1 sha256 `dc776901…f40a` = pin; Stockfish 19 sha256 `c78c22a9…52d2` = pin.
- **Run:** order B, H, C, one at a time, with a wait-clear before each (0 vitest, 0 cutechess-cli, load1 ≤ 2.0, Tctl ≤ 60 °C). Each cleared on its first poll.
  - `-debug all` output went to `log.txt`. Tctl was sampled every 10 s.
  - The thermal stop was armed at a median > 85 °C. It never fired.

## Results (`raw/a2/read-{B,H,C}.txt`; the setoption/go lines in `run-*/lines.txt`)
| | base `ca6e675c` + token | head `cec9c252` + token | control: base, no token |
|---|---|---|---|
| cutechess exit / games | 0 / 2 | 0 / 2 | 0 / 2 |
| skytalix instances (restart=on, one per game) | 2 | 2 | 2 |
| `setoption name Skill Level value 6` to skytalix | 1 per instance, before its first `go` (log ms 38 and the same in game 2) | 1 per instance, before its first `go` | **none** |
| skytalix `go` lines | 88, all `go movetime 4000` | 128, all `go movetime 4000` | 97, all `go movetime 4000` |
| Stockfish `go` / Skill Level | `go movetime 500` ×88 / 0 | ×127 / 0 | ×96 / 0 |
| PGN skytalix clocks ≥ 1 s | **4.0 s × 84**, nothing else | **4.0 s × 125**, nothing else | **3.0 s × 95**, nothing else |
| at 3.0 s / at 4.0 s | **0 / 84** | **0 / 125** | **95 / 0** |
| book replies (no clock) / < 1 s | 4 / 0 | 3 / 0 | 2 / 0 |
| engine `info … time T` (cross-check) | 84 lines, all in [3 900, 4 100], max 4 001 ms | 125, all in [3 900, 4 100], max 4 001 | 95, all in [2 900, 3 100], max 3 001 |
| results | 1-0 W mates (77 plies), 1-0 W mates (99) | 1-0 W mates (167), 0-1 B mates (88) | 1-0 W mates (67), 0-1 B mates (126) |
| faults / time losses / skytalix.stderr | 0 / 0 / 0 bytes | 0 / 0 / 0 bytes | 0 / 0 / 0 bytes |
| wall; Tctl median / max | 379 s; 74.4 / 77.0 °C | 561 s; 74.4 / 76.6 °C | 331 s; 74.8 / 76.4 °C |

**B PASS, H PASS, CONTROL MET → A2 MET.**
- The same base build reads 4.0 s with the token and 3.0 s without it. So the probe tells the two apart, and the token alone moves the base from `LEVELS[5]` (3 000 ms) to the 4 000 ms request.
- These are probe games. No score, Elo or ledger row is read from them.
- For the batch (Test note 3): this is the block-01 check the guard asks for, run on the exact argv shape.

The game wall here (2 games: 6.3 / 9.4 min with the token, 5.5 min without) is information only and too small a sample to re-estimate the batch's 21.7–24.1 h.
