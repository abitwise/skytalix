---
task: wave-2026-09-25
subtask: qe2-ABC-105
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-105-qe-hop-detector.md
ref: .grugops/context/qe2-ABC-105/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/fix-ABC-105 (tip cf353820; code 4bf6f3ee; off QE tip a0016dbb)
---

# Subtask: short QE re-check of `fix-ABC-105` — are `QE-105-p` and `QE-105-q` closed?

Fix notes: `.grugops/context/fix-ABC-105/notes/` (plant text verbatim in `…5c1e7a20`, probe in `probe/`). Re-plant QE's `coverage()`-only refs-only rule and the three symlink-check removals YOURSELF (scratch copy OUTSIDE the repo; restore; `cmp`) and confirm the new tests go red and the unmutated tool is green. Confirm `tools/grugops/qe-hop-integrity.js` `cmp` 0 to `60415a8a`, only the test file changed in code (`a0016dbb..4bf6f3ee`), still 1 file / 0 spawns, gates green (lint, typecheck, build, `npm test`, `last-run.json` success:true, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`), `--sweep` 132/38/77/2/15 exit 1. Rule each of `QE-105-p`/`-q` CLOSED or OPEN. Do NOT re-time the lane: +4 small in-process tests on a reading of +0.475 s against 650 ms — say only whether the new tests read the real notes tree again (cost driver) and how many times. UAT: the owner has waived UAT for ABC-105 (2026-10-12, Orchestrator's question) — do not re-litigate.

## Fences
Do not touch `src/`, `tools/`, `AGENTS.md`, `tsconfig.json`, `biome.json` or `plans/board.md`; revert every plant. Own worktree on `grugops/qe2-ABC-105` off `cf353820`; never `update-ref` another branch. No `--force`, `-D`, `--amend`, `reset --hard`. Never merge or push. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. A `kind: decision` `by: qe-e2e` verdict note (refs ABC-105), a trace row at the END of `plans/traceability.md`, a short § QE2 on the ticket. Queue: `mkdir .grugops/queue/claimed/qe2-ABC-105`, then FLAT `.grugops/queue/done/qe2-ABC-105.md` and `.claim.md`, uncommitted. Take no timing readings. End commits with a `Co-Authored-By:` trailer naming the model you are. Report tip, verdict, readings.
