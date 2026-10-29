---
id: 20261029T081027Z-software-engineer-observation-58723347
kind: observation
by: software-engineer
at: 2026-10-29T08:10:27Z
verified_by: 
confidence: high: every command run as stated at b95961d4
refs:
  - ABC-204
  - EPIC-008 Q4
  - tools/rating/rating.ts
  - plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
  - orch-2026-10-29d/20261029T080512Z-orchestrator-decision-3081f6d4
  - orch-2026-10-29c/20261029T073203Z-orchestrator-decision-d9513dc1
  - se-tools-rating-host/20261028T211542Z-software-engineer-decision-f55b4cdf
  - grugops/se-tools-rating-concurrency
  - b95961d4
supersedes: 
seal: sha256:4a025ce4acbc525eb486a1b1d77adc5cce72bddd148c7fc88dd36017c0f6e519
---

# Gates, bad values, and the no-game argument-list check at b95961d4

**Gates (worktree at `b95961d4`, Node 26, this host):** `npm run lint` exit 0 (129 files) · `npm run typecheck` exit 0 · `npm run build` exit 0 · `npm test` exit 0, **63 files / 2 128 passed** (unchanged) · pending 0, todo 0, failed 0 (`.test-results/last-run.json`) · `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` → `No findings.`

**Bad values (env set from the session file; out-dir in session scratch):** `0`, `9`, `1.5`, `x`, `2.0`, `0x2` and the empty string, each in both `r` and `d` mode, give `Error: --concurrency <v>: not an integer from 1 to 8` and exit 1. That is 14 runs, and none of them created the out-dir. A bare `--concurrency` with no value prints the usage and exits 1.

**Argument lists, no games:** `CUTECHESS_CLI` pointed at a scratch stub. The stub answers `--version` and, for anything else, writes its argv to `stub-argv.txt` and exits 1, so cutechess-cli was never started. The real Stockfish ran only its `uci` probe. main's harness (`bb089d3d`, an untracked temporary copy beside the new file, so the repo and openings paths are the same) and the new harness each ran into the same out path, with the same shas.
- `r`, no flag: `cmd.txt` and the stub argv are byte-identical, old against new (`cmp` exit 0; `cmd.txt` sha256 `e50e1465…` for both). The argv has `-concurrency 2`.
- `d`, no flag: byte-identical the same way (`cmd.txt` sha256 `441c7dda…` for both). The argv has `-concurrency 3`.
- `d --concurrency 2`: the argv differs from the no-flag `d` run in exactly one line, `3` → `2`, after `-concurrency`. `machine.txt` reads `concurrency: 2 (default 3)`.
- `machine.txt`, old against new: the only difference is the added last line, `concurrency: 2 (default)` (r) or `concurrency: 3 (default)` (d).
- Each run ended with `summary.txt` `state: UNRESOLVED` / `cutechess-cli exited 1` (the stub). No `cutechess-cli` process was running afterwards. The temporary old copy was removed before the commit.

**Side note:** a first lint attempt ran `npx biome` before `node_modules` existed, and npx fetched an unrelated registry package called `biome` into npm's exec cache. Nothing in the repo changed (`git status` clean apart from the edit). The gates then ran through `npm ci` + `npm run lint`.
