# qe-ABC-268-p2 host, window and artifacts (filed as observation; an artifact-ref needs a gate_run this hop has not got)

QE/E2E, task `qe-ABC-268-p2`. Every test, build and engine run wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock`, one at a time, `--concurrency 1`. Local `./node_modules/.bin/vitest`. The worktree's `node_modules` is a plain copy of the main checkout's (lockfiles byte-equal; ignored by git). Node v26.12.1, 24 cores, AMD Ryzen AI 9 HX 370, Linux 7.0.0-42. cutechess-cli 1.5.1 and Stockfish 19 both match the pins; openings sha256 `0d7f7a72…` (`raw/a6/machine.txt`).

## Window (UTC, 2026-11-02)
- Claim 19:59:02Z. Step 1 (plants 20:00:2x-20:00:43Z; gates 20:01:02-20:01:13Z). PREREG sealed 20:02:26Z, committed `bf3588ba`.
- A6 20:02:42-20:27:48Z (load1 0.95-3.61). Smoke 20:28:19-20:35:53Z (load1 0.78-2.19). Levels 20:36:17-20:45:54Z.
- Foreign load: see `QE-268-p2-a` (gaps note). No foreign process was touched. Long-running foreign processes seen: the `fake-oidc` node service from another repository, and other agents' sessions.

## Artifacts
- Branch `grugops/qe-ABC-268-p2` from `grugops/ABC-268-fix` `1169c024`, worktree `.claude/worktrees/qe-ABC-268-p2`. Commits: claim + step 1 + PREREG `bf3588ba`; evidence + notes and the closing commit follow. Nothing pushed or merged; no `src/` edit.
- `raw/`: `plants/` (head + QP2-QP6 lane output, plant diffs, summary); `gates/`; `a6/` (summary, cutechess result lines, artifacts with both `dist/` manifests, machine, cmd, SHA256SUMS of the deleted outputs, host.log, timing-and-pairs); `smoke/` (the same set, plus latency-and-pool); `levels/` (verbose output, times); `scripts/` (recheck.sh, gates.sh, qe-plant.py from `qe-ABC-268` unchanged, run-d.sh, run-r.sh, run-levels.sh, analyze.py, seal.mjs); `note-src/`. Host paths are redacted to `<home>` / `<scratch>`.
- Deleted after recording: PGNs, `d.out` / `r.out`, both build clones, and the scratch plant/head trees.
