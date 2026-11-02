# qe-ABC-268 host, window and artifacts (filed as observation; an artifact-ref needs a gate_run this hop has not got)

QE/E2E, task `qe-ABC-268`. Every test, build and engine run was wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock`, one at a time; local `./node_modules/.bin/vitest` only, never npx. Node v26.12.1, 24 cores. The worktree's `node_modules` is a plain copy of the main checkout's (lockfiles byte-equal; ignored by git); scratch trees symlinked it.

## Window (UTC, 2026-11-02)
- Claim 18:13Z (`e4dc2dac`); PREREG sealed 18:16:03Z, committed `085e8bbb` before any graded or timed run.
- Batch 1 (lint/typecheck/build, npm test ×3 interleaved with base, skips, integrity, inventory, G9) 18:16:49-18:17:55Z, load1 0.50-2.10.
- Batch 2 18:21:07-18:34:11Z: QE A1 (168 s), cut audit + probe-instrument sample (fire 38 s, audit 21 s, probe 18 s), `qe-a34.mjs` (158 s), 7 deep lanes; its plant step was void (below).
- A1 history pair re-spelled and run 18:34-18:35Z (two vacuous spellings first, below). Plants re-run 18:35-18:41:21Z.
- G6 + G11 timed session 18:41:21-18:50:55Z, host alone under the lock: 30 reads, load1 before each 0.39-1.27, Tctl median 56.2 °C, max 73.9 °C; no thermal stop.
- Plant A4-count check (QP2/3/4/6) after the timed session.

## Incidents (QE's own; no graded reading affected)
- **Void plant run:** batch 2's plant step spelled the five-file default lane with heap 400; the repository's heap guard refused each run ("no tests"), so all eight read rc 1 with no test run. Voided (kept out of `raw/plants/`), re-spelled with 128 as AGENTS.md says, re-run in full.
- **Two vacuous history spellings:** `qe-a1.mjs`'s first `priorKeys` pair (clock 0; then clock 8 with single occurrences) matched base but moved head `chooseMove` on 0 / 12 rows, because `ADR-0054` d3 needs two pre-root occurrences inside the clock. Not counted. The counted spelling (four reversible grandchildren each twice, clock 20) moves 8 / 12 and is 0 differ. `raw/a1/a1.txt` is batch 2's full run (its history line is the vacuous one); `raw/a1/a1-history.txt` is the counted pair; the script in `raw/qe-scripts/` is the final version.
- No foreign process was touched. Long-running foreign processes seen: a `fake-oidc` node service from another repository, grugops admission servers, playwright-mcp; no foreign vitest or cutechess-cli at any wait-clear.

## Artifacts
- Branch `grugops/qe-ABC-268` from `grugops/ABC-268` `4ca819c3`, worktree `.claude/worktrees/qe-ABC-268`. Commits: claim `e4dc2dac`; PREREG `085e8bbb`; evidence + notes and the closing commit follow. Nothing pushed or merged; no `src/` edit.
- `raw/`: `qe-scripts/` (qe-a1.mjs, qe-a34.mjs, qe-audit-patch.py, qe-audit.ts, probe-sample.ts, qe-plant.py, plants.sh, plant-a4.mjs, gates.sh, batch2.sh, and qe-ABC-264's exports.mjs/host.mjs/timed.mjs/g6.mjs/grade56.mjs/seal.mjs and qe-ABC-210's g11-fens.jsonl, unchanged); `gates/`; `a1/`; `a34/`; `audit/` (sample-head.txt.gz is the 2 943-line sample, sha256 prefix `cd47105e57539d6c`, byte-equal to the probe's); `deep/` (summary and grep lines); `plants/`; `g6/`; `notes/` (note sources and specs).
- Scratch (base/head/audit/probe/plant trees) deleted at the end of the hop.
