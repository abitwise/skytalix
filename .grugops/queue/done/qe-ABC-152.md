---
task: wave-2026-09-25
subtask: qe-ABC-152
role: qe-e2e
ticket: plans/tickets/ABC-152-upgrade-vitest-to-4-1-and-run-src-without-the-module-runner-with-every-mock-and-spy-guard-still-armed.md
ref: .grugops/context/qe-ABC-152/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-152-vitest-4-1-runner-off (tip a99e9845; base 91024242)
base: 91024242
---

# Subtask: QE review of ABC-152 (vitest 4.1, runner off, test rework).

Grade V2, V4–V8 on your OWN plants in your own copies (not the SE's files/plants): V2 six rows by content + M9b; V4 one
production plant per file in the set (expected-0 → plant adds the call), incl. A20's two plants and A2 red at head /
blind on the old form; V5 `expect(` counts per file; V6 pin reds/greens; V7 isolation + 20-run screen; V8 lane
collect-equality + lanes exit; `PUZZLE_DEEP=weakened` exits 1; RISK-ABC152-NEGWORKERS. Grade the SE's one green
add-plant on `PRODUCTION_DEPS` (src/move-input.ts:108, ≥ 1 guard, green on base too). Note the `vitest/reporters`
deprecation warning and the 3 stale comments. Your worktree needs its OWN `npm ci` (no symlink). No timing reads.
Commit notes on the ticket branch; never merge. Use /usr/bin/diff.
