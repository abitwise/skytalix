---
id: 20261109T092643Z-qe-e2e-observation-ba5495ab
kind: observation
by: qe-e2e
at: 2026-11-09T09:26:43Z
verified_by: 
confidence: high: every check run under the host lock on 2026-11-09, one at a time, outputs in raw/out; no game, build or search ran
refs:
  - qe-ABC-295
  - grugops/qe-ABC-295
  - ABC-295
  - ABC-273
  - ABC-204
  - R2
  - e069b49a
  - bba42fb7
  - c361f429
  - tools/rating/rating.ts
supersedes: 
seal: sha256:57d7d4c0bad2954aa645636efa480f1fdeda6c2c1dd43c994c0c5c819fe7694e
---

# qe-ABC-295 stage A checks: both tools = pin, `r` dry-runs (no smoke needed), its argv byte-equal to R1's, read sha `e069b49a` (`src/` `bba42fb7`), `node` v26.12.1. No game, no build, no engine search. Every command ran under the host lock, one at a time

QE/E2E, task `qe-ABC-295`, branch `grugops/qe-ABC-295` from `main` `e069b49a`, 2026-11-09 from 09:20Z. Each command below ran as `flock <scratch>/<home>/<repo>/host-test.lock <cmd>`, one core, one at a time. Paths are placeholders (`ADR-0049` d4).

| check | command (paths redacted) | result |
|---|---|---|
| `cutechess-cli` pin | `sha256sum <cutechess-cli>`; `<cutechess-cli> --version` | `dc77690113d9ae130f5d1b4c76fefb28f42620ac45a2bd4abb7dd8eb2154f40a` **= pin** (`ABC-204`); `cutechess-cli 1.5.1` |
| Stockfish pin | `sha256sum <stockfish>`; `uci` then `quit` on stdin | `c78c22a924e8d452e1089ec8d47826f7a276aba69373185e82cbac4593e352d2` **= pin**; `id name Stockfish 19` |
| openings pin | `sha256sum tools/rating/openings.epd` | `0d7f7a72678cbf54c2c309dc5d664e7aac5de2c15bc54fe4247a437f51e82666` = `OPENINGS_SHA256` |
| `node` | `node --version` | **v26.12.1** (the same as R1) |
| `r` dry | `CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> node tools/rating/rating.ts r e069b49a <out> --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1 --dry-run` | exit 0, "nothing is built, started or written". 40 tokens. With the out path as `<out>`, **byte-equal to R1's `cmd.txt`** (`cmp`). skytalix `st=0.1 timemargin=50 restart=on`; Stockfish `st=0.1 timemargin=2000 restart=on`, `Threads=1`, `Hash=16`, `UCI_LimitStrength=true`, `UCI_Elo=1810`; `-rounds 100 -concurrency 1 -maxmoves 200`. `raw/out/dry-run.txt`, `raw/out/dry-run.joined.txt` |
| smoke | none | Not needed: the harness has a dry mode. **0 games played.** |
| the sha to read | `git rev-parse e069b49a^{commit}:src`, `HEAD:tools` | `main` **`e069b49a`**; `src/` `bba42fb7`; harness `tools/` `c361f429` |
| `read.mjs` parse test | `node read.mjs <copy of qe-ABC-273's committed r.pgn and r.summary.out>` | Reproduces R1's committed figures: 95 / 8 / 97, 99.0 / 200, ± 47.3 iid, ± 48.4 cluster, 0 time losses, plies 85 / 105.1. Latency lines are absent because the committed `.out` has no debug lines. That is expected |
| `g11.mjs` imports | read on `main`'s `src/` | `parseFen`, `toSan`, `chooseMove`, `DEFAULT_BUDGET_MS = 4_000`, `LEVELS[5] = { budgetMs: 4_000, blunderRate: 0 }` all present. Not run: no search before the seal |
| scripts | `bash -n`, `node --check`; W-check pattern on three sample lines | syntax clean; the gate passes only on 0 / 0 / 0 for foreign `vitest`, `cutechess-cli`, `stockfish` |
| host, by class and count only | `bash raw/scripts/hostcheck.sh` | 09:24:27Z: load1 1.56, Tctl 42.8 °C, temp free 3 531 MB; foreign `vitest` 0, `cutechess-cli` 0, `stockfish` 0, `node` 0. A snapshot, not W |

- **Disk:** about 3.5 GB was free in the temp file system. One clone and R1's 64 MB debug log fit. Gate 3 asks 1 024 MB at launch.
- **Nothing left running.** No foreign process was read beyond a count, and none was touched.
