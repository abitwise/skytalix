# qe-ABC-317 stage A checks: pins = pin, trees as ABC-316 read, the L3 and L4 dry runs as A1 says, the session script's refusals and gates. One 2-game smoke at `--skill 4 --elo 2040`, NOT GRADED: control line = A1's, `Skill Level 4` and `UCI_Elo 2040` reach every engine process, every `go` is `go movetime 1000`, skytalix latency max 1 003 ms. Every engine run went under the host lock, one at a time

QE/E2E, task `qe-ABC-317`, stage A, branch `grugops/qe-ABC-317` at `559656a0` (= `main`), 2026-11-10 from 20:36Z. Each engine or tool run below went as `flock <scratch>/host-test.lock <cmd>`, one core, one at a time. Paths are placeholders (`ADR-0049` d4). Outputs: `raw/out/dry/`, `raw/out/smoke-l4-not-graded/`, `raw/out/session-refusals.txt`. Sources: the brief `qe-ABC-317`, the cut note `orch-2026-10-30a/…7ffdb8a5` (B1–B4), and ABC-316's QE record (`.grugops/queue/done/qe-ABC-316.md`, `qe-ABC-316/raw/`), the model.

| check | command (paths redacted) | result |
|---|---|---|
| `cutechess-cli` pin | `sha256sum <cutechess-cli>`; `--version` | `dc776901…2154f40a` **= pin**; `cutechess-cli 1.5.1` |
| Stockfish pin | `sha256sum <stockfish>`; `uci`, `quit` | `c78c22a9…4593e352d2` **= pin**; `id name Stockfish 19`; `UCI_Elo` 1320–3190 |
| openings pin | `sha256sum tools/rating/openings.epd` | `0d7f7a72…e82666` = `OPENINGS_SHA256` |
| `node` | `node --version` | v26.12.1 (as ABC-316) |
| trees | `git rev-parse` | `main` = branch tip `559656a0`: `src/` `21f3b304`, `tools/` `6272e8d2`, `src/levels.ts` blob `df0fbae5` (L3 `budgetMs` 330, rate 0.1; L4 1 000, rate 0.05). ABC-316's read sha `b6366a79`: `src/` `21f3b304`. `b6366a79..main` touches only `README.md`, `CHANGELOG.md` and `tools/rating/` outside the records; the build reads `src/uci.ts` and its imports only (`tsconfig.build.json`) |
| L3 dry | `r b6366a79 <out> --skill 3 --elo 1890 --rounds 100 --concurrency 1 --dry-run` | exit 0, nothing written. skytalix `st=0.33 timemargin=50 restart=on option.Skill Level=3`; Stockfish `st=0.33 timemargin=2000 restart=on`, `Threads 1`, `Hash 16`, `UCI_LimitStrength true`, `UCI_Elo 1890`; `-games 2 -rounds 100 -concurrency 1 -maxmoves 200`. Against ABC-316's L2 vector only `st`, `Skill Level` and `UCI_Elo` differ |
| L4 dry | `… --skill 4 --elo 2040 …` | exit 0; the same with `st=1` on both sides, `Skill Level=4`, `UCI_Elo 2040` |
| pick depth | the harness's `pickDepth` formula | **4 at E 1 890** (level 3.743), **5 at E 2 040** (level 4.342) |

**Session script (`raw/scripts/session.sh`, sealed with the PREREG):** `bash -n` clean; `node --check` on `read.mjs` clean. Refusals, each exit 2 and nothing created (`raw/out/session-refusals.txt`): L 2 and 5; E 1895 (not a multiple of 10), 1310, 3200, `abc`; a missing `<repo>`; a missing parent of `<out>`; `<out>` inside the repo; an existing `<out>`. A scratch copy cut before its launch line passed gates 1–4 at `3 1890` and `4 2040` on this worktree (W-check 0 / 0 / 0 / 0, load1 0.50). A pin miss (`STOCKFISH` not the pin) exits 3 at gate 1. The record check's patterns, run on the smoke's records: the control line and the three level tokens match at L4 `2040`; `-rounds 100` does not (the smoke ran `-rounds 1`), so the check bites.

**Smoke, NOT GRADED** (at most 2 games, the brief's item 2): `CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/host-test.lock node tools/rating/rating.ts r b6366a79 <out> --skill 4 --elo 2040 --rounds 1 --concurrency 1`, 20:37:52Z–20:41:40Z (3 min 48 s), exit 0. Host before: load1 0.26, Tctl 32.2 °C, foreign `vitest` / `cutechess-cli` / `stockfish` / `node` 0 / 0 / 0 / 0 (class and count only).
- `machine.txt`: `control: skytalix Skill Level=4 st=1 timemargin=50, stockfish st=1 timemargin=2000`, the form A1 specifies. Both tool lines `= pin`; `harness: <repo> at 559656a0…`.
- `cmd.txt`: `st=1 timemargin=50 restart=on 'option.Skill Level=4'` and Stockfish `st=1 timemargin=2000 restart=on … option.UCI_Elo=2040`.
- `r.out` (debug): each skytalix process (2) got `setoption name Skill Level value 4`; each Stockfish process (2) got `UCI_Elo value 2040`, `UCI_LimitStrength value true`, `Threads 1`, `Hash 16`. **Every `go` was `go movetime 1000`: 115 of 115 on each side.** skytalix's search reached depth 10 at about 500 000 nodes in a 1 s move.
- Summary: 2 / 2 games, faults 0, unclassified 0, move-cap draws 0; both stderr files 0 bytes; **depth guard 0 of 115 below depth 5**; 0 time losses.
- **Latency go → bestmove, skytalix: median 1 001, p95 1 002, p99 1 002, max 1 003 ms; 0 over 1 010, 0 at the 1 050 ms margin.** Stockfish: median 1 000, max 1 001 ms.
- `read.mjs <out> 4 2040 1000`: `Skill Level 4: … missing or other 0`, `UCI_Elo 2040: … missing or other 0`.
- **Game lengths: 71 and 159 plies (mean 115), 68 s and 155 s**: about 0.97 s a ply, both sides together. The debug log ran about 3.5 KB a ply. The build clone was 792 MB and was deleted after the smoke.
- The score (1 / 2) is not a reading and is not used. Records: `raw/out/smoke-l4-not-graded/` (redacted; `r.out` not committed, its sha256 in `README.txt`). The smoke ran before the PREREG seal; it chose nothing in the PREREG except the time estimate's per-ply rate and the disk gate.

No foreign process was read beyond a count, and none was touched. Nothing is left running.
