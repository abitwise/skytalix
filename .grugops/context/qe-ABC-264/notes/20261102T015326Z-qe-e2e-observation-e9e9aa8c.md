---
id: 20261102T015326Z-qe-e2e-observation-e9e9aa8c
kind: observation
by: qe-e2e
at: 2026-11-02T01:53:26Z
verified_by: 
confidence: high: paths, commits and window as recorded (observation: an artifact-ref needs a gate_run)
refs:
  - qe-ABC-264
  - ABC-264
  - ADR-0059
  - ADR-0050
  - ADR-0026
  - ADR-0028
  - EPIC-011
  - EPIC-008
  - NFR-004
  - NFR-005
  - NFR-008
  - ABC-086
  - ABC-229
  - ABC-230
  - grugops/ABC-264
  - grugops/qe-ABC-264
  - 358b5f4a
  - 0b73f51d
  - 4e6a59ee
  - src/search.reverse-futility.test.ts
  - QE-264-a
  - QE-264-b
  - QE-264-c
  - QE-264-d
  - QE-264-e
  - 20261102T011645Z-qe-e2e-decision-4e787c10
  - se-ABC-264/20261102T010954Z-software-engineer-observation-470e5bf6
  - se-ABC-264/20261102T010954Z-software-engineer-observation-d18a94a0
  - se-ABC-264/20261102T010954Z-software-engineer-decision-1fad1ebe
supersedes: 
seal: sha256:8b13943481a6a68b95860299a41758ed0ae236a1c4aefdf3c092326616c641f8
---

# qe-ABC-264 host, window and artifacts (filed as observation; an artifact-ref needs a gate_run this hop has not got)

QE/E2E, task `qe-ABC-264`. Every test, build and engine run was wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock`; local `./node_modules/.bin/vitest` only, never npx. Node v26.12.1, 24 cores.

## Window (UTC, 2026-11-02)
- Claim 01:12:04Z; PREREG sealed 01:16:45Z, committed `a55eb281` before any graded run.
- Batch 1 (mandatory gates, skips, inventory, G9) 01:21:41-01:22:38Z; G8 graded session after it (third session; two earlier voided, below).
- Batch 2 (A1, A3/A4 script, 7 deep lanes, plants) 01:25:30-01:36:54Z; QE d5 A1 spot and the static-eval probe after it.
- G6 + G11 timed session 01:41:02-01:51:21Z: 30 reads, load1 before each 0.41-1.79, Tctl median 55.1 °C, max 74.9 °C; first read waited 30 s for transient vitest pids and one poll for load.
- Firing session 01:51:36-01:51:40Z, load1 0.32-0.45; frozen readings after.

## Incidents (QE's own; no reading affected)
- **Self-wait:** the first batch-1 launch carried the script text inline, so its own shell matched the bracketed `pgrep -f "[/]vitest"` and the script waited on itself for about 4 min (lint/typecheck/build had passed). QE stopped its own script (SIGTERM), added an ancestor filter, and re-ran batch 1 in full.
- **Two voided G8 sessions:** QE's scratch base tree first lacked `.grugops/` and then `.grugops/context/`, which `tools/grugops/qe-hop-integrity.test.ts` reads; base read 2 344 and 2 365 passed. With the worktree's context linked in, base read 2 376/2 376. Only the third session is graded; head was 2 403/2 403 in all nine head runs.
- **One stopped spot run:** the first d5 A1 spot included minimax-scale doors (`searchWithoutOrdering` d5 = 80.5 M nodes); QE stopped its own process and re-ran without `searchWithoutPruning`, `…PruningOrQuiescence`, `…Ordering` (13.7 s).
- No foreign process was touched. Long-running foreign processes seen: `abtop`, Claude sessions, a `dist/main-worker.js` node service, docker services; ~0-9 % CPU each.

## Artifacts
- Branch `grugops/qe-ABC-264` from `grugops/ABC-264` `4e6a59ee`, worktree `.claude/worktrees/qe-ABC-264`. Commits: claim `8c80a3f2`; PREREG `a55eb281`; evidence + notes and the closing commit follow. Nothing pushed or merged.
- `raw/`: `qe-scripts/` (a1.mjs (SE's, reviewed), a1deep.mjs, exports.mjs, a34.mjs, evalmax.mjs, plant.py, plants.sh, gates.sh, g8.sh, batch2.sh, fire.mjs, fire.sh, fire-instrument.diff, grade56.mjs, and qe-ABC-229's host.mjs/timed.mjs/g6.mjs unchanged, qe-ABC-210's g11-fens.jsonl, seal.mjs); `gates/`; `a1/`; `a34/`; `deep/` (summary and grep lines); `plants/`; `g6/` (g6.jsonl, g11.jsonl, wait.log, grade.json); `fire/`; `notes/` (note sources and specs).
- Scratch (base/head/plant/instrument trees, about 40 MB, node_modules symlinked) deleted at the end of the hop.
