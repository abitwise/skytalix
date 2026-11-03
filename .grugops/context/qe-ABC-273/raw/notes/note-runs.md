# qe-ABC-273 runs: commands as run, host, test data and checks (one 200-game run plus G11; nothing re-played, nothing left running)

- **Order (as sealed in `…3cda6a60`):**
  1. 13:11:38Z, the PREREG was sealed. The claim and PREREG were committed at `fa88e150`, before any game.
  2. 13:11:56Z, host check: load1 0.93, Tctl 42 °C, 0 cutechess-cli, 0 stockfish, 0 foreign vitest.
  3. 13:12:07Z–13:47:36Z, the R1 run: exit 0, stop = none.
  4. 13:48:03Z–13:48:23Z, `G11`.
  5. `read.mjs`, offline.
  - Before the seal, the only runs were offline: a `--dry-run` of the exact command, `sha256sum` of the tools, and a parse test of `read.mjs` on `qe-ABC-269`'s committed smoke PGN. That test found a termination-text bug in `read.mjs`, which was fixed before the seal. The sealed hash is `e8d3fa6c…`.
- **R1 command:** `flock <scratch>/host-test.lock bash raw/scripts/run.sh <out> 85a304ff`. It runs `CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> node tools/rating/rating.ts r 85a304ff <out> --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1` from this worktree (harness HEAD `fa88e150`, `tools/` `0d76de4e`).
- **Tools:** `cutechess-cli` 1.5.1 sha256 `dc776901…2154f40a` = pin; Stockfish 19 sha256 `c78c22a9…4593e352d2` = pin; openings sha256 `0d7f7a72…e82666` = pin; `node` v26.12.1.
- **Build:** one clone of `85a304ff`, built by `npm ci && npm run build` in about 4 s. `dist/` has 23 files, tree sha256 `975241dc…2e2fd4`. That is the same tree as E1's candidate `be87a2f1` in `qe-ABC-269` B8.
- **Wall time and throughput:** 35 min 29 s in all, about 338 games/h. A game took 9.8 s on average (34 s at most), with 85 plies at the median and 105.1 on average. The PREREG estimated 25–54 min.
- **Host (211 samples, 10 s apart):**
  - load1: median 1.43, max 5.08.
  - Tctl: median 74.6 °C, max 83.1 °C. The thermal stop (a 30-sample median above 85 °C) never fired.
  - Foreign cutechess-cli: 0 in every sample.
  - Foreign `/vitest`: 21 of 211 samples (10 %), between 13:13:48Z and 13:28:05Z, with 1–3 processes. That is under the sealed 20 % line, so the run is labelled ALONE with that count. skytalix's latency shows no effect: max 106 ms, 0 moves over 110 ms.
  - A foreign long-running service process (not a test runner) was present throughout. It was not touched.
- **G11 command:** `flock <scratch>/host-test.lock`, then one fresh `node raw/scripts/g11.mjs <worktree> <label> <fen>` per line of `raw/scripts/g11-fens.jsonl`. That file is a byte copy of `qe-ABC-268`'s. `src/` was `4d6b117b`, which is `main`'s. Each search took 4 000.0–4 000.4 ms (G5-style, under 5 000).
- **Records:**
  - `raw/out/r1/` holds the tool's files: `machine.txt`, `cmd.txt`, `summary.txt`, `artifacts.txt`, `host.log`, `r.pgn`, both stderr files, the build log, and the tool's `SHA256SUMS`.
  - `r.summary.out` is `r.out` without its `-debug` engine chatter. The full 64 MB log stayed in scratch; its sha256 is in `SHA256SUMS.unredacted-originals`. The build clone was deleted.
  - Host paths, user and host name were replaced by placeholders by `raw/scripts/redact.sh`. That script was written after the seal; it handles records only, not the read.
  - `raw/out/` also holds `command-as-run.txt`, `sampler.log`, `run.txt`, `g11.jsonl` and `read.txt`.
- **Flaky risk:** the figure is one 200-game sample, ± 47 Elo. Nothing is graded on it, so no flake can flip a gate.
- **Nothing left running:** no cutechess-cli, stockfish, `rating.ts` or driver process remains. No node_modules symlink was needed, because `src/` has no bare imports and the tool builds its own clone.
