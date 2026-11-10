# qe-ABC-316 stage A checks: pins = pin, the gates green on the branch tip, R2's argv byte-equal, the L1 and L2 dry runs and every refusal as A1 says, `src/` diff empty. One 2-game smoke, NOT GRADED, read `machine.txt`'s control line on a real run. Every command ran under the host lock, one at a time

QE/E2E, task `qe-ABC-316`, branch `grugops/qe-ABC-316` at `dcfbb147` (on SE's `grugops/ABC-316`, A1 at `ebbeb615`), 2026-11-10 from 15:44Z. Each command below ran as `flock <scratch>/host-test.lock <cmd>`, one core, one at a time. Paths are placeholders (`ADR-0049` d4). Outputs: `raw/out/dry/`, `raw/out/smoke-l1-not-graded/`.

| check | command (paths redacted) | result |
|---|---|---|
| `cutechess-cli` pin | `sha256sum <cutechess-cli>`; `--version` | `dc776901…2154f40a` **= pin**; `cutechess-cli 1.5.1` |
| Stockfish pin | `sha256sum <stockfish>`; `uci`, `quit` | `c78c22a9…4593e352d2` **= pin**; `id name Stockfish 19` |
| openings pin | `sha256sum tools/rating/openings.epd` | `0d7f7a72…e82666` = `OPENINGS_SHA256` |
| `node` | `node --version` | v26.12.1 (as R1 and R2) |
| trees | `git rev-parse` | `main` `b6366a79`: `src/` `21f3b304`, `tools/` `c361f429`. Branch tip `dcfbb147` and `ebbeb615`: `src/` `21f3b304`, `tools/` `6272e8d2`. `src/levels.ts` blob `df0fbae5` in both |
| `src/` diff | `git -c core.quotePath=false diff --name-only main HEAD \| grep -v '\.test\.ts$' \| grep '^src/'` | **empty** (and `git diff --name-only main HEAD -- src`: 0 lines) |
| lint | `npm run lint` | exit 0, 150 files, no fixes |
| typecheck | `npm run typecheck` | exit 0 |
| unit | `VITEST_MAX_WORKERS=1 npm test` | exit 0, 72 files, 2 740 / 2 740 passed, 0 skipped, 17.1 s |
| build | `npm run build` | exit 0 |
| harness tests | `node --test --test-concurrency=1 tools/rating/pair-check.ts` | exit 0, 52 / 52, 10 suites, 0 skipped; the 7 `ABC-316` tests pass |
| R2 byte-equal | `r e069b49a <out> --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1 --dry-run`, joined + ` > <out>/r.out 2>&1` | `cmp` with `qe-ABC-295/raw/out/r2/cmd.txt`: **byte-equal** |
| L1 dry | `r b6366a79 <out> --skill 1 --elo 1320 --rounds 100 --concurrency 1 --dry-run` | exit 0, nothing written. Against R2's vector: `option.Skill Level=1` added after skytalix's `restart=on`, `UCI_Elo=1320`; both `st=0.1`, `timemargin` 50 and 2000. Nothing else differs |
| L2 dry | `… --skill 2 --elo 1450 …` | exit 0. Against R2's: both `st=0.18`, `option.Skill Level=2`, `UCI_Elo=1450`. Nothing else differs |
| L3, L4 dry | `--skill 3 --elo 1600`, `--skill 4 --elo 1800` | exit 0; `st=0.33` and `st=1` on both sides, from `LEVELS` |
| refusals | `raw/out/dry/refusals.txt` | exit 1 each: `--skill` with `--budget-ms` (both orders); L = 0, 5, 7, -1, 1.0, 01, x; `--skill` with no value (usage); `--elo` 1319 and 3191 under `--skill`; `d` and `rpair` with `--skill` (usage). Accepted: `--skill 1 --elo 2601` (the cap stays on `--budget-ms 100`, as ruled); `--budget-ms 100 --elo 2601` still refused |

**Smoke, NOT GRADED** (SE's open item; at most 2 games): `CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/host-test.lock node tools/rating/rating.ts r b6366a79 <out> --skill 1 --elo 1320 --rounds 1 --concurrency 1`, 15:46:04Z–15:46:54Z, exit 0. Host before: load1 0.55, Tctl 35.6 °C, foreign `vitest` / `cutechess-cli` / `stockfish` / `node` 0 / 0 / 0 (class and count only).
- `machine.txt`: `control: skytalix Skill Level=1 st=0.1 timemargin=50, stockfish st=0.1 timemargin=2000`, byte-equal to A1's spec. Both tool lines `= pin`; `harness: <repo> at dcfbb147…`.
- `cmd.txt`: `st=0.1 timemargin=50 restart=on 'option.Skill Level=1'` (one argument, quoted in the record) and Stockfish `st=0.1 timemargin=2000 … option.UCI_Elo=1320`.
- `r.out` (debug): each skytalix process (2) got `setoption name Skill Level value 1`, and each Stockfish process (2) got `UCI_Elo value 1320`. Every `go` was `go movetime 100` on both sides. skytalix's `info` lines carry no score, which is the level (blunder) path; 3 book moves.
- Summary: 2 / 2 games, faults 0, unclassified 0, move-cap draws 0, depth guard 0 of 230 below depth 1. 0 time losses. Latency go → bestmove: skytalix median 101, max 103 ms (0 over 110); Stockfish max 101 ms.
- Game lengths: 142 and 317 plies (13 s and 31 s), 92–98 ms a ply. The score (0.5 / 2) is not a reading and is not used.
- Records: `raw/out/smoke-l1-not-graded/` (redacted; `r.out` not committed, its sha256 in `README.txt`). This smoke ran before the PREREG seal; it chose nothing in the PREREG except the time estimate's game-length range.

**Scripts dry-checked (no game):** `bash -n` clean on `session.sh`, `stage-b.sh`, `hostcheck.sh`; `node --check` on `read.mjs`. `session.sh 3` → exit 2; `stage-b.sh` with an out-root inside the repo → exit 2, nothing made; a pin miss → exit 3 at gate 1. A scratch copy of `session.sh` cut before its launch line passed gates 1–4 for L1 and L2 on this worktree. `read.mjs` parsed the smoke: `Skill Level 1: … missing or other 0`; with L 2 and E 1450 it reports 2 missing (the check bites).

No foreign process was read beyond a count, and none was touched. Nothing is left running.
